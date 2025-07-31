from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
import app.schemas.chat as schemas
import app.models.chat as models
import uuid
from datetime import datetime, timedelta
from collections import defaultdict
from app.auth import get_current_user
from app.models.chat import ChatSession
from app.database import get_db
from app.models.users import User
from uuid import UUID

router = APIRouter(prefix="/chat", tags=["Chat"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/create", response_model=schemas.ChatOut)
def create_chat(chat: schemas.ChatCreate, db: Session = Depends(get_db)):
    existing_session = (
        db.query(models.ChatSession)
        .filter_by(user_id=chat.user_id, tenant_id=chat.tenant_id, title=chat.title)
        .first()
    )

    if existing_session:
        session = existing_session
    else:
        session = models.ChatSession(
            id=str(uuid.uuid4()),
            user_id=chat.user_id,
            tenant_id=chat.tenant_id,
            title=chat.title,
        )
        db.add(session)
        db.commit()

    for msg in chat.messages:
        message = models.ChatMessage(
            session_id=session.id,
            user_id=chat.user_id,
            tenant_id=chat.tenant_id,
            role=msg.role,
            text=msg.text,
            results=msg.results,
            created_at=datetime.utcnow()
        )
        db.add(message)

    db.commit()
    return session

@router.get("/history", response_model=dict)
def get_chat_history(user_id: int, tenant_id: int, db: Session = Depends(get_db)):
    sessions = (
        db.query(models.ChatSession)
        .filter_by(user_id=user_id, tenant_id=tenant_id)
        .order_by(models.ChatSession.created_at.desc())
        .all()
    )

    grouped = defaultdict(list)
    today = datetime.utcnow().date()

    for s in sessions:
        label = (
            "Today" if s.created_at.date() == today else
            "Yesterday" if s.created_at.date() == today - timedelta(days=1) else
            s.created_at.strftime("%d %B %Y")
        )
        grouped[label].append({
            "id": s.id,
            "title": s.title,
            "timestamp": s.created_at,
            "bookmarked": s.bookmarked
        })

    return grouped


@router.get("/session/{session_id}", response_model=schemas.ChatSessionFull)
def get_session(session_id: str, db: Session = Depends(get_db)):
    session = db.query(models.ChatSession).filter_by(id=session_id).first()
    if not session:
        raise HTTPException(404, "Chat session not found")
    return session

@router.post("/bookmark")
def bookmark_session(data: schemas.BookmarkUpdate, db: Session = Depends(get_db)):
    session = db.query(models.ChatSession).filter_by(id=data.session_id).first()
    if not session:
        raise HTTPException(404, "Not found")
    session.bookmarked = data.bookmarked
    db.commit()
    return {"success": True}


@router.get("/bookmarks", response_model=List[schemas.ChatOut])
def get_bookmarks(user_id: int, tenant_id: int, db: Session = Depends(get_db)):
    sessions = db.query(models.ChatSession).filter_by(
        user_id=user_id, tenant_id=tenant_id, bookmarked=True
    ).all()
    return sessions


@router.get("/files", response_model=List[str])
def get_recent_files(user_id: int, tenant_id: int, db: Session = Depends(get_db)):
    messages = (
        db.query(models.ChatMessage)
        .filter_by(user_id=user_id, tenant_id=tenant_id)
        .order_by(models.ChatMessage.created_at.desc())
        .all()
    )

    filenames = []
    seen = set()
    for msg in messages:
        if msg.results:
            for res in msg.results:
                filename = res.get("filename")
                if filename and filename not in seen:
                    filenames.append(filename)
                    seen.add(filename)
        if len(filenames) >= 10:
            break

    return filenames[:10]

@router.post("/chat_sessions/{session_id}/bookmark")
def toggle_bookmark(
    session_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    session = db.query(ChatSession).filter_by(id=session_id, user_id=current_user.id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found")

    session.bookmarked = not session.bookmarked
    db.commit()
    db.refresh(session)
    return {"session_id": session.id, "bookmarked": session.bookmarked}



@router.get("/chat_sessions/bookmarked")
def get_bookmarked_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    sessions = db.query(ChatSession).filter_by(user_id=current_user.id, bookmarked=True).all()
    return sessions

@router.get("/messages/{session_id}", response_model=List[schemas.ChatMessageOut])
def get_session_messages(session_id: str, db: Session = Depends(get_db)):
    messages = (
        db.query(models.ChatMessage)
        .filter_by(session_id=session_id)
        .order_by(models.ChatMessage.created_at.asc())
        .all()
    )
    return messages

@router.delete("/session/{session_id}")
def delete_chat_session(session_id: str, db: Session = Depends(get_db)):
    session = db.query(ChatSession).filter_by(id=session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found")

    # Optional: delete related messages
    db.query(models.ChatMessage).filter_by(session_id=session_id).delete()

    db.delete(session)
    db.commit()
    return {"success": True}


# routers/chat.py - Add these endpoints

@router.get("/session/{session_id}/full", response_model=schemas.ChatSessionFull)
def get_full_session(
    session_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get full chat session with all messages in chronological order
    """
    session = db.query(models.ChatSession).filter(
        models.ChatSession.id == session_id,
        models.ChatSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found")
    
    messages = (
        db.query(models.ChatMessage)
        .filter(models.ChatMessage.session_id == session_id)
        .order_by(models.ChatMessage.created_at.asc())
        .all()
    )
    
    return {
        "id": session.id,
        "title": session.title,
        "created_at": session.created_at,
        "bookmarked": session.bookmarked,
        "messages": messages
    }

@router.post("/session/new", response_model=schemas.ChatOut)
def create_new_session(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a brand new chat session
    """
    new_session = models.ChatSession(
        user_id=current_user.id,
        tenant_id=current_user.tenant_id,
        title="New Chat",
        created_at=datetime.utcnow()
    )
    
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    
    # Add welcome message
    welcome_msg = models.ChatMessage(
        session_id=new_session.id,
        user_id=current_user.id,
        tenant_id=current_user.tenant_id,
        role="assistant",
        text="Hello! How can I help you today?",
        created_at=datetime.utcnow()
    )
    db.add(welcome_msg)
    db.commit()
    
    return new_session