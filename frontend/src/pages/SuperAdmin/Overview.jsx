import React, { useState, useEffect } from "react";
import SuperAdminLayout from "../../components/SuperAdmin/SuperAdminLayout";
// import StatCard from "../../components/SuperAdmin/StatCard";
// import TenantTable from "../../components/SuperAdmin/TenantTable";
import {
  FiUsers,
  FiDollarSign,
  FiAlertTriangle,
  FiTrendingUp,
  FiPlus,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import "../../styles/SuperAdmin.css";

// Mock data - in a real app, this would come from an API
const mockTenants = [
  {
    id: 1,
    companyName: "Acme Corporation",
    contactEmail: "admin@acme.com",
    slugUrl: "acme-corp",
    contactPhone: "+1 (555) 123-4567",
    billingAddress: "123 Business St, Suite 100, New York, NY 10001",
    plan: "enterprise",
    monthlyFee: 4500,
    maxUsers: 100,
    status: "active",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    companyName: "TechStart Solutions",
    contactEmail: "contact@techstart.io",
    slugUrl: "techstart-solutions",
    contactPhone: "+1 (555) 987-6543",
    billingAddress: "456 Innovation Ave, San Francisco, CA 94105",
    plan: "professional",
    monthlyFee: 99,
    maxUsers: 25,
    status: "active",
    createdAt: "2024-02-01T14:20:00Z",
  },
  {
    id: 3,
    companyName: "Digital Dynamics",
    contactEmail: "hello@digitaldynamics.com",
    slugUrl: "digital-dynamics",
    contactPhone: "+1 (555) 246-8135",
    billingAddress: "789 Tech Park Dr, Austin, TX 73301",
    plan: "starter",
    monthlyFee: 29,
    maxUsers: 5,
    status: "active",
    createdAt: "2024-02-10T09:15:00Z",
  },
  {
    id: 4,
    companyName: "CloudFlow Inc",
    contactEmail: "info@cloudflow.net",
    slugUrl: "cloudflow-inc",
    contactPhone: "+1 (555) 369-2580",
    billingAddress: "321 Cloud St, Seattle, WA 98101",
    plan: "professional",
    monthlyFee: 99,
    maxUsers: 25,
    status: "inactive",
    createdAt: "2024-01-28T16:45:00Z",
  },
  {
    id: 5,
    companyName: "Innovate Labs",
    contactEmail: "team@innovatelabs.org",
    slugUrl: "innovate-labs",
    contactPhone: "+1 (555) 147-9632",
    billingAddress: "654 Research Blvd, Boston, MA 02101",
    plan: "enterprise",
    monthlyFee: 4500,
    maxUsers: 50,
    status: "active",
    createdAt: "2024-02-05T11:30:00Z",
  },
];

const mockPayments = [
  {
    id: 1,
    tenantId: 1,
    tenantName: "Acme Corporation",
    amount: 4500,
    status: "paid",
    dueDate: "2024-02-15T00:00:00Z",
    date: "2024-02-14T10:30:00Z",
  },
  {
    id: 2,
    tenantId: 2,
    tenantName: "TechStart Solutions",
    amount: 99,
    status: "overdue",
    dueDate: "2024-02-01T00:00:00Z",
    date: null,
  },
  {
    id: 3,
    tenantId: 3,
    tenantName: "Digital Dynamics",
    amount: 29,
    status: "paid",
    dueDate: "2024-02-10T00:00:00Z",
    date: "2024-02-09T15:20:00Z",
  },
  {
    id: 4,
    tenantId: 5,
    tenantName: "Innovate Labs",
    amount: 4500,
    status: "pending",
    dueDate: "2024-02-20T00:00:00Z",
    date: null,
  },
];

const Overview = () => {
  const [tenants] = useState(mockTenants);
  const [payments] = useState(mockPayments);

  // Calculate stats
  const totalTenants = tenants.length;
  const activeTenants = tenants.filter((t) => t.status === "active");
  const monthlyRecurringRevenue = activeTenants.reduce(
    (sum, tenant) => sum + tenant.monthlyFee,
    0,
  );

  const overduePayments = payments.filter((p) => p.status === "overdue").length;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthPayments = payments.filter((p) => {
    if (!p.date) return false;
    const paymentDate = new Date(p.date);
    return (
      paymentDate.getMonth() === currentMonth &&
      paymentDate.getFullYear() === currentYear &&
      p.status === "paid"
    );
  });

  const thisMonthRevenue = thisMonthPayments.reduce(
    (sum, payment) => sum + payment.amount,
    0,
  );

  // Get recent tenants (last 5)
  const recentTenants = [...tenants]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const handleViewTenant = (tenant) => {
    console.log("View tenant:", tenant);
    // In a real app, navigate to tenant details page
  };

  const handleEditTenant = (tenant) => {
    console.log("Edit tenant:", tenant);
    // In a real app, open edit modal or navigate to edit page
  };

  const handleDeleteTenant = (tenant) => {
    console.log("Delete tenant:", tenant);
    // In a real app, show confirmation modal and delete
  };

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
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="filter-buttons">
          <button className="filter-btn active">All Tenants</button>
          <button className="filter-btn">Active</button>
          <button className="filter-btn">Trial</button>
          <button className="filter-btn">Suspended</button>
        </div>

        {/* Stats Grid */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon">
              <FiUsers />
            </div>
            <div className="metric-content">
              <div className="metric-value">{totalTenants}</div>
              <div className="metric-label">Total Tenants</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <FiDollarSign />
            </div>
            <div className="metric-content">
              <div className="metric-value">
                KES {monthlyRecurringRevenue.toLocaleString()}
              </div>
              <div className="metric-label">Monthly Recurring Revenue</div>
            </div>
          </div>

          <div className="metric-card error">
            <div className="metric-icon">
              <FiAlertTriangle />
            </div>
            <div className="metric-content">
              <div className="metric-value">{overduePayments}</div>
              <div className="metric-label">Overdue Payments</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <FiTrendingUp />
            </div>
            <div className="metric-content">
              <div className="metric-value">{thisMonthPayments.length}</div>
              <div className="metric-label">This Month's Payments</div>
            </div>
          </div>
        </div>

        {/* Recent Tenants Section */}
        <div className="recent-tenants-section">
          <h2 className="section-title">Recent Tenants</h2>

          <div className="tenants-list">
            {recentTenants.map((tenant) => (
              <div key={tenant.id} className="tenant-card">
                <div className="tenant-info">
                  <div className="tenant-name">{tenant.companyName}</div>
                  <div className="tenant-email">{tenant.contactEmail}</div>
                </div>
                <div className="tenant-status">
                  <span className={`status-badge ${tenant.status}`}>
                    {tenant.status}
                  </span>
                </div>
                <div className="tenant-amount">
                  KES {tenant.monthlyFee.toLocaleString()}
                </div>
                <div className="tenant-actions">
                  <button
                    className="action-btn"
                    onClick={() => handleViewTenant(tenant)}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>

          {tenants.length > 5 && (
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
