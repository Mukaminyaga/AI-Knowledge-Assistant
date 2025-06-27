import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiSend, FiPlus } from "react-icons/fi";
import DashboardLayout from "../components/DashboardLayout";
import "../styles/Chat.css";

function Chat() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.email || "guest";

  const [inputValue, setInputValue] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatSessions, setChatSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);

  // Load saved sessions on start
  useEffect(() => {
    const savedSessions = JSON.parse(localStorage.getItem(`chat_sessions_${userId}`)) || [];
    setChatSessions(savedSessions);

    if (savedSessions.length > 0) {
      const lastSession = savedSessions[savedSessions.length - 1];
      const history = JSON.parse(localStorage.getItem(`chat_${userId}_${lastSession.id}`));
      setChatHistory(history || []);
      setCurrentSessionId(lastSession.id);
    } else {
      startNewChat();
    }
  }, [userId]);

  const summarizeTitle = (text) => {
    const clean = text.replace(/\s+/g, " ").trim();
    return clean.length > 35 ? clean.slice(0, 35) + "..." : clean;
  };

  const startNewChat = () => {
    const newId = `chat_${Date.now()}`;
    const welcomeMessage = [
      {
        role: "assistant",
        text: "Hello! I'm your Knowledge Assistant AI. How can I help you today?",
        results: [],
      },
    ];
    setChatHistory(welcomeMessage);
    setCurrentSessionId(newId);
    setInputValue("");
  };

  const handleSend = async (userQuery) => {
    if (!userQuery.trim()) return;

    const newChat = [...chatHistory, { role: "user", text: userQuery }];
    setChatHistory(newChat);
    setInputValue("");

    try {
      setLoading(true);
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/search/search`, {
        query: userQuery,
        top_k: 3,
      });

      const assistantMessage = {
        role: "assistant",
        text: response.data.answer,
        results: response.data.source_files?.map((src) => ({ chunk_text: src })) || [],
      };

      const updatedChat = [...newChat, assistantMessage];
      setChatHistory(updatedChat);

      // Save full chat to localStorage
      localStorage.setItem(
        `chat_${userId}_${currentSessionId}`,
        JSON.stringify(updatedChat)
      );

      // If this is a new session, add to sidebar
      const existingSession = chatSessions.find((s) => s.id === currentSessionId);
      if (!existingSession) {
        const newSession = {
          id: currentSessionId,
          title: summarizeTitle(userQuery),
        };
        const updatedSessions = [...chatSessions, newSession];
        setChatSessions(updatedSessions);
        localStorage.setItem(
          `chat_sessions_${userId}`,
          JSON.stringify(updatedSessions)
        );
      }
    } catch (error) {
      console.error("Error:", error);
      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry, I encountered an error while processing your request.",
          results: [],
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

  const handleSelectChat = (sessionId) => {
    const history = JSON.parse(localStorage.getItem(`chat_${userId}_${sessionId}`)) || [];
    setChatHistory(history);
    setCurrentSessionId(sessionId);
    setInputValue("");
  };

  return (
    <DashboardLayout>
      <div className="chat-page">
        <div className="chat-sidebar">
          <div className="sidebar-header">
            <button className="new-chat-button" onClick={startNewChat}>
              <FiPlus size={18} /> New Chat
            </button>
          </div>

          <h3>CHATS</h3>
          {chatSessions.length > 0 ? (
            chatSessions.map((session) => (
              <div
                key={session.id}
                className={`chat-sidebar-item ${session.id === currentSessionId ? "active" : ""}`}
                onClick={() => handleSelectChat(session.id)}
                title={session.title}
              >
                {session.title}
              </div>
            ))
          ) : (
            <div className="chat-sidebar-item no-recent">No conversations yet</div>
          )}
        </div>

        <div className="chat-main">
          <div className="chat-header">
            <h2>💬 Live AI Conversation</h2>
          </div>

          <div className="chat-messages">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.role}-message`}>
                <div className="message-role">{msg.role === "user" ? "YOU" : "AI ASSISTANT"}</div>
                <div className="message-content">
                  <div className="message-text">{msg.text}</div>
                  {msg.results?.length > 0 && (
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
              disabled={loading || !inputValue.trim()}
              title="Send message"
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
