import React from "react";
import "../../styles/StatsSection.css";

function StatsSection() {
  return (
    <section className="stats-section">
      <div className="stats-container">
        <div className="stat-item">
          <div className="stat-number">1,000+</div>
          <div className="stat-label">Active Monthly Users</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">23+</div>
          <div className="stat-label">Countries Available</div>
        </div>
      </div>
    </section>
  );
}

export default StatsSection;
