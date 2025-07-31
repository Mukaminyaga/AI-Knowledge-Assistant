import React from "react";
import LandingHeader from "../components/Landing/LandingHeader";
import FeaturesOverview from "../components/Landing/FeaturesOverview";
import LandingFooter from "../components/Landing/LandingFooter";
import "../styles/LandingPage.css";

function Features() {
  return (
    <div className="features-page">
      <LandingHeader />
      <main className="features-main">
        <div className="features-page-header">
          <div className="landing-container">
            <h1 className="features-page-title">
              Powerful Features for Modern Teams
            </h1>
            <p className="features-page-description">
              Discover how our AI Knowledge Assistant can transform the way your team finds, shares, and uses information across your organization.
            </p>
          </div>
        </div>
        <FeaturesOverview />
      </main>
      <LandingFooter />
    </div>
  );
}

export default Features;
