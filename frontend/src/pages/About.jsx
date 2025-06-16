import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import "../styles/About.css";

function About() {
  const teamMembers = [
    {
      name: "Sarah Chen",
      role: "CEO & Co-Founder",
      avatar: "👩‍💼",
      bio: "Former VP of Engineering at Google. Passionate about democratizing access to knowledge through AI.",
    },
    {
      name: "Marcus Johnson",
      role: "CTO & Co-Founder",
      avatar: "👨‍💻",
      bio: "AI researcher with 15+ years in machine learning. Previously led AI initiatives at Microsoft.",
    },
    {
      name: "Elena Rodriguez",
      role: "Head of Product",
      avatar: "👩‍🎨",
      bio: "Product design expert focused on creating intuitive knowledge management experiences.",
    },
    {
      name: "David Kim",
      role: "Lead AI Engineer",
      avatar: "🧑‍🔬",
      bio: "PhD in Natural Language Processing. Specializes in enterprise-scale AI implementations.",
    },
  ];

  const values = [
    {
      icon: "🎯",
      title: "Purpose-Driven",
      description:
        "We believe knowledge should be accessible to everyone, everywhere.",
    },
    {
      icon: "🚀",
      title: "Innovation First",
      description:
        "Pushing the boundaries of what's possible with AI and knowledge management.",
    },
    {
      icon: "🤝",
      title: "Customer-Centric",
      description:
        "Your success is our success. We build solutions that truly matter.",
    },
    {
      icon: "🌍",
      title: "Global Impact",
      description:
        "Creating technology that makes a positive difference worldwide.",
    },
  ];

  return (
    <div className="about-container">
      <Header />

      <section className="about-hero">
        <div className="container">
          <h1 className="about-hero-title">
            Empowering Teams with <br />
            Intelligent Knowledge
          </h1>
          <p className="about-hero-description">
            We're on a mission to transform how organizations discover, share,
            and leverage their collective knowledge through the power of
            artificial intelligence.
          </p>
        </div>
      </section>

      <main className="about-content">
        <section className="about-section">
          <h2 className="about-section-title">Our Story</h2>
          <p className="about-text">
            Founded in 2021, AI Knowledge Assistant was born from a simple
            observation: most organizations struggle with knowledge silos and
            information overload. Our founders, having experienced these
            challenges firsthand at major tech companies, set out to create a
            solution that would make organizational knowledge truly accessible.
          </p>
          <p className="about-text">
            Today, we serve thousands of teams worldwide, from startups to
            Fortune 500 companies, helping them unlock the full potential of
            their collective knowledge through our AI-powered platform.
          </p>
          <p className="about-text">
            Our journey is just beginning. We continue to push the boundaries of
            what's possible when human expertise meets artificial intelligence,
            creating tools that don't just store information, but truly
            understand and contextualize it.
          </p>
        </section>

        <section className="about-section">
          <div className="mission-vision-grid">
            <div className="mission-vision-card">
              <span className="mission-vision-icon">🎯</span>
              <h3 className="mission-vision-title">Our Mission</h3>
              <p className="mission-vision-text">
                To democratize access to organizational knowledge by creating
                intelligent systems that understand, organize, and deliver
                information when and where it's needed most.
              </p>
            </div>
            <div className="mission-vision-card">
              <span className="mission-vision-icon">🔮</span>
              <h3 className="mission-vision-title">Our Vision</h3>
              <p className="mission-vision-text">
                A world where every team member has instant access to the
                collective wisdom of their organization, powered by AI that
                truly understands context and intent.
              </p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2 className="about-section-title">Meet Our Team</h2>
          <p className="about-text">
            Our diverse team brings together expertise in artificial
            intelligence, product design, enterprise software, and customer
            success to create solutions that truly work.
          </p>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-member">
                <div className="team-avatar">{member.avatar}</div>
                <h3 className="team-name">{member.name}</h3>
                <p className="team-role">{member.role}</p>
                <p className="team-bio">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="values-section">
          <h2 className="about-section-title">Our Values</h2>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-item">
                <span className="value-icon">{value.icon}</span>
                <h3 className="value-title">{value.title}</h3>
                <p className="value-description">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="contact-cta">
          <h2 className="contact-cta-title">Join Our Mission</h2>
          <p className="contact-cta-description">
            Ready to transform how your organization manages knowledge? Let's
            start the conversation.
          </p>
          <Link to="/contact" className="contact-cta-button">
            Get in Touch
          </Link>
        </section>
      </main>
    </div>
  );
}

export default About;
