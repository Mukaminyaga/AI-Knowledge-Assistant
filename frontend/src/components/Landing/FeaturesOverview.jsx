import React from "react";
import FeatureCard from "./FeatureCard";
import "../../styles/FeaturesOverview.css";

function FeaturesOverview() {
  const features = [
    {
      id: "smart-search",
      title: "Smart Search",
      description: "Discover information in seconds with our AI-driven search engine that goes beyond simple keyword matching by deeply understanding user intent, context, and meaning.",
      imageSrc: "/icons/Rectangle 7671.png",
      imageAlt: "Smart Search Interface",
      backgroundColor: "#E8F9FF",
      buttonColor: "#31617B",
      buttonHoverColor: "#2a4f63"
    },
    {
      id: "ai-chat",
      title: "AI Chat Assistant",
      description: "Empower your team with a conversational AI that delivers real-time answers directly from your organization's documents with continuous learning.",
      imageSrc: "/icons/human4.jpg",
      imageAlt: "AI Chat Assistant Interface",
      backgroundColor: "#FAF2FE",
      buttonColor: "#D277FF",
      buttonHoverColor: "#c25aff"
    },
    {
      id: "centralized-hub",
      title: "Centralized Knowledge Hub",
      description: "Create a unified repository where all your organizational knowledge lives, making information easily accessible and manageable for your entire team.",
      imageSrc: "/icons/human2.jpg",
      imageAlt: "Centralized Knowledge Hub",
      backgroundColor: "#E3FCFC",
      buttonColor: "#55C9C9",
      buttonHoverColor: "#45b8b8"
    },
    {
      id: "secure-compliant",
      title: "Secure & Compliant",
      description: "Enterprise-grade security with full compliance standards, ensuring your sensitive organizational data remains protected and meets regulatory requirements.",
      imageSrc: "/icons/human.jpg",
      imageAlt: "Secure & Compliant Platform",
      backgroundColor: "#FDE1C3",
      buttonColor: "#FC9546",
      buttonHoverColor: "#fa8530"
    }
  ];

  return (
    <>
      <section className="features-overview">
        <div className="features-overview-container">
          <div className="features-overview-content">
            <h2 className="features-overview-title">
              Embracing AI-Powered Knowledge Management
            </h2>
            <p className="features-overview-description">
Vala.ai is an AI-powered knowledge management platform that transforms reports, policy briefs, publications, and technical documents into clear, searchable, and actionable insights. Whether it's employee onboarding, customer support, or navigating internal documentation, Vala.ai makes your organization’s knowledge instantly accessible whenever it’s needed            </p>
          </div>

          <div className="features-grid">
            {features.map((feature) => (
              <FeatureCard
                key={feature.id}
                title={feature.title}
                description={feature.description}
                imageSrc={feature.imageSrc}
                imageAlt={feature.imageAlt}
                backgroundColor={feature.backgroundColor}
                buttonColor={feature.buttonColor}
                buttonHoverColor={feature.buttonHoverColor}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default FeaturesOverview;
