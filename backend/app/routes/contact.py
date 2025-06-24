from fastapi import APIRouter
from pydantic import BaseModel
import aiosmtplib
from email.mime.text import MIMEText
import os

router = APIRouter()


class ContactForm(BaseModel):
    name: str
    email: str
    subject: str
    message: str


@router.post("/send-email")
async def send_email(data: ContactForm):
    sender_email = os.getenv("SENDER_EMAIL")           # your account
    sender_password = os.getenv("SENDER_PASSWORD")     # your app password
    recipient_email = "knowledgeassistantai@gmail.com"

    #  Preprocess the message
    formatted_message = data.message.replace("\n", "<br/>")

    html_body = f"""
    <html>
    <body style="font-family: Arial, sans-serif;">
      <h2>New Contact Form Submission</h2>
      <table style="border-collapse: collapse;">
        <tr>
            <td style="font-weight: bold; padding: 5px;">Name:</td>
            <td style="padding: 5px;">{data.name}</td>
        </tr>
        <tr>
            <td style="font-weight: bold; padding: 5px;">Email:</td>
            <td style="padding: 5px;"><a href="mailto:{data.email}">{data.email}</a></td>
        </tr>
        <tr>
            <td style="font-weight: bold; padding: 5px;" valign="top">Message:</td>
            <td style="padding: 5px;" valign="top">{formatted_message}</td>
        </tr>
      </table>
    </body>
    </html>
    """

    msg = MIMEText(html_body, "html")
    msg["Subject"] = f"Contact Form: {data.subject}"
    msg["From"] = sender_email
    msg["To"] = recipient_email
    msg["Reply-To"] = data.email

    try:
        await aiosmtplib.send(
            msg,
            hostname="smtp.gmail.com",
            port=587,
            username=sender_email,
            password=sender_password,
            start_tls=True,
        )
        return {"success": True, "message": "Email sent successfully"}
    except Exception as e:
        return {"success": False, "error": str(e)}
