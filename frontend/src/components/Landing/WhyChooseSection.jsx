import React from "react";
import "../../styles/WhyChooseSection.css";

function WhyChooseSection() {
  const benefits = [
    "Save 5+ hours per week on information searches",
    "Reduce repetitive questions by 80% with self-service",
    "Onboard new team members 3x faster",
    "Ensure compliance with up-to-date policy access"
  ];

  const stats = [
    {
      number: "98%",
      label: "Accuracy",
      bgColor: "#FAF2FE"
    },
    {
      number: "<3s",
      label: "Response Time",
      bgColor: "#E8F9FF"
    },
    {
      number: "10GB+",
      label: "Storage Space",
      bgColor: "rgba(254, 214, 170, 0.70)"
    }
  ];

  return (
    <section className="why-choose-section">
      <div className="why-choose-container">
        <h2 className="why-choose-title">Why Teams Choose Vala.ai</h2>
        
        <div className="benefits-list">
          {benefits.map((benefit, index) => (
            <div key={index} className="benefit-item">
              <svg className="check-icon" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.9998 32.4002L9.5998 24.0002L6.7998 26.8002L17.9998 38.0002L41.9998 14.0002L39.1998 11.2002L17.9998 32.4002Z" fill="#323232"/>
              </svg>
              <span className="benefit-text">{benefit}</span>
            </div>
          ))}
        </div>

        <div className="stats-cards">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="stat-card"
              style={{ backgroundColor: stat.bgColor }}
            >
              <div className="stat-number3">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseSection;
