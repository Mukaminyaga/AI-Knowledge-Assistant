from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app import schemas, auth, database
from app.models import users
from app.auth import get_current_user
from app.database import get_db


router = APIRouter()

@router.put("/approve/{user_id}")
def approve_user(
    user_id: int,
    db: Session = Depends(database.get_db),
    current_user: users.User = Depends(get_current_user)
):
    if current_user.role.lower() != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to approve users")

    user = db.query(users.User).filter(users.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_approved = True
    db.commit()
    db.refresh(user)
    return {"message": f"{user.email} has been approved."}

@router.get("/", response_model=List[schemas.UserOut])
def get_all_users(
    db: Session = Depends(get_db),
    current_user: users.User = Depends(get_current_user)
):
    print(f"Current user: {current_user.email}, Role: {current_user.role}")
    if current_user.role.lower() != "admin":
        raise HTTPException(status_code=403, detail="Only admins can view users.")
    return db.query(users.User).all()

@router.delete("/delete/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: users.User = Depends(get_current_user)
):
    if current_user.role.lower() != "admin":
        raise HTTPException(status_code=403, detail="Only admins can delete users")

    user = db.query(users.User).filter(users.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()
    return {"message": f"{user.email} has been deleted."}
