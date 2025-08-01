import React from "react";
import LandingHeader from "../components/Landing/LandingHeader";
import HeroSection from "../components/Landing/HeroSection";
import StatsSection from "../components/Landing/StatsSection";
import FeaturesOverview from "../components/Landing/FeaturesOverview";
import KeyUseCases from "../components/Landing/KeyUseCases";
import HowItWorks from "../components/Landing/HowItWorks";
import WhoUsesSection from "../components/Landing/WhoUsesSection";
import UserRolesSection from "../components/Landing/UserRolesSection";
import WhyChooseSection from "../components/Landing/WhyChooseSection";
import LandingFooter from "../components/Landing/LandingFooter";
import "../styles/LandingPage.css";

function LandingPage() {
  return (
    <div className="landing-page">
      <LandingHeader />
      <main className="landing-main">
        <HeroSection />
        <StatsSection />
        <FeaturesOverview />
        <KeyUseCases />
        <HowItWorks />
        <WhoUsesSection />
        <UserRolesSection />
        <WhyChooseSection />
      </main>
      <LandingFooter />
    </div>
  );
}

export default LandingPage;
