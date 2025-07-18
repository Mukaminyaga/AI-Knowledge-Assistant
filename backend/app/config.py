# app/config.py
import os

# Get base upload location from environment variable or default to local "uploads" (for dev)
BASE_DIR = os.getenv("DOCUMENT_BASE_DIR", os.path.abspath("uploads"))

UPLOAD_DIR = os.path.join(BASE_DIR, "documents")
INDEX_FILE = os.path.join(BASE_DIR, "vector.index")
METADATA_FILE = os.path.join(BASE_DIR, "vector_metadata.json")

# Ensure directories exist
os.makedirs(UPLOAD_DIR, exist_ok=True)
