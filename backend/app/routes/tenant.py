from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.tenant import Tenant
from app.models.users import User
from app.models.payment import Payment
from app.schemas.tenant import TenantCreate, TenantUpdate, TenantOut
from app.schemas.users import UserOut
from datetime import datetime
from fastapi.responses import JSONResponse
from sqlalchemy import extract, func

router = APIRouter(prefix="/tenants", tags=["Tenants"])

import random

def generate_unique_serial_code(db: Session):
    while True:
        code = str(random.randint(100000, 999999))  # Always 6 digits
        exists = db.query(Tenant).filter(Tenant.serial_code == code).first()
        if not exists:
            return code


# Create a new tenant
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

    # Automatically generate serial code if not provided
    serial_code = tenant.serial_code
    if not serial_code:
        serial_code = generate_unique_serial_code(db)
    else:
        # Validate manually entered one
        if len(serial_code) != 6 or not serial_code.isdigit():
            raise HTTPException(status_code=400, detail="Serial code must be a 6-digit number.")
        if db.query(Tenant).filter(Tenant.serial_code == serial_code).first():
            raise HTTPException(status_code=400, detail="Serial code already in use.")

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

    return db_tenant



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
    return tenant


# Get users under a tenant
@router.get("/{tenant_id}/users", response_model=List[UserOut])
def get_users_by_tenant(tenant_id: int, db: Session = Depends(get_db)):
    tenant = db.query(Tenant).filter(Tenant.id == tenant_id).first()
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")

    users = db.query(User).filter(User.tenant_id == tenant_id).all()
    return users

@router.put("/{tenant_id}", response_model=TenantOut)
def update_tenant(tenant_id: int, tenant: TenantUpdate, db: Session = Depends(get_db)):
    db_tenant = db.query(Tenant).filter(Tenant.id == tenant_id).first()
    if not db_tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")

    # Check for duplicate company name (if updating and it's different)
    if tenant.company_name and tenant.company_name != db_tenant.company_name:
        if db.query(Tenant).filter(Tenant.company_name == tenant.company_name, Tenant.id != tenant_id).first():
            raise HTTPException(status_code=400, detail="Company name already exists.")
        db_tenant.company_name = tenant.company_name

    # Check for duplicate contact email
    if tenant.contact_email and tenant.contact_email != db_tenant.contact_email:
        if db.query(Tenant).filter(Tenant.contact_email == tenant.contact_email, Tenant.id != tenant_id).first():
            raise HTTPException(status_code=400, detail="Email already in use.")
        db_tenant.contact_email = tenant.contact_email

    # Check for duplicate slug URL
    if tenant.slug_url and tenant.slug_url != db_tenant.slug_url:
        if db.query(Tenant).filter(Tenant.slug_url == tenant.slug_url, Tenant.id != tenant_id).first():
            raise HTTPException(status_code=400, detail="Slug URL already in use.")
        db_tenant.slug_url = tenant.slug_url

    # Check for duplicate serial code
    if tenant.serial_code and tenant.serial_code != db_tenant.serial_code:
        if len(tenant.serial_code) != 6 or not tenant.serial_code.isdigit():
            raise HTTPException(status_code=400, detail="Serial code must be a 6-digit number.")
        if db.query(Tenant).filter(Tenant.serial_code == tenant.serial_code, Tenant.id != tenant_id).first():
            raise HTTPException(status_code=400, detail="Serial code already in use.")
        db_tenant.serial_code = tenant.serial_code

    # Update other fields (no need for uniqueness checks)
    if tenant.contact_phone is not None:
        db_tenant.contact_phone = tenant.contact_phone
    if tenant.billing_address is not None:
        db_tenant.billing_address = tenant.billing_address
    if tenant.monthly_fee is not None:
        db_tenant.monthly_fee = tenant.monthly_fee
    if tenant.max_users is not None:
        db_tenant.max_users = tenant.max_users
    if tenant.status is not None:
        db_tenant.status = tenant.status
    if tenant.plan is not None:
        db_tenant.plan = tenant.plan
    if tenant.country is not None:
        db_tenant.country = tenant.country

    db.commit()
    db.refresh(db_tenant)
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
        extract('year', Payment.date) == current_year,
        extract('month', Payment.date) == current_month,
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