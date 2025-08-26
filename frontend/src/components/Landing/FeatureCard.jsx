import React from "react";
import { Link } from "react-router-dom";
import "../../styles/FeatureCard.css";

function FeatureCard({ title, description, imageSrc, imageAlt, className = "", backgroundColor = "rgba(255, 255, 255, 0.8)", buttonColor = "#32137F", buttonHoverColor = "#2a0f6b" }) {
  return (
    <div className={`feature-card ${className}`} style={{ background: backgroundColor }}>
      {/* <div className="feature-card-image">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="feature-img"
        />
      </div> */}
      <div className="feature-card-content">
        <h3 className="feature-card-title">{title}</h3>
        <p className="feature-card-description">{description}</p>
        <Link
          to="/features"
          className="feature-card-btn"
          style={{
            background: buttonColor,
            boxShadow: `0 4px 14px 0 ${buttonColor}30`
          }}
          onMouseEnter={(e) => {
            e.target.style.background = buttonHoverColor;
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = `0 6px 20px 0 ${buttonColor}40`;
          }}
          onMouseLeave={(e) => {
            e.target.style.background = buttonColor;
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = `0 4px 14px 0 ${buttonColor}30`;
          }}
        >
          Learn More
        </Link>
      </div>
    </div>
  );
}

export default FeatureCard;
