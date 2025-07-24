from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
from app.models.tenant import Tenant
from app.models.department import Department

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    size = Column(Integer, nullable=False)
    upload_time = Column(DateTime(timezone=True), server_default=func.now())
    num_chunks = Column(Integer)
    indexed = Column(Boolean, default=False)
    status = Column(String, default="pending") 

    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=False)
    tenant = relationship("Tenant", back_populates="documents")  
   
    department_id = Column(Integer, ForeignKey("departments.id"))
    department = relationship("Department", back_populates="documents")

