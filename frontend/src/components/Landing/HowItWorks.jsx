import React from "react";
import "../../styles/HowItWorks.css";

function HowItWorks() {
  return (
    <section className="how-it-works">
      <div className="how-it-works-container">
        <div className="about-header">
          <h1 className="how-it-works-title">Why Vala.ai</h1>
        </div>

        <div className="about-description">
          <div className="how-it-works-intro">
            <p>
              Most AI tools rely on publicly available data. Vala.ai is different. It draws directly from your organization's proprietary knowledge resources; content not available online, ensuring secure, accurate, and tailored responses for your team
            </p>
          </div>
        </div>
        
        <h2 className="how-it-works-title">How it Works</h2>  
              
        
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">01</div>
            <div className="step-icon">
              <svg width="64" height="64" viewBox="0 0 148 148" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M129.5 18.5H18.5003C11.6553 18.5 6.16699 23.9883 6.16699 30.8333V117.167C6.16699 124.012 11.6553 129.5 18.5003 129.5H129.5C136.345 129.5 141.834 124.012 141.834 117.167V30.8333C141.834 23.9883 136.345 18.5 129.5 18.5ZM129.5 117.29H18.5003V30.71H129.5V117.29ZM61.667 74H49.3337L74.0003 49.3333L98.667 74H86.3337V98.6667H61.667V74Z" fill="#FC9547"/>
              </svg>
            </div>
            <h3 className="step-title">Capture</h3>
            <p className="step-description">
              Easily upload documents into a single, secure knowledge hub
            </p>
          </div>
          
          <div className="step-card">
            <div className="step-number">02</div>
            <div className="step-icon">
              <svg width="64" height="64" viewBox="0 0 148 148" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.333 123.333H135.666V98.6665H12.333V123.333ZM24.6663 104.833H36.9997V117.167H24.6663V104.833ZM12.333 24.6665V49.3332H135.666V24.6665H12.333ZM36.9997 43.1665H24.6663V30.8332H36.9997V43.1665ZM12.333 86.3332H135.666V61.6665H12.333V86.3332ZM24.6663 67.8332H36.9997V80.1665H24.6663V67.8332Z" fill="#AA3BDE"/>
              </svg>
            </div>
            <h3 className="step-title">Organize</h3>
            <p className="step-description">
              Vala.ai structures your content into a searchable and well-organized knowledge base where employees can quickly find the information they need.
            </p>
          </div>
          
          <div className="step-card">
            <div className="step-number">03</div>
            <div className="step-icon">
              <svg width="64" height="64" viewBox="0 0 148 148" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M80.167 73.9998H123.334V83.2498H80.167V73.9998ZM80.167 58.5832H123.334V67.8332H80.167V58.5832ZM80.167 89.4165H123.334V98.6665H80.167V89.4165ZM129.5 24.6665H18.5003C11.717 24.6665 6.16699 30.2165 6.16699 36.9998V117.167C6.16699 123.95 11.717 129.5 18.5003 129.5H129.5C136.284 129.5 141.834 123.95 141.834 117.167V36.9998C141.834 30.2165 136.284 24.6665 129.5 24.6665ZM129.5 117.167H74.0003V36.9998H129.5V117.167Z" fill="#45A1C6"/>
              </svg>
            </div>
            <h3 className="step-title">Empower</h3>
            <p className="step-description">
              Teams can ask questions, search, and get precise answers in seconds. Vala.ai ensures employees work confidently, make informed decisions, and move faster without being slowed down by scattered or siloed information.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
