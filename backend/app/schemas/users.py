from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr
from sqlalchemy import DateTime, func


class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    role: str
    serial_code: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    role: str
    is_approved: bool
    status: str
    tenant_id: int
    last_active: Optional[datetime]


    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    email: EmailStr | None = None

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str