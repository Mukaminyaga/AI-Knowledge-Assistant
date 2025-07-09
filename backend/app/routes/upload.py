from fastapi import UploadFile, File, APIRouter, HTTPException, Depends, BackgroundTasks
from sqlalchemy.orm import Session
import os
import shutil

from app.utils import indexing_utils
from app.database import get_db
from app.models.document import Document
from app.auth import get_current_user
from app.models.users import User  # For current_user.tenant_id

router = APIRouter()
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    filename = file.filename
    ext = filename.split(".")[-1].lower()

    if ext not in ("pdf", "docx", "txt"):
        raise HTTPException(status_code=400, detail=f"{filename}: unsupported file type {ext}")

    # Save file locally
    dest = os.path.join(UPLOAD_DIR, filename)
    with open(dest, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Save document in DB
    document = Document(
        filename=filename,
        file_type=ext,
        size=os.path.getsize(dest),
        tenant_id=current_user.tenant_id,
        num_chunks=0,
    )
    db.add(document)
    db.commit()
    db.refresh(document)

    # Index the file in background
    background_tasks.add_task(indexing_utils.index_and_update, file_path=dest, document_id=document.id)

    return {
        "message": " Upload successful. Indexing is being done in the background.",
        "document": {
            "id": document.id,
            "filename": document.filename,
            "file_type": document.file_type,
            "size": document.size,
        },
    }


@router.get("/")
def get_all_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    documents = db.query(Document).filter(Document.tenant_id == current_user.tenant_id).all()
    return [
        {
            "id": doc.id,
            "filename": doc.filename,
            "file_type": doc.file_type,
            "size": doc.size,
            "num_chunks": doc.num_chunks,
            "indexed": doc.indexed
        }
        for doc in documents
    ]


@router.get("/tenants/{tenant_id}/documents")
def get_documents_by_tenant_id(
    tenant_id: int,
    db: Session = Depends(get_db)
):
    documents = db.query(Document).filter(Document.tenant_id == tenant_id).all()
    return [
        {
            "id": doc.id,
            "filename": doc.filename,
            "file_type": doc.file_type,
            "size": doc.size,
            "num_chunks": doc.num_chunks,
            "indexed": doc.indexed,
            "uploaded_at": getattr(doc, "created_at", None)
        }
        for doc in documents
    ]


@router.delete("/{doc_id}")
def delete_document(
    doc_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    document = db.query(Document).filter(
        Document.id == doc_id,
        Document.tenant_id == current_user.tenant_id
    ).first()

    if not document:
        raise HTTPException(status_code=404, detail="Document not found or not accessible.")

    file_path = os.path.join(UPLOAD_DIR, document.filename)
    if os.path.exists(file_path):
        os.remove(file_path)

    db.delete(document)
    db.commit()
    return {"message": f"Deleted document '{document.filename}' successfully."}
