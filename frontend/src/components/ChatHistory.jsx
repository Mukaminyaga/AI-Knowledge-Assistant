import React, { useState, useEffect } from 'react';
import {
  FiX,
  FiSearch,
  FiBookmark,
  FiMoreHorizontal,
  FiEdit2,
  FiTrash2,
} from 'react-icons/fi';
import '../styles/ChatHistory.css';
import axios from "axios";

const ChatHistory = ({ isOpen, onClose, chatSessions = [], onSelectSession, onBookmarkUpdate }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id || 0; // default to 0 or handle guest properly
  
  const [activeTab, setActiveTab] = useState('chat');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedSessions, setBookmarkedSessions] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null); // track dropdown state
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  


  // Group chats by Today, Yesterday, Older
  const groupChatsByDate = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const groups = { today: [], yesterday: [], older: {} };

    chatSessions.forEach(session => {
      if (!session.id || typeof session.id !== "number") return; 
      const sessionDate = new Date(session.timestamp);
      const isToday = sessionDate.toDateString() === today.toDateString();
      const isYesterday = sessionDate.toDateString() === yesterday.toDateString();

      const entry = {
        id: session.id,
        title: session.title,
        isBookmarked: session.isBookmarked || false,
        isHighlighted: false,
      };

      if (isToday) {
        groups.today.push({ ...entry, isHighlighted: groups.today.length === 0 });
      } else if (isYesterday) {
        groups.yesterday.push(entry);
      } else {
        const dateKey = sessionDate.toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }).replace(/,/g, '');
        if (!groups.older[dateKey]) groups.older[dateKey] = [];
        groups.older[dateKey].push(entry);
      }
    });

    return groups;
  };

  const sampleHistoryData = {
    today: [
      { id: 'sample1', title: 'Vala launch date', isBookmarked: false, isHighlighted: true }
    ],
    yesterday: [
      { id: 'sample2', title: '2025 Financial records', isBookmarked: true, isHighlighted: false }
    ],
    older: {
      '20 July 2025': [
        { id: 'sample3', title: 'Summary of meeting AOB', isBookmarked: false, isHighlighted: false }
      ]
    }
  };

  const historyData = chatSessions.length > 0 ? groupChatsByDate() : sampleHistoryData;

  // Filter based on search
  const filterHistoryData = (data) => {
    if (!searchQuery.trim()) return data;
    const query = searchQuery.toLowerCase();
    const filtered = { today: [], yesterday: [], older: {} };

    filtered.today = data.today.filter(i => i.title.toLowerCase().includes(query));
    filtered.yesterday = data.yesterday.filter(i => i.title.toLowerCase().includes(query));
    Object.entries(data.older || {}).forEach(([date, items]) => {
      const match = items.filter(i => i.title.toLowerCase().includes(query));
      if (match.length) filtered.older[date] = match;
    });
    return filtered;
  };
  const filteredHistoryData = filterHistoryData(historyData);

  // Fetch bookmarks
 useEffect(() => {
  if (activeTab === "bookmarks") {
    const fetchBookmarks = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/chat/bookmarks/${userId}`);
        if (res.ok) {
          const data = await res.json();
          setBookmarkedSessions(
            data.map(s => ({ id: s.id, title: s.title, isBookmarked: true, isHighlighted: false }))
          );
        }
      } catch (err) {
        console.error("Failed to fetch bookmarks:", err);
      }
    };
    fetchBookmarks();
  }
}, [activeTab]);


  // Keyboard + focus management
  useEffect(() => {
    const handleKeyDown = (e) => { if (isOpen && e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      const searchInput = document.querySelector('.search-input');
      if (searchInput) setTimeout(() => searchInput.focus(), 100);
    }
  }, [isOpen]);

  const tabs = [
    { id: 'chat', label: 'Chat' },
    { id: 'bookmarks', label: 'Bookmarks' }
  ];

  const toggleBookmark = async (itemId) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/chat/bookmark/${itemId}`
    );

    const newStatus = res.data?.isBookmarked;

    if (newStatus === undefined) return;

    // 🔹 Update local bookmarked sessions
    setBookmarkedSessions((prev) => {
      const exists = prev.find((s) => s.id === itemId);
      if (newStatus) {
        return exists ? prev : [...prev, { ...exists, id: itemId, isBookmarked: true }];
      } else {
        return prev.filter((s) => s.id !== itemId);
      }
    });

    // 🔹 Update chatSessions so the Chat tab UI reflects it
    const updated = chatSessions.map((s) =>
      s.id === itemId ? { ...s, isBookmarked: newStatus } : s
    );

    // Because chatSessions comes from parent, call onBookmarkUpdate
   if (onBookmarkUpdate) {
  onBookmarkUpdate(itemId, newStatus, updated);  // 🔹 pass updated sessions
}

    setSearchQuery((q) => q); // force rerender
  } catch (err) {
    console.error("Failed to toggle bookmark:", err);
  }
};


  // --- More Options: Rename + Delete ---
  const handleRename = async (id) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/chat/rename/${id}`, { title: renameValue });
      setRenamingId(null);
      setSearchQuery(q => q);
    } catch (err) {
      console.error("Rename failed:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/chat/delete/${id}`);
      setSearchQuery(q => q);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const HistoryItem = ({ item }) => {
    const isRenaming = renamingId === item.id;

    return (
      <div className={`history-item ${item.isHighlighted ? 'highlighted' : ''}`}>
      <div
  className="history-item-content"
  onClick={() => {
  if (!onSelectSession || !item.id) return;
  onSelectSession(item);   // pass the full session object
  onClose();
}}

>

          {isRenaming ? (
            <input
              className="rename-input"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onBlur={() => handleRename(item.id)}
              onKeyDown={(e) => e.key === 'Enter' && handleRename(item.id)}
              autoFocus
            />
          ) : (
            <span className="history-item-title">{item.title}</span>
          )}
        </div>
        <div className="history-item-actions">
          <button className="action-btn bookmark-btn"
            onClick={(e) => { e.stopPropagation(); toggleBookmark(item.id); }}>
            <FiBookmark className={item.isBookmarked ? 'bookmarked' : ''} style={{
              color: item.isBookmarked ? '#F59E0B' : 'inherit',
              fill: item.isBookmarked ? '#F59E0B' : 'transparent'
            }} />
          </button>

          <div className="dropdown-wrapper">
            <button className="action-btn more-btn"
              onClick={(e) => { e.stopPropagation(); setDropdownOpen(dropdownOpen === item.id ? null : item.id); }}>
              <FiMoreHorizontal />
            </button>
            {dropdownOpen === item.id && (
              <div className="dropdown-menu">
                <button onClick={(e) => {
                  e.stopPropagation();
                  setRenamingId(item.id);
                  setRenameValue(item.title);
                  setDropdownOpen(null);
                }}>
                  <FiEdit2 /> Rename
                </button>
                <button onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item.id);
                  setDropdownOpen(null);
                }}>
                  <FiTrash2 /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const HistorySection = ({ title, items }) => (
    <div className="history-section">
      <h3 className="section-title">{title}</h3>
      <div className="section-items">
        {items.map(item => (
          <HistoryItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="chat-history-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="chat-history-modal" role="dialog" aria-modal="true">
        <div className="history-header">
          <button className="close-btn" onClick={onClose}><FiX /></button>
          <h1 className="history-title">History</h1>
        </div>

        <div className="history-tabs">
          {tabs.map(tab => (
            <button key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="history-content">
          <div className="search-section">
            <input
              type="text"
              placeholder="Search Vala History"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="history-list">
            {activeTab === 'chat' && (
              <>
                {filteredHistoryData.today.length > 0 && <HistorySection title="Today" items={filteredHistoryData.today} />}
                {filteredHistoryData.yesterday.length > 0 && <HistorySection title="Yesterday" items={filteredHistoryData.yesterday} />}
                {Object.entries(filteredHistoryData.older || {}).map(([date, items]) =>
                  <HistorySection key={date} title={date} items={items} />
                )}
              </>
            )}

            {activeTab === 'bookmarks' && (
              bookmarkedSessions.length > 0 ?
                <HistorySection title="Bookmarked Sessions" items={bookmarkedSessions} /> :
                <div className="empty-state"><p>No bookmarks yet</p></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;
