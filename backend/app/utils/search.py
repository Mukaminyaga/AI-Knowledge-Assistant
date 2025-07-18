import os
import faiss
import json
import numpy as np
from app.utils.embedding_utils import embed_chunks

# BASE_DIR is app/utils
BASE_DIR = "/var/www/GPKnowledgeManagementAI"
INDEX_FILE = os.path.join(BASE_DIR, "vector.index")
METADATA_FILE = os.path.join(BASE_DIR, "vector_metadata.json")


class DocumentSearcher:
    def __init__(self):
        print(f"Loading index from: {os.path.abspath(INDEX_FILE)}")
        print(f"Loading metadata from: {os.path.abspath(METADATA_FILE)}")

        if not os.path.exists(INDEX_FILE) or not os.path.exists(METADATA_FILE):
            raise FileNotFoundError(f"Index or metadata file not found. Tried {INDEX_FILE} and {METADATA_FILE}")

        self.index = faiss.read_index(INDEX_FILE)
        with open(METADATA_FILE, "r") as f:
            self.metadata = json.load(f)

        if not self.metadata:
            raise ValueError("No documents available for searching.")

    def search(self, query: str, top_k: int = 5):
        """Perform a semantic search using cosine similarity."""
        embedding = embed_chunks([query])[0].astype("float32")

        # Normalize query embedding to unit length
        faiss.normalize_L2(embedding.reshape(1, -1))

        distances, indices = self.index.search(np.expand_dims(embedding, axis=0), top_k)

        results = []
        for idx in indices[0]:
            if idx < len(self.metadata):
                results.append(self.metadata[idx])
        return results
