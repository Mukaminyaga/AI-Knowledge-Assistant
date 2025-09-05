# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from app import database
# from app.services.metrics import (
#     get_login_failures,
#     get_last_active_user,
#     get_active_users,
#     get_login_failures_by_tenant,
#     get_last_active_user_by_tenant,
#     get_active_users_by_tenant
# )

# router = APIRouter()

# # --- System-wide metrics ---
# @router.get("/metrics/system")
# def system_metrics(db: Session = Depends(database.get_db)):
#     return {
#         "login_failures_24h": get_login_failures(db),
#         "last_active_user": get_last_active_user(db),
#         "active_users_7d": get_active_users(db, days=7),
#     }

# # --- Per-tenant metrics ---
# @router.get("/metrics/tenant/{tenant_id}")
# def tenant_metrics(tenant_id: int, db: Session = Depends(database.get_db)):
#     last_active = get_last_active_user_by_tenant(db, tenant_id)
#     if not last_active:
#         raise HTTPException(status_code=404, detail="Tenant not found or no users yet")

#     return {
#         "tenant_id": tenant_id,
#         "login_failures_24h": get_login_failures_by_tenant(db, tenant_id),
#         "last_active_user": {
#             "id": last_active.id,
#             "email": last_active.email,
#             "last_active": last_active.last_active
#         },
#         "active_users_7d": get_active_users_by_tenant(db, tenant_id, days=7),
#     }

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import database
from app.services.metrics import get_tenant_metrics

router = APIRouter()

@router.get("/metrics/tenants")
def metrics_all_tenants(db: Session = Depends(database.get_db)):
    return get_tenant_metrics(db)
