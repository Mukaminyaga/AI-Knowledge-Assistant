import faiss
import json
import numpy as np
import os

INDEX_FILE = "vector.index"
METADATA_FILE = "vector_metadata.json"

class DocumentSearcher:
    """Perform searches over a Faiss index and associated metadata."""
    def __init__(self):
        if not os.path.exists(INDEX_FILE) or not os.path.exists(METADATA_FILE):
            raise FileNotFoundError(f"Index or metadata file not found: {INDEX_FILE}, {METADATA_FILE}")

        self.index = faiss.read_index(INDEX_FILE)

        with open(METADATA_FILE, "r") as f:
            self.metadata = json.load(f)

        if not self.metadata:
            raise ValueError("No documents available for searching.")

    def search(self, query_embedding: np.ndarray, top_k: int = 3) -> list:
        """Perform a semantic search and return matching metadata, including chunk text."""
        distances, indices = self.index.search(np.expand_dims(query_embedding, axis=0), top_k)

        results = []
        for idx in indices[0]:
            if idx < len(self.metadata):
                results.append(self.metadata[idx])

        return results


def get_db_embeddings_and_chunks():
    """Load embeddings and chunk text from the index files."""
    if not os.path.exists(INDEX_FILE) or not os.path.exists(METADATA_FILE):
        return None, None

    index = faiss.read_index(INDEX_FILE)
    with open(METADATA_FILE, "r") as f:
        metadata = json.load(f)

    embeddings = []
    chunks = []
    for item in metadata:
        embeddings.append(np.asarray(item.get("embedding"))) if "embedding" in item else None
        chunks.append(item.get("chunk_text", ""))

    embeddings_array = np.vstack(embeddings) if embeddings else None
    return embeddings_array, chunks
