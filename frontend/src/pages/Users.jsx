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
                {users.map((user) => (
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
                        <button className="action-btn edit" title="Edit User">
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
      </div>
    </DashboardLayout>
  );
};

export default Users;
