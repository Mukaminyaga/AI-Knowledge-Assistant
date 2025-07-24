from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class DocumentBase(BaseModel):
    filename: str
    file_type: str
    size: int
    status: str
    department_id: Optional[int] = None

class DocumentCreate(DocumentBase):
    tenant_id: int

class DocumentUpdate(BaseModel):
    filename: Optional[str] = None
    file_type: Optional[str] = None
    status: Optional[str] = None
    department_id: Optional[int] = None

class DocumentOut(DocumentBase):
    id: int
    tenant_id: int
    uploaded_at: datetime
    num_chunks: Optional[int] = 0

    class Config:
        orm_mode = True

class DepartmentAssignmentRequest(BaseModel):
    document_ids: list[int]
    department_id: Optional[int] = None