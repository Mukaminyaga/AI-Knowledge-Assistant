from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class TenantCreate(BaseModel):
    company_name: str = Field(..., example="Acme Corp")
    contact_email: EmailStr
    slug_url: str
    contact_phone: str
    billing_address: str
    monthly_fee: float
    max_users: int



class TenantOut(TenantCreate):
    id: int
    created_at: datetime
    status: str

    class Config:
        orm_mode = True
