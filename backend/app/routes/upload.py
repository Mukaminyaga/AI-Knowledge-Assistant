from typing import List
from fastapi import UploadFile, File, APIRouter, HTTPException, Depends, BackgroundTasks, Form
from fastapi import Path
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
from app.utils.permissions import ensure_permission
from pathlib import Path
from pydantic import BaseModel
from typing import List, Optional


router = APIRouter()
logger = getLogger("uvicorn.error")
UPLOAD_DIR = "/var/www/GPKnowledgeManagementAI/uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)


class DepartmentAssignmentRequest(BaseModel):
    document_ids: List[int]
    department_id: Optional[int]

# --- Helper ---
def ensure_permission(user: User, allowed_roles: List[str]):
    if user.role.lower() not in [role.lower() for role in allowed_roles]:
        raise HTTPException(status_code=403, detail="You do not have permission to perform this action.")

# Upload (Editor/Admin only)
@router.post("/upload")
async def upload_documents(
    background_tasks: BackgroundTasks,
    files: List[UploadFile] = File(...),
    department_id: Optional[int] = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Only admin or editor can upload
    ensure_permission(current_user, ["admin", "editor"])

    logger.info("=== UPLOAD DOCUMENT CALLED ===")
    uploaded_docs = []

    for file in files:
       
        filename = os.path.basename(file.filename.replace("\\", "/"))
        file_path = os.path.join(UPLOAD_DIR, filename)
        ext = filename.split(".")[-1].lower()
        logger.info(f"Uploading file: {filename} (type: {ext})")

        if ext not in ("pdf", "docx", "txt"):
            logger.warning(f"{filename}: unsupported file type {ext}")
            raise HTTPException(status_code=400, detail=f"{filename}: unsupported file type {ext}")

        
        dest = os.path.normpath(os.path.join(UPLOAD_DIR, filename))
        with open(dest, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        logger.info(f"Saved file to: {dest}")

        # Only Admin uploads are auto-approved
      
        status = "processing" if current_user.role.lower() == "admin" else "pending"



        document = Document(
            filename=filename,
            file_type=ext,
            size=os.path.getsize(dest),
            tenant_id=current_user.tenant_id,
            num_chunks=0,
            status=status,
            department_id=department_id 
        )
        db.add(document)
        db.commit()
        db.refresh(document)
        logger.info(f"Document saved to DB with id: {document.id}")

        # Log upload
        db.add(DocumentInteraction(user_id=current_user.id, document_id=document.id, tenant_id=current_user.tenant_id, action="upload"))
        db.commit()
        logger.info(f"Logged upload interaction for user {current_user.id}, document {document.id}")

        # Only index approved documents
        if status == "processing":
            background_tasks.add_task(indexing_utils.index_and_update, file_path=dest, document_id=document.id)
            logger.info("Indexing scheduled.")
        else:
            logger.info("Document pending approval — indexing skipped.")

        uploaded_docs.append({
            "id": document.id,
            "filename": document.filename,
            "file_type": document.file_type,
            "size": document.size,
            "tenant_id": document.tenant_id,
            "status": document.status
        })

    return {
        "message": f"{len(uploaded_docs)} file(s) uploaded successfully.",
        "documents": uploaded_docs
    }



@router.post("/documents/assign-department")
def assign_documents_to_department(
    payload: DepartmentAssignmentRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ensure_permission(current_user, ["admin", "editor"])

    documents = db.query(Document).filter(Document.id.in_(payload.document_ids)).all()
    if not documents:
        raise HTTPException(status_code=404, detail="No documents found")

    for doc in documents:
        doc.department_id = payload.department_id
    db.commit()

    return {
        "message": f"Assigned {len(documents)} document(s) to department {payload.department_id}"
    }


@router.put("/approve/{document_id}")
def approve_document(
    document_id: int,
    background_tasks: BackgroundTasks,  
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ensure_permission(current_user, ["admin"])

    document = db.query(Document).filter(
        Document.id == document_id,
        Document.tenant_id == current_user.tenant_id
    ).first()

    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    if document.status == "approved" or document.status == "processing":
        raise HTTPException(status_code=400, detail="Document already approved or being processed")

    document.status = "processing"
    db.commit()

    # Trigger background indexing
    file_path = os.path.join(UPLOAD_DIR, document.filename)
    if os.path.exists(file_path):
        from app.utils.indexing_utils import index_and_update
        background_tasks.add_task(index_and_update, file_path=file_path, document_id=document.id)

    return {"message": "Document approved and indexing started."}


# Download (Viewer/Editor/Admin)
@router.get("/download/{filename}")
def download_file(
    filename: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ensure_permission(current_user, ["admin", "editor", "viewer"])

    decoded = unquote(unquote(filename))
    file_path = os.path.join(UPLOAD_DIR, decoded)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    # Ensure document belongs to the same tenant
    document = db.query(Document).filter_by(
        filename=decoded,
        tenant_id=current_user.tenant_id
    ).first()

    if not document:
        raise HTTPException(status_code=404, detail="Document not found for your tenant")

    # Log interaction
    db.add(DocumentInteraction(
        user_id=current_user.id,
        document_id=document.id,
        tenant_id=current_user.tenant_id,
        action="download"
    ))
    db.commit()

    return FileResponse(path=file_path, filename=decoded, media_type="application/octet-stream")


# View (Viewer/Editor/Admin)
@router.get("/view/{filename}")
def view_document(
    filename: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ensure_permission(current_user, ["admin", "editor", "viewer"])

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

    # Ensure document belongs to the same tenant
    document = db.query(Document).filter_by(
        filename=decoded,
        tenant_id=current_user.tenant_id
    ).first()

    if  document:

    # Log interaction
     db.add(DocumentInteraction(
        user_id=current_user.id,
        document_id=document.id,
        tenant_id=current_user.tenant_id,
        action="view"
    ))
    db.commit()

    return FileResponse(path=file_path, media_type=media_type, filename=decoded)

# Delete (Admin only)
@router.delete("/{doc_id}")
def delete_document(
    doc_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ensure_permission(current_user, ["admin"])

    document = db.query(Document).filter(Document.id == doc_id, Document.tenant_id == current_user.tenant_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found or not accessible.")

    filename = document.filename
    db.query(DocumentInteraction).filter(DocumentInteraction.document_id == doc_id).delete()

    file_path = os.path.join(UPLOAD_DIR, filename)
    if os.path.exists(file_path):
        os.remove(file_path)

    
    db.query(DocumentInteraction).filter(
    DocumentInteraction.document_id == document.id
).delete()
    
    db.delete(document)
    db.commit()

    return {"message": f"Deleted document '{filename}' successfully."}



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
            "status": doc.status,
            "department_id": doc.department_id 
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
            "status": doc.status,
            "department_id": doc.department_id 
        } for doc in documents
    ]

@router.get("/stats")
def get_tenant_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    total = db.query(Document).filter(Document.tenant_id == current_user.tenant_id).count()
    processed = db.query(Document).filter(
        Document.tenant_id == current_user.tenant_id,
        Document.status == "processed"
    ).count()
    processing = db.query(Document).filter(
        Document.tenant_id == current_user.tenant_id,
        Document.status == "processing"
    ).count()
    failed = db.query(Document).filter(
        Document.tenant_id == current_user.tenant_id,
        Document.status == "failed"
    ).count()
    pending = db.query(Document).filter(
        Document.tenant_id == current_user.tenant_id,
        Document.status == "pending"
    ).count()

    return {
        "total": total,
        "processed": processed,
        "processing": processing,
        "failed": failed,
        "pending": pending
    }

@router.get("/recent-activity")
def recent_activity(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(Document).filter(Document.tenant_id == current_user.tenant_id)

    # Optional: if you want admins to see ALL, and users to see only their own
    # Or skip this if tenant-based filtering is already sufficient
    # if current_user.role.lower() != "admin":
    #     query = query.filter(Document.user_id == current_user.id)  # if user_id exists

    docs = query.order_by(Document.upload_time.desc()).limit(3).all()

    return [
        {
            "id": doc.id, 
            "filename": doc.filename,
            "status": doc.status,
            "uploaded_at": doc.upload_time.isoformat(),
        }
        for doc in docs
    ]


@router.get("/admin/stats/monthly-usage")
def get_monthly_usage(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    ensure_permission(current_user, ["admin"])
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
    ensure_permission(current_user, ["super_admin"])
    total_documents = db.query(Document).count()
    return {"total_documents": total_documents}

@router.get("/admin/activity-log")
def get_user_activity_log(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ensure_permission(current_user, ["admin"])

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
        .filter(Document.tenant_id == current_user.tenant_id)  
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
        }
        for row in interactions
    ]
