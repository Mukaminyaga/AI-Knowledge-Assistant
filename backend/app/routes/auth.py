from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas import users as schemas
from app import auth,database
from app.models import tenant as tenant_model, users
from sqlalchemy import func
from datetime import datetime
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
    
    if new_user.email.lower() == tenant.contact_email.lower():
    # Email for tenant-linked user
      send_email(
        to_email=new_user.email,
        subject="Welcome to Vala.ai – Your Account is Ready",
        html_content=f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <p>Dear {new_user.first_name},</p>

            <p>Welcome to <strong>Vala.ai</strong>! Your account is now active and ready to use.</p>

            <p>You can log in right away using the link below:</p>

            <p>
                <a href="https://vala.ke/login" 
                   style="background-color: #4CAF50; color: white; padding: 10px 20px; 
                          text-decoration: none; border-radius: 5px; display: inline-block;">
                   Log In to Vala.ai
                </a>
            </p>

            <p>If you have any questions or need support, please feel free to reach out to us.</p>

            <p>Warm regards,<br>
               Vala.ai Support<br>
            <a href="mailto:vala.ai@goodpartnerske.org">vala.ai@goodpartnerske.org</a></p>

            <hr style="margin: 20px 0;">
            <p style="font-size: 0.9em; color: #777;">
                Sent from Vala.ai | {datetime.now().strftime('%b %d, %Y – %I:%M %p')} EAT<br>
                Need help? Contact us at: <a href="mailto:vala.ai@goodpartnerske.org">vala.ai@goodpartnerske.org</a><br>
                This is an automated message. Do not reply directly to this email.
            </p>
        </body>
        </html>
        """
    )

    else:
    # Email for normal user (awaiting approval)
      send_email(
        to_email=new_user.email,
        subject="Welcome to Vala.ai",
        html_content=f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <p>Dear {new_user.first_name},</p>

            <p>Welcome to <strong>Vala.ai</strong>! We're excited to have you on board. Your user account has been successfully created.</p>

            <p>Before you can log in, your account must be approved by your administrator.</p>

            <p>You will receive an email notification once your account has been approved.</p>

            <p>If you have any questions or need support, feel free to reach out to us.</p>

            <p>Warm regards,<br>
               Vala.ai Support<br>
            <a href="mailto:vala.ai@goodpartnerske.org">vala.ai@goodpartnerske.org</a></p>

            <hr style="margin: 20px 0;">
            <p style="font-size: 0.9em; color: #777;">
                Sent from Vala.ai | {datetime.now().strftime('%b %d, %Y – %I:%M %p')} EAT<br>
                Need help? Contact us at: <a href="mailto:vala.ai@goodpartnerske.org">vala.ai@goodpartnerske.org</a><br>
                This is an automated message. Do not reply directly to this email.
            </p>
        </body>
        </html>
        """
    )

    if not is_creator:
     send_email(
    to_email=tenant.contact_email,
    subject = f"Action Required: New User Request ({new_user.first_name} {new_user.last_name})",
    html_content=f"""
        <p style="color:black;">Dear {tenant.company_name} Admin,</p>

        <p style="color:black;">A new user has registered under your tenant on <strong>Vala.ai</strong> and is awaiting your approval:</p>

        <ul style="color:black;">
            <li><strong>Full Name</strong>: {new_user.first_name} {new_user.last_name}</li>
            <li><strong>Email</strong>: {new_user.email}</li>
            <li><strong>Requested Role</strong>: {new_user.role}</li>
        </ul>

        <p style="color:black;">
            To review, approve this user and/or edit their role, please visit
            <a href="https://vala.ke/users">https://vala.ke/users</a>.
        </p>

        <p style="color:black;">Thank you for using Vala.ai.</p>

        <br>
        <p style="color:black;">
            Warm regards,<br>
            Vala.ai Support<br>
            <a href="mailto:vala.ai@goodpartnerske.org">vala.ai@goodpartnerske.org</a>
        </p>

        <hr>
        <p style="font-size: 12px; color:black;">
            Sent from Vala.ai | {datetime.now().strftime('%b %d, %Y - %I:%M %p %Z')}
            <br>
            Need help? Contact us at: 
            <a href="mailto:vala.ai@goodpartnerske.org">vala.ai@goodpartnerske.org</a><br>
            This is an automated message. Do not reply directly to this email.
        </p>
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
