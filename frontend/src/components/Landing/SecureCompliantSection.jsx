import React from "react";
import { Link } from "react-router-dom";
import "../../styles/SecureCompliantSection.css";

function SecureCompliantSection() {
  return (
    <section className="secure-compliant-section">
      <div className="secure-compliant-container">
        <div className="secure-compliant-content">
          <div className="secure-compliant-text">
            <h2 className="secure-compliant-title">Secure & Compliant</h2>
            <p className="secure-compliant-description">
Built with enterprise-grade security protocols, vala.ai protects your data with encryption, role-based access control, and compliance with global standards. Whether you're handling sensitive HR records or critical operational data, rest assured that your knowledge is stored safely, with full visibility and control over who accesses what.
            </p>
            <Link to="/features" className="secure-compliant-btn">
              Learn More
            </Link>
          </div>
          <div className="secure-compliant-image">
            <img
src="/icons/Rectangle 7670 (2).png"
              alt="Secure & Compliant Interface"
              className="secure-compliant-img"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default SecureCompliantSection;
