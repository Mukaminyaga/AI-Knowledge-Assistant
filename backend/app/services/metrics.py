from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.users import User
from app.models.tenant import Tenant
from app.models.login_attempt import LoginAttempt
from datetime import timezone


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

    for tenant in tenants:
        # Login failures per tenant (last X hours)
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

        # Last active user in tenant
        last_active_user = (
            db.query(User)
            .filter(User.tenant_id == tenant.id, User.last_active.isnot(None))
            .order_by(User.last_active.desc())
            .first()
        )

        # Active users (last X days)
        active_users = (
            db.query(User)
            .filter(User.tenant_id == tenant.id, User.last_active >= since_days)
            .count()
        )
        total_active_users += active_users

        results.append({
            "tenant_id": tenant.id,
            "tenant_name": tenant.company_name,
            "login_failures_24h": login_failures,
            "last_active_user": {
                 "id": last_active_user.id,
                "email": last_active_user.email,
                "last_active": _iso_ms_z(last_active_user.last_active)
            } if last_active_user else None,

            "active_users_7d": active_users
        })

    return {
        "summary": {
            "total_login_failures_24h": total_failures,
            "total_active_users_7d": total_active_users,
        },
        "tenants": results
    }
