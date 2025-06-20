import json
import os
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer


model = SentenceTransformer("all-MiniLM-L6-v2")

INDEX_FILE = "vector.index"
METADATA_FILE = "vector_metadata.json"

def chunk_text(text, chunk_size=300):
    words = text.split()
    return [' '.join(words[i:i+chunk_size]) for i in range(0, len(words), chunk_size)]

def embed_chunks(chunks):
    return model.encode(chunks)

def save_to_faiss(embeddings: np.ndarray, metadata: list):
    dim = embeddings.shape[1]
    
    # Create or load index
    if os.path.exists(INDEX_FILE):
        index = faiss.read_index(INDEX_FILE)
    else:
        index = faiss.IndexFlatL2(dim)

    # Add vectors
    index.add(embeddings)
    faiss.write_index(index, INDEX_FILE)

    # Save metadata
    existing_meta = []
    if os.path.exists(METADATA_FILE):
        with open(METADATA_FILE, "r") as f:
            existing_meta = json.load(f)

    existing_meta.extend(metadata)

    with open(METADATA_FILE, "w") as f:
        json.dump(existing_meta, f, indent=2)
