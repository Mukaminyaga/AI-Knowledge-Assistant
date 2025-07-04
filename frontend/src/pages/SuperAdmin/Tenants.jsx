import React, { useState, useEffect } from "react";
import axios from "axios";
import SuperAdminLayout from "../../components/SuperAdmin/SuperAdminLayout";
import TenantTable from "../../components/SuperAdmin/TenantTable";
import TenantForm from "../../components/SuperAdmin/TenantForm";
import { FiPlus, FiDownload } from "react-icons/fi";
import "../../styles/SuperAdmin.css";

const API_URL = process.env.REACT_APP_API_URL;

const Tenants = () => {
  const [tenants, setTenants] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const response = await axios.get(`${API_URL}/tenants/tenants`);
      setTenants(response.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch tenants");
    }
  };

  const handleAddTenant = () => {
    setEditingTenant(null);
    setIsFormOpen(true);
  };

  const handleEditTenant = (tenant) => {
    setEditingTenant(tenant);
    setIsFormOpen(true);
  };

  const handleDeleteTenant = async (tenant) => {
    if (!window.confirm(`Delete ${tenant.company_name}?`)) return;

    try {
      await axios.delete(`${API_URL}/tenants/tenants/${tenant.id}`);
      setTenants((prev) => prev.filter((t) => t.id !== tenant.id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete tenant");
    }
  };

  const handleFormSubmit = (tenantData) => {
    if (editingTenant) {
      setTenants((prev) =>
        prev.map((t) => (t.id === tenantData.id ? tenantData : t))
      );
    } else {
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
  };

  const filteredTenants =
    statusFilter === "all"
      ? tenants
      : tenants.filter((tenant) => tenant.status === statusFilter);

  const totalTenants = tenants.length;
  const activeTenants = tenants.filter((t) => t.status === "active").length;
  const inactiveTenants = tenants.filter((t) => t.status === "inactive").length;
  const suspendedTenants = tenants.filter((t) => t.status === "suspended").length;
  const totalMRR = tenants
    .filter((t) => t.status === "active")
    .reduce((sum, t) => sum + (t.monthly_fee || 0), 0);

  return (
    <SuperAdminLayout activePage="tenants">
      <div className="tenants-page">
        {/* Header */}
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

        {/* Filters */}
        <div className="filter-buttons">
          {["all", "active", "inactive", "suspended"].map((status) => (
            <button
              key={status}
              className={`filter-btn ${statusFilter === status ? "active" : ""}`}
              onClick={() => setStatusFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="tenant-stats">
          <div className="stat-item"><div className="stat-value">{totalTenants}</div><div className="stat-label">Total Tenants</div></div>
          <div className="stat-item"><div className="stat-value">{activeTenants}</div><div className="stat-label">Active</div></div>
          <div className="stat-item"><div className="stat-value">{inactiveTenants}</div><div className="stat-label">Inactive</div></div>
          <div className="stat-item"><div className="stat-value">{suspendedTenants}</div><div className="stat-label">Suspended</div></div>
          <div className="stat-item"><div className="stat-value">KES {totalMRR.toLocaleString()}</div><div className="stat-label">Monthly Revenue</div></div>
        </div>

        {/* Filter Results */}
        <div className="advanced-filters">
          <div className="filter-results">
            Showing {filteredTenants.length} of {totalTenants} tenants
          </div>
        </div>

        {/* Table */}
        <div className="tenants-table-section">
          <TenantTable
            tenants={filteredTenants}
            onView={(t) => console.log("Viewing tenant:", t)}
            onEdit={handleEditTenant}
            onDelete={handleDeleteTenant}
            showActions={true}
          />
        </div>

        {/* Tenant Form */}
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
