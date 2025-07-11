import React from "react";
import SuperAdminSidebar from "./SuperAdminSidebar";
import "../../styles/SuperAdminLayout.css";

const SuperAdminLayout = ({ children, activePage }) => {
  return (
    <div className="super-admin-layout">
      <SuperAdminSidebar activePage={activePage} />

      {/* Main content area without header */}
      <div className="super-admin-main-container">
        <div className="super-admin-content">{children}</div>
      </div>
    </div>
  );
};

export default SuperAdminLayout;

