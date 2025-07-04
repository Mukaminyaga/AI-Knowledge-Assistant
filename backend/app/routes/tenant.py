from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas.tenant import TenantCreate, TenantOut
from app.crud.tenant import create_tenant, get_tenant_by_slug
from app.database import SessionLocal

router = APIRouter(prefix="/tenants", tags=["Tenants"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=TenantOut)
def register_tenant(tenant: TenantCreate, db: Session = Depends(get_db)):
    existing = get_tenant_by_slug(db, tenant.slug_url)
    if existing:
        raise HTTPException(status_code=400, detail="Slug already in use")
    return create_tenant(db, tenant)
