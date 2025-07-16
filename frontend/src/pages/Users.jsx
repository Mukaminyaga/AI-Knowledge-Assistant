import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout";
import {
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiActivity,
  FiTrash2,
  FiShield,
  FiEdit,
  FiChevronLeft,
  FiChevronRight,
  // FiUserPlus,
} from "react-icons/fi";
import {
  MdVerified,
  MdPending,
  MdAdminPanelSettings,
  MdPerson,
} from "react-icons/md";
import "../styles/Users.css";

const API_URL = process.env.REACT_APP_API_URL;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");

  // User statistics
  const calculateStats = (userList) => {
    return {
      total: userList.length,
      approved: userList.filter((u) => u.is_approved).length,
      pending: userList.filter((u) => !u.is_approved).length,
      active: userList.filter(
        (u) =>
          u.last_active?.includes("minutes") || u.last_active?.includes("hour"),
      ).length,
    };
  };

  const [userStats, setUserStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
  });

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers(res.data);
      setUserStats(calculateStats(res.data));
    } catch (err) {
      console.error("Fetch users error:", err);
      setError("Failed to fetch users");
    }
  };

  // Approve user
  const approveUser = async (userId) => {
    try {
      const res = await axios.put(
        `${API_URL}/users/approve/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (res.status === 200) {
        fetchUsers();
      } else {
        setError("Failed to approve user");
      }
    } catch (err) {
      console.error("Approval error:", err.response || err);
      setError("Error approving user");
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?",
    );
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(`${API_URL}/users/delete/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.status === 200) {
        fetchUsers();
      } else {
        setError("Failed to delete user");
      }
    } catch (err) {
      console.error("Delete error:", err.response || err);
      setError("Error deleting user");
    }
  };

  // Edit user functions
  const openEditModal = (user) => {
    setSelectedUser(user);
    setSelectedRole(user.role);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedUser(null);
    setSelectedRole("");
  };

  const updateUserRole = async () => {
    try {
      const res = await axios.put(
        `${API_URL}/users/users/role/${selectedUser.id}`,
        { role: selectedRole },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (res.status === 200) {
        fetchUsers();
        closeEditModal();
      } else {
        setError("Failed to update user role");
      }
    } catch (err) {
      console.error("Update role error:", err.response || err);
      setError("Error updating user role");
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = users.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <DashboardLayout>
      <div className="user-container enhanced">
        {/* Header Section */}
        <div className="users-header">
          <div className="header-content">
            <h2 className="users-title">
              <FiUsers size={28} /> User Management
            </h2>
            <p className="users-subtitle">
              Manage team members, permissions, and user activity
            </p>
          </div>
          {/* <button className="add-user-btn">
            <FiUserPlus size={18} />
            Add New User
          </button> */}
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* Statistics Cards */}
        <div className="user-stats-grid">
          <div className="user-stat-card primary">
            <div className="stat-icon">
              <FiUsers size={24} />
            </div>
            <div className="stat-content">
              <h3 className="stat-number">{userStats.total}</h3>
              <p className="stat-label">Total Users</p>
            </div>
          </div>

          <div className="user-stat-card success">
            <div className="stat-icon">
              <FiUserCheck size={24} />
            </div>
            <div className="stat-content">
              <h3 className="stat-number">{userStats.approved}</h3>
              <p className="stat-label">Approved</p>
            </div>
          </div>

          <div className="user-stat-card warning">
            <div className="stat-icon">
              <FiUserX size={24} />
            </div>
            <div className="stat-content">
              <h3 className="stat-number">{userStats.pending}</h3>
              <p className="stat-label">Pending</p>
            </div>
          </div>

          {/* <div className="user-stat-card info">
            <div className="stat-icon"><FiActivity size={24} /></div>
            <div className="stat-content">
              <h3 className="stat-number">{userStats.active}</h3>
              <p className="stat-label">Active Now</p>
            </div>
          </div> */}
        </div>

        {/* Users Table */}
        <div className="users-table-container">
          <div className="table-header">
            <h3 className="table-title">Team Members</h3>
            {/* You can add filters here if needed */}
          </div>

          <div className="users-table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  {/* <th>Last Active</th>
                  <th>Join Date</th> */}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user.id} className="user-row">
                    <td className="user-info">
                      {/* <div className="user-avatar">{user.first_name?.[0]}{user.last_name?.[0]}</div> */}
                      <div className="user-details">
                        <span className="user-name">
                          {user.first_name} {user.last_name}
                        </span>
                        <span className="user-email">{user.email}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`role-badge ${user.role.toLowerCase()}`}>
                        {user.role === "Admin" && (
                          <MdAdminPanelSettings size={14} />
                        )}
                        {user.role === "Manager" && <FiShield size={14} />}
                        {user.role === "Developer" && <FiActivity size={14} />}
                        {user.role === "User" && <MdPerson size={14} />}
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${user.is_approved ? "approved" : "pending"}`}
                      >
                        {user.is_approved ? (
                          <>
                            <MdVerified size={14} /> Approved
                          </>
                        ) : (
                          <>
                            <MdPending size={14} /> Pending
                          </>
                        )}
                      </span>
                    </td>
                    {/* <td className="last-active">
                      <FiClock size={14} />
                      {user.last_active || "N/A"}
                    </td>
                    <td className="join-date">{user.join_date || "N/A"}</td> */}
                    <td className="actions">
                      <div className="action-buttons">
                        {!user.is_approved && (
                          <button
                            className="action-btn approve"
                            onClick={() => approveUser(user.id)}
                            title="Approve User"
                          >
                            <FiUserCheck size={16} />
                          </button>
                        )}
                        <button
                          className="action-btn edit"
                          title="Edit User"
                          onClick={() => openEditModal(user)}
                        >
                          <FiEdit size={16} />
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => deleteUser(user.id)}
                          title="Delete User"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {users.length > 0 && (
          <>
            <div className="activity-results">
              <p>
                Showing {startIndex + 1} to {Math.min(endIndex, users.length)}{" "}
                of {users.length} users
              </p>
            </div>

            {totalPages >= 1 && (
              <div className="pagination-container">
                {currentPage > 1 && (
                  <button className="pagination-btn" onClick={handlePrevious}>
                    <FiChevronLeft size={16} />
                    Previous
                  </button>
                )}

                <div className="pagination-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        className={`pagination-number ${currentPage === page ? "active" : ""}`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    ),
                  )}
                </div>

                {currentPage < totalPages && (
                  <button className="pagination-btn" onClick={handleNext}>
                    Next
                    <FiChevronRight size={16} />
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {/* Edit User Modal */}
        {showEditModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Edit User Role</h3>
                <button className="close-btn" onClick={closeEditModal}>
                  ×
                </button>
              </div>

              <div className="modal-body">
                <div className="user-info-section">
                  <h4>User Information</h4>
                  <p>
                    <strong>Name:</strong> {selectedUser?.first_name}{" "}
                    {selectedUser?.last_name}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedUser?.email}
                  </p>
                </div>

                <div className="role-permissions-section">
                  <h4>Knowledge Base Permissions</h4>
                  <div className="permission-grid">
                    <div className="permission-item admin">
                      <h5>Admin</h5>
                      <ul>
                        <li>✓ Upload documents</li>
                        <li>✓ Download documents</li>
                        <li>✓ View documents</li>
                        <li>✓ Delete documents</li>
                      </ul>
                    </div>
                    <div className="permission-item editor">
                      <h5>Editor</h5>
                      <ul>
                        <li>✓ Upload documents</li>
                        <li>✓ View documents</li>
                        <li>✓ Download documents</li>
                      </ul>
                    </div>
                    <div className="permission-item viewer">
                      <h5>Viewer</h5>
                      <ul>
                        <li>✓ View documents</li>
                        <li>✓ Download documents</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="role-selection-section">
                  <h4>Assign Role</h4>
                  <div className="role-options">
                    <label className="role-option">
                      <input
                        type="radio"
                        name="role"
                        value="Admin"
                        checked={selectedRole === "Admin"}
                        onChange={(e) => setSelectedRole(e.target.value)}
                      />
                      <span className="role-label">Admin</span>
                    </label>
                    <label className="role-option">
                      <input
                        type="radio"
                        name="role"
                        value="Editor"
                        checked={selectedRole === "Editor"}
                        onChange={(e) => setSelectedRole(e.target.value)}
                      />
                      <span className="role-label">Editor</span>
                    </label>
                    <label className="role-option">
                      <input
                        type="radio"
                        name="role"
                        value="Viewer"
                        checked={selectedRole === "Viewer"}
                        onChange={(e) => setSelectedRole(e.target.value)}
                      />
                      <span className="role-label">Viewer</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button className="cancel-btn" onClick={closeEditModal}>
                  Cancel
                </button>
                <button className="save-btn" onClick={updateUserRole}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Users;
