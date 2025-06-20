import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import "../styles/Features.css";

function Features() {
  const features = [
    {
      icon: "🔍",
      title: "Intelligent Search",
      description:
        "Powerful AI-driven search that understands context and delivers precise answers from your knowledge base.",
      benefits: [
        "Natural language processing",
        "Context-aware results",
        "Multi-format document support",
        "Real-time indexing",
      ],
    },
    {
      icon: "📚",
      title: "Knowledge Management",
      description:
        "Centralize all your company knowledge in one secure, easily accessible platform.",
      benefits: [
        "Document versioning",
        "Access control",
        "Automated categorization",
        "Integration with existing tools",
      ],
    },
    {
      icon: "🤖",
      title: "AI Assistant",
      description:
        "Your personal knowledge companion that learns from your data and provides instant assistance.",
      benefits: [
        "24/7 availability",
        "Personalized responses",
        "Learning from interactions",
    
      ],
    },

    {
      icon: "🔒",
      title: "Enterprise Security",
      description:
        "High-level security with role-based access control and compliance features.",
      benefits: [
        "End-to-end encryption",
        "Role-based permissions",
        "Audit trails",
        "Compliance ready",
      ],
    },
    {
      icon: "⚡",
      title: "Lightning Fast",
      description:
        "Get answers in seconds, not hours. Our optimized infrastructure ensures rapid response times.",
      benefits: [
        "Sub-second search",
        "Global CDN",
        "Scalable architecture",
        "99.9% uptime",
      ],
    },
  ];

  return (
    <div className="features-container">
      <Header />

      <section className="features-hero">
        <div className="container">
          <h1 className="features-hero-title">
            Powerful Features for <br />
            Modern Teams
          </h1>
          <p className="features-hero-description">
            Discover how our AI Knowledge Assistant can transform the way your
            team finds, shares, and uses information across your organization.
          </p>
        </div>
      </section>

      <main className="features-content">
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <span className="feature-icon">{feature.icon}</span>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <ul className="feature-list">
                {feature.benefits.map((benefit, benefitIndex) => (
                  <li key={benefitIndex} className="feature-list-item">
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <section className="demo-section">
          <h2 className="demo-title">Ready to Experience the Power?</h2>
          <p className="demo-description">
            See how our AI Knowledge Assistant can revolutionize your team's
            productivity with a personalized demo tailored to your use case.
          </p>
          <div className="demo-buttons">
            <button className="btn btn-primary btn-large">
              Schedule a Demo
            </button>
            {/* <button className="btn btn-secondary btn-large">
              Try Free Trial
            </button> */}
          </div>
        </section>
      </main>

      <section className="cta-section">
        <div className="container">
          <h2 className="cta-title">Start Your Knowledge Revolution</h2>
          <p className="cta-description">
            Join thousands of teams who have already transformed their knowledge
            management with our AI-powered solution.
          </p>
          <Link to="/contact" className="cta-button">
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Features;
