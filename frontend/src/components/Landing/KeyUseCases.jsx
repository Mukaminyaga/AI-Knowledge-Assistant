import React from "react";
import { Link } from "react-router-dom";
import "../../styles/KeyUseCases.css";

function KeyUseCases() {
  const useCases = [
    {
      id: 1,
      title: "Knowledge Management",
      description: "Centralize your organization's collective intelligence and make it instantly searchable. Vala.ai ensures that critical information is organized, accessible, and easy to retrieve, reducing wasted time and breaking down data silos across departments.",
      bgColor: "#FAF2FE",
      btnColor: "#D277FF"
    },
    {
      id: 2,
      title: "Training & Onboarding",
      description: "Shorten learning curves and improve retention with conversational training flows. New employees can quickly access key resources, interactive guides, and AI-driven Q&A to adapt faster and become productive in less time.",
      bgColor: "#E8F9FF",
      btnColor: "#3ACCFF"
    },
    {
      id: 3,
      title: "HR & Employee Self-Service",
      description: "Let employees get instant answers to policy, benefits, and compliance queries without waiting for HR support. This self-service approach streamlines internal communications, reduces repetitive questions, and improves employee satisfaction.",
      bgColor: "#E3FCFC",
      btnColor: "#55C9C9"
    },
    {
      id: 4,
      title: "Learning & Development",
      description: "Capture valuable feedback, monitor team growth, and adapt your learning and development strategies using data-driven insights. Vala.ai helps identify skill gaps, measure engagement, and support continuous professional development.",
      bgColor: "#E8F9FF",
      btnColor: "#5DAAC5"
    }
  ];

  return (
    <section className="key-use-cases">
      <div className="key-use-cases-container">
        <div className="key-use-cases-header">
          <h2 className="key-use-cases-title">Key Use Cases</h2>
          <p className="key-use-cases-description">
            Vala.ai is built to solve real organizational challenges by providing intelligent solutions across multiple functions. Whether it's streamlining knowledge access, improving employee onboarding, or empowering self-service, our platform adapts to diverse needs with AI-powered precision.
          </p>
        </div>

        <div className="use-cases-grid">
          {useCases.map((useCase) => (
            <div 
              key={useCase.id} 
              className="use-case-card"
              style={{ backgroundColor: useCase.bgColor }}
            >
              <h3 className="use-case-title">{useCase.title}</h3>
              <p className="use-case-description">{useCase.description}</p>
              <Link 
                to="/features" 
                className="use-case-btn"
                style={{ backgroundColor: useCase.btnColor }}
              >
                Learn More
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default KeyUseCases;
