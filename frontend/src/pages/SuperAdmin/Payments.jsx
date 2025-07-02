import React, { useState } from "react";
import SuperAdminLayout from "../../components/SuperAdmin/SuperAdminLayout";
import PaymentTable from "../../components/SuperAdmin/PaymentTable";
import {
  FiDownload,
  FiFilter,
  FiRefreshCw,
  FiDollarSign,
  FiTrendingUp,
  FiAlertTriangle,
  FiCreditCard,
} from "react-icons/fi";
import "../../styles/SuperAdmin.css";

// Mock data...
const mockPayments = [
  // ... your existing mock data remains unchanged
  {
    id: 1,
    invoiceId: "INV-2024-001",
    tenantId: 1,
    tenantName: "Acme Corporation",
    tenantEmail: "admin@acme.com",
    amount: 4500,
    status: "paid",
    paymentMethod: "credit_card",
    dueDate: "2024-02-15T00:00:00Z",
    date: "2024-02-14T10:30:00Z",
    description: "Enterprise Plan - February 2024",
  },
  // ... rest of the mock payments
];

const Payments = () => {
  const [payments] = useState(mockPayments);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [dateFilter, setDateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleViewPaymentDetails = (payment) => {
    setSelectedPayment(payment);
  };

  const handleExport = () => {
    console.log("Export payments data");
  };

  const handleRefresh = () => {
    console.log("Refresh payments data");
  };

  const filteredPayments = payments.filter((payment) => {
    const statusMatch =
      statusFilter === "all" || payment.status === statusFilter;

    let dateMatch = true;
    if (dateFilter !== "all") {
      const paymentDate = payment.date
        ? new Date(payment.date)
        : new Date(payment.dueDate);
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
            1,
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
  const totalRevenue = filteredPayments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);

  const paidPayments = filteredPayments.filter(
    (p) => p.status === "paid",
  ).length;
  const pendingPayments = filteredPayments.filter(
    (p) => p.status === "pending",
  ).length;
  const overduePayments = filteredPayments.filter(
    (p) => p.status === "overdue",
  ).length;
  const failedPayments = filteredPayments.filter(
    (p) => p.status === "failed",
  ).length;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthRevenue = filteredPayments
    .filter((p) => {
      if (!p.date || p.status !== "paid") return false;
      const paymentDate = new Date(p.date);
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
      if (!p.date || p.status !== "paid") return false;
      const paymentDate = new Date(p.date);
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
        {/* Page Header */}
        <div className="page-header">
          <div className="page-header-content">
            <h1 className="page-title">Payment Management</h1>
            <p className="page-subtitle">
              Track and manage all tenant payments and billing history
            </p>
          </div>
          <div className="page-header-actions">
            <button className="btn btn-secondary" onClick={handleRefresh}>
              <FiRefreshCw className="btn-icon" />
              Refresh
            </button>
            <button className="btn btn-secondary" onClick={handleExport}>
              <FiDownload className="btn-icon" />
              Export
            </button>
          </div>
        </div>

        {/* Date Filters */}
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

        {/* Payment Stats */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon">
              <FiDollarSign />
            </div>
            <div className="metric-content">
              <div className="metric-value">
                KES {totalRevenue.toLocaleString()}
              </div>
              <div className="metric-label">Total Revenue</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <FiTrendingUp />
            </div>
            <div className="metric-content">
              <div className="metric-value">
                KES {thisMonthRevenue.toLocaleString()}
              </div>
              <div className="metric-label">This Month Revenue</div>
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
              <FiCreditCard />
            </div>
            <div className="metric-content">
              <div className="metric-value">{paidPayments}</div>
              <div className="metric-label">Successful Payments</div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="charts-section">
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Revenue Trend (Last 6 Months)</h3>
            </div>
            <div className="chart-content revenue-trend-chart">
              {monthlyTrend.map((month, index) => (
                <div key={index} className="trend-bar-container">
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
                            5,
                          )
                        }%`,
                      }}
                    />
                  </div>
                  <div className="trend-bar-value">
                    KES {month.revenue.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Payment Status Distribution</h3>
            </div>
            <div className="chart-content status-chart">
              {statusDistribution.map((item, index) => (
                <div key={index} className="status-item">
                  <div className="status-info">
                    <div
                      className="status-color"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="status-name">{item.status}</span>
                  </div>
                  <div className="status-count">{item.count}</div>
                  <div className="status-percentage">
                    {totalPayments > 0
                      ? Math.round((item.count / totalPayments) * 100)
                      : 0}
                    %
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

        {/* Payment Table */}
        <div className="payments-table-section">
          <PaymentTable
            payments={filteredPayments}
            onViewDetails={handleViewPaymentDetails}
            statusFilter={statusFilter} 
          />
        </div>

        {/* Modal */}
        {selectedPayment && (
          <div
            className="modal-overlay"
            onClick={() => setSelectedPayment(null)}
          >
            <div
              className="modal-container payment-details-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2 className="modal-title">Payment Details</h2>
                <button
                  className="modal-close"
                  onClick={() => setSelectedPayment(null)}
                >
                  ×
                </button>
              </div>

              <div className="payment-details">
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Invoice ID</label>
                    <span>{selectedPayment.invoiceId}</span>
                  </div>

                  <div className="detail-item">
                    <label>Tenant</label>
                    <span>{selectedPayment.tenantName}</span>
                  </div>

                  <div className="detail-item">
                    <label>Amount</label>
                    <span>${selectedPayment.amount}</span>
                  </div>

                  <div className="detail-item">
                    <label>Status</label>
                    <span
                      className={`status-badge status-${
                        selectedPayment.status === "paid"
                          ? "success"
                          : selectedPayment.status === "pending"
                          ? "warning"
                          : "danger"
                      }`}
                    >
                      {selectedPayment.status.charAt(0).toUpperCase() +
                        selectedPayment.status.slice(1)}
                    </span>
                  </div>

                  <div className="detail-item">
                    <label>Payment Method</label>
                    <span>
                      {selectedPayment.paymentMethod
                        .replace("_", " ")
                        .toUpperCase()}
                    </span>
                  </div>

                  <div className="detail-item">
                    <label>Due Date</label>
                    <span>
                      {new Date(selectedPayment.dueDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="detail-item">
                    <label>Payment Date</label>
                    <span>
                      {selectedPayment.date
                        ? new Date(selectedPayment.date).toLocaleDateString()
                        : "Not paid"}
                    </span>
                  </div>

                  <div className="detail-item detail-full">
                    <label>Description</label>
                    <span>{selectedPayment.description}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </SuperAdminLayout>
  );
};

export default Payments;
