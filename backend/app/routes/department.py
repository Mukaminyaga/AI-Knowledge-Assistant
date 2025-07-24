from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.models.department import Department
from app.models.document import Document 
from app.schemas.department import DepartmentCreate, DepartmentOut, DepartmentUpdate
from app.auth import get_current_user
from app.database import get_db
from sqlalchemy import func

router = APIRouter(
    prefix="/departments",
    tags=["departments"]
)

def ensure_admin(user):
    if user.role.lower() != "admin" or not user.is_approved:
        raise HTTPException(status_code=403, detail="Only approved Admins can perform this action")
    
@router.get("/", response_model=List[DepartmentOut])
def get_departments(db: Session = Depends(get_db)):
    departments = (
    db.query(
        Department.id,
        Department.name,
        Department.description,  
        Department.color,  
        Department.tenant_id,
        func.count(Document.id).label("document_count")
    )
    .outerjoin(Document, Department.id == Document.department_id)
    .group_by(Department.id)
    .all()
)

    results = []
    for dept_id, dept_name, description, color, tenant_id, count in departments:
        results.append({
        "id": dept_id,
        "name": dept_name,
        "description": description,
        "color": color,
        "tenant_id": tenant_id,
        "document_count": count,
    })


    return results



@router.post("/", response_model=DepartmentOut)
def create_department(
    dept: DepartmentCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if current_user.role.lower() != "admin" or not current_user.is_approved:
        raise HTTPException(status_code=403, detail="Only approved Admins can create departments")

    # Debug print to verify incoming data
    print(f"Received color: {dept.color}")

    new_dept = Department(
        name=dept.name,
        description=dept.description,
        color=dept.color,  # This should come from request
        tenant_id=current_user.tenant_id
    )
    
    db.add(new_dept)
    db.commit()
    db.refresh(new_dept)
    
    # Debug print to verify saved data
    print(f"Saved department with color: {new_dept.color}")
    
    return new_dept

@router.put("/{dept_id}", response_model=DepartmentOut)
def update_department(
    dept_id: int,
    updated: DepartmentUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    ensure_admin(current_user)
    dept = db.query(Department).filter(
        Department.id == dept_id,
        Department.tenant_id == current_user.tenant_id
    ).first()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")

    dept.name = updated.name
    dept.description = updated.description
    db.commit()
    db.refresh(dept)
    return dept

@router.delete("/{dept_id}")
def delete_department(
    dept_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    ensure_admin(current_user)
    dept = db.query(Department).filter(
        Department.id == dept_id,
        Department.tenant_id == current_user.tenant_id
    ).first()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")

    db.delete(dept)
    db.commit()
    return {"detail": "Department deleted"}


 