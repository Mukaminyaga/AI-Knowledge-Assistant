from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base
from app.models.users import User 

# models/tenant.py
class Tenant(Base):
    __tablename__ = "tenants"

    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String, nullable=False, unique=True)
    contact_email = Column(String, nullable=False, unique=True)
    slug_url = Column(String, nullable=False, unique=True)
    contact_phone = Column(String, nullable=False)
    billing_address = Column(String, nullable=False)
    monthly_fee = Column(Float, nullable=False)
    max_users = Column(Integer, nullable=False)
    status = Column(String, default="active")
    serial_code = Column(String(6), nullable=False, unique=True)
    plan = Column(String, default="basic")  # <-- new field
    country = Column(String, nullable=True)  # <-- new field
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    users = relationship("User", back_populates="tenant", cascade="all, delete")
    documents = relationship("Document", back_populates="tenant", cascade="all, delete")
    payments = relationship("Payment", back_populates="tenant")
