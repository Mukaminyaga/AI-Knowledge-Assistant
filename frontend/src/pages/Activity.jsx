import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout";
import {
  FiActivity,
  FiEye,
  FiDownload,
  FiUpload,
  FiFileText,
  FiClock,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import "../styles/Activity.css";

const API_URL = process.env.REACT_APP_API_URL;

const Activity = () => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const calculateStats = (activityList) => {
    return {
      total: activityList.length,
      views: activityList.filter((a) => a.action === "view").length,
      uploads: activityList.filter((a) => a.action === "upload").length,
      downloads: activityList.filter((a) => a.action === "download").length,
    };
  };

  const [activityStats, setActivityStats] = useState({
    total: 0,
    views: 0,
    uploads: 0,
    downloads: 0,
  });

  const fetchActivities = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_URL}/documents/admin/activity-log`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = res.data.map((item, index) => ({
        id: index + 1,
        user: item.user,
        action: item.action,
        document: item.document,
        timestamp: item.timestamp,
      }));

      setActivities(data);
      setFilteredActivities(data);
      setActivityStats(calculateStats(data));
    } catch (err) {
      console.error("Fetch activities error:", err);
      setError("Failed to fetch activities");
    } finally {
      setLoading(false);
    }
  };

  const filterActivities = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1); // Reset to first page when filtering
    if (filter === "all") {
      setFilteredActivities(activities);
    } else {
      setFilteredActivities(activities.filter((a) => a.action === filter));
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  const getActionIcon = (action) => {
    switch (action) {
      case "view":
        return <FiEye size={16} />;
      case "upload":
        return <FiUpload size={16} />;
      case "download":
        return <FiDownload size={16} />;
      case "delete":
        return <FiFileText size={16} />; // or any other icon like FiTrash2 if you import it
      default:
        return <FiActivity size={16} />;
    }
  };

  const getActionColorClass = (action) => {
    switch (action) {
      case "view":
        return "action-view";
      case "upload":
        return "action-upload";
      case "download":
        return "action-download";
      case "delete":
        return "action-delete";
      default:
        return "action-default";
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentActivities = filteredActivities.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="activity-container enhanced">
          <div className="loading-state">
            <FiActivity size={48} />
            <p>Loading activities...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="activity-container enhanced">
        <div className="activity-header">
          <div className="header-content">
            <h2 className="activity-title">
              <FiActivity size={28} /> Activity Log
            </h2>
            <p className="activity-subtitle">
              Track document views, uploads, and downloads by users
            </p>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="activity-table-container">
          <div className="table-header">
            <h3 className="table-title">Recent Activities</h3>

            <div className="filter-buttons">
              <button
                className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
                onClick={() => filterActivities("all")}
              >
                <FiFilter size={14} />
                All
              </button>
              <button
                className={`filter-btn ${activeFilter === "view" ? "active" : ""}`}
                onClick={() => filterActivities("view")}
              >
                <FiEye size={14} />
                Views
              </button>
              <button
                className={`filter-btn ${activeFilter === "upload" ? "active" : ""}`}
                onClick={() => filterActivities("upload")}
              >
                <FiUpload size={14} />
                Uploads
              </button>
              <button
                className={`filter-btn ${activeFilter === "download" ? "active" : ""}`}
                onClick={() => filterActivities("download")}
              >
                <FiDownload size={14} />
                Downloads
              </button>
              <button
                className={`filter-btn ${activeFilter === "delete" ? "active" : ""}`}
                onClick={() => filterActivities("delete")}
              >
                <FiFileText size={14} />
                Deletes
              </button>
            </div>
          </div>

          <div className="activity-table-wrapper">
            <table className="activity-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Action</th>
                  <th>Document</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {currentActivities.map((activity) => (
                  <tr key={activity.id} className="activity-row">
                    <td>{activity.user}</td>
                    <td>
                      <span
                        className={`action-badge ${getActionColorClass(activity.action)}`}
                      >
                        {getActionIcon(activity.action)}
                        {activity.action}
                      </span>
                    </td>
                    <td>{activity.document}</td>
                    <td>
                      <div>{formatTimestamp(activity.timestamp)}</div>
                      <div className="timestamp-full">
                        {new Date(activity.timestamp).toLocaleString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredActivities.length === 0 && (
              <div className="no-activities">
                <FiActivity size={48} />
                <p>No activities found for the selected filter.</p>
              </div>
            )}
          </div>
        </div>

        {filteredActivities.length > 0 && (
          <>
            <div className="activity-results">
              <p>
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, filteredActivities.length)} of{" "}
                {filteredActivities.length} activities
              </p>
            </div>

            {totalPages >= 1 && (
              <div className="pagination-container">
                {currentPage > 1 && (
                  <button className="pagination-btn" onClick={handlePrevious}>
                    <FiChevronLeft size={16} />
                    Previous
                  </button>
                )}

                <div className="pagination-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        className={`pagination-number ${currentPage === page ? "active" : ""}`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    ),
                  )}
                </div>

                {currentPage < totalPages && (
                  <button className="pagination-btn" onClick={handleNext}>
                    Next
                    <FiChevronRight size={16} />
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Activity;
