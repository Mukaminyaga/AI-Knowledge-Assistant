import React from "react";
import { Link } from "react-router-dom";
import "../../styles/SmartSearchSection.css";

function SmartSearchSection() {
  return (
    <section className="smart-search-section">
      <div className="smart-search-container">
        <div className="smart-search-content">
          <div className="smart-search-text">
            <h2 className="smart-search-title">Smart Search</h2>
            <p className="smart-search-description">
              Find information instantly with our advanced AI-powered search engine that goes beyond simple keyword matching by deeply understanding user intent, context, and semantic meaning. It intelligently analyzes queries to deliver highly accurate, relevant, and actionable results empowering your team to save time, make faster decisions, and unlock the full potential of your organization's knowledge.
            </p>
            <Link to="/features" className="smart-search-btn">
              Learn More
            </Link>
          </div>
        <div className="smart-search-image">
  <img
    src="/icons/Rectangle 7671.png"
    alt="Smart Search Interface"
    className="smart-search-img"
  />
</div>

        </div>
      </div>
    </section>
  );
}

export default SmartSearchSection;
