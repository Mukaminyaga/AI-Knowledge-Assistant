from sqlalchemy.orm import Session
from app.models.tenant import Tenant
from app.schemas.tenant import TenantCreate

def create_tenant(db: Session, tenant: TenantCreate) -> Tenant:
    db_tenant = Tenant(**tenant.dict())
    db.add(db_tenant)
    db.commit()
    db.refresh(db_tenant)
    return db_tenant

def get_tenant_by_slug(db: Session, slug: str) -> Tenant:
    return db.query(Tenant).filter(Tenant.slug_url == slug).first()
