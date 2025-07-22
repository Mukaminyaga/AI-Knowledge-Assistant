import React, { useState } from "react";
import { FiSearch, FiDownload, FiEye, FiClock, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "../../styles/SuperAdmin.css";



const PaymentTable = ({ payments, onViewDetails, onViewHistory, statusFilter }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Only filter by search term since status filtering is handled by parent
const filteredPayments = payments.filter((payment) => {
  const matchesSearch =
    (payment.tenant_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (payment.invoice_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (payment.tenant_email || '').toLowerCase().includes(searchTerm.toLowerCase());

  return matchesSearch;
});

  // Priority sorting: paid -> pending -> overdue -> failed
  const statusPriority = {
    'paid': 1,
    'pending': 2,
    'overdue': 3,
    'failed': 4
  };

  const sortedPayments = [...filteredPayments].sort((a, b) => {
    // First sort by status priority
    const statusA = statusPriority[a.status] || 5;
    const statusB = statusPriority[b.status] || 5;

    if (statusA !== statusB) {
      return statusA - statusB;
    }

    // Then sort by selected field
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (sortField === "date" || sortField === "due_date") {
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

  // Pagination
  const totalPages = Math.ceil(sortedPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPayments = sortedPayments.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    setCurrentPage(Math.max(1, currentPage - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(Math.min(totalPages, currentPage + 1));
  };

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
      currency: "KES",
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
              <th className="sortable" onClick={() => handleSort("invoice_id")}>
                Invoice ID
                {sortField === "invoice_id" && (
                  <span className="sort-indicator">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>
              <th className="sortable" onClick={() => handleSort("tenant_name")}>
                Tenant
                {sortField === "tenant_name" && (
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
              <th className="sortable" onClick={() => handleSort("due_date")}>
                Due Date
                {sortField === "due_date" && (
                  <span className="sort-indicator">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPayments.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">
                  {searchTerm || statusFilter !== "all"
                    ? "No payments found matching your criteria."
                    : "No payments available."}
                </td>
              </tr>
            ) : (
              paginatedPayments.map((payment) => (
                <tr key={payment.id}>
                  <td>
                    <code className="invoice-code">{payment.invoice_id}</code>
                  </td>
                  <td>
                    <div className="tenant-cell">
                      <div className="tenant-name">{payment.tenant_name}</div>
                      <div className="tenant-email">{payment.tenant_email}</div>

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
                        {getPaymentMethodIcon(payment.payment_method)}
                      </span>
                      <span className="method-text">
                       <td>
  {payment.payment_method
    ? payment.payment_method.replace("_", " ").toUpperCase()
    : 'N/A'}
</td>


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
                      {formatDate(payment.due_date)}
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
                     <button
  className="action-btn history-btn"
  onClick={() => onViewHistory && onViewHistory(payment.tenant_name, payment.tenant_email)}
  title="View payment history"
>
  <FiClock />
</button>

                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination-info">
            <span>
              Showing {startIndex + 1}-{Math.min(endIndex, sortedPayments.length)} of {sortedPayments.length} payments
            </span>
          </div>
          <div className="pagination-controls">
            <button
              className="pagination-btn"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              <FiChevronLeft />
              Previous
            </button>

            <div className="pagination-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Show first, last, current, and pages around current
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return <span key={page} className="pagination-ellipsis">...</span>;
                }
                return null;
              })}
            </div>

            <button
              className="pagination-btn"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
              <FiChevronRight />
            </button>
          </div>
        </div>
      )}

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
