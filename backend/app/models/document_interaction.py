# app/models/document_interaction.py
from sqlalchemy import Column, Integer, ForeignKey, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class DocumentInteraction(Base):
    __tablename__ = "document_interactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    document_id = Column(Integer, ForeignKey("documents.id"))
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False)  
    action = Column(String, nullable=False)  # 'view', 'download', 'upload'
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")
    document = relationship("Document")
    tenant = relationship("Tenant")
