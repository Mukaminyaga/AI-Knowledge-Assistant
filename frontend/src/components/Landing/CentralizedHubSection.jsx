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
Say goodbye to scattered documents and lost information. vala.ai centralizes your organizational knowledge into a single, searchable hub eliminating silos and creating a shared source of truth for all departments. Whether it’s SOPs, reports, policies, or training materials, everything is accessible from one intuitive platform.

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
