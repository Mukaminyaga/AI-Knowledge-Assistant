import os
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.document import Document

UPLOAD_DIR = "uploads"

def check_files():
    db: Session = SessionLocal()

    # 1️⃣ List files in uploads directory
    files_in_dir = set(os.listdir(UPLOAD_DIR))

    # 2️⃣ List files in database
    documents = db.query(Document).all()
    files_in_db = {doc.filename for doc in documents}

    # ✅ Compare
    only_in_dir = files_in_dir - files_in_db
    only_in_db = files_in_db - files_in_dir

    print("\n=== Summary ===")
    if only_in_dir:
        print(f"Files in 'uploads' but NOT in database ({len(only_in_dir)}):")
        for f in only_in_dir:
            print(f"  - {f}")

    if only_in_db:
        print(f"Files in database but NOT in 'uploads' ({len(only_in_db)}):")
        for f in only_in_db:
            print(f"  - {f}")

    if not only_in_dir and not only_in_db:
        print("✅ All files match between 'uploads' and the database.")

    db.close()


if __name__ == '__main__':
    check_files()
