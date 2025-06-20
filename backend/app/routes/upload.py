from fastapi import UploadFile, File, APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
import os, shutil
import numpy as np
from ..utils import document_utils, embedding_utils
from app.database import get_db
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

    # Save the uploaded file
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

    # Save document record
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

    # Save embeddings to FAISS
    metadata = [
        {
            "filename": filename,
            "chunk_index": i,
            "document_id": document.id
        }
        for i in range(len(embeddings))
    ]
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


@router.get("/")
def get_all_documents(db: Session = Depends(get_db)):
    documents = db.query(Document).all()
    return [
        {
            "id": doc.id,
            "filename": doc.filename,
            "file_type": doc.file_type,
            "size": doc.size,
            # "num_chunks": doc.num_chunks,
            # "preview": doc.preview,
        }
        for doc in documents
    ]


@router.delete("/{doc_id}")
def delete_document(doc_id: int, db: Session = Depends(get_db)):
    document = db.query(Document).filter(Document.id == doc_id).first()
    if not document:
        raise HTTPException(status_code=404, detail=f"Document {doc_id} not found.")

    file_path = os.path.join(UPLOAD_DIR, document.filename)
    if os.path.exists(file_path):
        os.remove(file_path)

    db.delete(document)
    db.commit()
    return {"message": f"Deleted document '{document.filename}' successfully."}
