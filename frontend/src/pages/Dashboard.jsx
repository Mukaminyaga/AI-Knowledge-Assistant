import React from "react";
import { Link } from "react-router-dom";
import {
  FiHome,
  FiMessageCircle,
  FiUsers,
  FiSettings,
  FiBookOpen,
  FiUpload,
  FiTrendingUp,
  FiFileText,
} from "react-icons/fi";
import { MdRecentActors, MdDocumentScanner, MdPersonAdd } from "react-icons/md";
import DashboardLayout from "../components/DashboardLayout";
import "../styles/SuperAdmin.css";

function Dashboard() {
  return (
    <DashboardLayout>
      <div
        className="overview-page"
        style={{ maxWidth: "1400px", margin: "0 auto", padding: "40px" }}
      >
        {/* Page Header */}
        <div className="page-header">
          <div className="page-header-content">
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">
              Welcome back! Here's what's happening with your knowledge base
            </p>
          </div>
          <div className="page-header-actions">
            <Link to="/" className="btn btn-secondary">
              {/* <FiHome className="btn-icon" /> */}
              Home
            </Link>
            <Link to="/chat" className="btn btn-primary">
              {/* <FiMessageCircle className="btn-icon" /> */}
              Start Chat
            </Link>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon">
              <FiBookOpen />
            </div>
            <div className="metric-content">
              <div className="metric-value">156</div>
              <div className="metric-label">Documents</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">
              <FiUsers />
            </div>
            <div className="metric-content">
              <div className="metric-value">24</div>
              <div className="metric-label">Team Members</div>
            </div>
          </div>

          {/* <div className="metric-card">
            <div className="metric-icon">
              <FiMessageCircle />
            </div>
            <div className="metric-content">
              <div className="metric-value">1,247</div>
              <div className="metric-label">Conversations</div>
            </div>
          </div> */}

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

        {/* Main Content Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "24px",
            marginBottom: "32px",
          }}
        >
          {/* Quick Actions */}
          <div
            style={{
              background: "rgb(255, 255, 255)",
              borderRadius: "16px",
              border: "1px solid rgb(229, 231, 235)",
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
                      background: "rgba(11, 58, 96, 0.1)",
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
                  <FiUpload className="btn-icon" />
                  Upload Documents
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
                      background: "rgba(16, 185, 129, 0.1)",
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
                  <MdPersonAdd className="btn-icon" />
                  Manage Team
                </Link>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div
            style={{
              background: "rgb(255, 255, 255)",
              borderRadius: "16px",
              border: "1px solid rgb(229, 231, 235)",
              padding: "24px",
            }}
          >
            <h3 className="section-title">System Status</h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontSize: "14px", color: "rgb(75, 85, 99)" }}>
                  AI Processing
                </span>
                <span
                  style={{
                    padding: "4px 12px",
                    borderRadius: "16px",
                    fontSize: "12px",
                    fontWeight: "600",
                    background: "rgba(34, 197, 94, 0.1)",
                    color: "#16a34a",
                  }}
                >
                  Online
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontSize: "14px", color: "rgb(75, 85, 99)" }}>
                  Document Index
                </span>
                <span
                  style={{
                    padding: "4px 12px",
                    borderRadius: "16px",
                    fontSize: "12px",
                    fontWeight: "600",
                    background: "rgba(34, 197, 94, 0.1)",
                    color: "#16a34a",
                  }}
                >
                  Up to date
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontSize: "14px", color: "rgb(75, 85, 99)" }}>
                  Search Engine
                </span>
                <span
                  style={{
                    padding: "4px 12px",
                    borderRadius: "16px",
                    fontSize: "12px",
                    fontWeight: "600",
                    background: "rgba(34, 197, 94, 0.1)",
                    color: "#16a34a",
                  }}
                >
                  Operational
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontSize: "14px", color: "rgb(75, 85, 99)" }}>
                  Response Time
                </span>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "rgb(17, 24, 39)",
                  }}
                >
                  2.3s avg
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="recent-tenants-section">
          <h2 className="section-title">Recent Activity</h2>
          <div className="tenants-list">
            <div className="tenant-card">
              <div className="tenant-info">
                <div className="tenant-name">
                  New document "Remote Work Guidelines" added
                </div>
                <div className="tenant-email">
                  Document processing completed successfully
                </div>
              </div>
              <div className="tenant-status">
                <span className="status-badge active">
                  <MdDocumentScanner size={16} />
                </span>
              </div>
              <div className="tenant-amount">15 min ago</div>
            </div>

            <div className="tenant-card">
              <div className="tenant-info">
                <div className="tenant-name">Sarah joined the team</div>
                <div className="tenant-email">
                  New team member added with user role
                </div>
              </div>
              <div className="tenant-status">
                <span className="status-badge trial">
                  <MdRecentActors size={16} />
                </span>
              </div>
              <div className="tenant-amount">1 hour ago</div>
            </div>

            <div className="tenant-card">
              <div className="tenant-info">
                <div className="tenant-name">
                  Knowledge base search performed
                </div>
                <div className="tenant-email">
                  User searched for "vacation policy" - 3 results found
                </div>
              </div>
              <div className="tenant-status">
                <span className="status-badge active">
                  <FiFileText size={16} />
                </span>
              </div>
              <div className="tenant-amount">2 hours ago</div>
            </div>
          </div>

          <div className="view-all-section">
            <Link to="/activity" className="view-all-link">
              View All Activity
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
