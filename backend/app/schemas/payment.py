from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date

class PaymentBase(BaseModel):
    amount: float
    status: str
    payment_method: str
    due_date: date
    payment_date: Optional[datetime] = None


class PaymentCreate(BaseModel):
    invoice_id: str  
    tenant_id: int
    amount: float
    status: str
    payment_method: str
    payment_date: datetime 
    due_date: date


class PaymentOut(PaymentBase):
    id: int
    invoice_id: str
    tenant_id: int
    tenant_name: str
    tenant_email: str

    class Config:
        orm_mode = True


class PaymentUpdate(BaseModel):
    amount: float
    payment_method: str
    payment_date: datetime 
