import React from "react";
import { Link } from "react-router-dom";
import "../../styles/AIChatSection.css";

function AIChatSection() {
  return (
    <section className="ai-chat-section">
      <div className="ai-chat-container">
        <div className="ai-chat-content">
          <div className="ai-chat-text">
            <h2 className="ai-chat-title">AI Chat Assistant</h2>
            <p className="ai-chat-description">
Empower your team with a conversational AI assistant that answers questions in real time using your uploaded documents. Vala understands natural language, refines its responses through continuous learning, and evolves with your content providing quick, precise, and context-aware answers that reduce back-and-forth and streamline knowledge access.            </p>
            <Link to="/features" className="ai-chat-btn">
              Learn More
            </Link>
          </div>
          <div className="ai-chat-image">
            <img
src="/icons/human4.jpg"              alt="AI Chat Assistant Interface"
              className="ai-chat-img"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default AIChatSection;
