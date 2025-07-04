from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from ..database import Base  

class Tenant(Base):
    __tablename__ = "tenants"

    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String, nullable=False)
    contact_email = Column(String, nullable=False, unique=True)
    slug_url = Column(String, nullable=False, unique=True)
    contact_phone = Column(String, nullable=False)
    billing_address = Column(String, nullable=False)
    monthly_fee = Column(Float, nullable=False)
    max_users = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String, default="active")  # optional: "active", "inactive"
