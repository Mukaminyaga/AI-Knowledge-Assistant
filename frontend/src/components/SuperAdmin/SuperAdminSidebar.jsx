import React from "react";
import { Link } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiCreditCard,
  FiBarChart2,
  FiSettings,
  FiActivity,
} from "react-icons/fi";
import "../../styles/SuperAdminSidebar.css";

const SuperAdminSidebar = ({ activePage }) => {
  const navigation = [
    {
      name: "Overview",
      path: "/super-admin/overview",
      icon: FiHome,
      key: "overview",
    },
    {
      name: "Tenants",
      path: "/super-admin/tenants",
      icon: FiUsers,
      key: "tenants",
    },
    {
      name: "Payments",
      path: "/super-admin/payments",
      icon: FiCreditCard,
      key: "payments",
    },
    {
      name: "Analytics",
      path: "/super-admin/analytics",
      icon: FiBarChart2,
      key: "analytics",
    },
  ];

  return (
    <div className="super-admin-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <FiActivity className="logo-icon" />
          <span className="logo-text">SuperAdmin</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.key;

            return (
              <li key={item.key} className="nav-item">
                <Link
                  to={item.path}
                  className={`nav-link ${isActive ? "active" : ""}`}
                >
                  <Icon className="nav-icon" />
                  <span className="nav-text">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <Link to="/settings" className="nav-link">
          <FiSettings className="nav-icon" />
          <span className="nav-text">Settings</span>
        </Link>
      </div>
    </div>
  );
};

export default SuperAdminSidebar;
