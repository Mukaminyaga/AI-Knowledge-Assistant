import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Sidebar.css";

function Sidebar({ isOpen = false, onClose, isMobile = false }) {
  const location = useLocation();
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

  const menuItems = [
    {
      icon: "🏠",
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      icon: "📄",
      label: "Upload Documents",
      path: "/upload-documents",
    },
    {
      icon: "💬",
      label: "Chat",
      path: "/chat",
    },
    // {
    //   icon: "🗨️",
    //   label: "Chat UI",
    //   path: "/chat-user",
    // },
    {
      icon: "📚",
      label: "Knowledge Base",
      path: "/knowledge-base",
    },
    {
      icon: "👥",
      label: "Team",
      path: "/users",
    },
    {
      icon: "⚙️",
      label: "Settings",
      path: "/settings",
    },
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
                className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
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

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">👤</div>
          {!isCollapsed && (
            <div className="user-info">
              <p className="user-name">John Doe</p>
              <p className="user-role">Administrator</p>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <div className="help-section">
            <div className="help-card">
              <h4 className="help-title">Need Help?</h4>
              {/* <p class="help-text">Contact our support team</p> */}
              <button className="help-button">Contact Support</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
