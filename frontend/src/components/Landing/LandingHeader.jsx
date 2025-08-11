import React from "react";
import { Link } from "react-router-dom";
import "../../styles/LandingHeader.css";

function LandingHeader() {
  return (
    <header className="landing-header">
      <div className="landing-header-container">
        <div className="landing-logo-section">
          <Link to="/" className="landing-logo-link">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/1f681df7d7b3566b19d922605d97f85d82fc32e6?width=200"
              alt="Vala AI Logo"
              className="landing-logo-image"
            />
            <span className="landing-logo-text">Vala.ai</span>
          </Link>
        </div>

        <nav className="landing-nav">
          <Link to="/" className="landing-nav-link">Home</Link>
          <Link to="/features" className="landing-nav-link">Features</Link>
          <Link to="/contact" className="landing-nav-link">Contact</Link>
        </nav>

        <div className="landing-auth-buttons">
          <Link to="/login" className="landing-login-btn">
            Log In
          </Link>
          <Link to="/contact" className="landing-demo-btn">
            Schedule a Meeting
          </Link>
        </div>
      </div>
    </header>
  );
}

export default LandingHeader;
