from pydantic import BaseModel
from typing import List

class OverviewData(BaseModel):
    totalRevenue: float
    revenueGrowth: float
    newTenants: int
    tenantGrowth: float
    churnRate: float
    avgRevenuePerTenant: float

class MonthlyRevenueItem(BaseModel):
    month: str
    revenue: float

class TenantPlanItem(BaseModel):
    plan: str
    count: int
    percentage: float
    revenue: float

class PaymentMethodItem(BaseModel):
    method: str
    percentage: int

class TopTenantItem(BaseModel):
    name: str
    plan: str
    revenue: float
    growth: float

class AnalyticsResponse(BaseModel):
    overview: OverviewData
    monthlyRevenue: List[MonthlyRevenueItem]
    tenantsByPlan: List[TenantPlanItem]
    paymentMethods: List[PaymentMethodItem]
    topTenants: List[TopTenantItem]
