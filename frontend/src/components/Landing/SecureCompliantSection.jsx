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
Vala.ai safeguards your data with enterprise-grade security, including encryption, role-based access, and compliance with global standards. Whether managing sensitive documents or critical operational information, your knowledge remains protected, with full control and visibility over who can access it.            </p>
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
