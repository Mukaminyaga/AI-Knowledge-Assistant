from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.tenant import Tenant
from app.models.users import User
from app.models.payment import Payment
from app.schemas.tenant import TenantCreate, TenantUpdate, TenantOut, TenantEmailRequest
from app.schemas.users import UserOut
from app.schemas.payment import PaymentOut
from datetime import datetime
from fastapi.responses import JSONResponse
from sqlalchemy import extract, func
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import random
from app.utils.email import send_email 

router = APIRouter(prefix="/tenants", tags=["Tenants"])

def generate_unique_serial_code(db: Session):
    while True:
        code = str(random.randint(100000, 999999))  # Always 6 digits
        exists = db.query(Tenant).filter(Tenant.serial_code == code).first()
        if not exists:
            return code

@router.post("/", response_model=TenantOut)
def create_tenant(tenant: TenantCreate, db: Session = Depends(get_db)):
    # Check if company name already exists
    if db.query(Tenant).filter(Tenant.company_name == tenant.company_name).first():
        raise HTTPException(status_code=400, detail="Company already exists.")

    # Check if contact email already exists
    if db.query(Tenant).filter(Tenant.contact_email == tenant.contact_email).first():
        raise HTTPException(status_code=400, detail="Email already in use.")

    # Check if slug URL already exists
    if db.query(Tenant).filter(Tenant.slug_url == tenant.slug_url).first():
        raise HTTPException(status_code=400, detail="Tenant with this slug already exists.")

    # Always generate serial code automatically
    serial_code = generate_unique_serial_code(db)

    db_tenant = Tenant(
        company_name=tenant.company_name,
        contact_email=tenant.contact_email,
        slug_url=tenant.slug_url,
        contact_phone=tenant.contact_phone,
        billing_address=tenant.billing_address,
        monthly_fee=tenant.monthly_fee,
        max_users=tenant.max_users,
        status=tenant.status,
        serial_code=serial_code,
        plan=tenant.plan,       
        country=tenant.country,
    )

    db.add(db_tenant)
    db.commit()
    db.refresh(db_tenant)
    signup_link = "https://vala.ke/signup"
    send_email(
        to_email=db_tenant.contact_email,
        subject="Welcome to Vala AI – Tenant Setup Successful",
        html_content=f"""
            <p>Dear {db_tenant.company_name},</p>

            <p>Welcome to <strong>Vala AI</strong>! Your tenant account has been successfully created.</p>
             <p>As the administrator of your organization, you now have the keys to your workspace. 
                Here’s what you can do to make the most of your account:</p>

        <ul>
            <li><strong>Approve new users</strong> so your team can join the platform.</li>
            <li><strong>Upload documents</strong> to your Knowledge Base to power your AI assistant with relevant information.</li>
            <li><strong>Create Departments</strong> so as to organize your knowledge base.</li>
            <li><strong>Edit user roles</strong> to assign the right permissions and responsibilities to your team.</li>
            <li><strong>View activity logs</strong> to keep track of important actions and platform usage.</li>
        </ul>

            <p>To get started, please sign up using the following credentials:</p>
            <ul>
                <li><strong>Signup Link:</strong> <a href="{signup_link}">{signup_link}</a></li>
                <li><strong>Email:</strong> {db_tenant.contact_email}</li>
                <li><strong>Serial Code:</strong> {db_tenant.serial_code}</li>
            </ul>

            <p>Please share the <strong>serial code</strong> above with your team members so they can also sign up and join your organization on the platform.</p>

            <p>We're excited to have you on board. If you have any questions, feel free to reach out to us.</p>
            <p>Warm regards,<br>
            Vala.ai Support<br>
            <a href="mailto:vala.ai@goodpartnerske.org">vala.ai@goodpartnerske.org</a></p>
            
        
             <hr>
            <p style="font-size: 12px; color: #888;">
                Sent from Vala.ai | {datetime.now().strftime('%b %d, %Y - %I:%M %p %Z')}
                <br>
                Need help? Contact us at: <a href="mailto:vala.ai@goodpartnerske.org">vala.ai@goodpartnerske.org</a><br>
                This is an automated message. Do not reply directly to this email.
            </p>
        """
    )

    return db_tenant

@router.post("/send-welcome-email")
def send_welcome_email(request: TenantEmailRequest, db: Session = Depends(get_db)):
    # Check if tenant exists by email
    db_tenant = db.query(Tenant).filter(Tenant.contact_email == request.contact_email).first()
    if not db_tenant:
        raise HTTPException(status_code=404, detail="Tenant not found with this email.")

    signup_link = "https://vala.ke/signup"

    send_email(
        to_email=db_tenant.contact_email,
        subject="Welcome to Vala AI – Tenant Setup Successful",
        html_content=f"""
            <p>Dear {db_tenant.company_name},</p>

            <p>Welcome to <strong>Vala AI</strong>! Your tenant account has been successfully created.</p>
            <p>As the administrator of your organization, you now have the keys to your workspace. 
               Here’s what you can do to make the most of your account:</p>

            <ul>
                <li><strong>Approve new users</strong> so your team can join the platform.</li>
                <li><strong>Upload documents</strong> to your Knowledge Base to power your AI assistant with relevant information.</li>
                <li><strong>Create Departments</strong> to organize your knowledge base.</li>
                <li><strong>Edit user roles</strong> to assign permissions to your team.</li>
                <li><strong>View activity logs</strong> to track platform usage.</li>
            </ul>

            <p>To get started, please sign up using the following credentials:</p>
            <ul>
                <li><strong>Signup Link:</strong> <a href="{signup_link}">{signup_link}</a></li>
                <li><strong>Email:</strong> {db_tenant.contact_email}</li>
                <li><strong>Serial Code:</strong> {db_tenant.serial_code}</li>
            </ul>

            <p>Please share the <strong>serial code</strong> with your team members so they can join your organization on the platform.</p>

            <p>We're excited to have you on board. If you have any questions, feel free to reach out.</p>
            <p>Warm regards,<br>
            Vala.ai Support<br>
            <a href="mailto:vala.ai@goodpartnerske.org">vala.ai@goodpartnerske.org</a></p>

            <hr>
            <p style="font-size: 12px; color: #888;">
                Sent from Vala.ai | {datetime.now().strftime('%b %d, %Y - %I:%M %p')}
                <br>
                Need help? Contact us at: <a href="mailto:vala.ai@goodpartnerske.org">vala.ai@goodpartnerske.org</a><br>
                This is an automated message. Do not reply directly to this email.
            </p>
        """
    )

    return {"message": f"Welcome email sent successfully to {db_tenant.contact_email}"}


# Get all tenants
@router.get("/", response_model=List[TenantOut])
def get_all_tenants(db: Session = Depends(get_db)):
    tenants = db.query(Tenant).all()
    tenant_list = []

    for tenant in tenants:
        user = db.query(User).filter(User.email == tenant.contact_email).first()
        tenant_data = tenant.__dict__.copy()
        tenant_data["first_name"] = user.first_name if user else ""
        tenant_data["last_name"] = user.last_name if user else ""
        tenant_list.append(tenant_data)

    return tenant_list


#  GET specific tenant by ID (this was missing)
@router.get("/{tenant_id}", response_model=TenantOut)
def get_tenant_by_id(tenant_id: int, db: Session = Depends(get_db)):
    tenant = db.query(Tenant).filter(Tenant.id == tenant_id).first()
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")

    user = db.query(User).filter(User.email == tenant.contact_email).first()

    # Manually construct the response to include additional fields
    tenant_data = tenant.__dict__.copy()
    tenant_data["first_name"] = user.first_name if user else ""
    tenant_data["last_name"] = user.last_name if user else ""

    return tenant_data



# Get users under a tenant
@router.get("/{tenant_id}/users", response_model=List[UserOut])
def get_users_by_tenant(tenant_id: int, db: Session = Depends(get_db)):
    tenant = db.query(Tenant).filter(Tenant.id == tenant_id).first()
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")

    users = db.query(User).filter(User.tenant_id == tenant_id).all()
    return users


@router.get("/tenants/{tenant_id}/payments", response_model=List[PaymentOut])
def get_payments_by_tenant(tenant_id: int, db: Session = Depends(get_db)):
    payments = db.query(Payment).filter(Payment.tenant_id == tenant_id).all()
    
    if not payments:
        raise HTTPException(status_code=404, detail="No payments found for this tenant.")
    
    return payments


@router.put("/{tenant_id}", response_model=TenantOut)
def update_tenant(tenant_id: int, tenant: TenantUpdate, db: Session = Depends(get_db)):
    db_tenant = db.query(Tenant).filter(Tenant.id == tenant_id).first()
    if not db_tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")

    changes = []  # Track what was updated

    # Check for duplicate company name (if updating and it's different)
    if tenant.company_name and tenant.company_name != db_tenant.company_name:
        if db.query(Tenant).filter(Tenant.company_name == tenant.company_name, Tenant.id != tenant_id).first():
            raise HTTPException(status_code=400, detail="Company name already exists.")
        changes.append(f"Company Name: {db_tenant.company_name} → {tenant.company_name}")
        db_tenant.company_name = tenant.company_name

    # Check for duplicate contact email
    if tenant.contact_email and tenant.contact_email != db_tenant.contact_email:
        if db.query(Tenant).filter(Tenant.contact_email == tenant.contact_email, Tenant.id != tenant_id).first():
            raise HTTPException(status_code=400, detail="Email already in use.")
        changes.append(f"Contact Email: {db_tenant.contact_email} → {tenant.contact_email}")
        db_tenant.contact_email = tenant.contact_email

    # Check for duplicate slug URL
    if tenant.slug_url and tenant.slug_url != db_tenant.slug_url:
        if db.query(Tenant).filter(Tenant.slug_url == tenant.slug_url, Tenant.id != tenant_id).first():
            raise HTTPException(status_code=400, detail="Slug URL already in use.")
        changes.append(f"Slug URL: {db_tenant.slug_url} → {tenant.slug_url}")
        db_tenant.slug_url = tenant.slug_url

    # Check for duplicate serial code
    if tenant.serial_code and tenant.serial_code != db_tenant.serial_code:
        if len(tenant.serial_code) != 6 or not tenant.serial_code.isdigit():
            raise HTTPException(status_code=400, detail="Serial code must be a 6-digit number.")
        if db.query(Tenant).filter(Tenant.serial_code == tenant.serial_code, Tenant.id != tenant_id).first():
            raise HTTPException(status_code=400, detail="Serial code already in use.")
        changes.append(f"Serial Code: {db_tenant.serial_code} → {tenant.serial_code}")
        db_tenant.serial_code = tenant.serial_code

    # Update other fields (no need for uniqueness checks)
    if tenant.contact_phone is not None and tenant.contact_phone != db_tenant.contact_phone:
        changes.append(f"Contact Phone: {db_tenant.contact_phone} → {tenant.contact_phone}")
        db_tenant.contact_phone = tenant.contact_phone

    if tenant.billing_address is not None and tenant.billing_address != db_tenant.billing_address:
        changes.append(f"Billing Address: {db_tenant.billing_address} → {tenant.billing_address}")
        db_tenant.billing_address = tenant.billing_address

    if tenant.monthly_fee is not None and tenant.monthly_fee != db_tenant.monthly_fee:
        changes.append(f"Monthly Fee: {db_tenant.monthly_fee} → {tenant.monthly_fee}")
        db_tenant.monthly_fee = tenant.monthly_fee

    if tenant.max_users is not None and tenant.max_users != db_tenant.max_users:
        changes.append(f"Max Users: {db_tenant.max_users} → {tenant.max_users}")
        db_tenant.max_users = tenant.max_users

    if tenant.status is not None and tenant.status != db_tenant.status:
        changes.append(f"Status: {db_tenant.status} → {tenant.status}")
        db_tenant.status = tenant.status

    if tenant.plan is not None and tenant.plan != db_tenant.plan:
        changes.append(f"Plan: {db_tenant.plan} → {tenant.plan}")
        db_tenant.plan = tenant.plan

    if tenant.country is not None and tenant.country != db_tenant.country:
        changes.append(f"Country: {db_tenant.country} → {tenant.country}")
        db_tenant.country = tenant.country

    db.commit()
    db.refresh(db_tenant)

    # Send email if there are changes
    if changes and db_tenant.contact_email:
        change_list_html = "".join([f"<li>{change}</li>" for change in changes])
        send_email(
            to_email=db_tenant.contact_email,
            subject=f"Vala.ai – Tenant Profile Updated ({datetime.now().strftime('%Y-%m-%d')})",
            html_content=f"""
                <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <p>Dear {db_tenant.company_name} Admin,</p>
                    <p>The following details in your tenant profile were updated:</p>
                    <ul>
                        {change_list_html}
                    </ul>
                    <p>If you did not request these changes, please contact support immediately.</p>
                    <p>Warm regards,<br>
                       Vala.ai Support<br>
                       <a href="mailto:vala.ai@goodpartnerske.org">vala.ai@goodpartnerske.org</a>
                    </p>
                    <hr>
                    <p style="font-size: 12px; color: #888;">
                        Sent from Vala.ai | {datetime.now().strftime('%b %d, %Y - %I:%M %p %Z')}<br>
                        Need help? Contact us at: 
                        <a href="mailto:vala.ai@goodpartnerske.org">vala.ai@goodpartnerske.org</a><br>
                        This is an automated message. Please do not reply directly to this email.
                    </p>
                </body>
                </html>
            """
        )

    return db_tenant



# Delete a tenant
@router.delete("/{tenant_id}")
def delete_tenant(tenant_id: int, db: Session = Depends(get_db)):
    db_tenant = db.query(Tenant).filter(Tenant.id == tenant_id).first()
    if not db_tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")

    db.delete(db_tenant)
    db.commit()
    return {"message": "Tenant deleted successfully"}

@router.get("/dashboard/overview")
def get_tenant_dashboard_data(db: Session = Depends(get_db)):
    # Tenants
    tenants = db.query(Tenant).all()
    total_tenants = len(tenants)
    active_tenants = [t for t in tenants if t.status == "active"]
    
    # Monthly Recurring Revenue (based on ACTIVE tenants’ monthly fees)
    mrr = sum(t.monthly_fee for t in active_tenants)

    # Recent tenants
    recent_tenants = sorted(tenants, key=lambda t: t.created_at or datetime.min, reverse=True)[:5]

    # Today's date details
    now = datetime.now()
    current_year = now.year
    current_month = now.month

    # This Month's Successful Payments (actual revenue this month)
    this_month_payments = db.query(func.sum(Payment.amount)).filter(
        extract('year', Payment.payment_date) == current_year,
        extract('month', Payment.payment_date) == current_month,
        Payment.status == "paid"
    ).scalar() or 0

    # Overdue Payments Count
    overdue_payments = db.query(Payment).filter(
        Payment.status == "overdue"
    ).count()

    return {
        "total_tenants": total_tenants,
        "monthly_recurring_revenue": mrr,
        "this_months_payments_total": this_month_payments,
        "overdue_payments": overdue_payments,
        "recent_tenants": [
            {
                "id": t.id,
                "company_name": t.company_name,
                "contact_email": t.contact_email,
                "monthly_fee": t.monthly_fee,
                "status": t.status,
                "created_at": t.created_at,
            }
            for t in recent_tenants
        ],
    }