import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Chat.css";

function Chat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      content:
        "Hello! I'm your AI Knowledge Assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const newMessage = {
        id: Date.now(),
        type: "user",
        content: inputValue,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newMessage]);
      setInputValue("");

      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: Date.now() + 1,
          type: "ai",
          content:
            "I understand your question. Let me search through your knowledge base to find the most relevant information for you.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiResponse]);
      }, 1000);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-header-content">
          <h1 className="chat-title">AI Assistant Chat</h1>
          <div className="chat-nav">
            <Link to="/home" className="back-to-home-button">
              ← Back to Home
            </Link>
            <Link to="/dashboard" className="dashboard-link-button">
              Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="chat-content">
        <div className="chat-sidebar">
          <div className="quick-actions">
            <h3 className="sidebar-title">Quick Actions</h3>
            <div className="action-buttons">
              <button className="action-button">
                <span className="action-icon">🔍</span>
                Search Documents
              </button>
              <button className="action-button">
                <span className="action-icon">📋</span>
                HR Policies
              </button>
              <button className="action-button">
                <span className="action-icon">🎓</span>
                Training Materials
              </button>
              <button className="action-button">
                <span className="action-icon">📞</span>
                Contact Info
              </button>
            </div>
          </div>

          <div className="recent-topics">
            <h3 className="sidebar-title">Recent Topics</h3>
            <div className="topics-list">
              <div className="topic-item">Vacation Policy</div>
              <div className="topic-item">Remote Work Guidelines</div>
              <div className="topic-item">Benefits Overview</div>
              <div className="topic-item">IT Support</div>
            </div>
          </div>
        </div>

        <div className="chat-main">
          <div className="messages-container">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.type}-message`}
              >
                <div className="message-avatar">
                  {message.type === "ai" ? "🤖" : "👤"}
                </div>
                <div className="message-content">
                  <div className="message-text">{message.content}</div>
                  <div className="message-time">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <form className="message-input-form" onSubmit={handleSendMessage}>
            <div className="input-container">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything about your knowledge base..."
                className="message-input"
              />
              <button type="submit" className="send-button">
                <span className="send-icon">📤</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Chat;
