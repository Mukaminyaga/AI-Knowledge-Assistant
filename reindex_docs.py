import os
import numpy as np
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.document import Document
from app.utils.document_utils import (
    extract_text_from_pdf,
    extract_text_from_docx,
    extract_text_from_txt,
)
from app.utils.embedding_utils import chunk_text, embed_chunks, save_to_faiss

DOCUMENTS_DIR = "uploads"

def load_docs_from_db(db: Session):
    """Retrieve all documents from the database."""
    return db.query(Document).all()

def extract_text_for_file(filename, filepath):
    """Extract text based on file extension."""
    ext = filename.lower().split(".")[-1]
    if ext == "pdf":
        return extract_text_from_pdf(filepath)
    elif ext == "docx":
        return extract_text_from_docx(filepath)
    elif ext == "txt":
        return extract_text_from_txt(filepath)

def reindex_docs():
    """Re-index all documents found in the database."""
    db = SessionLocal()
    documents = load_docs_from_db(db)

    all_chunks = []
    all_metadata = []
    for doc in documents:
        filepath = os.path.join(DOCUMENTS_DIR, doc.filename)

        if not os.path.exists(filepath):
            print(f"Warning: File not found for Document ID {doc.id}: {filepath}")
            continue

        text = extract_text_for_file(doc.filename, filepath)

        if not text:
            print(f"Warning: No text extracted from {doc.filename}. Skipping...")
            continue

        chunks = chunk_text(text, chunk_size=300)

        for idx, chunk in enumerate(chunks):
            all_chunks.append(chunk)
            all_metadata.append({
                "filename": doc.filename,
                "chunk_index": idx,
                "chunk_text": chunk,
                "document_id": doc.id
            })

    db.close()

    if not all_chunks:
        print("No documents found for indexing.")
        return

    embeddings = embed_chunks(all_chunks)
    embeddings_array = np.asarray(embeddings)

    save_to_faiss(embeddings_array, all_metadata)

    print(f"✅ Done reindexing {len(all_chunks)} chunks from {len(documents)} files.")

if __name__ == "__main__":
    reindex_docs()
