import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import "../styles/Home.css";

function Home() {
  return (
    <div className="home-container">
      <Header />
      <div className="main-content">
        <div className="content-grid">
          <div className="left-column">
            <div className="hero-content">
              <div className="hero-title">
                Smarter Knowledge
                <br />
                Discovery <br />
                with AI
              </div>
              <div className="hero-description">
                Empower your team to find answers fast — <br />
                from HR policies, internal docs, FAQs, and more — <br />
                all in one place
              </div>
              <Link to="/signup" className="get-started-button pulse">
                Get Started
              </Link>
              <div className="team-info">
                <div className="team-text">
                  Helping teams work smarter with AI
                </div>
              </div>
            </div>
          </div>
          <div className="right-column">
            <div className="ai-interface">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/0e944e7e924c57835acc93c4e90e613f01f1622e?placeholderIfAbsent=true&apiKey=ea5315464b7044b69c5ba8769be22018"
                className="background-image"
                alt="AI Interface Background"
              />
              <div className="chat-window">
                <div className="chat-header">💬 Live AI Conversation</div>
                <div className="conversation-example">
                  <div className="user-message">
                    <div className="message-label">You</div>
                    <div className="message-content">
                      "What's our remote work policy for new hires?"
                    </div>
                  </div>
                  <div className="ai-message">
                    <div className="message-label">🤖 AI Assistant</div>
                    <div className="message-content">
                      Based on your Employee Handbook (pg. 23), new hires can
                      work remotely after completing their first 30 days
                      in-office. Remote work requires:
                      <br />• Manager approval
                      <br />• Home office setup completion
                      <br />• IT security training certification
                    </div>
                    <div className="source-reference">
                      📄 Source: Employee Handbook v2.3, HR Policy #108
                    </div>
                  </div>
                </div>
                <div className="quick-searches-title">Try these examples</div>
                <div className="search-tags">
                  <div className="search-tag">
                    <div className="tag-text">Benefits</div>
                  </div>
                  <div className="search-tag">
                    <div className="tag-text">Time Off</div>
                  </div>
                  <div className="search-tag">
                    <div className="tag-text">Expenses</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="features-section">
          <div className="features-header">
            <h2 className="features-title">
              Powerful Features for Smarter Teams
            </h2>
            <p className="features-subtitle">
              Everything you need to transform how your team finds and shares
              knowledge
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3 className="feature-title">Smart Search</h3>
              <p className="feature-description">
                Find answers instantly across all your documents, policies, and
                knowledge base with AI-powered search.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3 className="feature-title">AI Assistant</h3>
              <p className="feature-description">
                Get contextual answers and suggestions from your personalized AI
                assistant trained on your company data.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3 className="feature-title">Knowledge Base</h3>
              <p className="feature-description">
                Centralize all your documents, FAQs, and procedures in one
                searchable, organized knowledge base.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3 className="feature-title">Quick Actions</h3>
              <p className="feature-description">
                Access frequently needed information with smart shortcuts and
                personalized quick searches.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3 className="feature-title">Team Collaboration</h3>
              <p className="feature-description">
                Share knowledge, insights, and updates seamlessly across teams
                with real-time collaboration tools.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="how-it-works-section">
          <div className="how-it-works-header">
            <h2 className="how-it-works-title">How It Works</h2>
            <p className="how-it-works-subtitle">
              Get started in minutes with our simple, intuitive process
            </p>
          </div>

          <div className="steps-container">
            <div className="step-item">
              <div className="step-number">01</div>
              <div className="step-content">
                <h3 className="step-title">Upload Your Documents</h3>
                <p className="step-description">
                  Simply drag and drop your existing documents, policies, and
                  knowledge base files into our secure platform.
                </p>
              </div>
            </div>

            <div className="step-item">
              <div className="step-number">02</div>
              <div className="step-content">
                <h3 className="step-title">AI Processing</h3>
                <p className="step-description">
                  Our AI analyzes and indexes your content, creating intelligent
                  connections and understanding context.
                </p>
              </div>
            </div>

            <div className="step-item">
              <div className="step-number">03</div>
              <div className="step-content">
                <h3 className="step-title">Start Searching</h3>
                <p className="step-description">
                  Ask questions in natural language and get instant, accurate
                  answers from your knowledge base.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="benefits-section">
          <div className="benefits-content">
            <div className="benefits-text">
              <h2 className="benefits-title">
                Why Teams Choose Our AI Assistant
              </h2>
              <div className="benefits-list">
                <div className="benefit-item">
                  <div className="benefit-icon">✅</div>
                  <div className="benefit-text">
                    <strong>Save 5+ hours per week</strong> on information
                    searches
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">✅</div>
                  <div className="benefit-text">
                    <strong>Reduce repetitive questions</strong> by 80% with
                    self-service
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">✅</div>
                  <div className="benefit-text">
                    <strong>Onboard new team members</strong> 3x faster
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">✅</div>
                  <div className="benefit-text">
                    <strong>Ensure compliance</strong> with up-to-date policy
                    access
                  </div>
                </div>
              </div>
      
            <Link to="/contact" className="benefits-cta-link">
  <button className="benefits-cta-button">Schedule a Demo</button>
</Link>
    
            </div>
            <div className="benefits-visual">
              <div className="stats-card">
                <div className="stat-item">
                  <div className="stat-number">95%</div>
                  <div className="stat-label">Accuracy Rate</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">2.5s</div>
                  <div className="stat-label">Average Response</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">10k+</div>
                  <div className="stat-label">Happy Users</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;