import React, { useState } from "react";
import {
  FiEdit,
  FiEye,
  FiSearch,
  FiMoreVertical,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { MdPauseCircle, MdCancel } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "../../styles/SuperAdmin.css";

// ...imports remain unchanged

const TenantTable = ({
  tenants,
  onEdit,
  onDelete,
  onView,
  onStatusChange,
  showActions = true,
  limit = null,
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("status");
  const [sortDirection, setSortDirection] = useState("asc");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredTenants = tenants.filter((tenant) => {
    const companyName = tenant?.companyName || tenant?.company_name || "";
    const contactEmail = tenant?.contactEmail || tenant?.contact_email || "";
    const slugUrl = tenant?.slugUrl || tenant?.slug_url || "";

    return (
      companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contactEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slugUrl.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const sortedTenants = [...filteredTenants].sort((a, b) => {
    // Priority sorting by status: active > inactive > suspended
    if (sortField === "status") {
      const statusOrder = { active: 1, inactive: 2, suspended: 3 };
      const aStatus = statusOrder[a.status] || 4;
      const bStatus = statusOrder[b.status] || 4;

      const statusSort = sortDirection === "asc"
        ? aStatus - bStatus
        : bStatus - aStatus;

      // If status is the same, sort by created_at (latest first)
      if (statusSort === 0) {
        const aDate = new Date(a.created_at);
        const bDate = new Date(b.created_at);
        return bDate - aDate; // descending order (latest first)
      }

      return statusSort;
    }

    // For non-status sorting, first sort by creation date (latest first), then by selected field
    const aDate = new Date(a.created_at);
    const bDate = new Date(b.created_at);
    const dateSort = bDate - aDate; // latest first

    // If creation dates are the same, then sort by the selected field
    if (dateSort === 0) {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === "createdAt" || sortField === "created_at") {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }

      if (sortField === "monthlyFee" || sortField === "monthly_fee") {
        aVal = parseFloat(aVal);
        bVal = parseFloat(bVal);
      }

      return sortDirection === "asc"
        ? aVal > bVal
          ? 1
          : -1
        : aVal < bVal
          ? 1
          : -1;
    }

    return dateSort;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedTenants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const displayTenants = limit
    ? sortedTenants.slice(0, limit)
    : sortedTenants.slice(startIndex, endIndex);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection(field === "status" ? "asc" : "desc");
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
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
      <span
        className={`status-badge status-${statusColors[status] || "default"}`}
      >
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  const handleStatusChange = async (tenant, newStatus) => {
    if (tenant.status === newStatus) {
      toast.info(`Tenant is already ${newStatus}`);
      return;
    }

    try {
      setUpdatingStatus(tenant.id);
      setActiveDropdown(null);

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/tenants/tenants/${tenant.id}`,
        {
          ...tenant,
          status: newStatus,
        },
      );

      toast.success(`Tenant status updated to ${newStatus}`, {
        position: "top-right",
        autoClose: 2000,
      });

      // Call the parent component's onStatusChange callback if provided
      if (onStatusChange) {
        onStatusChange(tenant.id, newStatus);
      }
    } catch (error) {
      console.error("Error updating tenant status:", error);
      toast.error("Failed to update tenant status", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const toggleDropdown = (tenantId) => {
    setActiveDropdown(activeDropdown === tenantId ? null : tenantId);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };

    if (activeDropdown) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [activeDropdown]);

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
              onChange={handleSearchChange}
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
                Company{" "}
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
                Contact Email{" "}
                {sortField === "contactEmail" && (
                  <span className="sort-indicator">
                    {sortDirection === "asc" ? "��" : "↓"}
                  </span>
                )}
              </th>
              <th>Slug URL</th>
              <th>Serial Code</th>
              <th className="sortable" onClick={() => handleSort("country")}>
                Country{" "}
                {sortField === "country" && (
                  <span className="sort-indicator">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>
              <th className="sortable" onClick={() => handleSort("plan")}>
                Plan{" "}
                {sortField === "plan" && (
                  <span className="sort-indicator">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>
              <th className="sortable" onClick={() => handleSort("monthlyFee")}>
                Monthly Fee{" "}
                {sortField === "monthlyFee" && (
                  <span className="sort-indicator">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>
              <th>Max Users</th>
              <th className="sortable" onClick={() => handleSort("created_at")}>
                Created{" "}
                {sortField === "created_at" && (
                  <span className="sort-indicator">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>
              <th>Status</th>
              {showActions && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {displayTenants.length === 0 ? (
              <tr>
                <td colSpan={showActions ? 11 : 10} className="no-data">
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
                      <div className="company-name">
                        {tenant.companyName || tenant.company_name}
                      </div>
                      <div className="company-phone">
                        {tenant.contactPhone || tenant.contact_phone}
                      </div>
                    </div>
                  </td>
                  <td>{tenant.contactEmail || tenant.contact_email}</td>
                  <td>
                    <code className="slug-code">
                      {tenant.slugUrl || tenant.slug_url}
                    </code>
                  </td>
                  <td>
                    <code className="serial-code">
                      {tenant.serial_code || "—"}
                    </code>
                  </td>
                  <td>{tenant.country || "—"}</td>
                  <td>
                    <span className="plan-badge">{tenant.plan || "—"}</span>
                  </td>
                  <td>{tenant.monthlyFee ?? tenant.monthly_fee}</td>
                  <td>{tenant.maxUsers ?? tenant.max_users}</td>
                  <td>{formatDate(tenant.created_at)}</td>
                  <td>{getStatusBadge(tenant.status)}</td>
                  {showActions && (
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn view-btn"
                          onClick={() =>
                            navigate(`/super-admin/tenant-details/${tenant.id}`)
                          }
                          title="View tenant details"
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
                        <div className="status-action-dropdown">
                          <button
                            className="action-btn status-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDropdown(tenant.id);
                            }}
                            title="Change status"
                            disabled={updatingStatus === tenant.id}
                          >
                            {updatingStatus === tenant.id ? (
                              <div className="loading-spinner"></div>
                            ) : (
                              <FiMoreVertical />
                            )}
                          </button>
                          {activeDropdown === tenant.id && (
                            <div className="status-dropdown-menu">
                              {tenant.status !== "active" && (
                                <button
                                  className="status-dropdown-item active-item"
                                  onClick={() =>
                                    handleStatusChange(tenant, "active")
                                  }
                                >
                                  <span className="status-icon active">●</span>
                                  Activate
                                </button>
                              )}
                              {tenant.status !== "inactive" && (
                                <button
                                  className="status-dropdown-item inactive-item"
                                  onClick={() =>
                                    handleStatusChange(tenant, "inactive")
                                  }
                                >
                                  <MdPauseCircle className="status-icon" />
                                  Make Inactive
                                </button>
                              )}
                              {tenant.status !== "suspended" && (
                                <button
                                  className="status-dropdown-item suspended-item"
                                  onClick={() =>
                                    handleStatusChange(tenant, "suspended")
                                  }
                                >
                                  <MdCancel className="status-icon" />
                                  Suspend
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {!limit && totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination-info">
            <span>
              Showing {startIndex + 1}-{Math.min(endIndex, sortedTenants.length)} of {sortedTenants.length} tenants
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
