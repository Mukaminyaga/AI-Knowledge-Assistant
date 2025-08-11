from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
from app.models.users import User
from app.database import SessionLocal
from app.utils.security import hash_password
from app.utils.email import send_email  # Ensure we import from the email utility
import os
from datetime import datetime

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

        # Send branded HTML email
        send_email(
            to_email=request.email,
            subject="Vala.ai – Password Reset Request",
            html_content=f"""
                <html>
                <body style="font-family: Arial, sans-serif; color: black; line-height: 1.6;">
                    <p>Hi {user.first_name or 'User'},</p>
                    <p>We received a request to reset your password for your <strong>Vala.ai</strong> account.</p>
                    <p style="color:black;">
                        Click the link below to reset your password:<br>
                        <a href="{reset_link}" style="color:blue;">Reset Password</a>
                    </p>
                    <p>If you didn’t request this change, please ignore this email or report to your system administrator.</p>
                    <p>Warm regards,<br>
                       Vala.ai Support<br>
                       <a href="mailto:vala.ai@goodpartnerske.org">vala.ai@goodpartnerske.org</a>
                    </p>
                    <hr>
                    <p style="font-size: 12px; color: #888;">
                        Sent from Vala.ai | {datetime.now().strftime('%b %d, %Y - %I:%M %p %Z')}<br>
                        Need help? Contact us at: 
                        <a href="mailto:vala.ai@goodpartnerske.org">vala.ai@goodpartnerske.org</a><br>
                        This is an automated message. Do not reply directly to this email.
                    </p>
                </body>
                </html>
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

        # Update password
        user.hashed_password = hash_password(request.new_password)
        db.commit()

        # Send confirmation email
        send_email(
            to_email=user.email,
            subject="Vala.ai – Password Reset Successful",
            html_content=f"""
                <html>
                <body style="font-family: Arial, sans-serif; color: black; line-height: 1.6;">
                    <p>Hi {user.first_name or 'User'},</p>
                    <p>Your password for <strong>Vala.ai</strong> has been successfully reset.</p>
                    <p>If you did not make this change, please contact our support team immediately.</p>
                    <p>Warm regards,<br>
                       Vala.ai Support<br>
                       <a href="mailto:vala.ai@goodpartnerske.org">vala.ai@goodpartnerske.org</a>
                    </p>
                    <hr>
                    <p style="font-size: 12px; color: #888;">
                        Sent from Vala.ai | {datetime.now().strftime('%b %d, %Y - %I:%M %p %Z')}<br>
                        Need help? Contact us at: 
                        <a href="mailto:vala.ai@goodpartnerske.org">vala.ai@goodpartnerske.org</a><br>
                        This is an automated message. Do not reply directly to this email.
                    </p>
                </body>
                </html>
            """
        )

        return {"message": "Password reset successfully."}
    finally:
        db.close()
