from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas, database
from app.models import users
from app.auth import get_current_user

router = APIRouter(prefix="/user", tags=["User"])

@router.get("/profile", response_model=schemas.UserOut)
def get_user_profile(
    db: Session = Depends(database.get_db),
    current_user: users.User = Depends(get_current_user)
):
    return current_user

@router.put("/profile", response_model=schemas.UserOut)
def update_user_profile(
    updates: schemas.UserUpdate,
    db: Session = Depends(database.get_db),
    current_user: users.User = Depends(get_current_user)
):
    for field, value in updates.dict(exclude_unset=True).items():
        setattr(current_user, field, value)
    db.commit()
    db.refresh(current_user)
    return current_user
