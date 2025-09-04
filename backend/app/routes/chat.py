from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.crud import chat as crud
from app.schemas import chat as schemas
from app.database import get_db

router = APIRouter(prefix="/chat", tags=["chat"])

@router.post("/start", response_model=schemas.ChatSession)
def start_chat(session: schemas.ChatSessionCreate, db: Session = Depends(get_db)):
    return crud.create_chat_session(db, user_id=session.user_id, title=session.title)

@router.post("/message", response_model=schemas.Message)
def add_message(data: schemas.MessageWithSession, db: Session = Depends(get_db)):
    return crud.add_message(db, session_id=data.session_id, role=data.role, text=data.text)



@router.get("/history/{user_id}", response_model=List[schemas.ChatSession])
def get_history(user_id: str, db: Session = Depends(get_db)):
    return crud.get_user_sessions(db, user_id=user_id)

@router.get("/messages/{session_id}", response_model=List[schemas.Message])
def get_messages(session_id: int, db: Session = Depends(get_db)):
    return crud.get_session_messages(db, session_id=session_id)

@router.put("/bookmark/{session_id}", response_model=schemas.ChatSession)
def bookmark_chat(session_id: int, db: Session = Depends(get_db)):
    session = crud.toggle_bookmark(db, session_id)
    if not session:
        return {"error": "Chat session not found"}
    return session

@router.get("/bookmarks/{user_id}", response_model=List[schemas.ChatSession])
def get_bookmarks(user_id: int, db: Session = Depends(get_db)):
    return crud.get_user_bookmarks(db, user_id=user_id)



@router.delete("/delete/{session_id}")
def delete_chat(session_id: int, db: Session = Depends(get_db)):
    success = crud.delete_chat_session(db, session_id)
    return {"deleted": success}
