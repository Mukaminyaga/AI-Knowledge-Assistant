from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas import users as schemas
from app import auth,database
from app.models import tenant as tenant_model, users
from sqlalchemy import func
from app.utils.email import send_email

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

    # Automatically approve and assign Admin to the tenant creator
    is_creator = user.email.lower() == tenant.contact_email.lower()
    assigned_role = "Admin" if is_creator else (
        user.role.capitalize() if user.role.capitalize() in ["Editor", "Viewer"] else "Viewer"
    )
    is_approved = is_creator  # Only tenant creator gets auto-approved

    # Create user
    new_user = users.User(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        hashed_password=hashed_pw,
        role=assigned_role,
        is_approved=is_approved,
        tenant_id=tenant.id
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    send_email(
        to_email=new_user.email,
        subject="Welcome to Vala.ai – Awaiting Approval",
        html_content=f"""
            <p>Hi {new_user.first_name},</p>
            <p>Thank you for signing up to Vala.ai. Your account is pending approval by your tenant admin.</p>
        """
    )
    if not is_creator:
        send_email(
            to_email=tenant.contact_email,
            subject="New User Awaiting Approval",
            html_content=f"""
                <p>A new user has registered for your tenant:</p>
                <ul>
                    <li>Name: {new_user.first_name} {new_user.last_name}</li>
                    <li>Email: {new_user.email}</li>
                    <li>Role Requested: {new_user.role}</li>
                </ul>
                <p>Please log in to approve this user.</p>
            """
        )
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
