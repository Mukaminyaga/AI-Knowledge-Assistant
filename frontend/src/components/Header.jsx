import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Header.css";

function Header() {
  const location = useLocation();

  return (
    <div className="header-container">
      <div className="nav-wrapper">
        <div className="brand-title">
          AI Knowlege <br />
          Assistant
        </div>
        <div className="nav-links-group">
          <Link
            to="/"
            // className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
          >
            Home
          </Link>
          <Link
            to="/features"
            // className={`nav-link ${location.pathname === "/features" ? "active" : ""}`}
          >
            Features
          </Link>
          {/* <Link
            to="/about"
            className={`nav-link ${location.pathname === "/about" ? "active" : ""}`}
          >
            About Us
          </Link> */}
          <Link
            to="/contact"
            // className={`nav-link ${location.pathname === "/contact" ? "active" : ""}`}
          >
            Contact
          </Link>
        </div>
        <div className="action-buttons">
          <Link to="/login" className="signin-button">
            Sign in
          </Link>
          <button className="demo-button">Try a Demo</button>
        </div>
      </div>
    </div>
  );
}

export default Header;
