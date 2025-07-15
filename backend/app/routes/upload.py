from typing import List
from fastapi import UploadFile, File, APIRouter, HTTPException, Depends, BackgroundTasks
from sqlalchemy.orm import Session
import os
import shutil

from app.utils import indexing_utils
from app.database import get_db
from app.models.document import Document
from app.auth import get_current_user
from app.models.users import User
from fastapi.responses import FileResponse
from urllib.parse import unquote



router = APIRouter()
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_documents(
    background_tasks: BackgroundTasks,
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    uploaded_docs = []

    for file in files:
        filename = file.filename
        ext = filename.split(".")[-1].lower()

        if ext not in ("pdf", "docx", "txt"):
            raise HTTPException(
                status_code=400,
                detail=f"{filename}: unsupported file type {ext}"
            )

        # Save file locally
        dest = os.path.join(UPLOAD_DIR, filename)
        with open(dest, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Save to DB with status = pending
        document = Document(
            filename=filename,
            file_type=ext,
            size=os.path.getsize(dest),
            tenant_id=current_user.tenant_id,
            num_chunks=0,
            status="pending"
        )
        db.add(document)
        db.commit()
        db.refresh(document)

        # Index document in background
        background_tasks.add_task(
            indexing_utils.index_and_update,
            file_path=dest,
            document_id=document.id
        )

        uploaded_docs.append({
            "id": document.id,
            "filename": document.filename,
            "file_type": document.file_type,
            "size": document.size,
            "tenant_id": document.tenant_id,
            "status": document.status
        })

    return {
        "message": f"{len(uploaded_docs)} file(s) uploaded successfully. Indexing in background.",
        "documents": uploaded_docs
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
            "uploaded_at": doc.upload_time,
            "tenant_id": doc.tenant_id,
            "status": doc.status
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
            "uploaded_at": doc.upload_time,
            "tenant_id": doc.tenant_id,
            "status": doc.status  # use status from DB
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




@router.get("/download/{filename}")
def download_file(
    filename: str,
    current_user: User = Depends(get_current_user)
):
    file_path = os.path.join(UPLOAD_DIR, filename)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(
        path=file_path,
        filename=filename,
        media_type="application/octet-stream"
    )


@router.get("/documents/view/{filename}")
def view_document(
    filename: str,
    current_user: User = Depends(get_current_user),
):
    filename = unquote(filename)
    file_path = os.path.join("uploads", filename)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    ext = filename.split(".")[-1].lower()
    media_type = {
        "pdf": "application/pdf",
        "txt": "text/plain",
        "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    }.get(ext, "application/octet-stream")

    return FileResponse(
        file_path,
        media_type=media_type,
        filename=filename
    )
@router.get("/stats")
def get_tenant_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    total = db.query(Document).filter(Document.tenant_id == current_user.tenant_id).count()
    processed = db.query(Document).filter(Document.tenant_id == current_user.tenant_id, Document.status == "processed").count()
    processing = db.query(Document).filter(Document.tenant_id == current_user.tenant_id, Document.status == "processing").count()
    failed = db.query(Document).filter(Document.tenant_id == current_user.tenant_id, Document.status == "failed").count()
    pending = db.query(Document).filter(Document.tenant_id == current_user.tenant_id, Document.status == "pending").count()
    return {"total": total, "processed": processed, "processing": processing, "failed": failed, "pending": pending}

@router.get("/recent-activity")
def recent_activity(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    docs = (
        db.query(Document)
        .filter(Document.tenant_id == current_user.tenant_id)
        .order_by(Document.upload_time.desc())
        .limit(5)
        .all()
    )
    return [
        {
            "filename": doc.filename,
            "status": doc.status,
            "uploaded_at": doc.upload_time.isoformat(),
        }
        for doc in docs
    ]

@router.get("/superadmin/stats/total-documents")
def get_total_documents_for_all_tenants(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "super_admin":
        raise HTTPException(status_code=403, detail="Access denied")

    total_documents = db.query(Document).count()
    return {"total_documents": total_documents}

