from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(String, unique=True, index=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))
    amount = Column(Float, nullable=False)
    status = Column(String, nullable=False)  # paid, pending, overdue, failed
    payment_method = Column(String, nullable=False)
    due_date = Column(DateTime, nullable=False)
    payment_date = Column(DateTime, nullable=True)  # Date of payment
    # description = Column(String, nullable=True)
    
    tenant = relationship("Tenant", back_populates="payments")
