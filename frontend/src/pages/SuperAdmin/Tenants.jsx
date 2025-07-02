import React, { useState } from "react";
import SuperAdminLayout from "../../components/SuperAdmin/SuperAdminLayout";
import TenantTable from "../../components/SuperAdmin/TenantTable";
import TenantForm from "../../components/SuperAdmin/TenantForm";
import { FiPlus, FiDownload, FiFilter } from "react-icons/fi";
import "../../styles/SuperAdmin.css";

// Mock data - in a real app, this would come from an API
const initialTenants = [
  {
    id: 1,
    companyName: "Acme Corporation",
    contactEmail: "admin@acme.com",
    slugUrl: "acme-corp",
    contactPhone: "+1 (555) 123-4567",
    billingAddress: "123 Business St, Suite 100, New York, NY 10001",
    plan: "enterprise",
    monthlyFee: 299,
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
    monthlyFee: 299,
    maxUsers: 50,
    status: "active",
    createdAt: "2024-02-05T11:30:00Z",
  },
  {
    id: 6,
    companyName: "DataSync Pro",
    contactEmail: "support@datasync.com",
    slugUrl: "datasync-pro",
    contactPhone: "+1 (555) 789-1234",
    billingAddress: "987 Data Center Rd, Dallas, TX 75201",
    plan: "starter",
    monthlyFee: 29,
    maxUsers: 10,
    status: "active",
    createdAt: "2024-02-12T13:45:00Z",
  },
  {
    id: 7,
    companyName: "WebCraft Studio",
    contactEmail: "hello@webcraft.design",
    slugUrl: "webcraft-studio",
    contactPhone: "+1 (555) 456-7890",
    billingAddress: "246 Design Ave, Portland, OR 97201",
    plan: "professional",
    monthlyFee: 99,
    maxUsers: 15,
    status: "suspended",
    createdAt: "2024-01-20T08:30:00Z",
  },
  {
    id: 8,
    companyName: "SecureVault Systems",
    contactEmail: "admin@securevault.tech",
    slugUrl: "securevault-systems",
    contactPhone: "+1 (555) 321-6547",
    billingAddress: "135 Security Blvd, Denver, CO 80202",
    plan: "enterprise",
    monthlyFee: 299,
    maxUsers: 75,
    status: "active",
    createdAt: "2024-01-25T11:15:00Z",
  },
];

const Tenants = () => {
  const [tenants, setTenants] = useState(initialTenants);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const handleAddTenant = () => {
    setEditingTenant(null);
    setIsFormOpen(true);
  };

  const handleEditTenant = (tenant) => {
    setEditingTenant(tenant);
    setIsFormOpen(true);
  };

  const handleDeleteTenant = (tenant) => {
    if (
      window.confirm(`Are you sure you want to delete ${tenant.companyName}?`)
    ) {
      setTenants((prev) => prev.filter((t) => t.id !== tenant.id));
    }
  };

  const handleViewTenant = (tenant) => {
    console.log("View tenant details:", tenant);
    // In a real app, this would navigate to a detailed view
  };

  const handleFormSubmit = (tenantData) => {
    if (editingTenant) {
      // Update existing tenant
      setTenants((prev) =>
        prev.map((t) =>
          t.id === editingTenant.id
            ? { ...tenantData, id: editingTenant.id }
            : t,
        ),
      );
    } else {
      // Add new tenant
      setTenants((prev) => [...prev, tenantData]);
    }
    setIsFormOpen(false);
    setEditingTenant(null);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingTenant(null);
  };

  const handleExport = () => {
    console.log("Export tenants data");
    // In a real app, this would generate and download a CSV/Excel file
  };

  // Filter tenants based on status
  const filteredTenants =
    statusFilter === "all"
      ? tenants
      : tenants.filter((tenant) => tenant.status === statusFilter);

  // Calculate stats
  const totalTenants = tenants.length;
  const activeTenants = tenants.filter((t) => t.status === "active").length;
  const inactiveTenants = tenants.filter((t) => t.status === "inactive").length;
  const suspendedTenants = tenants.filter(
    (t) => t.status === "suspended",
  ).length;
  const totalMRR = tenants
    .filter((t) => t.status === "active")
    .reduce((sum, t) => sum + t.monthlyFee, 0);

  return (
    <SuperAdminLayout activePage="tenants">
      <div className="tenants-page">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-header-content">
            <h1 className="page-title">Tenant Management</h1>
            <p className="page-subtitle">
              Manage all your tenants and their subscriptions
            </p>
          </div>
          <div className="page-header-actions">
            <button className="btn btn-secondary" onClick={handleExport}>
              <FiDownload className="btn-icon" />
              Export
            </button>
            <button className="btn btn-primary" onClick={handleAddTenant}>
              <FiPlus className="btn-icon" />
              Add Tenant
            </button>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="filter-buttons">
          <button
            className={`filter-btn ${statusFilter === "all" ? "active" : ""}`}
            onClick={() => setStatusFilter("all")}
          >
            All Tenants
          </button>
          <button
            className={`filter-btn ${statusFilter === "active" ? "active" : ""}`}
            onClick={() => setStatusFilter("active")}
          >
            Active
          </button>
          <button
            className={`filter-btn ${statusFilter === "inactive" ? "active" : ""}`}
            onClick={() => setStatusFilter("inactive")}
          >
            Inactive
          </button>
          <button
            className={`filter-btn ${statusFilter === "suspended" ? "active" : ""}`}
            onClick={() => setStatusFilter("suspended")}
          >
            Suspended
          </button>
        </div>

        {/* Stats Cards */}
        <div className="tenant-stats">
          <div className="stat-item">
            <div className="stat-value">{totalTenants}</div>
            <div className="stat-label">Total Tenants</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{activeTenants}</div>
            <div className="stat-label">Active</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{inactiveTenants}</div>
            <div className="stat-label">Inactive</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{suspendedTenants}</div>
            <div className="stat-label">Suspended</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">KES {totalMRR.toLocaleString()}</div>
            <div className="stat-label">Monthly Revenue</div>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="advanced-filters">
          <div className="filter-results">
            Showing {filteredTenants.length} of {totalTenants} tenants
          </div>
        </div>

        {/* Tenants Table */}
        <div className="tenants-table-section">
          <TenantTable
            tenants={filteredTenants}
            onView={handleViewTenant}
            onEdit={handleEditTenant}
            onDelete={handleDeleteTenant}
            showActions={true}
          />
        </div>

        {/* Tenant Form Modal */}
        <TenantForm
          isOpen={isFormOpen}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          initialData={editingTenant}
        />
      </div>
    </SuperAdminLayout>
  );
};

export default Tenants;
