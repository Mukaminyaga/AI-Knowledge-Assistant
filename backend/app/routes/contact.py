from fastapi import APIRouter
from pydantic import BaseModel
import aiosmtplib
from email.mime.text import MIMEText
import os
from dotenv import load_dotenv
from pathlib import Path

router = APIRouter()

# Load environment variables
env_path = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(dotenv_path=env_path)

class ContactForm(BaseModel):
    name: str
    email: str
    subject: str
    message: str

@router.post("/send-email")
async def send_email(data: ContactForm):
    sender_email = os.getenv("SENDER_EMAIL")
    sender_password = os.getenv("SENDER_PASSWORD")
    smtp_server = os.getenv("SMTP_SERVER", "mail.vala.ke")
    smtp_port = int(os.getenv("SMTP_PORT", 587))
    recipient_email = "vala.ai@goodpartnerske.org"  # or use data.email if you want dynamic destination

    formatted_message = data.message.replace("\n", "<br/>")

    html_body = f"""
    <html>
    <body style="font-family: Arial, sans-serif;">
      <h3>New Contact Form Submission</h3>
      <table style="border-collapse: collapse;">
        <tr><td style="font-weight: bold; padding: 5px;">Name:</td><td>{data.name}</td></tr>
        <tr><td style="font-weight: bold; padding: 5px;">Email:</td><td><a href="mailto:{data.email}">{data.email}</a></td></tr>
        <tr><td style="font-weight: bold; padding: 5px;" valign="top">Message:</td><td>{formatted_message}</td></tr>
      </table>
    </body>
    </html>
    """

    msg = MIMEText(html_body, "html")
    msg["Subject"] = f"Contact Form: {data.subject}"
    msg["From"] = f"Vala AI Support <{sender_email}>"
    msg["To"] = recipient_email
    msg["Reply-To"] = data.email

    try:
        await aiosmtplib.send(
            msg,
            hostname=smtp_server,
            port=smtp_port,
            username=sender_email,
            password=sender_password,
            start_tls=True,
        )
        return {"success": True, "message": "Email sent successfully"}
    except Exception as e:
        return {"success": False, "error": str(e)}
