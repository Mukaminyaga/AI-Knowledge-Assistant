import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";
import { useTheme } from "../context/ThemeContext";
import {
  FiHome,
  FiUpload,
  FiMessageSquare,
  FiBook,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiActivity,
} from "react-icons/fi";
import { logout } from "../utils/auth";

function Sidebar({ isOpen = false, onClose, isMobile = false }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isDarkMode } = useTheme();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

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

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  // Get the user data from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  const menuItems = [
    { icon: <FiHome size={20} />, label: "Dashboard", path: "/dashboard" },
    {
      icon: <FiUpload size={20} />,
      label: "Upload Documents",
      path: "/upload-documents",
    },
    { icon: <FiMessageSquare size={20} />, label: "Chat", path: "/chat" },
    {
      icon: <FiBook size={20} />,
      label: "Knowledge Base",
      path: "/knowledge-base",
    },
    { icon: <FiActivity size={20} />, label: "Activity", path: "/activity" },
    { icon: <FiUsers size={20} />, label: "Team", path: "/users" },
    { icon: <FiSettings size={20} />, label: "Settings", path: "/settings" },
  ];

  return (
    <div
      className={`sidebar-container ${isCollapsed && !isMobile ? "collapsed" : ""} ${isMobile && isOpen ? "mobile-open" : ""}`}
    >
      {/* Profile Dropdown at Top */}
      {/* <div className="sidebar-top-profile">
        <div
          className={`profile-dropdown-trigger ${profileDropdownOpen ? 'active' : ''}`}
          onClick={toggleProfileDropdown}
        >
          <div className="profile-avatar-sidebar">
            <FiUser size={16} />
          </div>
          {!isCollapsed && (
            <>
              <div className="profile-info">
                <span className="profile-name">
                  {user?.first_name
                    ? `${user.first_name} ${user.last_name?.charAt(0) || ''}.`
                    : "John D."}
                </span>
                <span className="profile-role">Member</span>
              </div>
              <div className="dropdown-arrow">
                {profileDropdownOpen ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
              </div>
            </>
          )}
        </div>

        {profileDropdownOpen && !isCollapsed && (
          <div className="profile-dropdown-menu">
            <div className="dropdown-item">
              <div className="user-details">
                <strong>{user?.first_name || 'User'} {user?.last_name || ''}</strong>
                <span>{user?.email || 'user@example.com'}</span>
              </div>
            </div>
            <div className="dropdown-divider"></div>
            <div className="dropdown-item clickable">
              <FiUser size={14} />
              <span>View Profile</span>
            </div>
            <div className="dropdown-item clickable">
              <FiSettings size={14} />
              <span>Account Settings</span>
            </div>
          </div>
        )}
      </div> */}

      <div className="sidebar-header">
        <div className="brand-section">
          {!isCollapsed ? (
            <div className="brand-text">
  <Link to="/" className="brand-subtitle-container">
    <img
      src={isDarkMode ? "/icons/vala ai logo white.png" : "/icons/vala ai logo black.png"}
      alt="Vala AI Logo"
      className="brand-logo"
    />
    <h3 className="brand-title">Vala AI</h3>
  </Link>

                {/* <button
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
                </button> */}
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
                {!isCollapsed && (
                  <span className="nav-label">{item.label}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button at Bottom */}
      <div className="sidebar-footer">
        <button
          className="logout-button-bottom"
          onClick={handleLogout}
          title={isCollapsed && !isMobile ? "Logout" : ""}
        >
          <span className="nav-icon">
            <FiLogOut size={20} />
          </span>
          {!isCollapsed && (
            <span className="nav-label">Logout</span>
          )}
        </button>

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
