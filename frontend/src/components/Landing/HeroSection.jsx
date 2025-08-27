import React from "react";
import { Link } from "react-router-dom";
import "../../styles/HeroSection.css";

function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-background"></div>
      <div className="hero-wave">
        <svg viewBox="0 0 1441 1006" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M31 26.0001C31 26.0001 248.134 291.478 472 319C755.381 353.84 1041.6 140.863 1370.5 581.5C1699.4 1022.14 659.5 1010.5 580 902"
            stroke="url(#paint0_linear_246_5159)"
            strokeWidth="80"
          />
          <defs>
            <linearGradient id="paint0_linear_246_5159" x1="-6.49958" y1="-0.500368" x2="1571.5" y2="821" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FAF2FE"/>
              <stop offset="0.2" stopColor="#E6DCFF"/>
              <stop offset="1" stopColor="#FAF2FE"/>
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              
              <span className="hero-title-gradient">Turning Organizational<br></br>
              Knowledge </span>
              into Actionable Insights
            </h1>

            <p className="hero-description">
             Your knowledge, made accessible.
            </p>

            <div className="hero-buttons">
              <Link to="/contact" className="hero-btn-primary">
                Request a Demo
              </Link>
              {/* <Link to="/contact" className="hero-btn-secondary">
                Request a Demo
              </Link> */}
              
            </div>

            <div className="hero-stats">
               <div className="stat-item1">
                <div className="stat-number1">1000+</div>
                <div className="stat-label1">Documents Processed</div>
              </div>
                <div className="stat-item1">
                <div className="stat-number1">95%</div>
                <div className="stat-label1">Query Accuracy</div>
              </div>
              {/* <div className="stat-item1">
                <div className="stat-number1">10GB+</div>
                <div className="stat-label1">Secure File Storage<br></br>  Per User</div>
              </div> */}
              <div className="stat-item1">
                <div className="stat-number1">5x</div>
                <div className="stat-label1">Faster Information<br></br> Retrieval</div>
              </div>
            </div>

          </div>


    {/* <div className="hero-image">
            <img
src="/icons/Rectangle 7667 (2).png"
         alt="AI Knowledge Management Platform"
              className="hero-main-image"
            />
          </div> */}

        </div>
      </div>
    </section>
  );
}

export default HeroSection;
