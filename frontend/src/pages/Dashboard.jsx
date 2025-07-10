import React from "react";
import { Link } from "react-router-dom";
import {
  FiHome,
  FiMessageCircle,
  FiUsers,
  FiSettings,
  FiBookOpen,
  FiUpload,
} from "react-icons/fi";
import { MdRecentActors, MdDocumentScanner, MdPersonAdd } from "react-icons/md";
import DashboardLayout from "../components/DashboardLayout";
import "../styles/Dashboard.css";

function Dashboard() {
  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
          <div className="dashboard-nav">
            <Link to="/" className="back-to-home-button">
               Home
            </Link>
            <Link to="/chat" className="chat-link-button">
             Start Chat
            </Link>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <div className="card-icon">
                <FiBookOpen size={32} />
              </div>
              <h3 className="card-title">Knowledge Base</h3>
              <p className="card-description">
                Manage your documents, FAQs, and knowledge articles
              </p>
              <Link to="/upload-documents" className="card-button">
                <FiUpload /> Upload Documents
              </Link>
            </div>

            <div className="dashboard-card">
              <div className="card-icon">
                <FiUsers size={32} />
              </div>
              <h3 className="card-title">Team Management</h3>
              <p className="card-description">
                Add team members and manage permissions
              </p>
              <Link to="/users" className="card-button">
                <MdPersonAdd /> Manage Team
              </Link>
            </div>

            <div className="dashboard-card">
              <div className="card-icon">
                <FiSettings size={32} />
              </div>
              <h3 className="card-title">Settings</h3>
              <p className="card-description">
                Configure AI assistant and system preferences
              </p>
              <Link to="/settings" className="card-button">
                <FiSettings /> Open Settings
              </Link>
            </div>
          </div>

          <div className="recent-activity">
            <h2 className="section-title">Recent Activity</h2>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon">
                  <MdDocumentScanner size={20} />
                </div>
                <div className="activity-details">
                  <p className="activity-text">
                    New document "Remote Work Guidelines" added
                  </p>
                  <span className="activity-time">15 minutes ago</span>
                </div>
              </div>

              <div className="activity-item">
                <div className="activity-icon">
                  <MdRecentActors size={20} />
                </div>
                <div className="activity-details">
                  <p className="activity-text">Sarah joined the team</p>
                  <span className="activity-time">1 hour ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
