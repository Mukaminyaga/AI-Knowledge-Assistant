from fastapi import UploadFile, File, APIRouter, HTTPException
from ..utils import document_utils, embedding_utils
import os
import shutil
import numpy as np

router = APIRouter()
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    extension = file.filename.split(".")[-1].lower()
    if extension not in ["pdf", "docx", "txt"]:
        raise HTTPException(status_code=400, detail="Only PDF, DOCX, and TXT files are supported.")

    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        if extension == "pdf":
            text = document_utils.extract_text_from_pdf(file_path)
        elif extension == "docx":
            text = document_utils.extract_text_from_docx(file_path)
        elif extension == "txt":
            text = document_utils.extract_text_from_txt(file_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to extract text: {str(e)}")

    # Chunk text
    chunks = embedding_utils.chunk_text(text)

    if not chunks:
        raise HTTPException(status_code=500, detail="No meaningful text found to process.")

    # Embed text
    try:
        embeddings = embedding_utils.embed_chunks(chunks)
        embedding_utils.save_to_faiss(np.array(embeddings))  # Save to vector index
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Embedding or indexing failed: {str(e)}")

    return {
        "filename": file.filename,
        "message": "Upload, parsing, and embedding successful",
        "chunks": len(chunks),
        "preview": chunks[0] if chunks else "No preview available"
    }
