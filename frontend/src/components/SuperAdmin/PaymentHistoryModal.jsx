import React, { useState, useEffect } from "react";
import { FiX, FiDownload, FiCalendar, FiDollarSign } from "react-icons/fi";
import "../../styles/PaymentHistoryModal.css";

const PaymentHistoryModal = ({ isOpen, onClose, tenantName, tenantEmail, allPayments }) => {
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [sortField, setSortField] = useState("payment_date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (isOpen && tenantName && allPayments) {
      // Filter payments for this specific tenant
      const tenantPayments = allPayments.filter(
        payment => 
          payment.tenant_name === tenantName || 
          payment.tenant_email === tenantEmail
      );
      
      // Apply status filter
      const filtered = tenantPayments.filter(payment => 
        statusFilter === "all" || payment.status === statusFilter
      );
      
      // Sort payments
      const sorted = [...filtered].sort((a, b) => {
        let aVal = a[sortField];
        let bVal = b[sortField];

        if (sortField === "payment_date" || sortField === "due_date") {
          aVal = new Date(aVal || a.due_date);
          bVal = new Date(bVal || b.due_date);
        }

        if (sortField === "amount") {
          aVal = parseFloat(aVal);
          bVal = parseFloat(bVal);
        }

        if (sortDirection === "asc") {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
      
      setFilteredPayments(sorted);
    }
  }, [isOpen, tenantName, tenantEmail, allPayments, sortField, sortDirection, statusFilter]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return `KES ${amount.toLocaleString()}`;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      paid: { class: "success", label: "Paid" },
      pending: { class: "warning", label: "Pending" },
      overdue: { class: "danger", label: "Overdue" },
      failed: { class: "danger", label: "Failed" },
      refunded: { class: "info", label: "Refunded" },
    };

    const config = statusConfig[status] || { class: "default", label: status };

    return (
      <span className={`status-badge status-${config.class}`}>
        {config.label}
      </span>
    );
  };

  const handleExport = () => {
    // Create CSV content
    const headers = ["Invoice ID", "Amount", "Status", "Payment Method", "Payment Date", "Due Date"];
    const csvContent = [
      headers.join(","),
      ...filteredPayments.map(payment => [
        payment.invoice_id,
        payment.amount,
        payment.status,
        payment.payment_method?.replace("_", " ") || "N/A",
        payment.payment_date || "",
        payment.due_date || ""
      ].join(","))
    ].join("\n");

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${tenantName}_payment_history.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  // Calculate summary statistics
  const totalPayments = filteredPayments.length;
  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const paidAmount = filteredPayments
    .filter(p => p.status === "paid")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const pendingAmount = filteredPayments
    .filter(p => p.status === "pending" || p.status === "overdue")
    .reduce((sum, payment) => sum + payment.amount, 0);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="payment-history-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-content">
            <h2 className="modal-title">Payment History</h2>
            <div className="modal-subtitle">
              <div className="tenant-info">
                <strong>{tenantName}</strong>
                <span className="tenant-email">{tenantEmail}</span>
              </div>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="modal-body">
          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="summary-card">
              <div className="summary-icon">
                <FiCalendar />
              </div>
              <div className="summary-content">
                <div className="summary-value">{totalPayments}</div>
                <div className="summary-label">Total Payments</div>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon">
                <FiDollarSign />
              </div>
              <div className="summary-content">
                <div className="summary-value">{formatCurrency(totalAmount)}</div>
                <div className="summary-label">Total Amount</div>
              </div>
            </div>
            <div className="summary-card success">
              <div className="summary-icon">
                <FiDollarSign />
              </div>
              <div className="summary-content">
                <div className="summary-value">{formatCurrency(paidAmount)}</div>
                <div className="summary-label">Paid Amount</div>
              </div>
            </div>
            <div className="summary-card warning">
              <div className="summary-icon">
                <FiDollarSign />
              </div>
              <div className="summary-content">
                <div className="summary-value">{formatCurrency(pendingAmount)}</div>
                <div className="summary-label">Outstanding</div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="history-filters">
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
                <option value="refunded">Refunded</option>
              </select>
            </div>
            <div className="filter-results">
              Showing {filteredPayments.length} payment{filteredPayments.length !== 1 ? 's' : ''}
            </div>
            <button className="btn btn-secondary" onClick={handleExport}>
              <FiDownload /> Export CSV
            </button>
          </div>

          {/* Payment History Table */}
          <div className="history-table-wrapper">
            <table className="history-table">
              <thead>
                <tr>
                  <th className="sortable" onClick={() => handleSort("invoice_id")}>
                    Invoice ID
                    {sortField === "invoice_id" && (
                      <span className="sort-indicator">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                  <th className="sortable" onClick={() => handleSort("amount")}>
                    Amount
                    {sortField === "amount" && (
                      <span className="sort-indicator">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                  <th>Status</th>
                  <th>Payment Method</th>
                  <th className="sortable" onClick={() => handleSort("payment_date")}>
                    Payment Date
                    {sortField === "payment_date" && (
                      <span className="sort-indicator">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                  <th className="sortable" onClick={() => handleSort("due_date")}>
                    Due Date
                    {sortField === "due_date" && (
                      <span className="sort-indicator">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="no-data">
                      No payment history found for this tenant.
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((payment) => (
                    <tr key={payment.id || payment.invoice_id}>
                      <td>
                        <code className="invoice-code">{payment.invoice_id}</code>
                      </td>
                      <td>
                        <span className="amount">{formatCurrency(payment.amount)}</span>
                      </td>
                      <td>{getStatusBadge(payment.status)}</td>
                      <td>
                        {payment.payment_method
                          ? payment.payment_method.replace("_", " ").toUpperCase()
                          : "N/A"}
                      </td>
                      <td>{formatDate(payment.payment_date)}</td>
                      <td>
                        <span
                          className={payment.status === "overdue" ? "overdue-date" : ""}
                        >
                          {formatDate(payment.due_date)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistoryModal;
