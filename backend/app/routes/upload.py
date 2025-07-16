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
from app.models.document_interaction import DocumentInteraction
from sqlalchemy import extract, func
from datetime import datetime
from logging import getLogger

router = APIRouter()
logger = getLogger("uvicorn.error")
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Upload
@router.post("/upload")
async def upload_documents(
    background_tasks: BackgroundTasks,
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    logger.info("=== UPLOAD DOCUMENT CALLED ===")
    uploaded_docs = []

    for file in files:
        filename = file.filename
        ext = filename.split(".")[-1].lower()
        logger.info(f"Uploading file: {filename} (type: {ext})")

        if ext not in ("pdf", "docx", "txt"):
            logger.warning(f"{filename}: unsupported file type {ext}")
            raise HTTPException(status_code=400, detail=f"{filename}: unsupported file type {ext}")

        dest = os.path.join(UPLOAD_DIR, filename)
        with open(dest, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        logger.info(f"Saved file to: {dest}")

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
        logger.info(f"Document saved to DB with id: {document.id}")

        # Log upload
        db.add(DocumentInteraction(user_id=current_user.id, document_id=document.id, action="upload"))
        db.commit()
        logger.info(f"Logged upload interaction for user {current_user.id}, document {document.id}")

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

    logger.info(f"Upload complete: {len(uploaded_docs)} file(s)")
    return {
        "message": f"{len(uploaded_docs)} file(s) uploaded successfully. Indexing in background.",
        "documents": uploaded_docs
    }

# Download
@router.get("/download/{filename}")
def download_file(
    filename: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    logger.info("=== DOWNLOAD DOCUMENT CALLED ===")
    decoded = unquote(unquote(filename))
    file_path = os.path.join(UPLOAD_DIR, decoded)

    if not os.path.exists(file_path):
        logger.warning(f"File not found: {file_path}")
        raise HTTPException(status_code=404, detail="File not found")

    document = db.query(Document).filter_by(filename=decoded).first()
    if document:
        db.add(DocumentInteraction(user_id=current_user.id, document_id=document.id, action="download"))
        db.commit()
        logger.info(f"Logged download by user {current_user.id} for document {document.id}")

    return FileResponse(path=file_path, filename=decoded, media_type="application/octet-stream")

# View
@router.get("/view/{filename}")
def view_document(
    filename: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    logger.info("=== VIEW DOCUMENT CALLED ===")
    decoded = unquote(unquote(filename))
    file_path = os.path.join(UPLOAD_DIR, decoded)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    ext = decoded.split(".")[-1].lower()
    media_type = {
        "pdf": "application/pdf",
        "txt": "text/plain",
        "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    }.get(ext, "application/octet-stream")

    document = db.query(Document).filter_by(filename=decoded).first()
    if document:
        db.add(DocumentInteraction(user_id=current_user.id, document_id=document.id, action="view"))
        db.commit()
        logger.info(f"Logged view by user {current_user.id} for document {document.id}")

    return FileResponse(path=file_path, media_type=media_type, filename=decoded)

# Delete (Admin-only)
@router.delete("/{doc_id}")
def delete_document(
    doc_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can delete documents.")

    document = db.query(Document).filter(Document.id == doc_id, Document.tenant_id == current_user.tenant_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found or not accessible.")

    filename = document.filename
    db.query(DocumentInteraction).filter(DocumentInteraction.document_id == doc_id).delete()

    file_path = os.path.join(UPLOAD_DIR, filename)
    if os.path.exists(file_path):
        os.remove(file_path)

    db.delete(document)
    db.commit()

    # Log delete (after deletion from DB, using doc_id still)
    db.add(DocumentInteraction(user_id=current_user.id, document_id=doc_id, action="delete"))
    db.commit()
    logger.info(f"Logged delete by user {current_user.id} for document {doc_id}")

    return {"message": f"Deleted document '{filename}' successfully."}

# Other routes (unchanged):
@router.get("/")
def get_all_documents(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
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
        } for doc in documents
    ]

@router.get("/tenants/{tenant_id}/documents")
def get_documents_by_tenant_id(tenant_id: int, db: Session = Depends(get_db)):
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
            "status": doc.status
        } for doc in documents
    ]

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

@router.get("/admin/stats/monthly-usage")
def get_monthly_usage(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admins can access this")
    now = datetime.utcnow()
    count = (
        db.query(func.count(DocumentInteraction.id))
        .join(User, User.id == DocumentInteraction.user_id)
        .filter(
            User.tenant_id == current_user.tenant_id,
            extract("year", DocumentInteraction.timestamp) == now.year,
            extract("month", DocumentInteraction.timestamp) == now.month
        )
        .scalar()
    )
    return {"usage_this_month": count}

@router.get("/superadmin/stats/total-documents")
def get_total_documents_for_all_tenants(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "super_admin":
        raise HTTPException(status_code=403, detail="Access denied")
    total_documents = db.query(Document).count()
    return {"total_documents": total_documents}

@router.get("/admin/activity-log")
def get_user_activity_log(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role.lower() not in ["admin", "super_admin"]:
        raise HTTPException(status_code=403, detail="Only admins can access activity logs")

    interactions = (
        db.query(
            DocumentInteraction.timestamp,
            DocumentInteraction.action,
            User.first_name,
            User.last_name,
            Document.filename
        )
        .join(User, User.id == DocumentInteraction.user_id)
        .join(Document, Document.id == DocumentInteraction.document_id)
        .order_by(DocumentInteraction.timestamp.desc())
        .limit(50)
        .all()
    )
    return [
        {
            "user": f"{row.first_name} {row.last_name}",
            "action": row.action,
            "document": row.filename,
            "timestamp": row.timestamp.isoformat()
        } for row in interactions
    ]
