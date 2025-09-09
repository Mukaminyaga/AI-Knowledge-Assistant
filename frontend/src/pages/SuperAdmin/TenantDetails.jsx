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
  FiDownload,
  FiSend,
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
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);


  useEffect(() => {
    if (tenantId) fetchTenantData();
  }, [tenantId]);

  useEffect(() => {
    if (activeTab === "payments" && tenant) {
      fetchTenantPayments();
    }
  }, [activeTab, tenant]);

  const fetchTenantData = async () => {
    try {
      setLoading(true);
      const [tenantRes, usersRes, docsRes] = await Promise.all([
        axios.get(`${API_URL}/tenants/tenants/${tenantId}`),
        axios.get(`${API_URL}/tenants/tenants/${tenantId}/users`),
        axios.get(`${API_URL}/documents/tenants/${tenantId}/documents`),
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

  const fetchTenantPayments = async () => {
    if (!tenant) return;

    try {
      setLoadingPayments(true);
      const response = await axios.get(`${API_URL}/payments`);
      const allPayments = response.data;

      // Filter payments for this specific tenant
      const tenantName = tenant.companyName || tenant.company_name;
      const tenantEmail = tenant.contactEmail || tenant.contact_email;

      const tenantPayments = allPayments.filter(payment =>
        payment.tenant_name === tenantName ||
        payment.tenant_email === tenantEmail
      );

      setPayments(tenantPayments);
    } catch (err) {
      console.error("Error fetching payments:", err);
    } finally {
      setLoadingPayments(false);
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

  const getPaymentStatusClass = (status) => {
    const statusClasses = {
      paid: "success",
      pending: "warning",
      overdue: "danger",
      failed: "danger",
      refunded: "info",
    };
    return statusClasses[status] || "default";
  };

  const sendWelcomeEmail = async () => {
    try {
      setSendingEmail(true);

      const tenantEmail = tenant.contactEmail || tenant.contact_email;
     

      // Make API call to send welcome email
      await axios.post(`${API_URL}/tenants/tenants/send-welcome-email`, {
        contact_email: tenantEmail
      });

      alert(`Welcome email sent successfully to ${tenantEmail}`);
    } catch (err) {
      console.error("Error sending welcome email:", err);
      alert("Failed to send welcome email. Please try again.");
    } finally {
      setSendingEmail(false);
    }
  };

  const handleExportPayments = (format) => {
    if (payments.length === 0) return;

    const tenantName = tenant.companyName || tenant.company_name || "Unknown";
    const exportData = payments.map(payment => ({
      invoice_id: payment.invoice_id,
      amount: payment.amount,
      status: payment.status,
      payment_method: payment.payment_method || "N/A",
      payment_date: payment.date || "",
      due_date: payment.due_date || "",
      description: payment.description || ""
    }));

    if (format === "csv") {
      const headers = ["Invoice ID", "Amount", "Status", "Payment Method", "Payment Date", "Due Date", "Description"];
      const csvContent = [
        headers.join(","),
        ...exportData.map(payment => [
          payment.invoice_id,
          payment.amount,
          payment.status,
          payment.payment_method,
          payment.payment_date,
          payment.due_date,
          payment.description
        ].join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${tenantName}_payments.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    }

    if (format === "pdf") {
      // Simple alert for PDF - can be enhanced with jsPDF later
      alert("PDF export functionality can be added with jsPDF library");
    }
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
            {/* <p className="page-subtitle">Manage users and documents for this tenant</p> */}
          </div>
          <div className="page-header-actions">
            <button
              className="btn btn-primary"
              onClick={sendWelcomeEmail}
              disabled={sendingEmail}
            >
              <FiSend className="btn-icon" />
              {sendingEmail ? "Sending..." : "Send Welcome Email"}
            </button>
            {getStatusBadge(tenant.status)}
          </div>
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
            onClick={() => setActiveTab("payments")}
          >
            <FiDollarSign className="tab-icon" />
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
          {activeTab === "payments" && (
            <div className="payments-section">
              <div className="payments-header">
                <h3 className="section-title">Payment History</h3>
                <div className="payments-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleExportPayments("csv")}
                    disabled={payments.length === 0}
                  >
                    <FiDownload className="btn-icon" />
                    Export CSV
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleExportPayments("pdf")}
                    disabled={payments.length === 0}
                  >
                    <FiDownload className="btn-icon" />
                    Export PDF
                  </button>
                </div>
              </div>

              {loadingPayments ? (
                <div className="loading-state">Loading payments...</div>
              ) : payments.length === 0 ? (
                <div className="no-data-state">
                  <FiDollarSign className="no-data-icon" />
                  <h4>No Payment History</h4>
                  <p>This tenant has no payment records yet.</p>
                </div>
              ) : (
                <div className="payments-table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Invoice ID</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Payment Method</th>
                        <th>Payment Date</th>
                        <th>Due Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment) => (
                        <tr key={payment.id}>
                          <td>
                            <code className="invoice-code">{payment.invoice_id}</code>
                          </td>
                          <td>
                            <span className="amount">KES {payment.amount.toLocaleString()}</span>
                          </td>
                          <td>
                            <span className={`status-badge status-${getPaymentStatusClass(payment.status)}`}>
                              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                            </span>
                          </td>
                          <td>
                            {payment.payment_method
                              ? payment.payment_method.replace("_", " ").toUpperCase()
                              : "—"}
                          </td>
                          <td>{payment.date ? formatDate(payment.date) : "—"}</td>
                          <td>
                            <span className={payment.status === "overdue" ? "overdue-date" : ""}>
                              {formatDate(payment.due_date)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Payment Summary */}
                  <div className="payments-summary">
                    <div className="summary-item">
                      <span className="summary-label">Total Payments:</span>
                      <span className="summary-value">{payments.length}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Total Amount:</span>
                      <span className="summary-value">
                        KES {payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Paid Amount:</span>
                      <span className="summary-value">
                        KES {payments.filter(p => p.status === "paid").reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Outstanding:</span>
                      <span className="summary-value">
                        KES {payments.filter(p => p.status !== "paid").reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default TenantDetails;
