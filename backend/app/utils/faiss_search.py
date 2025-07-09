import faiss
import json
import numpy as np
import os

INDEX_FILE = "vector.index"
METADATA_FILE = "vector_metadata.json"

class DocumentSearcher:
    """Perform searches over a FAISS index and associated metadata."""
    def __init__(self):
        if not os.path.exists(INDEX_FILE) or not os.path.exists(METADATA_FILE):
            raise FileNotFoundError(f"Index or metadata file not found: {INDEX_FILE}, {METADATA_FILE}")

        self.index = faiss.read_index(INDEX_FILE)

        with open(METADATA_FILE, "r") as f:
            self.metadata = json.load(f)

        if not self.metadata:
            raise ValueError("No metadata loaded for searching.")

        # Normalize metadata format to list
        if isinstance(self.metadata, dict):
            self.metadata = list(self.metadata.values())

    def search(self, query_embedding: np.ndarray, top_k: int = 3, tenant_id: int = None) -> list:
        """Perform semantic search and return top_k results filtered by tenant_id."""
        # Normalize query embedding for cosine similarity
        faiss.normalize_L2(query_embedding.reshape(1, -1))

        distances, indices = self.index.search(query_embedding.reshape(1, -1), top_k * 5)

        results = []
        seen = set()

        for idx, dist in zip(indices[0], distances[0]):
            if idx == -1 or idx >= len(self.metadata):
                continue

            meta = self.metadata[idx]

            # ✅ Filter by tenant_id if provided
            if tenant_id is not None and str(meta.get("tenant_id")) != str(tenant_id):
                continue

            if idx in seen:
                continue
            seen.add(idx)

            meta_copy = meta.copy()
            meta_copy["score"] = float(dist)
            results.append(meta_copy)

            if len(results) >= top_k:
                break

        return results


def get_db_embeddings_and_chunks():
    """Return the embeddings array and the corresponding chunk texts from metadata."""
    if not os.path.exists(INDEX_FILE) or not os.path.exists(METADATA_FILE):
        return None, None

    index = faiss.read_index(INDEX_FILE)

    with open(METADATA_FILE, "r") as f:
        metadata = json.load(f)

    # Normalize metadata format to list
    if isinstance(metadata, dict):
        metadata = list(metadata.values())

    chunks = []
    for meta in metadata:
        chunks.append(meta.get("chunk_text", ""))

    return index, chunks
