from fastapi import UploadFile, File, APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
import os, shutil
import numpy as np
from ..utils import document_utils, embedding_utils
from ..database import get_db  # function that gives a DB session
from app.models.document import Document


router = APIRouter()
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_document(file: UploadFile = File(...), db: Session = Depends(get_db)):
    filename = file.filename
    ext = filename.split(".")[-1].lower()

    if ext not in ("pdf", "docx", "txt"):
        raise HTTPException(status_code=400, detail=f"{filename}: unsupported type {ext}")

    # Save file to disk
    dest = os.path.join(UPLOAD_DIR, filename)
    with open(dest, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract text
    try:
        text = {
            "pdf": document_utils.extract_text_from_pdf,
            "docx": document_utils.extract_text_from_docx,
            "txt": document_utils.extract_text_from_txt,
        }[ext](dest)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"{filename}: extract error {e}")

    # Chunk and embed
    chunks = embedding_utils.chunk_text(text)
    if not chunks:
        raise HTTPException(status_code=500, detail=f"{filename}: no text chunks extracted")

    try:
        embeddings = embedding_utils.embed_chunks(chunks)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"{filename}: embedding error {e}")

    # Save document metadata to database (needed before FAISS for document_id)
    document = Document(
        filename=filename,
        file_type=ext,
        size=os.path.getsize(dest),
        num_chunks=len(chunks),
        preview=chunks[0]
    )
    db.add(document)
    db.commit()
    db.refresh(document)

    # Prepare metadata for FAISS
    metadata = [
        {
            "filename": filename,
            "chunk_index": i,
            "document_id": document.id
        }
        for i in range(len(embeddings))
    ]

    # Save to FAISS
    try:
        embedding_utils.save_to_faiss(np.array(embeddings), metadata)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"{filename}: embedding error {e}")

    return {
        "message": "Uploaded successfully",
        "document": {
            "id": document.id,
            "filename": document.filename,
            "file_type": document.file_type,
            "size": document.size,
            "num_chunks": document.num_chunks,
            "preview": document.preview,
        }
    }
