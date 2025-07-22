from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PaymentBase(BaseModel):
    amount: float
    status: str
    payment_method: str
    due_date: datetime
    date: Optional[datetime]
    # description: Optional[str]

class PaymentCreate(PaymentBase):
    invoice_id: str
    tenant_id: int

class PaymentOut(PaymentBase):
    id: int
    invoice_id: str
    tenant_id: int
    tenant_name: str
    tenant_email: str
    amount: float
    status: str
    payment_method: str

    class Config:
        orm_mode = True
