import React, { useState } from "react";
import { FiSearch, FiDownload, FiEye } from "react-icons/fi";
import "../../styles/SuperAdmin.css";

const PaymentTable = ({ payments, onViewDetails, statusFilter }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");

  // Only filter by search term since status filtering is handled by parent
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.tenantEmail.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const sortedPayments = [...filteredPayments].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (sortField === "date" || sortField === "dueDate") {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
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

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
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

  const getPaymentMethodIcon = (method) => {
    const methods = {
      credit_card: "💳",
      bank_transfer: "🏦",
      paypal: "🅿️",
      stripe: "💳",
      wire_transfer: "🏛️",
    };

    return methods[method] || "💳";
  };

  return (
    <div className="payment-table-container">
      <div className="table-controls">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search payments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <button className="btn btn-secondary">
          <FiDownload /> Export
        </button>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th className="sortable" onClick={() => handleSort("invoiceId")}>
                Invoice ID
                {sortField === "invoiceId" && (
                  <span className="sort-indicator">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>
              <th className="sortable" onClick={() => handleSort("tenantName")}>
                Tenant
                {sortField === "tenantName" && (
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
              <th className="sortable" onClick={() => handleSort("date")}>
                Payment Date
                {sortField === "date" && (
                  <span className="sort-indicator">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>
              <th className="sortable" onClick={() => handleSort("dueDate")}>
                Due Date
                {sortField === "dueDate" && (
                  <span className="sort-indicator">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedPayments.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">
                  {searchTerm || statusFilter !== "all"
                    ? "No payments found matching your criteria."
                    : "No payments available."}
                </td>
              </tr>
            ) : (
              sortedPayments.map((payment) => (
                <tr key={payment.id}>
                  <td>
                    <code className="invoice-code">{payment.invoiceId}</code>
                  </td>
                  <td>
                    <div className="tenant-cell">
                      <div className="tenant-name">{payment.tenantName}</div>
                      <div className="tenant-email">{payment.tenantEmail}</div>
                    </div>
                  </td>
                  <td>
                    <span className="amount">
                      {formatCurrency(payment.amount)}
                    </span>
                  </td>
                  <td>{getStatusBadge(payment.status)}</td>
                  <td>
                    <div className="payment-method">
                      <span className="method-icon">
                        {getPaymentMethodIcon(payment.paymentMethod)}
                      </span>
                      <span className="method-text">
                        {payment.paymentMethod.replace("_", " ").toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td>{payment.date ? formatDate(payment.date) : "-"}</td>
                  <td>
                    <span
                      className={
                        payment.status === "overdue" ? "overdue-date" : ""
                      }
                    >
                      {formatDate(payment.dueDate)}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn view-btn"
                        onClick={() => onViewDetails && onViewDetails(payment)}
                        title="View details"
                      >
                        <FiEye />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="table-summary">
        <div className="summary-item">
          <span className="summary-label">Total Payments:</span>
          <span className="summary-value">{sortedPayments.length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Total Amount:</span>
          <span className="summary-value">
            {formatCurrency(
              sortedPayments.reduce((sum, payment) => sum + payment.amount, 0),
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PaymentTable;
