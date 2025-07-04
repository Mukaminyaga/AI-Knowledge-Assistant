from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.tenant import Tenant
from app.schemas.tenant import TenantCreate, TenantUpdate, TenantOut

router = APIRouter(prefix="/tenants", tags=["Tenants"])

@router.post("/", response_model=TenantOut)
def create_tenant(tenant: TenantCreate, db: Session = Depends(get_db)):
    existing = db.query(Tenant).filter(Tenant.slug_url == tenant.slug_url).first()
    if existing:
        raise HTTPException(status_code=400, detail="Tenant with this slug already exists.")

    db_tenant = Tenant(
        company_name=tenant.company_name,
        contact_email=tenant.contact_email,
        slug_url=tenant.slug_url,
        contact_phone=tenant.contact_phone,
        billing_address=tenant.billing_address,
        monthly_fee=tenant.monthly_fee,
        max_users=tenant.max_users
    )
    db.add(db_tenant)
    db.commit()
    db.refresh(db_tenant)
    return db_tenant

@router.get("/", response_model=list[TenantOut])
def get_all_tenants(db: Session = Depends(get_db)):
    return db.query(Tenant).all()

@router.put("/{tenant_id}", response_model=TenantOut)
def update_tenant(tenant_id: int, tenant: TenantUpdate, db: Session = Depends(get_db)):
    db_tenant = db.query(Tenant).filter(Tenant.id == tenant_id).first()
    if not db_tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")

    if tenant.company_name is not None:
        db_tenant.company_name = tenant.company_name
    if tenant.contact_email is not None:
        db_tenant.contact_email = tenant.contact_email
    if tenant.slug_url is not None:
        db_tenant.slug_url = tenant.slug_url
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

    db.commit()
    db.refresh(db_tenant)
    return db_tenant

@router.delete("/{tenant_id}")
def delete_tenant(tenant_id: int, db: Session = Depends(get_db)):
    db_tenant = db.query(Tenant).filter(Tenant.id == tenant_id).first()
    if not db_tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")

    db.delete(db_tenant)
    db.commit()
    return {"message": "Tenant deleted successfully"}
