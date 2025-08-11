import React, { useState, useEffect } from "react";
import SuperAdminLayout from "../../components/SuperAdmin/SuperAdminLayout";
import PaymentTable from "../../components/SuperAdmin/PaymentTable";
import PaymentHistoryModal from "../../components/SuperAdmin/PaymentHistoryModal";
import OverdueTenantsModal from "../../components/SuperAdmin/OverdueTenantsModal";
import {
  FiDownload,
  FiRefreshCw,
  FiDollarSign,
  FiTrendingUp,
  FiAlertTriangle,
  FiCreditCard,
} from "react-icons/fi";
import "../../styles/SuperAdmin.css";
import axios from "axios";
import ThemeToggle from "../../components/ThemeToggle";

const API_URL = process.env.REACT_APP_API_URL;

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [dateFilter, setDateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [paymentHistoryModal, setPaymentHistoryModal] = useState({
    isOpen: false,
    tenantName: "",
    tenantEmail: ""
  });
  const [overdueTenantsModal, setOverdueTenantsModal] = useState(false);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/payments`);
      setPayments(res.data);
    } catch (err) {
      console.error("Error fetching payments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleViewPaymentDetails = (payment) => {
    setSelectedPayment(payment);
  };

  const handleViewPaymentHistory = (tenantName, tenantEmail) => {
    setPaymentHistoryModal({
      isOpen: true,
      tenantName: tenantName,
      tenantEmail: tenantEmail
    });
  };

  const handlePaymentUpdated = (updatedPayment) => {
    // Update the payment in the local state
    setPayments(prevPayments =>
      prevPayments.map(payment =>
        payment.id === updatedPayment.id ? updatedPayment : payment
      )
    );

    // Optionally fetch fresh data from server
    // fetchPayments();
  };

  const handleClosePaymentHistory = () => {
    setPaymentHistoryModal({
      isOpen: false,
      tenantName: "",
      tenantEmail: ""
    });
  };

  const handleExport = async (format = "csv") => {
    try {
      const res = await axios.get(`${API_URL}/payments/export/${format}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `payments_export.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Export error:", err);
    }
  };

  const handleRefresh = () => {
    fetchPayments();
  };

  const filteredPayments = payments.filter((payment) => {
    const statusMatch =
      statusFilter === "all" || payment.status === statusFilter;

    let dateMatch = true;
    if (dateFilter !== "all") {
      const paymentDate = payment.payment_date
        ? new Date(payment.payment_date)
        : new Date(payment.due_date);
      const now = new Date();

      switch (dateFilter) {
        case "this_month":
          dateMatch =
            paymentDate.getMonth() === now.getMonth() &&
            paymentDate.getFullYear() === now.getFullYear();
          break;
        case "last_month":
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          dateMatch =
            paymentDate.getMonth() === lastMonth.getMonth() &&
            paymentDate.getFullYear() === lastMonth.getFullYear();
          break;
        case "this_quarter":
          const quarterStart = new Date(
            now.getFullYear(),
            Math.floor(now.getMonth() / 3) * 3,
            1
          );
          dateMatch = paymentDate >= quarterStart;
          break;
        case "this_year":
          dateMatch = paymentDate.getFullYear() === now.getFullYear();
          break;
        default:
          dateMatch = true;
      }
    }

    return statusMatch && dateMatch;
  });

  const totalPayments = filteredPayments.length;
  const paidPayments = filteredPayments.filter((p) => p.status === "paid").length;
  const pendingPayments = filteredPayments.filter((p) => p.status === "pending").length;
  const overduePayments = filteredPayments.filter((p) => p.status === "overdue").length;
  const failedPayments = filteredPayments.filter((p) => p.status === "failed").length;

  const totalRevenue = filteredPayments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const thisMonthRevenue = filteredPayments
    .filter((p) => {
      if (!p.payment_date || p.status !== "paid") return false;
      const paymentDate = new Date(p.payment_date);
      return (
        paymentDate.getMonth() === currentMonth &&
        paymentDate.getFullYear() === currentYear
      );
    })
    .reduce((sum, p) => sum + p.amount, 0);

  const statusDistribution = [
    { status: "Paid", count: paidPayments, color: "#10b981" },
    { status: "Pending", count: pendingPayments, color: "#f59e0b" },
    { status: "Overdue", count: overduePayments, color: "#ef4444" },
    { status: "Failed", count: failedPayments, color: "#6b7280" },
  ];

  const monthlyTrend = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    const monthPayments = payments.filter((p) => {
      if (!p.payment_date || p.status !== "paid") return false;
      const paymentDate = new Date(p.payment_date);
      return (
        paymentDate.getMonth() === date.getMonth() &&
        paymentDate.getFullYear() === date.getFullYear()
      );
    });

    return {
      month: date.toLocaleDateString("en-US", { month: "short" }),
      revenue: monthPayments.reduce((sum, p) => sum + p.amount, 0),
      count: monthPayments.length,
    };
  });

  return (
    <SuperAdminLayout activePage="payments">
      <div className="payments-page">
        {/* Header */}
        <div className="page-header">
          <div className="page-header-content">
            <h1 className="page-title">Payment Management</h1>
            <p className="page-subtitle">Track and manage all tenant payments and billing history</p>
          </div>
          <div className="page-header-actions">
          <ThemeToggle className="dashboard-theme-toggle" />

            <button className="btn btn-secondary" onClick={handleRefresh}>
              <FiRefreshCw className="btn-icon" /> Refresh
            </button>
            <button className="btn btn-secondary" onClick={() => handleExport("csv")}>
              <FiDownload className="btn-icon" /> Export CSV
            </button>
            <button className="btn btn-secondary" onClick={() => handleExport("pdf")}>
              <FiDownload className="btn-icon" /> Export PDF
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="filter-buttons">
          {[
            ["all", "All Time"],
            ["this_month", "This Month"],
            ["this_quarter", "This Quarter"],
            ["this_year", "This Year"],
          ].map(([value, label]) => (
            <button
              key={value}
              className={`filter-btn ${dateFilter === value ? "active" : ""}`}
              onClick={() => setDateFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Metrics */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon"><FiDollarSign /></div>
            <div className="metric-content">
              <div className="metric-value">KES {totalRevenue.toLocaleString()}</div>
              <div className="metric-label">Total Revenue</div>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon"><FiTrendingUp /></div>
            <div className="metric-content">
              <div className="metric-value">KES {thisMonthRevenue.toLocaleString()}</div>
              <div className="metric-label">This Month Revenue</div>
            </div>
          </div>
          <div
            className="metric-card error clickable"
            onClick={() => setOverdueTenantsModal(true)}
            style={{ cursor: 'pointer' }}
          >
            <div className="metric-icon"><FiAlertTriangle /></div>
            <div className="metric-content">
              <div className="metric-value">{overduePayments}</div>
              <div className="metric-label">Overdue Payments</div>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon"><FiCreditCard /></div>
            <div className="metric-content">
              <div className="metric-value">{paidPayments}</div>
              <div className="metric-label">Successful Payments</div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="charts-section">
          {/* Revenue Trend */}
          <div className="chart-card">
            <h3 className="chart-title">Revenue Trend (Last 6 Months)</h3>
            <div className="chart-content revenue-trend-chart">
              {monthlyTrend.map((month, i) => (
                <div key={i} className="trend-bar-container">
                  <div className="trend-bar-label">{month.month}</div>
                  <div className="trend-bar-wrapper">
                    <div
                      className="trend-bar"
                      style={{
                        height: `${
                          Math.max(
                            (month.revenue /
                              Math.max(...monthlyTrend.map((m) => m.revenue || 1))) *
                              100,
                            5
                          )
                        }%`,
                      }}
                    />
                  </div>
                  <div className="trend-bar-value">KES {month.revenue.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Distribution */}
          <div className="chart-card">
            <h3 className="chart-title">Payment Status Distribution</h3>
            <div className="chart-content status-chart">
              {statusDistribution.map((item, i) => (
                <div key={i} className="status-item">
                  <div className="status-info">
                    <div
                      className="status-color"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="status-name">{item.status}</span>
                  </div>
                  <div className="status-count">{item.count}</div>
                  <div className="status-percentage">
                    {totalPayments > 0 ? Math.round((item.count / totalPayments) * 100) : 0}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="advanced-filters">
          <div className="filter-group">
            <label className="filter-label">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <div className="filter-results">
            Showing {filteredPayments.length} of {payments.length} payments
          </div>
        </div>

        {/* Table */}
        <div className="payments-table-section">
          <PaymentTable
            payments={filteredPayments}
            onViewDetails={handleViewPaymentDetails}
            onViewHistory={handleViewPaymentHistory}
            onPaymentUpdated={handlePaymentUpdated}
            statusFilter={statusFilter}
          />
        </div>

        {/* Payment Details Modal */}
        {selectedPayment && (
          <div className="modal-overlay" onClick={() => setSelectedPayment(null)}>
            <div
              className="modal-container payment-details-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2 className="modal-title">Payment Details</h2>
                <button className="modal-close" onClick={() => setSelectedPayment(null)}>
                  ×
                </button>
              </div>
              <div className="payment-details">
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Invoice ID</label>
                    <span>{selectedPayment.invoice_id}</span>
                  </div>
                  <div className="detail-item">
                    <label>Tenant</label>
                    <span>{selectedPayment.tenantName || selectedPayment.tenant?.full_name}</span>
                  </div>
                  <div className="detail-item">
                    <label>Amount</label>
                    <span>KES {selectedPayment.amount.toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <label>Status</label>
                    <span className={`status-badge status-${selectedPayment.status}`}>
                      {selectedPayment.status}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Payment Method</label>
                    <span>{selectedPayment.payment_method?.replace("_", " ").toUpperCase()}</span>
                  </div>
                  <div className="detail-item">
                    <label>Due Date</label>
                    <span>{new Date(selectedPayment.due_date).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-item">
                    <label>Payment Date</label>
                    <span>
                      {selectedPayment.payment_date
                        ? new Date(selectedPayment.payment_date).toLocaleDateString()
                        : "Not Paid"}
                    </span>
                  </div>
                  <div className="detail-item detail-full">
                    <label>Description</label>
                    <span>{selectedPayment.description || "—"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment History Modal */}
        <PaymentHistoryModal
          isOpen={paymentHistoryModal.isOpen}
          onClose={handleClosePaymentHistory}
          tenantName={paymentHistoryModal.tenantName}
          tenantEmail={paymentHistoryModal.tenantEmail}
          allPayments={payments}
        />

        {/* Overdue Tenants Modal */}
        <OverdueTenantsModal
          isOpen={overdueTenantsModal}
          onClose={() => setOverdueTenantsModal(false)}
          allPayments={payments}
        />
      </div>
    </SuperAdminLayout>
  );
};

export default Payments;
