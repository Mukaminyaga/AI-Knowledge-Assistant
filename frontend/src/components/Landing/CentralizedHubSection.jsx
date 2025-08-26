import React from "react";
import { Link } from "react-router-dom";
import "../../styles/CentralizedHubSection.css";

function CentralizedHubSection() {
  return (
    <section className="centralized-hub-section">
      <div className="centralized-hub-container">
        <div className="centralized-hub-content">
          <div className="centralized-hub-text">
            <h2 className="centralized-hub-title">Centralized Knowledge Hub</h2>
            <p className="centralized-hub-description">
No more scattered files or missing information. Vala.ai brings all your organizational knowledge into one secure, searchable hub; eliminating silos and creating a single source of truth for every team. From SOPs and policies to reports and training materials, everything your organization needs is accessible in one intuitive platform.
            </p>
            <Link to="/features" className="centralized-hub-btn">
              Learn More
            </Link>
          </div>
          <div className="centralized-hub-image">
            <img
src="/icons/Rectangle 7670 (1).png"              alt="Centralized Knowledge Hub Interface"
              className="centralized-hub-img"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default CentralizedHubSection;
