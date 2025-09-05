import React, { useState, useEffect } from "react";
import { 
  FiUsers, 
  FiActivity, 
  FiAlertTriangle, 
  FiTrendingUp,
  FiHardDrive,
  FiClock,
  FiSearch,
  FiFilter,
  FiDownload,
  FiEye
} from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../styles/SuperAdmin.css";

const TenantMetricsTable = ({ 
  tenants = [], 
  searchTerm = "", 
  onSearchChange,
  selectedStatus = "all",
  onStatusChange,
  selectedDateRange = "7d",
  onDateRangeChange 
}) => {
  const [sortField, setSortField] = useState("lastActive");
  const [sortDirection, setSortDirection] = useState("desc");
  const [loading, setLoading] = useState(false);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };



const sortedTenants = [...tenants].sort((a, b) => {
  let aVal, bVal;

  if (sortField === "lastActive") {
    aVal = a.last_active_user?.last_active
      ? new Date(a.last_active_user.last_active)
      : null;
    bVal = b.last_active_user?.last_active
      ? new Date(b.last_active_user.last_active)
      : null;

    if (!aVal && !bVal) return 0;
    if (!aVal) return 1; // nulls go last
    if (!bVal) return -1;
    return bVal - aVal; // newest first
  } else {
    aVal = a[sortField];
    bVal = b[sortField];
    if (typeof aVal === "string") return aVal.localeCompare(bVal);
    return (bVal || 0) - (aVal || 0);
  }
});


 const formatDate = (dateString) => {
  if (!dateString) return "Never";
  const date = new Date(dateString); // safe now
  if (isNaN(date)) return "Invalid date";

  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInHours < 48) return "Yesterday";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

  

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: "success", icon: "●" },
      inactive: { color: "warning", icon: "●" },
      suspended: { color: "danger", icon: "●" },
      trial: { color: "info", icon: "●" }
    };

    const config = statusConfig[status] || { color: "default", icon: "●" };

    return (
      <span className={`status-badge status-${config.color}`}>
        <span className="status-indicator">{config.icon}</span>
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  const getActivityLevel = (activeUsers) => {
    if (activeUsers >= 20) return { level: "high", color: "#4CAF50" };
    if (activeUsers >= 10) return { level: "medium", color: "#FF9800" };
    return { level: "low", color: "#F44336" };
  };

  const getStorageUsagePercentage = (storageUsed) => {
    // Extract number from string like "2.5 GB"
    const usage = parseFloat(storageUsed);
    // Assume 5GB is 100% for demo purposes
    return Math.min((usage / 5) * 100, 100);
  };

  const exportToCSV = () => {
    const headers = [
      "Tenant Name",
      "Contact Email", 
      "Status",
      "Last Active",
      "Active Users (7d)",
      "Total Uploads",
      "Storage Used",
      "Error Count",
      "Plan",
      "Monthly Fee"
    ];

    const csvData = sortedTenants.map(tenant => [
      tenant.company_name,
      tenant.contact_email,
      tenant.status,
      formatDate(tenant.lastActive),
      tenant.activeUsers7d,
      tenant.totalUploads,
      tenant.storageUsed,
      tenant.errorCount,
      tenant.plan || "Basic",
      tenant.monthly_fee || 0
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tenant-metrics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="tenant-metrics-section">
      {/* Table Controls */}
      <div className="table-controls">
        <div className="table-header-content">
          <h2 className="section-title">Tenant Usage Metrics</h2>
          <p className="section-subtitle">
            Monitor tenant activity, performance, and system health
          </p>
        </div>
        
        <div className="table-filters">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search tenants..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-group">
            <FiFilter className="filter-icon" />
            <span className="filter-label">Status:</span>
            <select 
              value={selectedStatus} 
              onChange={(e) => onStatusChange(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
              <option value="trial">Trial</option>
            </select>
          </div>

          <div className="filter-group">
            <FiClock className="filter-icon" />
            <span className="filter-label">Period:</span>
            <select 
              value={selectedDateRange} 
              onChange={(e) => onDateRangeChange(e.target.value)}
              className="filter-select"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>

          <div className="export-group">
            <button 
              onClick={exportToCSV} 
              className="btn btn-secondary"
              title="Export to CSV"
            >
              <FiDownload className="btn-icon" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Table */}
      <div className="table-wrapper tenant-metrics-table">
        <table className="data-table">
          <thead>
            <tr>
              <th 
                className="sortable" 
                onClick={() => handleSort("company_name")}
              >
                Tenant Information
                {sortField === "company_name" && (
                  <span className="sort-indicator">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>
              <th 
                className="sortable" 
                onClick={() => handleSort("status")}
              >
                Status
                {sortField === "status" && (
                  <span className="sort-indicator">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>
              <th 
                className="sortable" 
                onClick={() => handleSort("lastActive")}
              >
                <div className="th-content">
                  <FiClock className="th-icon" />
                  Last Active
                </div>
                {sortField === "lastActive" && (
                  <span className="sort-indicator">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>
              <th 
                className="sortable" 
                onClick={() => handleSort("activeUsers7d")}
              >
                <div className="th-content">
                  <FiUsers className="th-icon" />
                  Active Users (7d)
                </div>
                {sortField === "activeUsers7d" && (
                  <span className="sort-indicator">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>
              <th 
                className="sortable" 
                onClick={() => handleSort("totalUploads")}
              >
                <div className="th-content">
                  <FiTrendingUp className="th-icon" />
                  Total Uploads
                </div>
                {sortField === "totalUploads" && (
                  <span className="sort-indicator">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>
              <th>
                <div className="th-content">
                  <FiHardDrive className="th-icon" />
                  Storage Usage
                </div>
              </th>
              <th>
                <div className="th-content">
                  <FiAlertTriangle className="th-icon" />
                  Errors (24h)
                </div>
              </th>
              <th>Plan & Revenue</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="loading-cell">
                  <div className="loading-spinner"></div>
                  Loading tenant metrics...
                </td>
              </tr>
            ) : sortedTenants.length === 0 ? (
              <tr>
                <td colSpan={9} className="no-data">
                  {searchTerm ? "No tenants found matching your search." : "No tenant data available."}
                </td>
              </tr>
            ) : (
              sortedTenants.map((tenant) => {
                const activityLevel = getActivityLevel(tenant.activeUsers7d);
                const storagePercentage = getStorageUsagePercentage(tenant.storageUsed);
                
                return (
                  <tr key={tenant.id} className="tenant-row">
                    <td>
                      <div className="tenant-info-cell">
                        <div className="tenant-avatar">
                          {tenant.company_name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="tenant-details">
                          <div className="tenant-name">{tenant.company_name}</div>
                          <div className="tenant-email">{tenant.contact_email}</div>
                          <div className="tenant-id">ID: {tenant.serial_code || tenant.id}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td>
                      <div className="status-cell">
                        {getStatusBadge(tenant.status)}
                        <div className="status-since">
                          Since {new Date(tenant.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    
                    <td>
  <div className="activity-cell">
    <div className="activity-time">
      {tenant.lastActive ? formatDate(tenant.lastActive) : "Never"}
    </div>
    <div className="activity-indicator">
      <div className={`activity-dot ${activityLevel.level}`}></div>
    </div>
    {/* {tenant.lastActiveEmail && (
      <div className="activity-user">{tenant.lastActiveEmail}</div>
    )} */}
  </div>
</td>

                    
                    <td>
                      <div className="users-cell">
                        <div className="users-count">
                          <span className="metric-highlight" style={{ color: activityLevel.color }}>
                            {tenant.activeUsers7d}
                          </span>
                          <span className="users-label">users</span>
                        </div>
                        <div className="users-trend">
                          <div 
                            className="trend-bar" 
                            style={{ 
                              width: `${Math.min(tenant.activeUsers7d * 4, 100)}%`,
                              backgroundColor: activityLevel.color 
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    
                    <td>
                      <div className="uploads-cell">
                        <span className="metric-highlight uploads-count">
                          {tenant.totalUploads}
                        </span>
                        <div className="uploads-change">
                          +{Math.floor(Math.random() * 10 + 1)} this week
                        </div>
                      </div>
                    </td>
                    
                    <td>
                      <div className="storage-cell">
                        <div className="storage-amount">{tenant.storageUsed}</div>
                        <div className="storage-bar">
                          <div 
                            className="storage-fill" 
                            style={{ width: `${storagePercentage}%` }}
                          ></div>
                        </div>
                        <div className="storage-percentage">{storagePercentage.toFixed(0)}% used</div>
                      </div>
                    </td>
                    
                     <td>
            <div className="errors-cell">
              <span className={`error-count ${tenant.login_failures_24h > 0 ? 'has-errors' : 'no-errors'}`}>
                {tenant.login_failures_24h}
              </span>
              {tenant.login_failures_24h > 0 && (
                <div className="error-details">
                  <span className="error-type">Auth failures</span>
                </div>
              )}
            </div>
          </td>
                    
                    <td>
                      <div className="plan-revenue-cell">
                        <div className="plan-info">
                          <span className="plan-badge">{tenant.plan || 'Basic'}</span>
                        </div>
                        <div className="revenue-info">
                          <span className="revenue-amount">
                            KES {(tenant.monthly_fee || 0).toLocaleString()}
                          </span>
                          <span className="revenue-period">/month</span>
                        </div>
                      </div>
                    </td>
                    
                    <td>
                      <div className="action-buttons-enhanced">
                        <Link
                          to={`/super-admin/tenant-details/${tenant.id}`}
                          className="action-btn view-btn"
                          title="View Tenant Details"
                        >
                          <FiEye />
                        </Link>
                        <button
                          className="action-btn activity-btn"
                          title="View Activity Log"
                          onClick={() => console.log('View activity for', tenant.id)}
                        >
                          <FiActivity />
                        </button>
                        {tenant.errorCount > 0 && (
                          <button
                            className="action-btn error-btn"
                            title="View Error Details"
                            onClick={() => console.log('View errors for', tenant.id)}
                          >
                            <FiAlertTriangle />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      {sortedTenants.length > 0 && (
        <div className="table-footer-enhanced">
          <div className="table-stats">
            <div className="stat-item">
              <span className="stat-value">{sortedTenants.length}</span>
              <span className="stat-label">Total Tenants</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">
                {sortedTenants.filter(t => t.status === 'active').length}
              </span>
              <span className="stat-label">Active</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">
                KES {sortedTenants.reduce((sum, t) => sum + (t.monthly_fee || 0), 0).toLocaleString()}
              </span>
              <span className="stat-label">Total MRR</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">
                {sortedTenants.reduce((sum, t) => sum + t.activeUsers7d, 0)}
              </span>
              <span className="stat-label">Total Active Users</span>
            </div>
          </div>
        </div>
    )}
    </div>
  );
};

export default TenantMetricsTable;
