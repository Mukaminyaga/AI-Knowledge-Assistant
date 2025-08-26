import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import '../styles/Activity.css';

const Activity = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFilter, setCurrentFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Sample activity data
  const activityData = [
    {
      id: 1,
      user: 'Super Admin',
      action: 'download',
      document: 'Topographic Survey.pdf',
      timestamp: 'Today - 2:30:18 PM',
      actionType: 'download'
    },
    {
      id: 2,
      user: 'Super Admin',
      action: 'upload',
      document: 'Laboratory Testing.pdf',
      timestamp: 'Yesterday - 5:30:00 PM',
      actionType: 'upload'
    },
    {
      id: 3,
      user: 'Super Admin',
      action: 'view',
      document: 'Topographic Survey.pdf',
      timestamp: '25 July 2025 - 7:45:17 PM',
      actionType: 'view'
    },
    {
      id: 4,
      user: 'Super Admin',
      action: 'view',
      document: 'Roads and Urban Roads.pdf',
      timestamp: '25 July 2025 - 1:40:23 PM',
      actionType: 'view'
    },
    {
      id: 5,
      user: 'Super Admin',
      action: 'upload',
      document: 'Materials Field.pdf',
      timestamp: '25 July 2025 - 10:51:06 PM',
      actionType: 'upload'
    },
    {
      id: 6,
      user: 'Super Admin',
      action: 'download',
      document: 'Laboratory Testing.pdf',
      timestamp: '24 July 2025 - 9:15:14 PM',
      actionType: 'download'
    }
  ];

  // Filter data based on current filter and search
  const filteredData = activityData.filter(item => {
    const matchesSearch = item.document.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.user.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = currentFilter === 'all' || item.actionType === currentFilter;
    return matchesSearch && matchesFilter;
  });

  // Get counts for each filter
  const getCounts = () => {
    const all = activityData.length;
    const views = activityData.filter(item => item.actionType === 'view').length;
    const uploads = activityData.filter(item => item.actionType === 'upload').length;
    const downloads = activityData.filter(item => item.actionType === 'download').length;
    return { all, views, uploads, downloads };
  };

  const counts = getCounts();

  const getActionBadge = (action) => {
    const config = {
      download: { 
        icon: (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.6663 6H9.99967V2H5.99967V6H3.33301L7.99967 10.6667L12.6663 6ZM7.33301 7.33333V3.33333H8.66634V7.33333H9.44634L7.99967 8.78L6.55301 7.33333H7.33301ZM3.33301 12H12.6663V13.3333H3.33301V12Z" fill="#FF9800"/>
          </svg>
        ),
        color: '#FF9800',
        bg: 'rgba(255, 152, 0, 0.10)',
        text: 'download'
      },
      upload: { 
        icon: (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.99967 10.6667H9.99967V6.66667H12.6663L7.99967 2L3.33301 6.66667H5.99967V10.6667ZM7.99967 3.88667L9.44634 5.33333H8.66634V9.33333H7.33301V5.33333H6.55301L7.99967 3.88667ZM3.33301 12H12.6663V13.3333H3.33301V12Z" fill="#4CAF50"/>
          </svg>
        ),
        color: '#4CAF50',
        bg: 'rgba(76, 175, 80, 0.10)',
        text: 'upload'
      },
      view: { 
        icon: (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.00033 3C4.66699 3 1.82033 5.07333 0.666992 8C1.82033 10.9267 4.66699 13 8.00033 13C11.3337 13 14.1803 10.9267 15.3337 8C14.1803 5.07333 11.3337 3 8.00033 3ZM8.00033 11.3333C6.16033 11.3333 4.66699 9.84 4.66699 8C4.66699 6.16 6.16033 4.66667 8.00033 4.66667C9.84033 4.66667 11.3337 6.16 11.3337 8C11.3337 9.84 9.84033 11.3333 8.00033 11.3333ZM8.00033 6C6.89366 6 6.00033 6.89333 6.00033 8C6.00033 9.10667 6.89366 10 8.00033 10C9.10699 10 10.0003 9.10667 10.0003 8C10.0003 6.89333 9.10699 6 8.00033 6Z" fill="#2563EB"/>
          </svg>
        ),
        color: '#2563EB',
        bg: 'rgba(37, 99, 235, 0.10)',
        text: 'view'
      }
    };
    return config[action] || config.view;
  };

  return (
    <DashboardLayout>
      <div className="activity-page">
        <div className="activity-header">
          <div className="activity-title-section">
            <h1 className="activity-title">Activity Log</h1>
            <p className="activity-description">Track document views, uploads, and downloads by users.</p>
          </div>
        </div>

        <div className="activity-controls">
          <div className="activity-search-section">
            <div className="search-input-wrapper">
              <svg className="search-icon" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.6667 18.6667H19.6133L19.24 18.3067C20.5467 16.7867 21.3333 14.8133 21.3333 12.6667C21.3333 7.88 17.4533 4 12.6667 4C7.88 4 4 7.88 4 12.6667C4 17.4533 7.88 21.3333 12.6667 21.3333C14.8133 21.3333 16.7867 20.5467 18.3067 19.24L18.6667 19.6133V20.6667L25.3333 27.32L27.32 25.3333L20.6667 18.6667ZM12.6667 18.6667C9.34667 18.6667 6.66667 15.9867 6.66667 12.6667C6.66667 9.34667 9.34667 6.66667 12.6667 6.66667C15.9867 6.66667 18.6667 9.34667 18.6667 12.6667C18.6667 15.9867 15.9867 18.6667 12.6667 18.6667Z" fill="#ACAAAA"/>
              </svg>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="activity-search-input"
              />
            </div>

            <button className="date-filter-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 11H9V13H7V11ZM21 6V20C21 21.1 20.1 22 19 22H5C3.89 22 3 21.1 3 20L3.01 6C3.01 4.9 3.89 4 5 4H6V2H8V4H16V2H18V4H19C20.1 4 21 4.9 21 6ZM5 8H19V6H5V8ZM19 20V10H5V20H19ZM15 13H17V11H15V13ZM11 13H13V11H11V13Z" fill="#FCFCFC"/>
              </svg>
            </button>
          </div>

          <div className="filter-buttons">
            <button
              className={`filter-btn ${currentFilter === 'all' ? 'active' : ''}`}
              onClick={() => setCurrentFilter('all')}
            >
              All {counts.all}
            </button>
            <button
              className={`filter-btn ${currentFilter === 'view' ? 'active' : ''}`}
              onClick={() => setCurrentFilter('view')}
            >
              <span>Views</span> <span className="count">{counts.views}</span>
            </button>
            <button
              className={`filter-btn ${currentFilter === 'upload' ? 'active' : ''}`}
              onClick={() => setCurrentFilter('upload')}
            >
              <span>Uploads</span> <span className="count">{counts.uploads}</span>
            </button>
            <button
              className={`filter-btn ${currentFilter === 'download' ? 'active' : ''}`}
              onClick={() => setCurrentFilter('download')}
            >
              <span>Downloads</span> <span className="count">{counts.downloads}</span>
            </button>
          </div>
        </div>

        <div className="activity-table-container">
          <div className="activity-table">
            <div className="table-header">
              <div className="header-cell user-column">User</div>
              <div className="header-cell action-column">Action</div>
              <div className="header-cell document-column">Document</div>
              <div className="header-cell timestamp-column">Timestamp</div>
            </div>
            
            <div className="table-body">
              {filteredData.map((item) => {
                const badge = getActionBadge(item.action);
                return (
                  <div key={item.id} className="table-row">
                    <div className="table-cell user-column">{item.user}</div>
                    <div className="table-cell action-column">
                      <div className="action-badge" style={{ backgroundColor: badge.bg }}>
                        {badge.icon}
                        <span style={{ color: badge.color }}>{badge.text}</span>
                      </div>
                    </div>
                    <div className="table-cell document-column">{item.document}</div>
                    <div className="table-cell timestamp-column">{item.timestamp}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="pagination-container">
          <div className="pagination-controls">
            <button className="pagination-btn">First</button>
            <button className="pagination-btn">Previous</button>
            <div className="pagination-info">
              Showing 1 to {filteredData.length} of {filteredData.length}
            </div>
            <button className="pagination-btn active">Next</button>
            <button className="pagination-btn active">Last</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Activity;
