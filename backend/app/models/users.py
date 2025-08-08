
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base
from app.models.chat import ChatSession



class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False, default="Viewer")  # 'Viewer', 'Editor', 'Admin'
    is_approved = Column(Boolean, nullable=False, default=False)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False)
    status = Column(String, nullable=False, default="active")
    tenant = relationship("Tenant", back_populates="users")
    chats = relationship("ChatSession", back_populates="user", cascade="all, delete-orphan")


