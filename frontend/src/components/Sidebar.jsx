import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";
import {
  FiHome,
  FiUpload,
  FiMessageSquare,
  FiBook,
  FiUser,
  FiUsers,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import { logout } from "../utils/auth"; 

function Sidebar({ isOpen = false, onClose, isMobile = false }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    if (isMobile && onClose) {
      onClose();
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };
  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  // Get the user data from localStorage
const user = JSON.parse(localStorage.getItem("user"));

  const menuItems = [
    { icon: <FiHome size={20} />, label: "Dashboard", path: "/dashboard" },
    { icon: <FiUpload size={20} />, label: "Upload Documents", path: "/upload-documents" },
    { icon: <FiMessageSquare size={20} />, label: "Chat", path: "/chat" },
    { icon: <FiBook size={20} />, label: "Knowledge Base", path: "/knowledge-base" },
    { icon: <FiUsers size={20} />, label: "Team", path: "/users" },
    { icon: <FiSettings size={20} />, label: "Settings", path: "/settings" },
  ];

  return (
    <div
      className={`sidebar-container ${isCollapsed && !isMobile ? "collapsed" : ""} ${isMobile && isOpen ? "mobile-open" : ""}`}
    >
      <div className="sidebar-header">
        <div className="brand-section">
          {!isCollapsed ? (
            <div className="brand-text">
              <h3 className="brand-title">AI Assistant</h3>
              <div className="brand-subtitle-container">
                <p className="brand-subtitle">Knowledge Hub</p>
                <button
                  className="toggle-button"
                  onClick={toggleSidebar}
                  aria-label={
                    isMobile
                      ? "Close sidebar"
                      : isCollapsed
                      ? "Expand sidebar"
                      : "Collapse sidebar"
                  }
                >
                  {isMobile ? "✕" : "←"}
                </button>
              </div>
            </div>
          ) : (
            <button
              className="toggle-button collapsed-only"
              onClick={toggleSidebar}
              aria-label="Expand sidebar"
            >
              →
            </button>
          )}
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => (
            <li key={item.path} className="nav-item">
              <Link
                to={item.path}
                className={`nav-link1 ${location.pathname === item.path ? "active" : ""}`}
                title={isCollapsed && !isMobile ? item.label : ""}
                onClick={handleLinkClick}
              >
                <span className="nav-icon">{item.icon}</span>
                {!isCollapsed && <span className="nav-label">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar1">
            <FiUser size={20} />
          </div>
          {!isCollapsed && (
            <div className="user-info">
               <p className="user-name">
                  {user?.first_name
                   ? `${user.first_name}.${user.last_name?.charAt(0).toUpperCase() || ""}`
                    : "John.D"}
              </p>

              <p className="user-email">{user?.email || "john@example.com"}</p>
               </div>
          )}
          {!isCollapsed && (
            <div className="profile-actions">
              <FiLogOut
                className="logout-icon"
                title="Logout"
                onClick={handleLogout}
              />
            </div>
          )}
        </div>

        {!isCollapsed && (
         <div className="help-section">
  <div className="help-card">
    <h4 className="help-title">Need Help?</h4>
    <Link to="/contact">
      <button className="help-button">Contact Support</button>
    </Link>
  </div>
</div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
