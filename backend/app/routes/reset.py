from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
from app.models.users import User
from app.database import SessionLocal
from app.utils.security import hash_password, send_email
import os

router = APIRouter()

SECRET_KEY = os.environ.get("SECRET_KEY", "your_secret_key_here")
serializer = URLSafeTimedSerializer(SECRET_KEY)


class EmailRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


@router.post("/forgot-password")
def forgot_password(request: EmailRequest):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == request.email).first()
        if not user:
            raise HTTPException(status_code=404, detail="Email not found.")

        # Create reset token
        token = serializer.dumps(request.email, salt="reset-password-salt")
        reset_link = f"{os.environ.get('FRONTEND_URL')}/reset?token={token}"

        # Send an HTML email
        send_email(
            to_email=request.email,
            subject="Password Reset Request",
            body=f"""
            <p>We received a request to reset your password. Click the link below to reset it:</p>
            <p><a href="{reset_link}">Reset Your Password</a></p>
            <p>If you didn’t request this, you can ignore this email.</p>
             <p>Regards,<br/><strong>Vala AI Support</strong></p>
            """
        )
        return {"message": "Password reset link sent to your email."}
    finally:
        db.close()


@router.post("/reset-password")
def reset_password(request: ResetPasswordRequest):
    try:
        email = serializer.loads(request.token, salt="reset-password-salt", max_age=3600)
    except SignatureExpired:
        raise HTTPException(status_code=400, detail="Token has expired.")
    except BadSignature:
        raise HTTPException(status_code=400, detail="Invalid token.")

    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found.")
        user.hashed_password = hash_password(request.new_password)
        db.commit()
        return {"message": "Password reset successfully."}
    finally:
        db.close()
