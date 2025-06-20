import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import "../styles/DashboardLayout.css";

function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className={`dashboard-layout ${sidebarOpen ? "sidebar-open" : ""}`}>
      <Sidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        isMobile={isMobile}
      />

      {/* Mobile overlay */}
      {sidebarOpen && isMobile && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}

      {/* Main content */}
      <div className="dashboard-main">
        {/* Mobile header with menu button */}
        <div className="mobile-header">
          <button
            className="mobile-menu-button"
            onClick={toggleSidebar}
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
          >
            {sidebarOpen ? "✕" : "☰"}
          </button>
          <div className="mobile-brand">
            {/* <span className="mobile-brand-icon">🤖</span> */}
            <span className="mobile-brand-text">AI Assistant</span>
          </div>
        </div>

        {/* Page content */}
        <div className="dashboard-content">{children}</div>
      </div>
    </div>
  );
}

export default DashboardLayout;
