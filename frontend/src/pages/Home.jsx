import React from "react";
import "../styles/Home.css";

function Home() {
  return (
    <div className="chat-container">
      <div className="desktop-layout">
        <div className="sidebar">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/8bec5fd07b066f4c244b33ebda2a2c9d5c09f55e?placeholderIfAbsent=true"
            className="logo-image"
            alt="Logo"
          />
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/a4784354f91d2a08bd7d76ffc5df9ee473f0de31?placeholderIfAbsent=true"
            className="nav-icon"
            alt="Navigation icon"
          />
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/679fbbab4eb08ea8b1eec1b878025b8cc01c7427?placeholderIfAbsent=true"
            className="nav-icon"
            alt="Navigation icon"
          />
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/9aefdbca3241c9e024ae84a44353d1f33e64eef6?placeholderIfAbsent=true"
            className="nav-icon"
            alt="Navigation icon"
          />
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/f9b9b7bd67fddc92be60dfa74a7fb4438b74c4a4?placeholderIfAbsent=true"
            className="nav-icon"
            alt="Navigation icon"
          />
        </div>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/c4cf647c053511fbe5e6b02e954f8f34b7691c86?placeholderIfAbsent=true"
          className="profile-icon"
          alt="Profile"
        />
        <div className="main-content">
          <div className="chat-header-section">
            <div className="new-chat-button">
              New Chat
            </div>
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/f980d815558b7d3ef79877f361fed5d51296e05c?placeholderIfAbsent=true"
              className="chat-illustration"
              alt="Chat illustration"
            />
            <div className="greeting-text">
              Hi there,
            </div>
            <div className="help-text">
              How can I help?
            </div>
          </div>
          <div className="suggestions-section">
            <div className="suggestions-grid">
              <div className="suggestion-card">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/a45695d907e33d937a751065ec5e48f3b3ba2bab?placeholderIfAbsent=true"
                  className="suggestion-icon"
                  alt="Suggestion icon"
                />
                <div className="suggestion-text">
                  Where can I find the employee code of conduct?
                </div>
              </div>
              <div className="suggestion-card">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/6f7773bacd4ec7789b1064c5e157f280cab52a08?placeholderIfAbsent=true"
                  className="suggestion-icon"
                  alt="Suggestion icon"
                />
                <div className="suggestion-text">
                  Find onboarding materials for new hires.
                </div>
              </div>
              <div className="suggestion-card">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/81eb2eb3c3152ed49e125f6eb4d3d147add36fec?placeholderIfAbsent=true"
                  className="suggestion-icon"
                  alt="Suggestion icon"
                />
                <div className="suggestion-text">
                  How do I reset my company email password?
                </div>
              </div>
            </div>
          </div>
          <div className="input-section">
            <div className="input-container">
              <div className="input-placeholder">
                Ask me anything ..
              </div>
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/6ce4305ae9d9863a81bf73837262b9375cbdce70?placeholderIfAbsent=true"
                className="attachment-icon"
                alt="Attachment"
              />
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/99f3e69ef66aa962902be4f65631319f99009d5b?placeholderIfAbsent=true"
                className="send-icon"
                alt="Send"
              />
            </div>
            <div className="disclaimer-text">
              The assistant's accuracy depends on the quality of uploaded
              documents. If something seems off, contact your Admin
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
