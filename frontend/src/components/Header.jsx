import React from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";

function Header() {


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
  
          >
            Home
          </Link>
          <Link
            to="/features"
            
          >
            Features
          </Link>
         
          <Link
            to="/contact"
           
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
