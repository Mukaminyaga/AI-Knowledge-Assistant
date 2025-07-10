import React from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";

function Header() {
  return (
    <div className="header-container">
      <div className="nav-wrapper">
         <div className="logo-section">
          <Link to="/" className="logo-link">
            {/* <img
              src="/1.png"
              alt="AI Knowledge Assistant Logo"
              className="logo-image"
            /> */}
            <div className="brand-title">
              AI Knowledge <br />
              Assistant
            </div>
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
