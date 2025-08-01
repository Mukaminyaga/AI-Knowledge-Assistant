import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiBookOpen,
  FiUsers,
  FiUpload,
  FiTrendingUp,
  FiCheck,
  // FiFileText,
} from "react-icons/fi";
import { MdPersonAdd } from "react-icons/md";
// import { MdDocumentScanner, MdRecentActors } from "react-icons/md";
import DashboardLayout from "../components/DashboardLayout";
import axios from "axios";
import "../styles/SuperAdmin.css";

const API_URL = process.env.REACT_APP_API_URL;

function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    processed: 0,
    processing: 0,
    failed: 0,
    pending: 0,
  });
  const [recent, setRecent] = useState([]);
  const [teamCount, setTeamCount] = useState(0);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/users/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTeamCount(res.data.length);
    } catch (err) {
      console.error("Fetch users error:", err);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const res = await axios.get(`${API_URL}/documents/recent-activity`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setRecent(res.data);
    } catch (err) {
      console.error("Fetch recent activity error:", err);
    }
  };

  const approveDocument = async (documentId) => {
    try {
      const res = await axios.put(
        `${API_URL}/documents/approve/${documentId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (res.status === 200) {
        fetchRecentActivity(); // Refresh recent activity
      }
    } catch (err) {
      console.error("Document approval failed:", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    axios
      .get(`${API_URL}/documents/stats`, { headers })
      .then((res) => setStats(res.data))
      .catch(console.error);

    fetchUsers();
    fetchRecentActivity();
  }, []);

  return (
    <DashboardLayout>
      <div
        className="overview-page"
        style={{ padding: "2.5rem" }}
      >
        <div className="page-header">
          <div className="page-header-content">
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">
              Welcome back! Here's what's happening with your knowledge base
            </p>
          </div>
          <div className="page-header-actions">
            <Link to="/" className="btn btn-secondary">
              Home
            </Link>
            <Link to="/chat" className="btn btn-primary">
              Start Chat
            </Link>
          </div>
        </div>

        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon">
              <FiBookOpen />
            </div>
            <div className="metric-content">
              <div className="metric-value">{stats.total}</div>
              <div className="metric-label">Documents</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <FiUsers />
            </div>
            <div className="metric-content">
              <div className="metric-value">{teamCount}</div>
              <div className="metric-label">Team Members</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <FiTrendingUp />
            </div>
            <div className="metric-content">
              <div className="metric-value">95%</div>
              <div className="metric-label">Accuracy Rate</div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "24px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              border: "1px solid #e5e7eb",
              padding: "24px",
            }}
          >
            <h3 className="section-title">Quick Actions</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "20px",
              }}
            >
              <div
                style={{
                  background:
                    "linear-gradient(135deg, rgba(11, 58, 96, 0.05) 0%, rgba(240, 242, 245, 0.3) 100%)",
                  padding: "24px",
                  borderRadius: "12px",
                  border: "1px solid rgba(240, 242, 245, 0.8)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      background: "none",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "rgb(11, 58, 96)",
                    }}
                  >
                    <FiBookOpen size={24} />
                  </div>
                  <div>
                    <h4
                      style={{
                        margin: "0 0 4px 0",
                        fontSize: "18px",
                        fontWeight: "600",
                        color: "rgb(17, 24, 39)",
                      }}
                    >
                      Knowledge Base
                    </h4>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "14px",
                        color: "rgb(75, 85, 99)",
                      }}
                    >
                      Manage your documents and knowledge articles
                    </p>
                  </div>
                </div>
                <Link
                  to="/upload-documents"
                  className="btn btn-primary"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  <FiUpload className="btn-icon" /> Upload
                </Link>
              </div>

              <div
                style={{
                  background:
                    "linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(240, 242, 245, 0.3) 100%)",
                  padding: "24px",
                  borderRadius: "12px",
                  border: "1px solid rgba(240, 242, 245, 0.8)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      background: "none",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "rgb(16, 185, 129)",
                    }}
                  >
                    <FiUsers size={24} />
                  </div>
                  <div>
                    <h4
                      style={{
                        margin: "0 0 4px 0",
                        fontSize: "18px",
                        fontWeight: "600",
                        color: "rgb(17, 24, 39)",
                      }}
                    >
                      Team Management
                    </h4>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "14px",
                        color: "rgb(75, 85, 99)",
                      }}
                    >
                      Add team members and manage permissions
                    </p>
                  </div>
                </div>
                <Link
                  to="/users"
                  className="btn btn-primary"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  <MdPersonAdd className="btn-icon" /> Manage Team
                </Link>
              </div>
            </div>
          </div>

          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              border: "1px solid #e5e7eb",
              padding: "24px",
            }}
          >
            <h3 className="section-title">System Status</h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {Object.entries({
                Total: stats.total,
                Processed: stats.processed,
                Processing: stats.processing,
                Failed: stats.failed,
                Pending: stats.pending,
              }).map(([key, value]) => (
                <div
                  key={key}
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ fontSize: "14px", color: "#4B5563" }}>
                    {key}
                  </span>
                  <span
                    style={{
                      padding: "4px 12px",
                      borderRadius: "16px",
                      fontSize: "12px",
                      fontWeight: "600",
                      background:
                        key === "Failed"
                          ? "rgba(220,38,38,0.1)"
                          : key === "Processing"
                            ? "rgba(234,179,8,0.1)"
                            : "rgba(34,197,94,0.1)",
                      color:
                        key === "Failed"
                          ? "#DC2626"
                          : key === "Processing"
                            ? "#D97706"
                            : "#16a34a",
                    }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="recent-tenants-section">
          <h2 className="section-title">Recent Activity</h2>
          <div className="tenants-list">
            {recent.map((item, i) => (
              <div key={i} className="tenant-card">
                <div className="tenant-info">
                  <div className="tenant-name">{item.filename} uploaded</div>
                  <div className="tenant-email">Status: {item.status}</div>
                </div>

                {item.status === "pending" && (
                  <button
                    className="approve-btn"
                    onClick={() => approveDocument(item.id)}
                  >
                    <FiCheck />
                    Approve
                  </button>
                )}
                <div className="tenant-amount">
                  {new Date(item.uploaded_at).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>

          <div className="view-all-section">
            <Link to="/activity" className="view-all-link">
              View All Document Activity
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
