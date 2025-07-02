import React, { useState } from "react";
import SuperAdminLayout from "../../components/SuperAdmin/SuperAdminLayout";
import StatCard from "../../components/SuperAdmin/StatCard";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiUsers,
  FiDollarSign,
  FiCalendar,
  FiBarChart,
  FiPieChart,
  FiActivity,
} from "react-icons/fi";
import "../../styles/SuperAdmin.css";

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("30d");
  const [activeMetric, setActiveMetric] = useState("revenue");

  // Mock analytics data - in a real app, this would come from an API
  const analyticsData = {
    overview: {
      totalRevenue: 1247800,
      revenueGrowth: 15.3,
      newTenants: 24,
      tenantGrowth: 8.7,
      churnRate: 2.1,
      avgRevenuePerTenant: 156.23,
    },
    monthlyRevenue: [
      { month: "Jan", revenue: 89400 },
      { month: "Feb", revenue: 94200 },
      { month: "Mar", revenue: 98700 },
      { month: "Apr", revenue: 102300 },
      { month: "May", revenue: 108900 },
      { month: "Jun", revenue: 115600 },
      { month: "Jul", revenue: 121200 },
      { month: "Aug", revenue: 127800 },
      { month: "Sep", revenue: 134500 },
      { month: "Oct", revenue: 141200 },
      { month: "Nov", revenue: 148900 },
      { month: "Dec", revenue: 156700 },
    ],
    tenantsByPlan: [
      { plan: "Starter", count: 45, percentage: 45, revenue: 1305 },
      { plan: "Professional", count: 32, percentage: 32, revenue: 3168 },
      { plan: "Enterprise", count: 23, percentage: 23, revenue: 6877 },
    ],
    paymentMethods: [
      { method: "Credit Card", percentage: 65 },
      { method: "Bank Transfer", percentage: 20 },
      { method: "PayPal", percentage: 10 },
      { method: "Wire Transfer", percentage: 5 },
    ],
    topTenants: [
      {
        name: "Acme Corporation",
        plan: "Enterprise",
        revenue: 3588,
        growth: 12.3,
      },
      {
        name: "TechStart Solutions",
        plan: "Professional",
        revenue: 1188,
        growth: 8.9,
      },
      {
        name: "SecureVault Systems",
        plan: "Enterprise",
        revenue: 3588,
        growth: 15.2,
      },
      { name: "Innovate Labs", plan: "Enterprise", revenue: 2691, growth: 6.7 },
      {
        name: "CloudFlow Inc",
        plan: "Professional",
        revenue: 891,
        growth: -2.1,
      },
    ],
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
  };

  return (
    <SuperAdminLayout activePage="analytics">
      <div className="analytics-page">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-header-content">
            <h1 className="page-title">Analytics Dashboard</h1>
            <p className="page-subtitle">
              Insights and trends for your multi-tenant platform
            </p>
          </div>
          <div className="page-header-actions">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="filter-select"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="filter-buttons">
          <button
            className={`filter-btn ${activeMetric === "revenue" ? "active" : ""}`}
            onClick={() => setActiveMetric("revenue")}
          >
            Revenue
          </button>
          <button
            className={`filter-btn ${activeMetric === "tenants" ? "active" : ""}`}
            onClick={() => setActiveMetric("tenants")}
          >
            Tenants
          </button>
          <button
            className={`filter-btn ${activeMetric === "payments" ? "active" : ""}`}
            onClick={() => setActiveMetric("payments")}
          >
            Payments
          </button>
          <button
            className={`filter-btn ${activeMetric === "growth" ? "active" : ""}`}
            onClick={() => setActiveMetric("growth")}
          >
            Growth
          </button>
        </div>

        {/* Key Metrics */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon">
              <FiDollarSign />
            </div>
            <div className="metric-content">
              <div className="metric-value">
                KES {analyticsData.overview.totalRevenue.toLocaleString()}
              </div>
              <div className="metric-label">Total Revenue</div>
              <div className="metric-trend positive">
                ↗ {formatPercentage(analyticsData.overview.revenueGrowth)}
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <FiUsers />
            </div>
            <div className="metric-content">
              <div className="metric-value">
                {analyticsData.overview.newTenants}
              </div>
              <div className="metric-label">New Tenants</div>
              <div className="metric-trend positive">
                ↗ {formatPercentage(analyticsData.overview.tenantGrowth)}
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <FiTrendingDown />
            </div>
            <div className="metric-content">
              <div className="metric-value">
                {analyticsData.overview.churnRate}%
              </div>
              <div className="metric-label">Churn Rate</div>
              <div className="metric-trend negative">↘ -0.3%</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <FiTrendingUp />
            </div>
            <div className="metric-content">
              <div className="metric-value">
                KES{" "}
                {analyticsData.overview.avgRevenuePerTenant.toLocaleString()}
              </div>
              <div className="metric-label">Avg Revenue per Tenant</div>
              <div className="metric-trend positive">↗ +4.2%</div>
            </div>
          </div>
        </div>

        {/* Interactive Charts */}
        <div className="analytics-charts-grid">
          {/* Main Revenue Chart */}
          <div className="main-chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Monthly Revenue Trend</h3>
              <div className="chart-controls">
                <button className="chart-btn active">Revenue</button>
                <button className="chart-btn">Tenants</button>
                <button className="chart-btn">Growth</button>
              </div>
            </div>
            <div className="chart-content">
              <div className="interactive-chart">
                <div className="chart-grid">
                  {/* Y-axis labels */}
                  <div className="y-axis">
                    <div className="y-label">200K</div>
                    <div className="y-label">150K</div>
                    <div className="y-label">100K</div>
                    <div className="y-label">50K</div>
                    <div className="y-label">0</div>
                  </div>

                  {/* Chart bars */}
                  <div className="chart-bars">
                    {analyticsData.monthlyRevenue.map((item, index) => (
                      <div key={item.month} className="bar-container">
                        <div
                          className="chart-bar interactive"
                          style={{
                            height: `${Math.max((item.revenue / 200000) * 100, 2)}%`,
                          }}
                          title={`${item.month}: ${formatCurrency(item.revenue)}`}
                        />
                        <div className="bar-label">{item.month}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Plan Distribution Donut Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Tenant Plan Distribution</h3>
            </div>
            <div className="chart-content">
              <div className="donut-chart-container">
                <div className="donut-chart">
                  <div className="donut-center">
                    <div className="donut-total">
                      {analyticsData.tenantsByPlan.reduce(
                        (sum, p) => sum + p.count,
                        0,
                      )}
                    </div>
                    <div className="donut-label">Total Tenants</div>
                  </div>
                  {/* CSS-based donut segments would go here in a real implementation */}
                </div>
                <div className="donut-legend">
                  {analyticsData.tenantsByPlan.map((plan, index) => (
                    <div key={plan.plan} className="legend-item">
                      <div
                        className={`legend-color plan-${plan.plan.toLowerCase()}`}
                      />
                      <div className="legend-info">
                        <div className="legend-name">{plan.plan}</div>
                        <div className="legend-value">
                          {plan.count} ({plan.percentage}%)
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Payment Methods</h3>
            </div>
            <div className="chart-content">
              <div className="horizontal-bars">
                {analyticsData.paymentMethods.map((method, index) => (
                  <div key={method.method} className="horizontal-bar-item">
                    <div className="bar-info">
                      <span className="bar-label">{method.method}</span>
                      <span className="bar-value">{method.percentage}%</span>
                    </div>
                    <div className="horizontal-bar">
                      <div
                        className="horizontal-bar-fill"
                        style={{
                          width: `${method.percentage}%`,
                          backgroundColor: `hsl(${index * 60}, 70%, 60%)`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Performers */}
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Top Performing Tenants</h3>
            </div>
            <div className="chart-content">
              <div className="top-performers">
                {analyticsData.topTenants.map((tenant, index) => (
                  <div key={tenant.name} className="performer-item">
                    <div className="performer-rank">#{index + 1}</div>
                    <div className="performer-info">
                      <div className="performer-name">{tenant.name}</div>
                      <div className="performer-plan">{tenant.plan}</div>
                    </div>
                    <div className="performer-metrics">
                      <div className="performer-revenue">
                        KES {tenant.revenue.toLocaleString()}
                      </div>
                      <div
                        className={`performer-growth ${tenant.growth > 0 ? "positive" : "negative"}`}
                      >
                        {tenant.growth > 0 ? "↗" : "↘"}{" "}
                        {Math.abs(tenant.growth)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default Analytics;
