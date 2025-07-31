import React, { useState } from "react";
import SmartSearchSection from "./SmartSearchSection";
import AIChatSection from "./AIChatSection";
import CentralizedHubSection from "./CentralizedHubSection";
import SecureCompliantSection from "./SecureCompliantSection";
import "../../styles/FeaturesOverview.css";

function FeaturesOverview() {
  const [activeFeature, setActiveFeature] = useState("smart-search");

  const features = [
    { id: "smart-search", name: "Smart Search" },
    { id: "ai-chat", name: "AI Chat Assistant" },
    { id: "centralized-hub", name: "Centralized Knowledge Hub" },
    { id: "secure-compliant", name: "Secure & Compliant" }
  ];

  const renderActiveFeature = () => {
    switch (activeFeature) {
      case "smart-search":
        return <SmartSearchSection />;
      case "ai-chat":
        return <AIChatSection />;
      case "centralized-hub":
        return <CentralizedHubSection />;
      case "secure-compliant":
        return <SecureCompliantSection />;
      default:
        return <SmartSearchSection />;
    }
  };

  const getActiveLinePosition = () => {
    const index = features.findIndex(feature => feature.id === activeFeature);
    return index * 25; // 25% for each tab
  };

  return (
    <>
      <section className="features-overview">
        <div className="features-overview-container">
          <div className="features-overview-content">
            <h2 className="features-overview-title">
              Embracing AI-Powered Knowledge Management
            </h2>
            <p className="features-overview-description">
              Vala.ai is an intelligent knowledge management platform that helps teams find, share, and act on information with ease. Whether it's employee onboarding, customer support, or internal documentation, Vala.ai ensures your organization's knowledge is always accessible and never siloed.
            </p>
          </div>

          <div className="features-tabs">
            {features.map((feature) => (
              <div
                key={feature.id}
                className={`feature-tab ${activeFeature === feature.id ? 'active' : ''}`}
                onClick={() => setActiveFeature(feature.id)}
              >
                {feature.name}
              </div>
            ))}
          </div>

          <div className="features-divider">
            <div className="features-line"></div>
            <div
              className="features-active-line"
              style={{ left: `${getActiveLinePosition()}%` }}
            ></div>
          </div>
        </div>
      </section>

      {renderActiveFeature()}
    </>
  );
}

export default FeaturesOverview;
