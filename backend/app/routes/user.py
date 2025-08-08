from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.schemas.users import UserCreate, UserLogin, UserOut 
from app import auth, database
from app.models import users
from app.auth import get_current_user
from app.models import tenant as tenant_model
from app.database import get_db
from app.utils.email import send_email

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

    send_email(
    to_email=user.email,
    subject="Your Vala.ai Account Has Been Approved",
    html_content=f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <p>Dear {user.first_name},</p>

            <p>We’re excited to inform you that your <strong>Vala.ai</strong> account has been approved by your administrator.</p>

            <p>You can now access your account and start using the platform.</p>

            <p><strong>Login here:</strong> <a href="https://vala.ke/login" style="color: #1a73e8;">https://vala.ke/login</a></p>

            <p>If you encounter any issues or have questions, don’t hesitate to contact us.</p>

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


    return {"message": f"{user.email} has been approved and notified."}



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


@router.put("/deactivate/{user_id}")
def deactivate_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: users.User = Depends(get_current_user)
):
    # Only admins can deactivate
    if current_user.role.lower() != "admin":
        raise HTTPException(status_code=403, detail="Only admins can deactivate users")

    user = db.query(users.User).filter(
        users.User.id == user_id,
        users.User.tenant_id == current_user.tenant_id  # prevent affecting other tenants
    ).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found in your tenant")

    if user.status == "inactive":
        raise HTTPException(status_code=400, detail="User is already inactive")

    user.status = "inactive"
    db.commit()
    db.refresh(user)

    return {"message": f"{user.email} has been deactivated."}


@router.put("/activate/{user_id}")
def activate_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: users.User = Depends(get_current_user)
):
    if current_user.role.lower() != "admin":
        raise HTTPException(status_code=403, detail="Only admins can activate users")

    user = db.query(users.User).filter(
        users.User.id == user_id,
        users.User.tenant_id == current_user.tenant_id
    ).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found in your tenant")

    if user.status == "active":
        raise HTTPException(status_code=400, detail="User is already active")

    user.status = "active"
    db.commit()
    db.refresh(user)

    return {"message": f"{user.email} has been activated."}


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
        users.User.tenant_id == current_user.tenant_id 
    ).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found in your tenant")

    db.delete(user)
    db.commit()
    db.flush()
    check_user = db.query(users.User).filter(users.User.id == user_id).first()
    print("User after delete:", check_user)
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

    user = db.query(users.User).filter(
        users.User.id == user_id,
        users.User.tenant_id == current_user.tenant_id
    ).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Update role
    user.role = new_role
    db.commit()
    db.refresh(user)

    # Role-specific permissions
    role_permissions = {
        "Admin": """
            <ul>
                <li>Approve and manage users.</li>
                <li>Upload, view, and download documents from the knowledge base.</li>
                <li>Create and manage departments for organizing the knowledge base.</li>
                <li>View activity logs.</li>
                <li>Chat with the AI.</li>
            </ul>
        """,
        "Editor": """
            <ul>
                <li>Upload documents to the knowledge base.</li>
                <li>View and download documents from the knowledge base.</li>
                <li>Create departments for organizing the knowledge base.</li>
                <li>Chat with the AI.</li>
            </ul>
        """,
        "Viewer": """
            <ul>
                <li>View and download documents from the knowledge base.</li>
                <li>Chat with the AI.</li>
            </ul>
        """
    }

    permissions_html = role_permissions.get(new_role, "<p>No permissions information available.</p>")

    # Send notification email
    send_email(
        to_email=user.email,
        subject="Your Role on Vala.ai Has Been Updated",
        html_content=f"""
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <p>Hi {user.first_name},</p>

                <p>You have been assigned a new role: <strong>{new_role}</strong> in Vala.ai.</p>

                <p><strong>What you can do with this role:</strong></p>
                {permissions_html}
                
                <p> Please log in to explore your permissions and assigned responsibilities.</p>


                <p>If you have any questions, please reach out to the system administrator.</p>

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

    return {
        "message": f"User role updated to {new_role}",
        "user": {
            "id": user.id,
            "email": user.email,
            "role": user.role,
            "is_approved": user.is_approved
        }
    }
