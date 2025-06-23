import React, { useState, useEffect } from "react";
import axios from "axios"; 
import { FiSend, FiPlus } from "react-icons/fi";
import DashboardLayout from "../components/DashboardLayout";
import "../styles/Chat.css";

function Chat() {
  const [inputValue, setInputValue] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      role: "assistant",
      text: "Hello! I'm your Knowledge Assistant AI. How can I help you today?",
      results: []
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => {
    // Load recent searches from localStorage if available
    const stored = localStorage.getItem("recentSearches");
    return stored ? JSON.parse(stored) : [];
  });

  const handleSend = async (userQuery) => {
    if (!userQuery.trim()) return;

    // Push user message
    setChatHistory((prev) => [...prev, { role: "user", text: userQuery }]);
    setInputValue("");

    // ✅ Add to recent searches
    setRecentSearches((prev) => {
      const updated = [userQuery, ...prev.filter((q) => q !== userQuery)];
      const trimmed = updated.slice(0, 5); // Keep only the 5 most recent
      localStorage.setItem("recentSearches", JSON.stringify(trimmed));
      return trimmed;
    });

    try {
      setLoading(true);
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/search/search`, {
        query: userQuery,
        top_k: 3,
      });
      const data = response.data;

      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.answer,
          results: data.source_files?.map((src) => ({ chunk_text: src })) || []
        },
      ]);
    } catch (error) {
      console.error(error);
      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry, I encountered an error while processing your request.",
          results: []
        },
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      handleSend(inputValue);
    }
  };
  
  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    handleSend(suggestion);
  };
  
  const handleNewChat = () => {
    setChatHistory([
      {
        role: "assistant",
        text: "Hello! I'm your Knowledge Assistant AI. How can I help you today?",
        results: []
      }
    ]);
    setInputValue("");
  };
  
  return (
    <DashboardLayout>
      <div className="chat-page">
        <div className="chat-sidebar">
          <div className="sidebar-header">
            <button className="new-chat-button" onClick={handleNewChat}>
              <FiPlus size={18} /> New Chat
            </button>
          </div>
          <h3>Recent Searches</h3>
          {recentSearches.length > 0 ? (
            recentSearches.map((search, index) => (
              <div
                key={index}
                className="chat-sidebar-item"
                onClick={() => handleSuggestionClick(search)}
              >
                {search}
              </div>
            ))
          ) : (
            <div className="chat-sidebar-item no-recent">No recent searches yet</div>
          )}
        </div>

        <div className="chat-main">
          <div className="chat-header">
            <h2>💬 Live AI Conversation</h2>
          </div>

          <div className="chat-messages">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.role}-message`}>
                <div className="message-role">{msg.role === 'user' ? 'YOU' : 'AI ASSISTANT'}</div>
                <div className="message-content">
                  <div className="message-text">{msg.text}</div>
                  {msg.results && msg.results.length > 0 && (
                    <div className="message-results">
                      <ul>
                        {msg.results.map((res, i) => (
                          <li key={i} className="result-item">
                            <span className="result-bullet">•</span> {res.chunk_text}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="chat-message assistant-message">
                <div className="message-role">AI ASSISTANT</div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form className="chat-input-area" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Ask me anything ..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="chat-input"
            />
            <button
              type="submit"
              className="chat-send-button"
              title="Send message"
              disabled={loading || !inputValue.trim()}
            >
              <FiSend size={20} />
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Chat;
