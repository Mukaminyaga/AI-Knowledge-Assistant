import smtplib
from email.mime.text import MIMEText
import os
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from app.models import users


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def send_email(to_email: str, subject: str, body: str):
    sender_email = os.environ.get("SENDER_EMAIL")
    sender_password = os.environ.get("SENDER_PASSWORD")

    msg = MIMEText(body, "html") 
    msg["Subject"] = subject
    msg["From"] = sender_email
    msg["To"] = to_email

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(sender_email, sender_password)
        server.send_message(msg)


def verify_email_exists(db: Session, email: str) -> bool:
    """Check if an email already exists in the database."""
    return db.query(users.User).filter(users.User.email == email).first() is not None
