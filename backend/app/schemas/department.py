from pydantic import BaseModel

class DepartmentBase(BaseModel):
    name: str
    description: str
    color: str 

class DepartmentCreate(DepartmentBase):
    pass  

class DepartmentUpdate(DepartmentBase):
    pass

class DepartmentOut(DepartmentBase):
    id: int
    tenant_id: int
    name: str
    document_count: int = 0 

    class Config:
        orm_mode = True
