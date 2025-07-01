import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiSend, FiPlus, FiTrash2 } from "react-icons/fi";
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

  useEffect(() => {
    const savedSessions = JSON.parse(localStorage.getItem(`chat_sessions_${userId}`)) || [];
    const lastSession = savedSessions[savedSessions.length - 1];

    // Move previous chat to recents only if user had sent a message
    if (lastSession) {
      const history = JSON.parse(localStorage.getItem(`chat_${userId}_${lastSession.id}`)) || [];
      const hasUserMessage = history.some((msg) => msg.role === "user");

      if (hasUserMessage) {
        const exists = savedSessions.some((s) => s.id === lastSession.id);
        if (!exists) {
          savedSessions.push({
            id: lastSession.id,
            title: summarizeTitle(history.find((msg) => msg.role === "user")?.text || "Chat"),
            timestamp: Date.now(),
          });
          localStorage.setItem(`chat_sessions_${userId}`, JSON.stringify(savedSessions));
        }
      }
      setChatSessions(savedSessions.sort((a, b) => b.timestamp - a.timestamp));
    }

    // Start fresh session
    startNewChat();
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

      localStorage.setItem(
        `chat_${userId}_${currentSessionId}`,
        JSON.stringify(updatedChat)
      );

      // Save to sessions if not already
      const exists = chatSessions.some((s) => s.id === currentSessionId);
      if (!exists) {
        const newSession = {
          id: currentSessionId,
          title: summarizeTitle(userQuery),
          timestamp: Date.now(),
        };
        const updatedSessions = [newSession, ...chatSessions];
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

  const handleDeleteChat = (sessionId) => {
    const updatedSessions = chatSessions.filter((s) => s.id !== sessionId);
    setChatSessions(updatedSessions);
    localStorage.setItem(`chat_sessions_${userId}`, JSON.stringify(updatedSessions));
    localStorage.removeItem(`chat_${userId}_${sessionId}`);

    if (sessionId === currentSessionId) {
      startNewChat();
    }
  };

  return (
    <DashboardLayout>
      <div className="chat-page1">
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
                title={`Last updated: ${new Date(session.timestamp).toLocaleString()}`}
              >
                <span className="chat-title" onClick={() => handleSelectChat(session.id)}>
                  {session.title}
                </span>
                <FiTrash2
                  className="chat-delete-icon"
                  title="Delete chat"
                  onClick={() => handleDeleteChat(session.id)}
                />
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
                            <span className="result-bullet"></span> {res.chunk_text}
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
