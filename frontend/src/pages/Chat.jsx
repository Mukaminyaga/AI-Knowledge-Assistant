import React, { useState } from "react";
import "../styles/Chat.css";

function Chat() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState("");

  // Mock data for previous chats
  const previousChats = [
    {
      id: 1,
      title: "Employee Handbook Query",
      timestamp: "2 hours ago",
      preview: "Where can I find the employee code...",
    },
    {
      id: 2,
      title: "Password Reset Help",
      timestamp: "1 day ago",
      preview: "How do I reset my company email...",
    },
    {
      id: 3,
      title: "Onboarding Materials",
      timestamp: "3 days ago",
      preview: "Find onboarding materials for...",
    },
    {
      id: 4,
      title: "IT Support Request",
      timestamp: "1 week ago",
      preview: "My laptop is running slowly...",
    },
    {
      id: 5,
      title: "Benefits Information",
      timestamp: "2 weeks ago",
      preview: "What health insurance options...",
    },
  ];

  const filteredChats = previousChats.filter(
    (chat) =>
      chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.preview.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };

  const handleNewChat = () => {
    setSelectedChat(null);
    setMessageInput("");
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Here you would typically send the message to your backend
      console.log("Sending message:", messageInput);
      setMessageInput("");
    }
  };

  const suggestionCards = [
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/a45695d907e33d937a751065ec5e48f3b3ba2bab?placeholderIfAbsent=true",
      text: "Where can I find the employee code of conduct?",
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/6f7773bacd4ec7789b1064c5e157f280cab52a08?placeholderIfAbsent=true",
      text: "Find onboarding materials for new hires.",
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/81eb2eb3c3152ed49e125f6eb4d3d147add36fec?placeholderIfAbsent=true",
      text: "How do I reset my company email password?",
    },
  ];

  return (
    <div className="chat-wrapper">
      <div className="chat-layout">
        {/* Navigation Sidebar */}
        <div className="navigation-sidebar">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/8bec5fd07b066f4c244b33ebda2a2c9d5c09f55e?placeholderIfAbsent=true"
            className="sidebar-logo"
            alt="Logo"
          />
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/a4784354f91d2a08bd7d76ffc5df9ee473f0de31?placeholderIfAbsent=true"
            className="sidebar-icon"
            alt="Home"
          />
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/679fbbab4eb08ea8b1eec1b878025b8cc01c7427?placeholderIfAbsent=true"
            className="sidebar-icon"
            alt="Search"
          />
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/9aefdbca3241c9e024ae84a44353d1f33e64eef6?placeholderIfAbsent=true"
            className="sidebar-icon active"
            alt="Chat"
          />
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/f9b9b7bd67fddc92be60dfa74a7fb4438b74c4a4?placeholderIfAbsent=true"
            className="sidebar-icon"
            alt="Settings"
          />
        </div>

        {/* Previous Chats Sidebar */}
        <div className="chats-sidebar">
          <div className="chats-header">
            <button className="new-chat-button" onClick={handleNewChat}>
              New Chat
            </button>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/6ce4305ae9d9863a81bf73837262b9375cbdce70?placeholderIfAbsent=true"
                className="search-icon"
                alt="Search"
              />
            </div>
          </div>

          <div className="previous-chats">
            <h3 className="chats-title">Previous Chats</h3>
            <div className="chats-list">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  className={`chat-item ${selectedChat?.id === chat.id ? "active" : ""}`}
                  onClick={() => handleChatSelect(chat)}
                >
                  <div className="chat-title">{chat.title}</div>
                  <div className="chat-preview">{chat.preview}</div>
                  <div className="chat-timestamp">{chat.timestamp}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Profile Icon */}
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/c4cf647c053511fbe5e6b02e954f8f34b7691c86?placeholderIfAbsent=true"
          className="profile-icon"
          alt="Profile"
        />

        {/* Main Content */}
        <div className="main-content">
          {!selectedChat ? (
            /* New Chat Welcome Screen */
            <div className="welcome-content">
              <div className="content-header">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/f980d815558b7d3ef79877f361fed5d51296e05c?placeholderIfAbsent=true"
                  className="chat-illustration"
                  alt="Chat illustration"
                />
                <div className="greeting-text">Hi there,</div>
                <div className="help-text">How can I help?</div>
              </div>

              <div className="suggestion-section">
                <div className="suggestions-grid">
                  {suggestionCards.map((suggestion, index) => (
                    <div
                      key={index}
                      className="suggestion-card"
                      onClick={() => setMessageInput(suggestion.text)}
                    >
                      <img
                        src={suggestion.icon}
                        className="suggestion-icon"
                        alt="Suggestion"
                      />
                      <div className="suggestion-text">{suggestion.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Selected Chat Content */
            <div className="chat-content">
              <div className="chat-header">
                <h2 className="chat-title-main">{selectedChat.title}</h2>
                <span className="chat-timestamp-main">
                  {selectedChat.timestamp}
                </span>
              </div>
              <div className="chat-messages">
                <div className="message user-message">
                  <div className="message-content">{selectedChat.preview}</div>
                  <div className="message-time">{selectedChat.timestamp}</div>
                </div>
                <div className="message bot-message">
                  <div className="message-content">
                    I'd be happy to help you with that! Let me search through
                    our company documents and provide you with the most relevant
                    information.
                  </div>
                  <div className="message-time">2 minutes ago</div>
                </div>
              </div>
            </div>
          )}

          {/* Input Section */}
          <div className="input-section">
            <div className="input-container">
              <input
                type="text"
                placeholder="Ask me anything..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="message-input"
              />
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/6ce4305ae9d9863a81bf73837262b9375cbdce70?placeholderIfAbsent=true"
                className="attach-icon"
                alt="Attach"
              />
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/99f3e69ef66aa962902be4f65631319f99009d5b?placeholderIfAbsent=true"
                className="send-icon"
                alt="Send"
                onClick={handleSendMessage}
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

export default Chat;
