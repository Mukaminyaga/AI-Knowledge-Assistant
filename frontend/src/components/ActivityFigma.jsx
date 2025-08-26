import React, { useState } from "react";
import "../styles/ActivityFigma.css";

const ActivityFigma = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Sample activity data matching the Figma design
  const activities = [
    {
      id: 1,
      user: "Super Admin",
      action: "download",
      document: "Topographic Survey.pdf",
      timestamp: "Today - 2:30:18 PM"
    },
    {
      id: 2,
      user: "Super Admin", 
      action: "upload",
      document: "Laboratory Testing.pdf",
      timestamp: "Yesterday - 5:30:00 PM"
    },
    {
      id: 3,
      user: "Super Admin",
      action: "view",
      document: "Topographic Survey.pdf", 
      timestamp: "25 July 2025 - 7:45:17 PM"
    },
    {
      id: 4,
      user: "Super Admin",
      action: "view", 
      document: "Roads and Urban Roads.pdf",
      timestamp: "25 July 2025 - 1:40:23 PM"
    },
    {
      id: 5,
      user: "Super Admin",
      action: "upload",
      document: "Materials Field.pdf",
      timestamp: "25 July 2025 - 10:51:06 PM"
    },
    {
      id: 6,
      user: "Super Admin",
      action: "download",
      document: "Laboratory Testing.pdf", 
      timestamp: "24 July 2025 - 9:15:14 PM"
    }
  ];

  const filterStats = {
    all: 30,
    views: 16,
    uploads: 9,
    downloads: 5
  };

  const getActionIcon = (action) => {
    switch (action) {
      case "download":
        return (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12.6663 6H9.99967V2H5.99967V6H3.33301L7.99967 10.6667L12.6663 6ZM7.33301 7.33333V3.33333H8.66634V7.33333H9.44634L7.99967 8.78L6.55301 7.33333H7.33301ZM3.33301 12H12.6663V13.3333H3.33301V12Z" fill="currentColor"/>
          </svg>
        );
      case "upload": 
        return (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M5.99967 10.6667H9.99967V6.66667H12.6663L7.99967 2L3.33301 6.66667H5.99967V10.6667ZM7.99967 3.88667L9.44634 5.33333H8.66634V9.33333H7.33301V5.33333H6.55301L7.99967 3.88667ZM3.33301 12H12.6663V13.3333H3.33301V12Z" fill="currentColor"/>
          </svg>
        );
      case "view":
        return (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8.00033 3C4.66699 3 1.82033 5.07333 0.666992 8C1.82033 10.9267 4.66699 13 8.00033 13C11.3337 13 14.1803 10.9267 15.3337 8C14.1803 5.07333 11.3337 3 8.00033 3ZM8.00033 11.3333C6.16033 11.3333 4.66699 9.84 4.66699 8C4.66699 6.16 6.16033 4.66667 8.00033 4.66667C9.84033 4.66667 11.3337 6.16 11.3337 8C11.3337 9.84 9.84033 11.3333 8.00033 11.3333ZM8.00033 6C6.89366 6 6.00033 6.89333 6.00033 8C6.00033 9.10667 6.89366 10 8.00033 10C9.10699 10 10.0003 9.10667 10.0003 8C10.0003 6.89333 9.10699 6 8.00033 6Z" fill="currentColor"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="activity-figma-container">
      {/* Sidebar */}
      <div className="activity-sidebar">
        <div className="sidebar-header">
          <img src="https://api.builder.io/api/v1/image/assets/TEMP/5466862e96d2c987d2e2e076b94c78f0864534f2?width=140" alt="Vala AI Logo" className="sidebar-logo" />
          <div className="sidebar-brand">Vala AI</div>
        </div>
        
        <div className="sidebar-divider"></div>
        
        <nav className="sidebar-nav">
          <a href="#" className="sidebar-nav-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 3L4 9V21H9V14H15V21H20V9L12 3Z" fill="currentColor"/>
            </svg>
            Dashboard
          </a>
          <a href="#" className="sidebar-nav-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 16H15V10H19L12 3L5 10H9V16ZM5 18H19V20H5V18Z" fill="currentColor"/>
            </svg>
            Upload File
          </a>
          <a href="#" className="sidebar-nav-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M20 2H4C2.9 2 2.01 2.9 2.01 4L2 22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM6 9H18V11H6V9ZM14 14H6V12H14V14ZM18 8H6V6H18V8Z" fill="currentColor"/>
            </svg>
            Chat
          </a>
          <a href="#" className="sidebar-nav-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M2 20H22V16H2V20ZM4 17H6V19H4V17ZM2 4V8H22V4H2ZM6 7H4V5H6V7ZM2 14H22V10H2V14ZM4 11H6V13H4V11Z" fill="currentColor"/>
            </svg>
            Knowledge Base
          </a>
          <a href="#" className="sidebar-nav-item active">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M23 8C23 9.1 22.1 10 21 10C20.82 10 20.65 9.98 20.49 9.93L16.93 13.48C16.98 13.64 17 13.82 17 14C17 15.1 16.1 16 15 16C13.9 16 13 15.1 13 14C13 13.82 13.02 13.64 13.07 13.48L10.52 10.93C10.36 10.98 10.18 11 10 11C9.82 11 9.64 10.98 9.48 10.93L4.93 15.49C4.98 15.65 5 15.82 5 16C5 17.1 4.1 18 3 18C1.9 18 1 17.1 1 16C1 14.9 1.9 14 3 14C3.18 14 3.35 14.02 3.51 14.07L8.07 9.52C8.02 9.36 8 9.18 8 9C8 7.9 8.9 7 10 7C11.1 7 12 7.9 12 9C12 9.18 11.98 9.36 11.93 9.52L14.48 12.07C14.64 12.02 14.82 12 15 12C15.18 12 15.36 12.02 15.52 12.07L19.07 8.51C19.02 8.35 19 8.18 19 8C19 6.9 19.9 6 21 6C22.1 6 23 6.9 23 8Z" fill="currentColor"/>
            </svg>
            Activity
          </a>
          <a href="#" className="sidebar-nav-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M19.1401 12.9404C19.1801 12.6404 19.2001 12.3304 19.2001 12.0004C19.2001 11.6804 19.1801 11.3604 19.1301 11.0604L21.1601 9.48039C21.3401 9.34039 21.3901 9.07039 21.2801 8.87039L19.3601 5.55039C19.2401 5.33039 18.9901 5.26039 18.7701 5.33039L16.3801 6.29039C15.8801 5.91039 15.3501 5.59039 14.7601 5.35039L14.4001 2.81039C14.3601 2.57039 14.1601 2.40039 13.9201 2.40039H10.0801C9.84011 2.40039 9.65011 2.57039 9.61011 2.81039L9.25011 5.35039C8.66011 5.59039 8.12011 5.92039 7.63011 6.29039L5.24011 5.33039C5.02011 5.25039 4.77011 5.33039 4.65011 5.55039L2.74011 8.87039C2.62011 9.08039 2.66011 9.34039 2.86011 9.48039L4.89011 11.0604C4.84011 11.3604 4.80011 11.6904 4.80011 12.0004C4.80011 12.3104 4.82011 12.6404 4.87011 12.9404L2.84011 14.5204C2.66011 14.6604 2.61011 14.9304 2.72011 15.1304L4.64011 18.4504C4.76011 18.6704 5.01011 18.7404 5.23011 18.6704L7.62011 17.7104C8.12011 18.0904 8.65011 18.4104 9.24011 18.6504L9.60011 21.1904C9.65011 21.4304 9.84011 21.6004 10.0801 21.6004H13.9201C14.1601 21.6004 14.3601 21.4304 14.3901 21.1904L14.7501 18.6504C15.3401 18.4104 15.8801 18.0904 16.3701 17.7104L18.7601 18.6704C18.9801 18.7504 19.2301 18.6704 19.3501 18.4504L21.2701 15.1304C21.3901 14.9104 21.3401 14.6604 21.1501 14.5204L19.1401 12.9404ZM12.0001 15.6004C10.0201 15.6004 8.40011 13.9804 8.40011 12.0004C8.40011 10.0204 10.0201 8.40039 12.0001 8.40039C13.9801 8.40039 15.6001 10.0204 15.6001 12.0004C15.6001 13.9804 13.9801 15.6004 12.0001 15.6004Z" fill="currentColor"/>
            </svg>
            Settings
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="activity-main">
        {/* Header */}
        <div className="activity-header">
          <div className="header-user-dropdown">
            <div className="user-avatar">N</div>
            <span>Normal User Account</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4.94 5.72656L8 8.7799L11.06 5.72656L12 6.66656L8 10.6666L4 6.66656L4.94 5.72656Z" fill="currentColor"/>
            </svg>
          </div>
          
          <div className="header-controls">
            <div className="header-search">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M20.6667 18.6667H19.6133L19.24 18.3067C20.5467 16.7867 21.3333 14.8133 21.3333 12.6667C21.3333 7.88 17.4533 4 12.6667 4C7.88 4 4 7.88 4 12.6667C4 17.4533 7.88 21.3333 12.6667 21.3333C14.8133 21.3333 16.7867 20.5467 18.3067 19.24L18.6667 19.6133V20.6667L25.3333 27.32L27.32 25.3333L20.6667 18.6667ZM12.6667 18.6667C9.34667 18.6667 6.66667 15.9867 6.66667 12.6667C6.66667 9.34667 9.34667 6.66667 12.6667 6.66667C15.9867 6.66667 18.6667 9.34667 18.6667 12.6667C18.6667 15.9867 15.9867 18.6667 12.6667 18.6667Z" fill="currentColor"/>
              </svg>
              <span>Search...</span>
            </div>
            
            <svg className="theme-toggle" width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M9.01301 6.4534L6.61301 4.06673L4.73301 5.94673L7.11967 8.3334L9.01301 6.4534ZM1.33301 14.0001H5.33301V16.6667H1.33301V14.0001ZM14.6663 0.733398H17.333V4.66673H14.6663V0.733398ZM25.3863 4.06007L27.2637 5.93607L24.877 8.32273L23.001 6.4454L25.3863 4.06007ZM22.9863 24.2134L25.373 26.6134L27.253 24.7334L24.853 22.3467L22.9863 24.2134ZM26.6663 14.0001H30.6663V16.6667H26.6663V14.0001ZM15.9997 7.3334C11.5863 7.3334 7.99967 10.9201 7.99967 15.3334C7.99967 19.7467 11.5863 23.3334 15.9997 23.3334C20.413 23.3334 23.9997 19.7467 23.9997 15.3334C23.9997 10.9201 20.413 7.3334 15.9997 7.3334ZM15.9997 20.6667C13.053 20.6667 10.6663 18.2801 10.6663 15.3334C10.6663 12.3867 13.053 10.0001 15.9997 10.0001C18.9463 10.0001 21.333 12.3867 21.333 15.3334C21.333 18.2801 18.9463 20.6667 15.9997 20.6667ZM14.6663 26.0001H17.333V29.9334H14.6663V26.0001ZM4.73301 24.7201L6.61301 26.6001L8.99967 24.2001L7.11967 22.3201L4.73301 24.7201Z" fill="currentColor"/>
            </svg>
            
            <div className="user-profile">
              <svg width="34" height="33" viewBox="0 0 34 33" fill="none">
                <path d="M17.0006 16.0562C19.9502 16.0562 22.3392 13.6672 22.3392 10.7176C22.3392 7.76796 19.9502 5.37891 17.0006 5.37891C14.051 5.37891 11.6619 7.76796 11.6619 10.7176C11.6619 13.6672 14.051 16.0562 17.0006 16.0562ZM17.0006 18.7256C13.437 18.7256 6.32324 20.514 6.32324 24.0642V26.7336H27.6779V24.0642C27.6779 20.514 20.5641 18.7256 17.0006 18.7256Z" fill="currentColor"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="activity-content">
          <div className="content-header">
            <h1 className="content-title">Activity Log</h1>
            <p className="content-description">Track document views, uploads, and downloads by users.</p>
          </div>

          {/* Filters Section */}
          <div className="filters-section">
            <div className="search-bar">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M20.6667 18.6667H19.6133L19.24 18.3067C20.5467 16.7867 21.3333 14.8133 21.3333 12.6667C21.3333 7.88 17.4533 4 12.6667 4C7.88 4 4 7.88 4 12.6667C4 17.4533 7.88 21.3333 12.6667 21.3333C14.8133 21.3333 16.7867 20.5467 18.3067 19.24L18.6667 19.6133V20.6667L25.3333 27.32L27.32 25.3333L20.6667 18.6667ZM12.6667 18.6667C9.34667 18.6667 6.66667 15.9867 6.66667 12.6667C6.66667 9.34667 9.34667 6.66667 12.6667 6.66667C15.9867 6.66667 18.6667 9.34667 18.6667 12.6667C18.6667 15.9867 15.9867 18.6667 12.6667 18.6667Z" fill="currentColor"/>
              </svg>
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="date-picker">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M7 11H9V13H7V11ZM21 6V20C21 21.1 20.1 22 19 22H5C3.89 22 3 21.1 3 20L3.01 6C3.01 4.9 3.89 4 5 4H6V2H8V4H16V2H18V4H19C20.1 4 21 4.9 21 6ZM5 8H19V6H5V8ZM19 20V10H5V20H19ZM15 13H17V11H15V13ZM11 13H13V11H11V13Z" fill="currentColor"/>
              </svg>
            </div>

            <div className="filter-tabs">
              <button 
                className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                All {filterStats.all}
              </button>
              <button 
                className={`filter-tab ${activeFilter === 'views' ? 'active' : ''}`}
                onClick={() => setActiveFilter('views')}
              >
                Views {filterStats.views}
              </button>
              <button 
                className={`filter-tab ${activeFilter === 'uploads' ? 'active' : ''}`}
                onClick={() => setActiveFilter('uploads')}
              >
                Uploads {filterStats.uploads}
              </button>
              <button 
                className={`filter-tab ${activeFilter === 'downloads' ? 'active' : ''}`}
                onClick={() => setActiveFilter('downloads')}
              >
                Downloads {filterStats.downloads}
              </button>
            </div>
          </div>

          {/* Activity Table */}
          <div className="activity-table">
            <div className="table-header">
              <div className="table-header-cell">User</div>
              <div className="table-header-cell">Action</div>
              <div className="table-header-cell">Document</div>
              <div className="table-header-cell">Timestamp</div>
            </div>

            <div className="table-body">
              {activities.map((activity) => (
                <div key={activity.id} className="table-row">
                  <div className="table-cell user-cell">{activity.user}</div>
                  <div className="table-cell action-cell">
                    <span className={`action-badge action-${activity.action}`}>
                      {getActionIcon(activity.action)}
                      {activity.action}
                    </span>
                  </div>
                  <div className="table-cell document-cell">{activity.document}</div>
                  <div className="table-cell timestamp-cell">{activity.timestamp}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          <div className="pagination">
            <div className="pagination-info">Showing 1 to 4 of 4</div>
            <div className="pagination-controls">
              <button className="pagination-btn">First</button>
              <button className="pagination-btn">Previous</button>
              <button className="pagination-btn">Next</button>
              <button className="pagination-btn">Last</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityFigma;
