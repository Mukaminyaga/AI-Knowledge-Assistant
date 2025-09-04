from sqlalchemy.orm import Session
from app.models import chat as models
from app.schemas import chat as schemas

def create_chat_session(db: Session, user_id: str, title: str = "New Chat"):
    session = models.ChatSession(user_id=user_id, title=title)
    db.add(session)
    db.commit()
    db.refresh(session)
    return session

def add_message(db: Session, session_id: int, role: str, text: str):
    msg = models.Message(session_id=session_id, role=role, text=text)
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg

def get_user_sessions(db: Session, user_id: str):
    return db.query(models.ChatSession).filter(models.ChatSession.user_id == user_id).all()

def get_session_messages(db: Session, session_id: int):
    return db.query(models.Message).filter(models.Message.session_id == session_id).all()

def toggle_bookmark(db: Session, session_id: int):
    session = db.query(models.ChatSession).filter(models.ChatSession.id == session_id).first()
    if session:
        session.bookmarked = 0 if session.bookmarked else 1
        db.commit()
        db.refresh(session)
    return session

def delete_chat_session(db: Session, session_id: int):
    session = db.query(models.ChatSession).filter(models.ChatSession.id == session_id).first()
    if session:
        db.delete(session)
        db.commit()
        return True
    return False

def get_user_bookmarks(db: Session, user_id: int):
    return (
        db.query(models.ChatSession)
        .filter(
            models.ChatSession.user_id == user_id,
            models.ChatSession.bookmarked == 1
        )
        .order_by(models.ChatSession.timestamp.desc())
        .all()
    )

