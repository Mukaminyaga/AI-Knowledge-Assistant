import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import SuperAdminLayout from "../../components/SuperAdmin/SuperAdminLayout";
import UserTable from "../../components/SuperAdmin/UserTable";
import DocumentTable from "../../components/SuperAdmin/DocumentTable";
import PaymentHistoryModal from "../../components/SuperAdmin/PaymentHistoryModal";

import {
  FiArrowLeft,
  FiUsers,
  FiFileText,
  FiMail,
  FiPhone,
  FiGlobe,
  FiDollarSign,
  FiClock,
  FiCalendar,
} from "react-icons/fi";
import "../../styles/SuperAdmin.css";
import "../../styles/TenantDetails.css";

const API_URL = process.env.REACT_APP_API_URL;

const TenantDetails = () => {
  const { tenantId } = useParams();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState(null);
  const [users, setUsers] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payments, setPayments] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);


  useEffect(() => {
    if (tenantId) fetchTenantData();
  }, [tenantId]);

  const fetchTenantData = async () => {
    try {
      setLoading(true);
      const [tenantRes, usersRes, docsRes] = await Promise.all([
        axios.get(`${API_URL}/tenants/tenants/${tenantId}`),
        axios.get(`${API_URL}/tenants/tenants/${tenantId}/users`),
        axios.get(`${API_URL}/documents/tenants/${tenantId}/documents`),
        axios.get(`${API_URL}/tenants/tenants/${tenantId}/payments`)

      ]);

      setTenant(tenantRes.data);
      setUsers(usersRes.data);
      setDocuments(docsRes.data);
      
    } catch (err) {
      console.error("Error fetching tenant data:", err);
      setError("Failed to fetch tenant data.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const getStatusBadge = (status) => {
    const statusColors = {
      active: "success",
      inactive: "warning",
      suspended: "danger",
    };

    return (
      <span className={`status-badge status-${statusColors[status] || "default"}`}>
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <SuperAdminLayout activePage="tenant-details">
        <div className="tenant-details-page">
          <div className="loading-state">Loading tenant details...</div>
        </div>
      </SuperAdminLayout>
    );
  }

  if (error) {
    return (
      <SuperAdminLayout activePage="tenant-details">
        <div className="tenant-details-page">
          <div className="error-state">{error}</div>
        </div>
      </SuperAdminLayout>
    );
  }

  if (!tenant) {
    return (
      <SuperAdminLayout activePage="tenant-details">
        <div className="tenant-details-page">
          <div className="error-state">Tenant not found.</div>
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout activePage="tenant-details">
      <div className="tenant-details-page">
        {/* Header */}
        <div className="page-header">
          <div className="page-header-content">
            <div className="page-navigation">
              <button
                className="back-button"
                onClick={() => navigate("/super-admin/tenants")}
              >
                <FiArrowLeft className="back-icon" />
                Back to Tenants
              </button>
            </div>
            <h1 className="page-title">{tenant.companyName || tenant.company_name}</h1>
            <p className="page-subtitle">Manage users and documents for this tenant</p>
          </div>
          <div className="page-header-actions">{getStatusBadge(tenant.status)}</div>
        </div>

        {/* Info Cards */}
        <div className="tenant-info-grid">
          <div className="info-card">
            <div className="info-icon"><FiMail /></div>
            <div className="info-content">
              <div className="info-label">Contact Email</div>
              <div className="info-value">{tenant.contactEmail || tenant.contact_email}</div>
            </div>
          </div>
          <div className="info-card">
            <div className="info-icon"><FiPhone /></div>
            <div className="info-content">
              <div className="info-label">Phone</div>
              <div className="info-value">{tenant.contactPhone || tenant.contact_phone}</div>
            </div>
          </div>
          <div className="info-card">
            <div className="info-icon"><FiGlobe /></div>
            <div className="info-content">
              <div className="info-label">Slug URL</div>
              <div className="info-value">{tenant.slugUrl || tenant.slug_url}</div>
            </div>
          </div>
          <div className="info-card">
            <div className="info-icon"><FiDollarSign /></div>
            <div className="info-content">
              <div className="info-label">Monthly Fee</div>
              <div className="info-value">
                KES {(tenant.monthlyFee || tenant.monthly_fee || 0).toLocaleString()}
              </div>
            </div>
          </div>
          <div className="info-card">
            <div className="info-icon"><FiUsers /></div>
            <div className="info-content">
              <div className="info-label">Max Users</div>
              <div className="info-value">{tenant.maxUsers || tenant.max_users}</div>
            </div>
          </div>
          <div className="info-card">
            <div className="info-icon"><FiCalendar /></div>
            <div className="info-content">
              <div className="info-label">Created</div>
              <div className="info-value">
                {formatDate(tenant.created_at || tenant.createdAt)}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="content-tabs">
          <button
            className={`tab-button ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            <FiUsers className="tab-icon" />
            Users ({users.length})
          </button>
          <button
            className={`tab-button ${activeTab === "documents" ? "active" : ""}`}
            onClick={() => setActiveTab("documents")}
          >
            <FiFileText className="tab-icon" />
            Documents ({documents.length})
          </button>
         <button
  className={`tab-button ${activeTab === "payments" ? "active" : ""}`}
  onClick={() => {
    setActiveTab("payments");
    setShowPaymentModal(true); // auto open modal
  }}
>
  <FiClock className="tab-icon" />
  Payments ({payments.length})
</button>

        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === "users" && (
            <div className="users-section">
              <UserTable users={users} tenantId={tenantId} />
            </div>
          )}
          {activeTab === "documents" && (
            <div className="documents-section">
              <DocumentTable documents={documents} tenantId={tenantId} />
            </div>
          )}
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default TenantDetails;
