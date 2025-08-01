import React from "react";
import "../../styles/StatsSection.css";

function StatsSection() {
  return (
    <section className="stats-section">
      <div className="stats-container">
       <div className="stat-item">
          <div className="stat-number">10GB+</div>
          <div className="stat-label">Secure File Storage Per User</div>
        </div>
        {/* <div className="stat-item">
          <div className="stat-number">15+</div>
          <div className="stat-label">Institutions Using the Platform</div>
        </div> */}
        {/* <div className="stat-item">
          <div className="stat-number">10+</div>
          <div className="stat-label">Supported Countries</div>
        </div> */}
        <div className="stat-item">
          <div className="stat-number">98%</div>
          <div className="stat-label">Positive Feedback</div>
        </div>
      </div>
    </section>
  );
}

export default StatsSection;
