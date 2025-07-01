import os
import numpy as np
import faiss
from app.utils import document_utils, embedding_utils
from app.database import SessionLocal
from app.models.document import Document

UPLOAD_DIR = "uploads"

def index_document_file(file_path: str, document: Document):
    """
    Index a newly uploaded document (extract, chunk, embed, save to FAISS).
    """
    ext = document.file_type
    filename = document.filename

    extract_fn = {
        "pdf": document_utils.extract_text_from_pdf,
        "docx": document_utils.extract_text_from_docx,
        "txt": document_utils.extract_text_from_txt,
    }.get(ext)

    if not extract_fn:
        raise ValueError(f"Unsupported file type: {ext}")

    text = extract_fn(file_path)

    if not text or not text.strip():
        raise ValueError("No text could be extracted from the document.")

    chunks = embedding_utils.chunk_text(text)
    if not chunks:
        raise ValueError("No chunks generated from the document.")

    embeddings = embedding_utils.embed_chunks(chunks)
    faiss.normalize_L2(embeddings)

    metadata = [
        {
            "filename": filename,
            "chunk_index": i,
            "chunk_text": chunk,
            "document_id": document.id,
        }
        for i, chunk in enumerate(chunks)
    ]

    embedding_utils.save_to_faiss(np.array(embeddings), metadata)
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
        print(f"✅ Successfully indexed {document.filename} in background.")

    except Exception as e:
        print(f"Error indexing document ID {document_id}: {e}")
    finally:
        db.close()
