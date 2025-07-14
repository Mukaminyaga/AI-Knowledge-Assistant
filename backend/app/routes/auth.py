from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas import users as schemas
from app import auth,database
from app.models import tenant as tenant_model, users
from sqlalchemy import func

router = APIRouter()

@router.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    # Check if email already exists
    db_user = db.query(users.User).filter(users.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Look up tenant by serial_code 
    tenant = (
        db.query(tenant_model.Tenant)
        .filter(tenant_model.Tenant.serial_code == user.serial_code.strip())
        .first()
    )

    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant with provided serial code not found")

    # Hash password
    hashed_pw = auth.hash_password(user.password)

    # Automatically approve the tenant creator (whose email matches contact_email)
    is_approved = user.email.lower() == tenant.contact_email.lower()

    # Create user
    new_user = users.User(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        hashed_password=hashed_pw,
        role=user.role,
        is_approved=is_approved,
        tenant_id=tenant.id
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user



@router.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(database.get_db)):
    db_user = db.query(users.User).filter(users.User.email == user.email).first()

    if not db_user or not auth.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    if not db_user.is_approved:
        raise HTTPException(status_code=403, detail="Your account is pending approval")

    token = auth.create_access_token({
        "sub": db_user.email,
        "role": db_user.role,
        "tenant_id": db_user.tenant_id,
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "first_name": db_user.first_name,
            "last_name": db_user.last_name,
            "email": db_user.email,
            "role": db_user.role,
            "is_approved": db_user.is_approved,
            "tenant_id": db_user.tenant_id,
        },
    }
