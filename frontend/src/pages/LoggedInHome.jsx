import React from "react";
import { Link } from "react-router-dom";
import "../styles/LoggedInHome.css";

function LoggedInHome() {
  return (
    <div className="ai-home-container">
      <div className="ai-header">
        <div className="brand-title">
          AI Knowlege <br />
          Assistant
        </div>
        <div className="nav-menu">
          <div className="nav-item active">Home</div>
          <div className="nav-item">Features</div>
          <div className="nav-item">About Us</div>
          <Link to="/login" className="signin-btn">
            Sign in
          </Link>
          <button className="demo-btn">Try a Demo</button>
        </div>
      </div>

      <div className="main-content">
        <div className="content-columns">
          <div className="left-content">
            <div className="hero-section">
              <h1 className="hero-title">
                Smarter Knowledge
                <br />
                Discovery <br />
                with AI
              </h1>
              <p className="hero-description">
                Empower your team to find answers fast — <br />
                from HR policies, internal docs, FAQs, and more — <br />
                all in one place
              </p>
              <Link to="/dashboard" className="get-started-btn">
                Get Started
              </Link>
              <div className="team-badge">
                <div className="team-emoji">👥</div>
                <div className="team-text">
                  Helping teams work smarter with AI
                </div>
              </div>
            </div>
          </div>

          <div className="right-content">
            <div className="ai-interface">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/0e944e7e924c57835acc93c4e90e613f01f1622e?placeholderIfAbsent=true&apiKey=ea5315464b7044b69c5ba8769be22018"
                className="interface-background"
                alt="AI Interface Background"
              />

              <div className="chat-panel">
                <div className="chat-greeting">Hey,Mike need help</div>
                <div className="chat-prompt">Ask me anything </div>
                <div className="quick-searches-label">Quick searches</div>
                <div className="search-tags">
                  <div className="search-tag">
                    <div className="tag-label">Onboarding</div>
                  </div>
                  <div className="search-tag">
                    <div className="tag-label">Policies</div>
                  </div>
                  <div className="search-tag">
                    <div className="tag-label">Training</div>
                  </div>
                </div>
              </div>

              <div className="home-panel">
                <div className="home-header">
                  <div className="home-label">Home</div>
                  <div className="home-icon-area">
                    <div className="home-icon-wrapper">
                      <div className="home-icon">
                        <img
                          src="https://cdn.builder.io/api/v1/image/assets/TEMP/18b68749a6ade76d57c671cddde5953d489ade18?placeholderIfAbsent=true&apiKey=ea5315464b7044b69c5ba8769be22018"
                          className="home-icon-image"
                          alt="Home Icon"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="search-area">
                  <div className="search-container">
                    <div className="search-input-group">
                      <div className="search-input-wrapper">
                        <div className="search-icon-section">
                          <img
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/91435b73ac441d923a1b11c9232bb4799d653435?placeholderIfAbsent=true&apiKey=ea5315464b7044b69c5ba8769be22018"
                            className="search-icon"
                            alt="Search Icon"
                          />
                        </div>
                        <div className="search-placeholder">
                          Search for documents, folders, or people
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="search-border"></div>
              </div>

              <div className="documents-panel">
                <div className="documents-header"> Documents</div>
                <div className="upload-section">
                  <div className="upload-row">
                    <div className="upload-label">Upload a document</div>
                    <div className="upload-icon-area">
                      <div className="upload-icon-wrapper">
                        <img
                          src="https://cdn.builder.io/api/v1/image/assets/TEMP/c41db42c1d4753421d89e411af318ba2dd4d300d?placeholderIfAbsent=true&apiKey=ea5315464b7044b69c5ba8769be22018"
                          className="upload-icon"
                          alt="Upload Icon"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="upload-border"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoggedInHome;
