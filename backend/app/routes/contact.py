from fastapi import APIRouter
from pydantic import BaseModel
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import os
from dotenv import load_dotenv
from pathlib import Path

router = APIRouter()

# Load environment variables from .env
env_path = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(dotenv_path=env_path)

# Pydantic model for incoming contact form data
class ContactForm(BaseModel):
    name: str
    email: str
    contact: str
    subject: str
    message: str

@router.post("/send-email")
async def send_email(data: ContactForm):
    sender_email = os.getenv("SENDER_EMAIL")
    api_key = os.getenv("SENDGRID_API_KEY")

    if not sender_email or not api_key:
        return {"success": False, "error": "Missing email configuration in environment variables."}

    # Pre-format message to avoid backslash errors in f-strings
    formatted_message = data.message.replace("\n", "<br/>")

    # Build the HTML email content
    html_content = f"""
    <html>
    <body style="font-family: Arial, sans-serif;">
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> {data.name}</p>
        <p><strong>Email:</strong> <a href="mailto:{data.email}">{data.email}</a></p>
         <p><strong>Contact:</strong> {data.contact}</p>
        <p><strong>Subject:</strong> {data.subject}</p>
        <p><strong>Message:</strong><br/>{formatted_message}</p>
    </body>
    </html>
    """

    # Create the email message object
    message = Mail(
        from_email=sender_email,
        to_emails="vala.ai@goodpartnerske.org",  # Or change to data.email if dynamic
        subject=f"Contact Form: {data.subject}",
        html_content=html_content
    )
    message.reply_to = data.email

    # Send the email via SendGrid API
    try:
        sg = SendGridAPIClient(api_key)
        response = sg.send(message)
        return {
            "success": True,
            "message": "Email sent successfully",
            "status_code": response.status_code
        }
    except Exception as e:
        return {"success": False, "error": str(e)}
