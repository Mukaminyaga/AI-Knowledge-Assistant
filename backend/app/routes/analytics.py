from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from app.database import get_db
from app.models.tenant import Tenant
from app.models.payment import Payment
from app.schemas.analytics import AnalyticsResponse

router = APIRouter(prefix="/superadmin/analytics", tags=["Analytics"])

@router.get("/overview", response_model=AnalyticsResponse)
def get_analytics(
    time_range: str = Query("30d", enum=["7d", "30d", "90d", "1y"]),
    db: Session = Depends(get_db),
):
    now = datetime.utcnow()
    ranges = {"7d": 7, "30d": 30, "90d": 90, "1y": 365}
    since = now - timedelta(days=ranges[time_range])

    # Overview
    total_revenue = db.query(func.coalesce(func.sum(Payment.amount), 0)).scalar()
    this_period = db.query(func.coalesce(func.sum(Payment.amount), 0))\
        .filter(Payment.date >= since).scalar()
    prev_period_start = since - (now - since)
    prev_period = db.query(func.coalesce(func.sum(Payment.amount), 0))\
        .filter(Payment.date >= prev_period_start, Payment.date < since).scalar()

    revenue_growth = ((this_period - prev_period) / prev_period * 100) if prev_period else 0.0

    new_tenants = db.query(Tenant).filter(Tenant.created_at >= since).count()
    total_tenants = db.query(Tenant).count()
    tenant_growth = (new_tenants / (total_tenants - new_tenants) * 100) if total_tenants - new_tenants > 0 else 0.0

    churned = db.query(Tenant).filter(Tenant.status == "inactive", Tenant.updated_at >= since).count()
    churn_rate = (churned / total_tenants * 100) if total_tenants > 0 else 0.0

    avg_revenue_per_tenant = total_revenue / total_tenants if total_tenants > 0 else 0.0

    # Monthly Revenue for last 12 months
    monthly_revenue = []
    start_month = now.replace(day=1) - timedelta(days=30*11)
    for m in range(12):
        sm = (start_month + timedelta(days=30 * m))
        em = (sm + timedelta(days=30))
        rev = db.query(func.coalesce(func.sum(Payment.amount), 0))\
            .filter(Payment.date >= sm, Payment.date < em).scalar()
        monthly_revenue.append({"month": sm.strftime("%b"), "revenue": rev})

    # Tenants By Plan
    plans = ["Starter", "Professional", "Enterprise"]
    tenants_by_plan = []
    for plan in plans:
        count = db.query(Tenant).filter(Tenant.plan == plan).count()
        percentage = (count / total_tenants * 100) if total_tenants else 0
        tenants_by_plan.append({
            "plan": plan,
            "count": count,
            "percentage": round(percentage, 1),
            "revenue": round(percentage / 100 * total_revenue, 2),
        })

    # Payment Methods
    methods = db.query(Payment.payment_method, func.count(Payment.id))\
        .group_by(Payment.payment_method).all()
    sum_methods = sum(c for _, c in methods) or 1
    payment_methods = [{"method": m, "percentage": int(c / sum_methods * 100)} for m, c in methods]

    # Top Performing Tenants
    top = db.query(Tenant.id, Tenant.company_name, Tenant.plan,
                   func.coalesce(func.sum(Payment.amount), 0).label("revenue"))\
        .join(Payment, isouter=True).group_by(Tenant.id)\
        .order_by(func.sum(Payment.amount).desc()).limit(5).all()
    top_tenants = [
        {
            "name": t.company_name,
            "plan": t.plan,
            "revenue": t.revenue,
            "growth": round((t.revenue / avg_revenue_per_tenant - 1) * 100, 1) if avg_revenue_per_tenant else 0,
        } for t in top
    ]

    return {
        "overview": {
            "totalRevenue": total_revenue,
            "revenueGrowth": round(revenue_growth, 1),
            "newTenants": new_tenants,
            "tenantGrowth": round(tenant_growth, 1),
            "churnRate": round(churn_rate, 1),
            "avgRevenuePerTenant": round(avg_revenue_per_tenant, 2),
        },
        "monthlyRevenue": monthly_revenue,
        "tenantsByPlan": tenants_by_plan,
        "paymentMethods": payment_methods,
        "topTenants": top_tenants,
    }
