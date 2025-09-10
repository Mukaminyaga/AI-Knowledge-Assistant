from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.users import User
from app.models.tenant import Tenant
from app.models.login_attempt import LoginAttempt
from datetime import timezone
from app.models.document_interaction import DocumentInteraction
from app.models.document import Document
from sqlalchemy import func
from app.utils.plan_limits import PLAN_LIMITS

# def get_login_failures(db: Session, hours: int = 24):
#     since = datetime.utcnow() - timedelta(hours=hours)
#     return db.query(LoginAttempt).filter(
#         LoginAttempt.success == False,
#         LoginAttempt.timestamp >= since
#     ).count()

# def get_last_active_user(db: Session):
#     return db.query(User).order_by(User.last_active.desc()).first()

# def get_active_users(db: Session, days: int = 7):
#     since = datetime.utcnow() - timedelta(days=days)
#     return db.query(User).filter(User.last_active >= since).count()

# # --- Per-tenant metrics ---
# def get_login_failures_by_tenant(db: Session, tenant_id: int, hours: int = 24):
#     since = datetime.utcnow() - timedelta(hours=hours)
#     return db.query(LoginAttempt).join(User).filter(
#         LoginAttempt.user_id == User.id,
#         User.tenant_id == tenant_id,
#         LoginAttempt.success == False,
#         LoginAttempt.timestamp >= since
#     ).count()

# def get_last_active_user_by_tenant(db: Session, tenant_id: int):
#     return db.query(User).filter(User.tenant_id == tenant_id).order_by(User.last_active.desc()).first()

# def get_active_users_by_tenant(db: Session, tenant_id: int, days: int = 7):
#     since = datetime.utcnow() - timedelta(days=days)
#     return db.query(User).filter(
#         User.tenant_id == tenant_id,
#         User.last_active >= since
#     ).count()


def _iso_ms_z(dt):
    if not dt:
        return None
    dt_utc = dt.astimezone(timezone.utc)
    return dt_utc.strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"

def get_tenant_metrics(db, days=7, hours=24):
    tenants = db.query(Tenant).all()
    since_days = datetime.utcnow() - timedelta(days=days)
    since_hours = datetime.utcnow() - timedelta(hours=hours)

    results = []
    total_failures = 0
    total_active_users = 0
    total_uploads_all = 0
    total_uploads_week = 0

    for tenant in tenants:
        # Login failures
        login_failures = (
            db.query(LoginAttempt)
            .join(User, User.id == LoginAttempt.user_id)
            .filter(
                User.tenant_id == tenant.id,
                LoginAttempt.success == False,
                LoginAttempt.timestamp >= since_hours
            )
            .count()
        )
        total_failures += login_failures

        # Last active user
        last_active_user = (
            db.query(User)
            .filter(User.tenant_id == tenant.id, User.last_active.isnot(None))
            .order_by(User.last_active.desc())
            .first()
        )

        # Active users
        active_users = (
            db.query(User)
            .filter(User.tenant_id == tenant.id, User.last_active >= since_days)
            .count()
        )
        total_active_users += active_users

        # Total docs
        total_documents = (
            db.query(Document)
            .filter(Document.tenant_id == tenant.id)
            .count()
        )
        total_uploads_all += total_documents

        # Recent uploads
        recent_uploads = (
            db.query(DocumentInteraction)
            .filter(
                DocumentInteraction.tenant_id == tenant.id,
                DocumentInteraction.action == "upload",
                DocumentInteraction.timestamp >= since_days
            )
            .count()
        )
        total_uploads_week += recent_uploads

        # Storage used
        storage_used = (
            db.query(func.coalesce(func.sum(Document.size), 0))
            .filter(Document.tenant_id == tenant.id)
            .scalar()
        )

        # ✅ Get plan limit (default 5GB if not found)
        plan_limit = PLAN_LIMITS.get(tenant.plan.lower(), 5 * 1024 * 1024 * 1024)

        results.append({
            "tenant_id": tenant.id,
            "tenant_name": tenant.company_name,
            "status": tenant.status,
            "plan": tenant.plan,
            "monthly_fee": tenant.monthly_fee,
            "login_failures_24h": login_failures,
            "last_active_user": {
                "id": last_active_user.id,
                "email": last_active_user.email,
                "last_active": _iso_ms_z(last_active_user.last_active)
            } if last_active_user else None,
            "active_users_7d": active_users,
            "total_uploads": total_documents,
            "uploads_7d": recent_uploads,
            "storage_used": storage_used,
            "plan_limit": plan_limit   # <-- NEW
        })

    return {
        "summary": {
            "total_login_failures_24h": total_failures,
            "total_active_users_7d": total_active_users,
            "total_uploads": total_uploads_all,
            "total_uploads_7d": total_uploads_week
        },
        "tenants": results
    }