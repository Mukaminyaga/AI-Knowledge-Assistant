from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class MessageBase(BaseModel):
    role: str
    text: str

class MessageCreate(MessageBase):
    pass

class Message(MessageBase):
    id: int

    class Config:
        orm_mode = True

class MessageWithSession(BaseModel):
    session_id: int
    role: str
    text: str


class ChatSessionBase(BaseModel):
    user_id: int
    title: Optional[str] = "New Chat"
    bookmarked: Optional[int] = 0

class ChatSessionCreate(ChatSessionBase):
    pass

class ChatSession(ChatSessionBase):
    id: int
    timestamp: datetime
    messages: List[Message] = []

    class Config:
        orm_mode = True
