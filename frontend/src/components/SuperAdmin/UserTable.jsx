import React, { useState } from "react";
import { FiSearch, FiMail } from "react-icons/fi";
import "../../styles/SuperAdmin.css";

const UserTable = ({ users, tenantId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  // const [statusFilter, setStatusFilter] = useState("all");

 const filteredUsers = users.filter((user) => {
  const matchesSearch =
    (user.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (user.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (user.role?.toLowerCase() || "").includes(searchTerm.toLowerCase());

    // const matchesStatus =
    //   statusFilter === "all" || user.status === statusFilter;

    return matchesSearch ;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (sortField === "createdAt" || sortField === "lastActive") {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
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

  // const formatDate = (dateString) => {
  //   return new Date(dateString).toLocaleDateString("en-US", {
  //     month: "short",
  //     day: "numeric",
  //     year: "numeric",
  //   });
  // };

  // const formatDateTime = (dateString) => {
  //   return new Date(dateString).toLocaleString("en-US", {
  //     month: "short",
  //     day: "numeric",
  //     year: "numeric",
  //     hour: "2-digit",
  //     minute: "2-digit",
  //   });
  // };

  // const getStatusBadge = (status) => {
  //   const statusColors = {
  //     active: "success",
  //     inactive: "warning",
  //     suspended: "danger",
  //   };

  //   return (
  //     <span
  //       className={`status-badge status-${statusColors[status] || "default"}`}
  //     >
  //       {status?.charAt(0).toUpperCase() + status?.slice(1)}
  //     </span>
  //   );
  // };

  const getRoleBadge = (role) => {
    const roleColors = {
      admin: "primary",
      user: "secondary",
      moderator: "info",
    };

    return (
      <span
        className={`role-badge role-${roleColors[role.toLowerCase()] || "default"}`}
      >
        {role}
      </span>
    );
  };

  return (
    <div className="user-table-container">
      {/* Controls */}
      <div className="table-controls">
        <div className="search-and-filters">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {/* <div className="filter-buttons">
            {["all", "active", "inactive", "suspended"].map((status) => (
              <button
                key={status}
                className={`filter-btn ${statusFilter === status ? "active" : ""}`}
                onClick={() => setStatusFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div> */}
        </div>
      </div>

      {/* Stats */}
      <div className="user-stats">
        <div className="stat-item">
          <div className="stat-value">{users.length}</div>
          <div className="stat-label">Total Users</div>
        </div>
        {/* <div className="stat-item">
          <div className="stat-value">
            {users.filter((u) => u.status === "active").length}
          </div>
          <div className="stat-label">Active</div>
        </div> */}
        <div className="stat-item">
          <div className="stat-value">
            {users.filter((u) => u.role.toLowerCase() === "admin").length}
          </div>
          <div className="stat-label">Admins</div>
        </div>
        {/* <div className="stat-item">
          <div className="stat-value">
            {users.filter((u) => u.status === "inactive").length}
          </div>
          <div className="stat-label">Inactive</div>
        </div> */}
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th className="sortable" onClick={() => handleSort("name")}>
                User
                {sortField === "name" && (
                  <span className="sort-indicator">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>
              <th className="sortable" onClick={() => handleSort("email")}>
                Email
                {sortField === "email" && (
                  <span className="sort-indicator">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>
              <th className="sortable" onClick={() => handleSort("role")}>
                Role
                {sortField === "role" && (
                  <span className="sort-indicator">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>
              {/* <th>Status</th> */}
              {/* <th className="sortable" onClick={() => handleSort("lastActive")}>
                Last Active
                {sortField === "lastActive" && (
                  <span className="sort-indicator">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th> */}
              {/* <th className="sortable" onClick={() => handleSort("createdAt")}>
                Created
                {sortField === "createdAt" && (
                  <span className="sort-indicator">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th> */}
            </tr>
          </thead>
          <tbody>
            {sortedUsers.length === 0 ? (
              <tr>
                {/* <td colSpan={6} className="no-data">
                  {searchTerm || statusFilter !== "all"
                    ? "No users found matching your criteria."
                    : "No users available for this tenant."}
                </td> */}
              </tr>
            ) : (
              sortedUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-cell">
                      {/* <div className="user-avatar">
                        <FiUser />
                      </div> */}
                      <div className="user-info">
                        <div className="user-name">{user.name}</div>
                        <div className="user-id">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="email-cell">
                      <FiMail className="email-icon" />
                      {user.email}
                    </div>
                  </td>
                  <td>{getRoleBadge(user.role)}</td>
                  {/* <td>{getStatusBadge(user.status)}</td> */}
                  {/* <td>
                    <div className="date-cell">
                      <FiClock className="date-icon" />
                      {formatDateTime(user.lastActive)}
                    </div>
                  </td>
                  <td>
                    <div className="date-cell">
                      <FiCalendar className="date-icon" />
                      {formatDate(user.createdAt)}
                    </div>
                  </td> */}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="table-footer">
        <p className="showing-count">
          Showing {sortedUsers.length} of {users.length} users
        </p>
      </div>
    </div>
  );
};

export default UserTable;
