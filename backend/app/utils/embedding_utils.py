import json
import os
import faiss
import numpy as np
import re
from sentence_transformers import SentenceTransformer

# Load the model once
model = SentenceTransformer("intfloat/e5-small-v2", device="cpu")  # Use 'cuda' if on GPU

INDEX_FILE = "vector.index"
METADATA_FILE = "vector_metadata.json"

def chunk_text(text, chunk_size=300, overlap=50):
    """
    Splits the text by headings like '2.2.4 Local Roads' and chunk the sections with overlap.
    """
    section_pattern = re.compile(r"(?=\n?\d+(\.\d+)+\s+[^\n]+)")  # Matches '2.2.4 Local Roads'
    sections = section_pattern.split(text)

    all_chunks = []
    for section in sections:
        if not section.strip():
            continue

        words = section.strip().split()
        i = 0
        while i < len(words):
            chunk = " ".join(words[i:i + chunk_size])
            all_chunks.append(chunk)
            i += chunk_size - overlap

    return all_chunks

def embed_chunks(chunks):
    """Embed and normalize text chunks for cosine similarity."""
    embeddings = model.encode(chunks, normalize_embeddings=True)  # Automatically normalizes
    return np.array(embeddings, dtype=np.float32)

def save_to_faiss(embeddings: np.ndarray, metadata: list):
    """Save normalized embeddings to a FAISS index and chunk metadata to JSON."""
    dim = embeddings.shape[1]

    # Normalize for cosine similarity
    faiss.normalize_L2(embeddings)

    # Load or create the index using inner product (cosine similarity)
    if os.path.exists(INDEX_FILE):
        index = faiss.read_index(INDEX_FILE)
    else:
        index = faiss.IndexFlatIP(dim)

    index.add(embeddings)
    faiss.write_index(index, INDEX_FILE)

    # Load existing metadata if any
    existing_meta = []
    if os.path.exists(METADATA_FILE):
        with open(METADATA_FILE, "r") as f:
            existing_meta = json.load(f)

    existing_meta.extend(metadata)

    with open(METADATA_FILE, "w") as f:
        json.dump(existing_meta, f, indent=2)

    print(f"✅ Saved {len(embeddings)} embeddings to {INDEX_FILE}")
    print(f"✅ Saved metadata (without embeddings) to {METADATA_FILE}")
