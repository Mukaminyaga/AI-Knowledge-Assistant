from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

model = SentenceTransformer("all-MiniLM-L6-v2")

def chunk_text(text, chunk_size=300):
    words = text.split()
    chunks = [' '.join(words[i:i+chunk_size]) for i in range(0, len(words), chunk_size)]
    return chunks

def embed_chunks(chunks):
    return model.encode(chunks)

def save_to_faiss(embeddings, metadata=None, index_file="vector.index"):
    dim = embeddings.shape[1]
    index = faiss.IndexFlatL2(dim)
    index.add(embeddings)

    faiss.write_index(index, index_file)
