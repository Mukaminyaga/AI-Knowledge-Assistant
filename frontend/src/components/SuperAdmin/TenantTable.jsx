import React, { useState } from "react";
import { FiEdit, FiTrash2, FiEye, FiSearch } from "react-icons/fi";
import "../../styles/SuperAdmin.css";

const TenantTable = ({
  tenants,
  onEdit,
  onDelete,
  onView,
  showActions = true,
  limit = null,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");

  const filteredTenants = tenants.filter(
    (tenant) =>
      tenant.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.contactEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.slugUrl.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const sortedTenants = [...filteredTenants].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (sortField === "createdAt") {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    }

    if (sortField === "monthlyFee") {
      aVal = parseFloat(aVal);
      bVal = parseFloat(bVal);
    }

    if (sortDirection === "asc") {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const displayTenants = limit ? sortedTenants.slice(0, limit) : sortedTenants;

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

  const getStatusBadge = (status) => {
    const statusColors = {
      active: "success",
      inactive: "warning",
      suspended: "danger",
    };

    return (
      <span
        className={`status-badge status-${statusColors[status] || "default"}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="tenant-table-container">
      {!limit && (
        <div className="table-controls">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search tenants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      )}

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th
                className="sortable"
                onClick={() => handleSort("companyName")}
              >
                Company
                {sortField === "companyName" && (
                  <span className="sort-indicator">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>
              <th
                className="sortable"
                onClick={() => handleSort("contactEmail")}
              >
                Contact Email
                {sortField === "contactEmail" && (
                  <span className="sort-indicator">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>
              <th>Slug URL</th>
              <th>Plan</th>
              <th className="sortable" onClick={() => handleSort("monthlyFee")}>
                Monthly Fee
                {sortField === "monthlyFee" && (
                  <span className="sort-indicator">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>
              <th>Max Users</th>
              <th>Status</th>
              <th className="sortable" onClick={() => handleSort("createdAt")}>
                Created
                {sortField === "createdAt" && (
                  <span className="sort-indicator">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>
              {showActions && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {displayTenants.length === 0 ? (
              <tr>
                <td colSpan={showActions ? 9 : 8} className="no-data">
                  {searchTerm
                    ? "No tenants found matching your search."
                    : "No tenants available."}
                </td>
              </tr>
            ) : (
              displayTenants.map((tenant) => (
                <tr key={tenant.id}>
                  <td>
                    <div className="company-cell">
                      <div className="company-name">{tenant.companyName}</div>
                      <div className="company-phone">{tenant.contactPhone}</div>
                    </div>
                  </td>
                  <td>{tenant.contactEmail}</td>
                  <td>
                    <code className="slug-code">{tenant.slugUrl}</code>
                  </td>
                  <td>
                    <span className="plan-badge">{tenant.plan}</span>
                  </td>
                  <td>
                    <span className="fee-amount">${tenant.monthlyFee}</span>
                  </td>
                  <td>{tenant.maxUsers}</td>
                  <td>{getStatusBadge(tenant.status)}</td>
                  <td>{formatDate(tenant.createdAt)}</td>
                  {showActions && (
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn view-btn"
                          onClick={() => onView && onView(tenant)}
                          title="View details"
                        >
                          <FiEye />
                        </button>
                        <button
                          className="action-btn edit-btn"
                          onClick={() => onEdit && onEdit(tenant)}
                          title="Edit tenant"
                        >
                          <FiEdit />
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => onDelete && onDelete(tenant)}
                          title="Delete tenant"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {limit && sortedTenants.length > limit && (
        <div className="table-footer">
          <p className="showing-count">
            Showing {limit} of {sortedTenants.length} tenants
          </p>
        </div>
      )}
    </div>
  );
};

export default TenantTable;
