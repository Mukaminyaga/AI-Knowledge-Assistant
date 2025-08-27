import React, { useState, useEffect } from 'react';
import {
  FiX,
  FiSearch,
  FiBookmark,
  FiMoreHorizontal,
  FiCopy,
  FiThumbsUp,
  FiThumbsDown
} from 'react-icons/fi';
import '../styles/ChatHistory.css';
import axios from "axios";


const ChatHistory = ({ isOpen, onClose, chatSessions = [], onSelectSession }) => {
  const [activeTab, setActiveTab] = useState('chat');
  const [searchQuery, setSearchQuery] = useState('');

  // Transform chat sessions into grouped history data
  const groupChatsByDate = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const groups = {
      today: [],
      yesterday: [],
      older: {}
    };

    chatSessions.forEach(session => {
      const sessionDate = new Date(session.timestamp);
      const isToday = sessionDate.toDateString() === today.toDateString();
      const isYesterday = sessionDate.toDateString() === yesterday.toDateString();

      if (isToday) {
        groups.today.push({
          id: session.id,
          title: session.title,
          isBookmarked: session.isBookmarked || false,
          isHighlighted: groups.today.length === 0 // Highlight first item of today
        });
      } else if (isYesterday) {
        groups.yesterday.push({
          id: session.id,
          title: session.title,
          isBookmarked: session.isBookmarked || false,
          isHighlighted: false
        });
      } else {
        const dateKey = sessionDate.toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }).replace(/,/g, '');

        if (!groups.older[dateKey]) {
          groups.older[dateKey] = [];
        }
        groups.older[dateKey].push({
          id: session.id,
          title: session.title,
          isBookmarked: session.isBookmarked || false,
          isHighlighted: false
        });
      }
    });

    return groups;
  };

  // Sample history data for demo when no sessions available
  const sampleHistoryData = {
    today: [
      { id: 'sample1', title: 'Vala launch date', isBookmarked: false, isHighlighted: true }
    ],
    yesterday: [
      { id: 'sample2', title: '2025 Financial records', isBookmarked: true, isHighlighted: false }
    ],
    older: {
      '20 July 2025': [
        { id: 'sample3', title: 'Summary of meeting AOB', isBookmarked: false, isHighlighted: false },
        { id: 'sample4', title: "Member's list", isBookmarked: false, isHighlighted: false },
        { id: 'sample5', title: 'Company policies', isBookmarked: false, isHighlighted: false }
      ],
      '19 July 2025': [
        { id: 'sample6', title: 'Attendance Records', isBookmarked: false, isHighlighted: false }
      ]
    }
  };

  const historyData = chatSessions.length > 0 ? groupChatsByDate() : sampleHistoryData;

  // Filter history based on search query
  const filterHistoryData = (data) => {
    if (!searchQuery.trim()) return data;

    const query = searchQuery.toLowerCase();
    const filtered = { today: [], yesterday: [], older: {} };

    // Filter today's items
    filtered.today = data.today.filter(item =>
      item.title.toLowerCase().includes(query)
    );

    // Filter yesterday's items
    filtered.yesterday = data.yesterday.filter(item =>
      item.title.toLowerCase().includes(query)
    );

    // Filter older items
    Object.entries(data.older || {}).forEach(([date, items]) => {
      const filteredItems = items.filter(item =>
        item.title.toLowerCase().includes(query)
      );
      if (filteredItems.length > 0) {
        filtered.older[date] = filteredItems;
      }
    });

    return filtered;
  };

  const filteredHistoryData = filterHistoryData(historyData);
  const [bookmarkedSessions, setBookmarkedSessions] = useState([]);

useEffect(() => {
  if (activeTab === "bookmarks") {
    const fetchBookmarks = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/bookmarks?user_id=1&tenant_id=1`
        );
        if (res.ok) {
          const data = await res.json();
          setBookmarkedSessions(
            data.map(s => ({
              id: s.id,
              title: s.title,
              isBookmarked: true,
              isHighlighted: false,
            }))
          );
        }
      } catch (err) {
        console.error("Failed to fetch bookmarks:", err);
      }
    };
    fetchBookmarks();
  }
}, [activeTab]);


  // Keyboard event handling
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isOpen) return;

      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      const searchInput = document.querySelector('.search-input');
      if (searchInput) {
        setTimeout(() => searchInput.focus(), 100);
      }
    }
  }, [isOpen]);

  const tabs = [
    { id: 'chat', label: 'Chat', active: true },
    { id: 'bookmarks', label: 'Bookmarks', active: false }
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

const toggleBookmark = async (itemId, section) => {
  try {
    // Find the session being toggled
    const allSessions = [
      ...historyData.today,
      ...historyData.yesterday,
      ...Object.values(historyData.older).flat(),
    ];
    const session = allSessions.find(s => s.id === itemId);
    if (!session) return;

    const newStatus = !session.isBookmarked;

    // Call backend API with axios
    await axios.post(`${process.env.REACT_APP_API_URL}/chat/bookmark`, {
      session_id: itemId,
      bookmarked: newStatus,
    });

    // Update local state so UI reflects immediately
    session.isBookmarked = newStatus;
    setSearchQuery(q => q); // quick re-render trigger
  } catch (error) {
    console.error("Failed to toggle bookmark:", error);
  }
};


  const handleMoreOptions = (itemId) => {
    // This would typically show a dropdown menu
    console.log('Show more options for item:', itemId);
  };

  const HistoryItem = ({ item, section, isHighlighted = false }) => {
    const handleItemClick = () => {
      if (onSelectSession) {
        if (item.id.startsWith('sample')) {
          // For sample data, create a mock chat history
          const sampleHistory = [
            { role: "user", text: "Tell me about " + item.title },
            { role: "assistant", text: `Here's information about ${item.title}: This is a sample response showing how the chat history feature works. In a real scenario, this would load the actual conversation history stored in your browser's local storage.`, results: [] }
          ];
          // Call onSelectSession with the sample data
          onSelectSession(item.id, sampleHistory);
        } else {
          onSelectSession(item.id);
        }
        onClose();
      }
    };

    return (
      <div
        className={`history-item ${isHighlighted ? 'highlighted' : ''}`}
        onClick={handleItemClick}
        style={{ cursor: onSelectSession ? 'pointer' : 'default' }}
      >
        <div className="history-item-content">
          <span className="history-item-title">{item.title}</span>
        </div>
        <div className="history-item-actions">
          <button
            className="action-btn bookmark-btn"
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark(item.id, section);
            }}
            aria-label={item.isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            <FiBookmark className={item.isBookmarked ? 'bookmarked' : ''} />
          </button>
          <button
            className="action-btn more-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleMoreOptions(item.id);
            }}
            aria-label="More options"
          >
            <FiMoreHorizontal />
          </button>
        </div>
      </div>
    );
  };

  const HistorySection = ({ title, items, sectionKey }) => (
    <div className="history-section">
      <div className="section-header">
        <h3 className="section-title">{title}</h3>
      </div>
      <div className="section-items">
        {items.map((item, index) => (
          <HistoryItem
            key={item.id}
            item={item}
            section={sectionKey}
            isHighlighted={item.isHighlighted}
          />
        ))}
      </div>
    </div>
  );

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="chat-history-overlay" onClick={handleOverlayClick}>
      <div
        className="chat-history-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="history-title"
      >
        <div className="history-header">
          <button className="close-btn" onClick={onClose} aria-label="Close history">
            <FiX />
          </button>
          <h1 id="history-title" className="history-title">History</h1>
        </div>

        <div className="history-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => handleTabClick(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="history-content">
          <div className="search-section">
            <div className="search-container">
             
              <input
                type="text"
                placeholder="Search Vala History"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="history-list">
            {activeTab === 'chat' && (
              <>
                {filteredHistoryData.today.length > 0 && (
                  <HistorySection
                    title="Today"
                    items={filteredHistoryData.today}
                    sectionKey="today"
                  />
                )}
                {filteredHistoryData.yesterday.length > 0 && (
                  <HistorySection
                    title="Yesterday"
                    items={filteredHistoryData.yesterday}
                    sectionKey="yesterday"
                  />
                )}
                {Object.entries(filteredHistoryData.older || {}).map(([dateKey, items]) => (
                  <HistorySection
                    key={dateKey}
                    title={dateKey}
                    items={items}
                    sectionKey={dateKey}
                  />
                ))}
                {searchQuery.trim() &&
                 filteredHistoryData.today.length === 0 &&
                 filteredHistoryData.yesterday.length === 0 &&
                 Object.keys(filteredHistoryData.older || {}).length === 0 && (
                  <div className="empty-state">
                    <p>No results found for "{searchQuery}"</p>
                  </div>
                )}
                {!searchQuery.trim() &&
                 historyData.today.length === 0 &&
                 historyData.yesterday.length === 0 &&
                 Object.keys(historyData.older || {}).length === 0 && (
                  <div className="empty-state">
                    <p>No chat history yet</p>
                  </div>
                )}
              </>
            )}

         {activeTab === 'bookmarks' && (
  <>
    {bookmarkedSessions.length > 0 ? (
      <HistorySection
        title="Bookmarked Sessions"
        items={bookmarkedSessions}
        sectionKey="bookmarks"
      />
    ) : (
      <div className="empty-state">
        <p>No bookmarks yet</p>
      </div>
    )}
  </>
)}


            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;
