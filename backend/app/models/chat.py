from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)   
    title = Column(String, default="New Chat")
    timestamp = Column(DateTime, default=datetime.utcnow)
    bookmarked = Column(Integer, default=0)

    messages = relationship("Message", back_populates="session", cascade="all, delete")
    user = relationship("User", back_populates="chats")

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("chat_sessions.id"), nullable=False)
    role = Column(String, nullable=False)  # "user" or "assistant"
    text = Column(Text, nullable=False)

    session = relationship("ChatSession", back_populates="messages")
