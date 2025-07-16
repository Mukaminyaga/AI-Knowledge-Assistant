import os
import json
import faiss
import numpy as np
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.document import Document
from app.utils.document_utils import (
    extract_text_from_pdf,
    extract_text_from_docx,
    extract_text_from_txt,
)
from app.utils.embedding_utils import chunk_text, embed_chunks

INDEX_FILE = "vector.index"
METADATA_FILE = "vector_metadata.json"
DOCUMENTS_DIR = "uploads"

def extract_text_for_file(filename, filepath):
    ext = filename.lower().split(".")[-1]
    if ext == "pdf":
        return extract_text_from_pdf(filepath)
    elif ext == "docx":
        return extract_text_from_docx(filepath)
    elif ext == "txt":
        return extract_text_from_txt(filepath)
    return ""

def index_and_update(file_path: str, document_id: int):
    """Index an approved document, updating vector index and metadata."""
    db: Session = SessionLocal()
    try:
        doc = db.query(Document).filter(Document.id == document_id).first()
        if not doc:
            print(f"[✗] Document ID {document_id} not found.")
            return

        # Ensure it's only indexing approved docs
        if doc.status != "processing":
            print(f"[!] Document ID {document_id} not in 'processing' state. Current status: {doc.status}")
            return

        text = extract_text_for_file(doc.filename, file_path)
        if not text:
            print(f"[✗] No text extracted from '{doc.filename}'")
            doc.status = "failed"
            db.commit()
            return

        chunks = chunk_text(text, chunk_size=300, overlap=50)
        embeddings = embed_chunks(chunks)
        embeddings = np.asarray(embeddings, dtype=np.float32)
        faiss.normalize_L2(embeddings)

        # Load or create FAISS index
        dim = embeddings.shape[1]
        if os.path.exists(INDEX_FILE):
            index = faiss.read_index(INDEX_FILE)
        else:
            index = faiss.IndexFlatIP(dim)
        index.add(embeddings)
        faiss.write_index(index, INDEX_FILE)

        # Load or update metadata
        metadata = []
        if os.path.exists(METADATA_FILE):
            with open(METADATA_FILE, "r") as f:
                metadata = json.load(f)

        for idx, chunk in enumerate(chunks):
            metadata.append({
                "filename": doc.filename,
                "chunk_index": idx,
                "chunk_text": chunk,
                "document_id": doc.id,
                "tenant_id": doc.tenant_id
            })

        with open(METADATA_FILE, "w") as f:
            json.dump(metadata, f, indent=2)

        # Update DB
        doc.num_chunks = len(chunks)
        doc.indexed = True
        doc.status = "processed"
        db.commit()
        print(f"[✓] Indexed {len(chunks)} chunks for '{doc.filename}' (ID: {doc.id})")

    except Exception as e:
        print(f"[✗] Indexing failed for document ID {document_id}: {e}")
        if 'doc' in locals() and doc:
            doc.status = "failed"
            db.commit()
    finally:
        db.close()
