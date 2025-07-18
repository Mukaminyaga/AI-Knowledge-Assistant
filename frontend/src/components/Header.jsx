import React from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";

function Header() {
  return (
    <div className="header-container1">
      <div className="nav-wrapper">
        <div className="logo-section">
          <Link to="/" className="logo-link">
            <img
              src="Vala Logo.png"
              alt="Vala.ai Logo"
              className="logo-image"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "8px",
                objectFit: "contain",
              }}
            />
          </Link>
        </div>
        <div className="nav-links-group">
          <Link to="/">Home</Link>
          <Link to="/features">Features</Link>

          <Link to="/contact">Contact</Link>
        </div>
        <div className="action-buttons">
          <Link to="/login" className="signin-button">
            Sign in
          </Link>
          <Link to="/contact">
            <button className="demo-button">Try a Demo</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Header;
