import React, { useEffect, useState } from "react";
import axios from "axios";
import SuperAdminLayout from "../../components/SuperAdmin/SuperAdminLayout";
import { FiUsers, FiDollarSign, FiAlertTriangle, FiTrendingUp, FiPlus, FiFileText } from "react-icons/fi";
import { Link } from "react-router-dom";
import "../../styles/SuperAdmin.css";


const API_URL = process.env.REACT_APP_API_URL;

const Overview = () => {
 const [dashboardData, setDashboardData] = useState({
  total_tenants: 0,
  monthly_recurring_revenue: 0,
  total_documents: 0, // <-- Already added via mergedData
  this_months_payments_total: 0,
  overdue_payments: 0,
  recent_tenants: [],
});



useEffect(() => {
  const fetchOverview = async () => {
    try {
      const token = localStorage.getItem("token"); // or sessionStorage or wherever you store the token

      const headers = {
        Authorization: `Bearer ${token}`
      };

      const [overviewRes, documentsRes] = await Promise.all([
        axios.get(`${API_URL}/tenants/tenants/dashboard/overview`, { headers }),
        axios.get(`${API_URL}/documents/superadmin/stats/total-documents`, { headers })
      ]);

      const mergedData = {
        ...overviewRes.data,
        total_documents: documentsRes.data.total_documents
      };

      console.log("Dashboard data:", mergedData);
      setDashboardData(mergedData);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    }
  };

  fetchOverview();
}, []);


  return (
    <SuperAdminLayout activePage="overview">
      <div className="overview-page">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-header-content">
            <h1 className="page-title">Super Admin Dashboard</h1>
            <p className="page-subtitle">
              Manage tenants, subscriptions, and billing
            </p>
          </div>
         <div className="page-header-actions">
  <Link to="/super-admin/tenants" className="btn btn-primary">
    <FiPlus className="btn-icon" />
    Add Tenant
  </Link>

  <Link to="/dashboard" className="btn btn-secondary" style={{ marginLeft: "10px" }}>
    Back to dashboard
  </Link>
</div>
</div>

        {/* Stats Grid */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon"><FiUsers /></div>
            <div className="metric-content">
              <div className="metric-value">{dashboardData.total_tenants}</div>
              <div className="metric-label">Total Tenants</div>
            </div>
          </div>

          
  <div className="metric-card">
    <div className="metric-icon"><FiFileText /></div>
    <div className="metric-content">
      <div className="metric-value">{dashboardData.total_documents}</div>
      <div className="metric-label">Total Documents</div>
    </div>
  </div>


          <div className="metric-card">
            <div className="metric-icon"><FiDollarSign /></div>
            <div className="metric-content">
              <div className="metric-value">
                KES {dashboardData.monthly_recurring_revenue.toLocaleString()}
              </div>
              <div className="metric-label">Monthly Recurring Revenue</div>
            </div>
          </div>

          {/* Optional hardcoded or future dynamic metrics */}
          <div className="metric-card error">
            <div className="metric-icon"><FiAlertTriangle /></div>
            <div className="metric-content">
              <div className="metric-value">{dashboardData.overdue_payments}</div>
              <div className="metric-label">Overdue Payments</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon"><FiTrendingUp /></div>
            <div className="metric-content">
           <div className="metric-value">
  KES {(dashboardData.this_months_payments_total || 0).toLocaleString()}
</div>

              <div className="metric-label">This Month's Payments</div>
            </div>
          </div>
        </div>

        {/* Recent Tenants Section */}
        <div className="recent-tenants-section">
          <h2 className="section-title">Recent Tenants</h2>
          <div className="tenants-list">
            {dashboardData.recent_tenants.map((tenant) => (
              <div key={tenant.id} className="tenant-card">
                <div className="tenant-info">
                  <div className="tenant-name">{tenant.company_name}</div>
                  <div className="tenant-email">{tenant.contact_email}</div>
                </div>
                <div className="tenant-status">
                  <span className={`status-badge ${tenant.status}`}>
                    {tenant.status}
                  </span>
                </div>
                <div className="tenant-amount">
                  KES {tenant.monthly_fee.toLocaleString()}
                </div>
                {/* <div className="tenant-actions">
                  <button className="action-btn" onClick={() => console.log("View", tenant)}>
                    View
                  </button>
                </div> */}
              </div>
            ))}
          </div>

          {dashboardData.total_tenants > 5 && (
            <div className="view-all-section">
              <Link to="/super-admin/tenants" className="view-all-link">
                View all tenants
              </Link>
            </div>
          )}
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default Overview;
