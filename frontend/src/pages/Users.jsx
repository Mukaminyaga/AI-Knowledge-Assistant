import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout";
import "../styles/Users.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Fetch users error:", err);
      setError("Failed to fetch users");
    }
  };

  // Approve user
  const approveUser = async (userId) => {
    try {
      const res = await axios.put(
        `http://localhost:8000/users/approve/${userId}`,
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
      const res = await axios.delete(
        `http://localhost:8000/users/delete/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
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
      <div className="user-container">
        <h2>User Management</h2>
        {error && <p className="error">{error}</p>}
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Approved</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  {user.first_name} {user.last_name}
                </td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.is_approved ? "Yes" : "No"}</td>
                <td>
                  {!user.is_approved && (
                    <button onClick={() => approveUser(user.id)}>
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => deleteUser(user.id)}
                    style={{ marginLeft: "10px", color: "red" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default Users;
