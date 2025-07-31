# schemas/chat.py

from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from uuid import UUID

class MessageCreate(BaseModel):
    role: str
    text: str
    results: Optional[List[dict]] = []

class ChatCreate(BaseModel):
    user_id: int
    tenant_id: int
    title: str
    messages: List[MessageCreate]

class ChatOut(BaseModel):
    id: UUID
    title: str
    created_at: datetime
    bookmarked: bool

    class Config:
        from_attributes = True

class ChatMessageOut(BaseModel):
    role: str
    text: str
    response: Optional[str] = None
    results: Optional[List[dict]] = []
    created_at: datetime

    class Config:
        from_attributes = True

class ChatSessionFull(ChatOut):
    messages: List[ChatMessageOut]

class BookmarkUpdate(BaseModel):
    session_id: UUID
    bookmarked: bool
