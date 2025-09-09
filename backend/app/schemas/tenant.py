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
    serial_code: Optional[str] = None  
    status: Optional[str] = "active" 
    plan: Optional[str] = "basic"
    country: Optional[str] = None


class TenantOut(TenantCreate):
    id: int
    created_at: datetime
    status: str
    serial_code: str
    # first_name: Optional[str]
    # last_name: Optional[str]

    class Config:
        orm_mode = True

class TenantUpdate(BaseModel):
    company_name: Optional[str]
    contact_email: Optional[EmailStr]
    slug_url: Optional[str]
    contact_phone: Optional[str]
    billing_address: Optional[str]
    monthly_fee: Optional[float]
    max_users: Optional[int]
    status: Optional[str]
    serial_code: Optional[str]  
    plan: Optional[str]
    country: Optional[str]

    class Config:
        orm_mode = True

class TenantEmailRequest(BaseModel):
    contact_email: EmailStr
