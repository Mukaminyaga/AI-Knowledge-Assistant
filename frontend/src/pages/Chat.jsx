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
  FiEdit2,
  FiCheck
} from "react-icons/fi";
import DashboardLayout from "../components/DashboardLayout";
import ChatHistory from "../components/ChatHistory";
import ThemeToggle from "../components/ThemeToggle";
import "../styles/Chat.css";
import { Link } from "react-router-dom";

function Chat() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id || 0; // default to 0 or handle guest properly

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatSessions, setChatSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [messageActions, setMessageActions] = useState({});
  const [inputPosition, setInputPosition] = useState("center"); // 'center' or 'bottom'
  const [copiedMessageIndex, setCopiedMessageIndex] = useState(null);
  const [editingMessageIndex, setEditingMessageIndex] = useState(null);
  

  // Update input position based on chat history
  useEffect(() => {
    if (chatHistory.length > 0) {
      setInputPosition("bottom");
    } else {
      setInputPosition("center");
    }
  }, [chatHistory]);

  // Load user chat sessions from backend
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await axios.get(
  `${process.env.REACT_APP_API_URL}/chat/history/${userId}`
);
        setChatSessions(res.data || []);
      } catch (err) {
        console.error("Failed to load sessions:", err);
      }
    };
    fetchSessions();
  }, [userId]);

  const summarizeTitle = (text) => {
    const clean = text.replace(/\s+/g, " ").trim();
    return clean.length > 35 ? clean.slice(0, 35) + "..." : clean;
  };

  const startNewChat = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/chat/start`,
        { user_id: userId, title: "New Chat" }
      );
      setChatHistory([]);
      setCurrentSessionId(res.data.id);
      
      setInputValue("");
      setChatSessions((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error("Failed to create new chat:", err);
    }
  };
const handleSend = async (userQuery) => {
  if (!userQuery.trim()) return;

  // Always update chat history locally first
  const newChat = [...chatHistory, { role: "user", text: userQuery }];
  setChatHistory(newChat);
  setInputValue("");

  try {
    setLoading(true);

    let sessionId = currentSessionId;

    // 🔹 If no session exists, create one before sending the first message
    if (!sessionId) {
      const startRes = await axios.post(
        `${process.env.REACT_APP_API_URL}/chat/start`,
        { user_id: userId, title: summarizeTitle(userQuery) }
      );
      sessionId = startRes.data.id;
      setCurrentSessionId(sessionId);
      setChatSessions((prev) => [startRes.data, ...prev]);
    }

    // 🔹 Store user message in backend
    await axios.post(`${process.env.REACT_APP_API_URL}/chat/message`, {
      session_id: Number(sessionId),
      role: "user",
      text: userQuery,
    });

    // 🔹 Call AI search endpoint
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/search/search`,
      { query: userQuery, top_k: 15, summarize: true },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );

    const assistantMessage = {
      role: "assistant",
      text: response.data.answer,
      results:
        response.data.source_files?.map((src) => ({ chunk_text: src })) || [],
    };

    setChatHistory((prev) => [...prev, assistantMessage]);

    // 🔹 Store assistant message in backend
    await axios.post(`${process.env.REACT_APP_API_URL}/chat/message`, {
      session_id: Number(sessionId),
      role: "assistant",
      text: response.data.answer,
    });
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
    handleSubmitEdit(e);
  };

const handleSelectChat = async (session) => {
  if (session.messages) {
    // Sample/demo messages
    setChatHistory(session.messages);
    setCurrentSessionId(null); // no real session
  } else {
    // Fetch messages from backend for real session
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/chat/messages/${session.id}`
      );

      
    const normalized = (res.data || []).map(m => ({
    role: m.role,
    text: m.text || m.message || "",
    results: m.results || []
  }));


      setChatHistory(normalized);
      setCurrentSessionId(session.id);
    } catch (err) {
      console.error("Failed to load chat history:", err);
      setChatHistory([]);
    }
  }
  setInputValue("");
};




  const handleDeleteChat = async (sessionId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/chat/delete/${sessionId}`
      );
      setChatSessions((prev) => prev.filter((s) => s.id !== sessionId));
      if (sessionId === currentSessionId) {
        startNewChat();
      }
    } catch (err) {
      console.error("Failed to delete session:", err);
    }
  };

 // 🔹 Accept optional updatedSessions array from ChatHistory
const handleBookmarkUpdate = (sessionId, isBookmarked, updatedSessions) => {
  if (updatedSessions) {
    setChatSessions(updatedSessions);
  } else {
    setChatSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? { ...session, isBookmarked }
          : session
      )
    );
  }
};


  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const openHistory = () => setIsHistoryOpen(true);
  const closeHistory = () => setIsHistoryOpen(false);

  const handleMessageAction = (messageIndex, action) => {
    setMessageActions((prev) => ({
      ...prev,
      [messageIndex]: {
        ...prev[messageIndex],
        [action]: !prev[messageIndex]?.[action],
      },
    }));
  };

  const copyToClipboard = async (text, messageIndex) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedMessageIndex(messageIndex);
      setTimeout(() => setCopiedMessageIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      // Still show copied feedback even if there was an error
      setCopiedMessageIndex(messageIndex);
      setTimeout(() => setCopiedMessageIndex(null), 2000);
    }
  };

  const handleEditMessage = (messageText, messageIndex) => {
    setInputValue(messageText);
    setEditingMessageIndex(messageIndex);
    // Focus on input field
    setTimeout(() => {
      const inputElement = document.querySelector('.chat-input');
      if (inputElement) {
        inputElement.focus();
      }
    }, 100);
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      if (editingMessageIndex !== null) {
        // Update the message in chat history
        const updatedHistory = [...chatHistory];
        updatedHistory[editingMessageIndex] = {
          ...updatedHistory[editingMessageIndex],
          text: inputValue
        };
        setChatHistory(updatedHistory);
        setEditingMessageIndex(null);
      } else {
        handleSend(inputValue);
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="new-chat-container">
        {/* Header */}
        <div className="chat-compact-header">
          <div className="search-wrapper">
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
                className={`profile-dropdown-trigger ${
                  profileDropdownOpen ? "active" : ""
                }`}
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
                          ? `${user.first_name} ${user.last_name?.charAt(0) || ""}.`
                          : "John D."}
                      </span>
                    </div>
                    <div className="dropdown-arrow">
                      {profileDropdownOpen ? (
                        <FiChevronUp size={16} />
                      ) : (
                        <FiChevronDown size={16} />
                      )}
                    </div>
                  </>
                )}
              </div>
              {profileDropdownOpen && !isCollapsed && (
                <div className="profile-dropdown-menu">
                  <div className="dropdown-item">
                    <div className="user-details">
                      <span>{user?.email || "user@example.com"}</span>
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

        {/* Chat area */}
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
                    <div className="message-header">
                      {msg.role === "user" ? "YOU" : "AI ASSISTANT"}
                    </div>
                    {msg.role === "user" ? (
                      <>
                        <div className="message-body">
                          <div className="message-text selectable-text">{msg.text}</div>
                        </div>
                        <div className="user-message-actions-outside">
                          <button
                            className="user-action-btn"
                            onClick={() => copyToClipboard(msg.text, idx)}
                            title="Copy message"
                          >
                            {copiedMessageIndex === idx ? <FiCheck /> : <FiCopy />}
                          </button>
                          <button
                            className="user-action-btn"
                            onClick={() => handleEditMessage(msg.text, idx)}
                            title="Edit message"
                          >
                            <FiEdit2 />
                          </button>
                          {/* {copiedMessageIndex === idx && (
                            <span className="copied-feedback">Copied!</span>
                          )} */}
                        </div>
                      </>
                    ) : (
                      <div className="assistant-message-content">
                        <div className="formatted-message-text">{msg.text}</div>
                        {msg.results?.length > 0 && (
                          <div className="message-sources">
                            <ul>
                              {msg.results.map((res, i) => (
                                <li key={i} className="source-item">
                                  <span className="source-bullet"></span>{" "}
                                  {res.chunk_text}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <div className="message-actions">
                          <button
                            className="message-action-btn"
                            onClick={() => copyToClipboard(msg.text, idx)}
                            title="Copy message"
                          >
                            {copiedMessageIndex === idx ? <FiCheck /> : <FiCopy />}
                          </button>
                          {/* {copiedMessageIndex === idx && (
                            <span className="copied-feedback">Copied!</span>
                          )} */}
                          <button
                            className={`message-action-btn ${
                              messageActions[idx]?.liked ? "liked" : ""
                            }`}
                            onClick={() => handleMessageAction(idx, "liked")}
                            title="Like message"
                          >
                            <FiThumbsUp />
                          </button>
                          <button
                            className={`message-action-btn ${
                              messageActions[idx]?.disliked ? "disliked" : ""
                            }`}
                            onClick={() => handleMessageAction(idx, "disliked")}
                            title="Dislike message"
                          >
                            <FiThumbsDown />
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
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

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
        onBookmarkUpdate={handleBookmarkUpdate}
      />
    </DashboardLayout>
  );
}

export default Chat;
