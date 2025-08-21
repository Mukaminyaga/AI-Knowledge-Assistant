import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FiPlus,
  FiTrash2,
  FiChevronDown,
  FiChevronUp,
  FiSearch,
  FiUser,
  FiPaperclip,
  FiArrowUp,
  FiTrendingUp,
  FiSettings,
  FiClock,
  FiCopy,
  FiThumbsUp,
  FiThumbsDown,
  FiBookmark
} from "react-icons/fi";
import DashboardLayout from "../components/DashboardLayout";
import ChatHistory from "../components/ChatHistory";
import ThemeToggle from "../components/ThemeToggle";
import "../styles/Chat.css";
import { Link } from "react-router-dom";


function Chat() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.email || "guest";
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatSessions, setChatSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [messageActions, setMessageActions] = useState({});
  const [inputPosition, setInputPosition] = useState('center'); // 'center' or 'bottom'

  // Update input position based on chat history
  useEffect(() => {
    if (chatHistory.length > 0) {
      setInputPosition('bottom');
    } else {
      setInputPosition('center');
    }
  }, [chatHistory]);

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
    setChatHistory([]);
    setCurrentSessionId(newId);
    setInputValue("");
  };

  const handleSend = async (userQuery) => {
    if (!userQuery.trim()) return;
    const normalizedQuery = userQuery.trim().toLowerCase();
    const newChat = [...chatHistory, { role: "user", text: userQuery }];
    setChatHistory(newChat);
    setInputValue("");

    const greetings = ["hello", "hi", "h", "goodmorning", "good morning", "hey"];
    if (greetings.includes(normalizedQuery)) {
      const assistantMessage = {
        role: "assistant",
        text: "Hello! I'm your Knowledge Assistant. How can I help you today?",
        results: [],
      };
      const updatedChat = [...newChat, assistantMessage];
      setChatHistory(updatedChat);
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/search/search`,
        {
          query: userQuery,
          top_k: 10,
          summarize: true
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

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
   const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const openHistory = () => {
    setIsHistoryOpen(true);
  };

  const closeHistory = () => {
    setIsHistoryOpen(false);
  };

  const handleMessageAction = (messageIndex, action) => {
    setMessageActions(prev => ({
      ...prev,
      [messageIndex]: {
        ...prev[messageIndex],
        [action]: !prev[messageIndex]?.[action]
      }
    }));
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Function to format text for better readability
const formatMessageText = (text) => {
  if (!text) return null;

  // Step 1: Normalize separators and detect inline numbered/bullet lists
  const normalizedText = text
    .replace(/(\d+)\.\s+/g, '\n$1. ')       // Split inline numbered lists
    .replace(/[-*•]\s+/g, '\n• ')           // Split inline bullets
    .replace(/\([a-z]\)\s+/g, '\n$&');      // Split inline (a), (b), ...

  // Step 2: Split into lines
  const lines = normalizedText.split('\n').map(l => l.trim()).filter(Boolean);

  // Step 3: Detect lists
  const listLines = lines.filter(line =>
    /^\d+\./.test(line) || /^•/.test(line) || /^\([a-z]\)/.test(line)
  );

  if (listLines.length > 0) {
    const isNumbered = lines.some(line => /^\d+\./.test(line));

    if (isNumbered) {
      return (
        <ol className="formatted-list numbered-list">
          {lines.map((line, i) => {
            const cleanLine = line.replace(/^\d+\.\s*/, '').trim();
            return cleanLine ? <li key={i}>{cleanLine}</li> : null;
          })}
        </ol>
      );
    } else {
      return (
        <ul className="formatted-list bullet-list">
          {lines.map((line, i) => {
            const cleanLine = line.replace(/^•\s*/, '').replace(/^\([a-z]\)\s*/, '').trim();
            return cleanLine ? <li key={i}>{cleanLine}</li> : null;
          })}
        </ul>
      );
    }
  }

  // Step 4: Fallback to paragraphs
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim());
  return paragraphs.map((p, idx) => (
    <div key={idx} className="formatted-paragraph">{p.trim()}</div>
  ));
};

  return (
    <DashboardLayout>
      <div className="new-chat-container">
        {/* Compact Header */}
        <div className="chat-compact-header">
          <div className="search-wrapper">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search..."
              className="compact-search-input"
            />
          </div>
          <div className="header-controls">
            <button className="control-btn new-chat-btn" onClick={startNewChat}>
              <FiPlus size={18} />
              <span>New Chat</span>
            </button>
            <button className="control-btn" onClick={openHistory}>
              <FiClock size={18} />
              <span>History</span>
            </button>
            <ThemeToggle className="control-btn" />
             <div className="sidebar-top-profile">
                    <div
                      className={`profile-dropdown-trigger ${profileDropdownOpen ? 'active' : ''}`}
                      onClick={toggleProfileDropdown}
                    >
                      <div className="profile-avatar-sidebar">
                        <FiUser size={16} />
                      </div>
                      {!isCollapsed && (
                        <>
                          <div className="profile-info">
                            <span className="profile-name">
                              {user?.first_name
                                ? `${user.first_name} ${user.last_name?.charAt(0) || ''}.`
                                : "John D."}
                            </span>
                            {/* <span className="profile-role">Member</span> */}
                          </div>
                          <div className="dropdown-arrow">
                            {profileDropdownOpen ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                          </div>
                        </>
                      )}
                    </div>

                    {profileDropdownOpen && !isCollapsed && (
                      <div className="profile-dropdown-menu">
                        <div className="dropdown-item">
                          <div className="user-details">
                            {/* <strong>{user?.first_name || 'User'} {user?.last_name || ''}</strong> */}
                            <span>{user?.email || 'user@example.com'}</span>
                          </div>
                        </div>
                        <div className="dropdown-divider"></div>
                        <div className="dropdown-item clickable">
                          <FiUser size={14} />
                          <Link to="/settings" className="dropdown-link">
                          <span>View Profile</span>
                          </Link>
                        </div>
                        <div className="dropdown-item clickable">
                          <FiSettings size={14} />
                                                    <Link to="/settings" className="dropdown-link">

                          <span>Account Settings</span>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className={`chat-content-area ${inputPosition}`}>
          {chatHistory.length === 0 ? (
            <div className="welcome-container">
              <div className="welcome-content">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/6a96318cde428ff3923086fb78ab6a189e119652?width=143"
                  alt="Vala AI Logo"
                  className="vala-avatar"
                />
                <h2>Hi, I'm Vala.</h2>
                <p>How can I help you today?</p>
              </div>

              {/* Centered Input when no chat history */}
              <div className="centered-input-area">
                <form className="input-form" onSubmit={handleSubmit}>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      placeholder="What do you want to know?"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="chat-input"
                    />
                    <div className="input-controls">
                      <button type="button" className="attach-btn">
                        <FiPaperclip size={18} />
                      </button>
                      <div className="deepsearch-pill">
                        <FiTrendingUp size={16} />
                        <span>DeepSearch</span>
                      </div>
                      <button
                        type="submit"
                        className="send-button"
                        disabled={loading || !inputValue.trim()}
                      >
                        <FiArrowUp size={18} />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <>
              <div className="messages-area">
                {chatHistory.map((msg, idx) => (
                  <div key={idx} className={`message ${msg.role}-msg`}>
                    <div className="message-header">{msg.role === "user" ? "YOU" : "AI ASSISTANT"}</div>
                    {msg.role === "user" ? (
                      <div className="message-body">
                        <div className="message-text">{msg.text}</div>
                      </div>
                    ) : (
                      <div className="assistant-message-content">
                        <div className="formatted-message-text">
                          {formatMessageText(msg.text)}
                        </div>
                        {msg.results?.length > 0 && (
                          <div className="message-sources">
                            <ul>
                              {msg.results.map((res, i) => (
                                <li key={i} className="source-item">
                                  <span className="source-bullet"></span> {res.chunk_text}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <div className="message-actions">
                          <button
                            className="message-action-btn"
                            onClick={() => copyToClipboard(msg.text)}
                            title="Copy message"
                          >
                            <FiCopy />
                          </button>
                          <button
                            className={`message-action-btn ${messageActions[idx]?.liked ? 'liked' : ''}`}
                            onClick={() => handleMessageAction(idx, 'liked')}
                            title="Like message"
                          >
                            <FiThumbsUp />
                          </button>
                          <button
                            className={`message-action-btn ${messageActions[idx]?.disliked ? 'disliked' : ''}`}
                            onClick={() => handleMessageAction(idx, 'disliked')}
                            title="Dislike message"
                          >
                            <FiThumbsDown />
                          </button>
                          <button
                            className={`message-action-btn ${messageActions[idx]?.bookmarked ? 'bookmarked' : ''}`}
                            onClick={() => handleMessageAction(idx, 'bookmarked')}
                            title="Bookmark message"
                          >
                            <FiBookmark />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {loading && (
                  <div className="message assistant-msg">
                    <div className="message-header">AI ASSISTANT</div>
                    <div className="assistant-message-content">
                      <div className="typing-dots">
                        <span></span><span></span><span></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Input Area when chat history exists */}
              <div className="bottom-input-area">
                <form className="input-form" onSubmit={handleSubmit}>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      placeholder="What do you want to know?"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="chat-input"
                    />
                    <div className="input-controls">
                      <button type="button" className="attach-btn">
                        <FiPaperclip size={18} />
                      </button>
                      <div className="deepsearch-pill">
                        <FiTrendingUp size={16} />
                        <span>DeepSearch</span>
                      </div>
                      <button
                        type="submit"
                        className="send-button"
                        disabled={loading || !inputValue.trim()}
                      >
                        <FiArrowUp size={18} />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </div>

      <ChatHistory
        isOpen={isHistoryOpen}
        onClose={closeHistory}
        chatSessions={chatSessions}
        onSelectSession={handleSelectChat}
      />
    </DashboardLayout>
  );
}

export default Chat;
