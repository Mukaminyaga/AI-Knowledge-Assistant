import React from "react";
import "../../styles/WhyChooseSection.css";

function WhyChooseSection() {
  const benefits = [
    "Ask questions and get tailored answers powered by your own documents.",
    "Generate summaries, explanations, or organized content from organizational knowledge.",
    "Engage in dynamic conversations, ask follow-up questions, and uncover insights instantly.",
    "Search across multiple formats, including PDFs, Word documents, text files, and more, in seconds."
  ];

  const stats = [
    {
      number: "95%",
      label: " Query Accuracy",
      bgColor: "#FAF2FE"
    },
    {
      number: "<3s",
      label: "Response Time",
      bgColor: "#E8F9FF"
    },
    {
      number: "24/7",
      label: "Availability",
      bgColor: "rgba(254, 214, 170, 0.70)"
    }
    
  ];

  return (
    <section className="why-choose-section">
      <div className="why-choose-container">
        <h2 className="why-choose-title">What You Can Do with Vala.ai</h2>
         <div className="why-choose-summary">
        <p>Through our intuitive platform, your team can:</p>
        </div>
        <div className="benefits-list">
          {benefits.map((benefit, index) => (
            <div key={index} className="benefit-item">
              <svg className="check-icon" width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.9998 32.4002L9.5998 24.0002L6.7998 26.8002L17.9998 38.0002L41.9998 14.0002L39.1998 11.2002L17.9998 32.4002Z" fill="#323232"/>
              </svg>
              <span className="benefit-text">{benefit}</span>
            </div>
          ))}
        </div>

        <div className="why-choose-summary">
          <p>Vala.ai helps organizations to Unlock the full value of their knowledge base, Strengthen collaboration and decision-making, and Translate project outputs into practical insights and strategic guidance.</p>
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
