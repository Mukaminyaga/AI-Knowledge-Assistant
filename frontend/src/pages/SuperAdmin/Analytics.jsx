import React, { useState, useEffect } from "react";
import axios from "axios";
import SuperAdminLayout from "../../components/SuperAdmin/SuperAdminLayout";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiUsers,
  FiDollarSign,
} from "react-icons/fi";
import "../../styles/SuperAdmin.css";

const API_URL = process.env.REACT_APP_API_URL;

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("30d");
  const [activeMetric, setActiveMetric] = useState("revenue");
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/superadmin/analytics/overview`, {
        params: { time_range: timeRange },
      });
      setAnalyticsData(response.data);
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError("Failed to load analytics data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <SuperAdminLayout activePage="analytics">
        <div className="analytics-page">Loading analytics...</div>
      </SuperAdminLayout>
    );
  }

  if (error) {
    return (
      <SuperAdminLayout activePage="analytics">
        <div className="analytics-page">{error}</div>
      </SuperAdminLayout>
    );
  }

  const overview = analyticsData.overview;

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
          {["revenue", "tenants", "payments", "growth"].map((metric) => (
            <button
              key={metric}
              className={`filter-btn ${activeMetric === metric ? "active" : ""}`}
              onClick={() => setActiveMetric(metric)}
            >
              {metric.charAt(0).toUpperCase() + metric.slice(1)}
            </button>
          ))}
        </div>

        {/* Key Metrics */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon">
              <FiDollarSign />
            </div>
            <div className="metric-content">
              <div className="metric-value">
                {formatCurrency(overview.totalRevenue)}
              </div>
              <div className="metric-label">Total Revenue</div>
              <div className="metric-trend positive">
                ↗ {formatPercentage(overview.revenueGrowth)}
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <FiUsers />
            </div>
            <div className="metric-content">
              <div className="metric-value">{overview.newTenants}</div>
              <div className="metric-label">New Tenants</div>
              <div className="metric-trend positive">
                ↗ {formatPercentage(overview.tenantGrowth)}
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <FiTrendingDown />
            </div>
            <div className="metric-content">
              <div className="metric-value">{overview.churnRate}%</div>
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
                {formatCurrency(overview.avgRevenuePerTenant)}
              </div>
              <div className="metric-label">Avg Revenue per Tenant</div>
              <div className="metric-trend positive">↗ +4.2%</div>
            </div>
          </div>
        </div>

        {/* Interactive Charts */}
        <div className="analytics-charts-grid">
          {/* Monthly Revenue Chart */}
          <div className="main-chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Monthly Revenue Trend</h3>
            </div>
            <div className="chart-content">
              <div className="interactive-chart">
                <div className="chart-grid">
                  <div className="y-axis">
                    <div className="y-label">200K</div>
                    <div className="y-label">150K</div>
                    <div className="y-label">100K</div>
                    <div className="y-label">50K</div>
                    <div className="y-label">0</div>
                  </div>
                  <div className="chart-bars">
                    {analyticsData.monthlyRevenue.map((item) => (
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

          {/* Tenant Plan Distribution */}
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Tenant Plan Distribution</h3>
            </div>
            <div className="chart-content">
              <div className="donut-chart-container">
                <div className="donut-chart">
                  <div className="donut-center">
                    <div className="donut-total">
                      {analyticsData.tenantsByPlan.reduce((sum, p) => sum + p.count, 0)}
                    </div>
                    <div className="donut-label">Total Tenants</div>
                  </div>
                </div>
                <div className="donut-legend">
                  {analyticsData.tenantsByPlan.map((plan) => (
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

          {/* Payment Methods */}
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

          {/* Top Performing Tenants */}
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
                        {formatCurrency(tenant.revenue)}
                      </div>
                      <div
                        className={`performer-growth ${
                          tenant.growth > 0 ? "positive" : "negative"
                        }`}
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
