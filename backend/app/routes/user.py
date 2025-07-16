from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.schemas.users import UserCreate, UserLogin, UserOut 
from app import auth, database
from app.models import users
from app.auth import get_current_user
from app.models import tenant as tenant_model
from app.database import get_db

router = APIRouter()

@router.put("/approve/{user_id}")
def approve_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: users.User = Depends(get_current_user)
):
    # Get the current user's tenant
    tenant = db.query(tenant_model.Tenant).filter(
        tenant_model.Tenant.id == current_user.tenant_id
    ).first()

    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")

    # Check if the current user is the creator of the tenant
    if current_user.email.lower() != tenant.contact_email.lower():
        raise HTTPException(status_code=403, detail="Only the tenant creator can approve users")

    # Approve only users in the same tenant
    user = db.query(users.User).filter(
        users.User.id == user_id,
        users.User.tenant_id == current_user.tenant_id
    ).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found in your tenant")

    user.is_approved = True
    db.commit()
    db.refresh(user)

    return {"message": f"{user.email} has been approved."}



@router.get("/", response_model=List[UserOut])
def get_all_users(
    db: Session = Depends(get_db),
    current_user: users.User = Depends(get_current_user)
):
    # Get the tenant
    tenant = db.query(tenant_model.Tenant).filter(
        tenant_model.Tenant.id == current_user.tenant_id
    ).first()

    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")

    # Allow only admins or the creator of the tenant
    if current_user.role.lower() != "admin" and current_user.email.lower() != tenant.contact_email.lower():
        raise HTTPException(status_code=403, detail="Not authorized to view users.")

    # Return users in the same tenant
    return db.query(users.User).filter(
        users.User.tenant_id == current_user.tenant_id
    ).all()



@router.delete("/delete/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: users.User = Depends(get_current_user)
):
    if current_user.role.lower() != "admin":
        raise HTTPException(status_code=403, detail="Only admins can delete users")

    user = db.query(users.User).filter(
        users.User.id == user_id,
        users.User.tenant_id == current_user.tenant_id  #  prevent deleting users from other tenants
    ).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found in your tenant")

    db.delete(user)
    db.commit()
    return {"message": f"{user.email} has been deleted."}

@router.put("/users/role/{user_id}")
def update_user_role(
    user_id: int,
    role_data: dict,
    db: Session = Depends(get_db),
    current_user: users.User = Depends(get_current_user),
):
    if current_user.role.lower() != "admin" or not current_user.is_approved:
      raise HTTPException(status_code=403, detail="Only approved Admins can assign roles")


    allowed_roles = ["Admin", "Editor", "Viewer"]
    new_role = role_data.get("role")

    if new_role not in allowed_roles:
        raise HTTPException(status_code=400, detail=f"Role must be one of: {', '.join(allowed_roles)}")

    user = db.query(users.User).filter(users.User.id == user_id, users.User.tenant_id == current_user.tenant_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.role = new_role
    db.commit()
    db.refresh(user)

    return {"message": f"User role updated to {new_role}", "user": {
        "id": user.id,
        "email": user.email,
        "role": user.role,
        "is_approved": user.is_approved
    }}

