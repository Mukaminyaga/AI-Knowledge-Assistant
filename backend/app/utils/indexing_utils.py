import os
import numpy as np
import faiss
from app.database import SessionLocal
from app.models.document import Document
from app.utils.document_utils import (
    extract_text_from_pdf,
    extract_text_from_docx,
    extract_text_from_txt,
)
from app.utils.embedding_utils import chunk_text, embed_chunks, save_to_faiss

UPLOAD_DIR = "uploads"

def extract_text_for_file(filename, filepath):
    """Extract text based on file extension."""
    ext = filename.lower().split(".")[-1]
    if ext == "pdf":
        return extract_text_from_pdf(filepath)
    elif ext == "docx":
        return extract_text_from_docx(filepath)
    elif ext == "txt":
        return extract_text_from_txt(filepath)
    return ""

def index_document_file(file_path: str, document: Document):
    """
    Index a newly uploaded document (extract, chunk, embed, save to FAISS).
    """
    text = extract_text_for_file(document.filename, file_path)

    if not text or not text.strip():
        raise ValueError("No text could be extracted from the document.")

    chunks = chunk_text(text, chunk_size=300, overlap=50)
    if not chunks:
        raise ValueError("No chunks generated from the document.")

    embeddings = embed_chunks(chunks)
    faiss.normalize_L2(embeddings)

    metadata = [
        {
            "filename": document.filename,
            "chunk_index": i,
            "chunk_text": chunk,
            "document_id": document.id,
            "tenant_id": document.tenant_id  
        }
        for i, chunk in enumerate(chunks)
    ]

    save_to_faiss(np.array(embeddings), metadata)
    return chunks


def index_and_update(file_path: str, document_id: int):
    """
    Background-safe indexing task that also updates the document record.
    """
    db = SessionLocal()
    try:
        document = db.query(Document).filter(Document.id == document_id).first()
        if not document:
            print(f"Document ID {document_id} not found in DB.")
            return

        chunks = index_document_file(file_path, document)
        document.num_chunks = len(chunks)
        document.preview = chunks[0] if chunks else ""
        document.indexed = True
        db.commit()
        print(f"Successfully indexed {document.filename} for tenant {document.tenant_id}")

    except Exception as e:
        print(f"Error indexing document ID {document_id}: {e}")
    finally:
        db.close()
