import json
import os
import faiss
import numpy as np
import re
from sentence_transformers import SentenceTransformer

# Load the model once
model = SentenceTransformer("intfloat/e5-small-v2", device="cpu")  # Use 'cuda' if on GPU

BASE_DIR = "/var/www/GPKnowledgeManagementAI"

INDEX_FILE = os.path.join(BASE_DIR, "vector.index")
METADATA_FILE = os.path.join(BASE_DIR, "vector_metadata.json")



def chunk_text(text, chunk_size=300, overlap=50):
    """
    Splits text into sections by numbered headings and paragraphs, preserving table blocks.
    Groups sections into chunks of approx `chunk_size` words with `overlap` between chunks.
    """

    def is_table_block(paragraph):
        # Heuristics to detect table-like text
        lines = paragraph.splitlines()
        table_line_count = sum(1 for line in lines if re.search(r'\t| {2,}|\|', line))
        return len(lines) > 1 and table_line_count / len(lines) > 0.5

    # Step 1: Split into sections using non-capturing regex for headings like "3.3", "2.1.4 General"
    heading_pattern = re.compile(r"(?=\n?\d+(?:\.\d+)*\s+[^\n]+)")
    sections = heading_pattern.split(text)

    chunks = []

    for section in sections:
        if not section or not isinstance(section, str):
            continue
        if not section.strip():
            continue

        # Step 2: Split section into paragraphs (by double newlines)
        raw_paragraphs = re.split(r"\n\s*\n", section.strip())
        paragraphs = []

        # Step 3: Group table lines as blocks
        temp_block = []
        inside_table = False

        for para in raw_paragraphs:
            if is_table_block(para):
                if inside_table:
                    temp_block.append(para)
                else:
                    if temp_block:
                        paragraphs.append("\n\n".join(temp_block))
                        temp_block = []
                    temp_block = [para]
                    inside_table = True
            else:
                if inside_table:
                    paragraphs.append("\n\n".join(temp_block))
                    temp_block = []
                    inside_table = False
                paragraphs.append(para)

        if temp_block:
            paragraphs.append("\n\n".join(temp_block))

        # Step 4: Form word-limited chunks with overlap
        current_chunk = []
        current_length = 0

        for para in paragraphs:
            words = para.strip().split()
            if current_length + len(words) > chunk_size:
                chunks.append(" ".join(current_chunk))
                current_chunk = current_chunk[-overlap:]  # Add overlap
                current_length = len(current_chunk)

            current_chunk.extend(words)
            current_length += len(words)

        if current_chunk:
            chunks.append(" ".join(current_chunk))

    return chunks


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

    print(f" Saved {len(embeddings)} embeddings to {INDEX_FILE}")
    print(f" Saved metadata (without embeddings) to {METADATA_FILE}")
