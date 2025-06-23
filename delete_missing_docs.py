import os
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.document import Document

UPLOAD_DIR = "uploads"

def delete_docs_not_in_upload_dir():
    """Check for documents in the database that are NOT in the uploads directory and delete them."""
    db: Session = SessionLocal()
    documents = db.query(Document).all()
    deleted_docs = []
    for doc in documents:
        file_path = os.path.join(UPLOAD_DIR, doc.filename)
        if not os.path.exists(file_path):  # If the actual file isn't found
            db.delete(doc)
            deleted_docs.append(doc.filename)

    db.commit()
    db.close()

    if deleted_docs:
        print(f"Deleted documents from database because files were missing:")
        for doc_name in deleted_docs:
            print(f" - {doc_name}")
    else:
        print("All database documents have matching files.")

if __name__ == "__main__":
    delete_docs_not_in_upload_dir()
