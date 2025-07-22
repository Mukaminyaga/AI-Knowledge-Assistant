import React, { useState, useEffect } from "react";
import { FiX, FiAlertTriangle, FiDollarSign, FiCalendar, FiMail, FiUser } from "react-icons/fi";
import "../../styles/SuperAdmin.css";

const OverdueTenantsModal = ({ isOpen, onClose, allPayments }) => {
  const [overdueData, setOverdueData] = useState([]);
  const [sortField, setSortField] = useState("totalOverdue");
  const [sortDirection, setSortDirection] = useState("desc");

  useEffect(() => {
    if (isOpen && allPayments) {
      // Filter overdue payments
      const overduePayments = allPayments.filter(payment => payment.status === "overdue");
      
      // Group by tenant and calculate totals
      const tenantMap = {};
      
      overduePayments.forEach(payment => {
        const tenantKey = payment.tenant_name || payment.tenant_email || "Unknown Tenant";
        const tenantEmail = payment.tenant_email || "";
        
        if (!tenantMap[tenantKey]) {
          tenantMap[tenantKey] = {
            tenantName: tenantKey,
            tenantEmail: tenantEmail,
            overduePayments: [],
            totalOverdue: 0,
            oldestOverdue: null
          };
        }
        
        tenantMap[tenantKey].overduePayments.push(payment);
        tenantMap[tenantKey].totalOverdue += payment.amount || 0;
        
        // Track oldest overdue payment
        const dueDate = new Date(payment.due_date);
        if (!tenantMap[tenantKey].oldestOverdue || dueDate < new Date(tenantMap[tenantKey].oldestOverdue)) {
          tenantMap[tenantKey].oldestOverdue = payment.due_date;
        }
      });
      
      // Convert to array and sort
      const overdueArray = Object.values(tenantMap);
      
      // Sort the data
      const sorted = [...overdueArray].sort((a, b) => {
        let aVal = a[sortField];
        let bVal = b[sortField];

        if (sortField === "oldestOverdue") {
          aVal = new Date(aVal);
          bVal = new Date(bVal);
        }

        if (sortField === "totalOverdue") {
          aVal = parseFloat(aVal);
          bVal = parseFloat(bVal);
        }

        if (sortDirection === "asc") {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
      
      setOverdueData(sorted);
    }
  }, [isOpen, allPayments, sortField, sortDirection]);

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

  const getDaysOverdue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Calculate summary statistics
  const totalTenants = overdueData.length;
  const totalOverdueAmount = overdueData.reduce((sum, tenant) => sum + tenant.totalOverdue, 0);
  const totalOverduePayments = overdueData.reduce((sum, tenant) => sum + tenant.overduePayments.length, 0);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container overdue-tenants-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-content">
            <h2 className="modal-title">
              <FiAlertTriangle className="modal-title-icon error-icon" />
              Tenants with Overdue Payments
            </h2>
            <div className="modal-subtitle">
              Review and follow up on outstanding payments
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="modal-body">
          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="summary-card error">
              <div className="summary-icon">
                <FiUser />
              </div>
              <div className="summary-content">
                <div className="summary-value">{totalTenants}</div>
                <div className="summary-label">Tenants with Overdue</div>
              </div>
            </div>
            <div className="summary-card error">
              <div className="summary-icon">
                <FiDollarSign />
              </div>
              <div className="summary-content">
                <div className="summary-value">{formatCurrency(totalOverdueAmount)}</div>
                <div className="summary-label">Total Overdue Amount</div>
              </div>
            </div>
            <div className="summary-card error">
              <div className="summary-icon">
                <FiCalendar />
              </div>
              <div className="summary-content">
                <div className="summary-value">{totalOverduePayments}</div>
                <div className="summary-label">Overdue Payments</div>
              </div>
            </div>
          </div>

          {/* Tenants Table */}
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="sortable" onClick={() => handleSort("tenantName")}>
                    Tenant
                    {sortField === "tenantName" && (
                      <span className="sort-indicator">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                  <th>Contact</th>
                  <th className="sortable" onClick={() => handleSort("totalOverdue")}>
                    Total Overdue
                    {sortField === "totalOverdue" && (
                      <span className="sort-indicator">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                  <th>Overdue Count</th>
                  <th className="sortable" onClick={() => handleSort("oldestOverdue")}>
                    Oldest Overdue
                    {sortField === "oldestOverdue" && (
                      <span className="sort-indicator">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                  <th>Days Overdue</th>
                </tr>
              </thead>
              <tbody>
                {overdueData.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="no-data">
                      No tenants with overdue payments found.
                    </td>
                  </tr>
                ) : (
                  overdueData.map((tenant, index) => (
                    <tr key={`${tenant.tenantName}-${index}`}>
                      <td>
                        <div className="tenant-cell">
                          <div className="tenant-name">{tenant.tenantName}</div>
                        </div>
                      </td>
                      <td>
                        <div className="contact-cell">
                          {tenant.tenantEmail && (
                            <div className="contact-email">
                              <FiMail className="contact-icon" />
                              {tenant.tenantEmail}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="amount overdue-amount">
                          {formatCurrency(tenant.totalOverdue)}
                        </span>
                      </td>
                      <td>
                        <span className="count-badge">
                          {tenant.overduePayments.length}
                        </span>
                      </td>
                      <td>
                        <span className="overdue-date">
                          {formatDate(tenant.oldestOverdue)}
                        </span>
                      </td>
                      <td>
                        <span className="days-overdue">
                          {getDaysOverdue(tenant.oldestOverdue)} days
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {overdueData.length > 0 && (
            <div className="modal-footer">
              <div className="footer-note">
                <FiAlertTriangle className="footer-icon" />
                Contact these tenants to resolve outstanding payments and maintain healthy cash flow.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverdueTenantsModal;
