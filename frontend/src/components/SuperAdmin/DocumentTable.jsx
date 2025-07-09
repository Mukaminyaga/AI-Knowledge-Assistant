import React, { useState } from "react";
import {
  FiSearch,
  FiFile,
  FiFileText,
  FiImage,
  FiDownload,
  FiEye,
  FiCalendar,
  FiUser,
  FiHardDrive,
} from "react-icons/fi";
import "../../styles/SuperAdmin.css";

const DocumentTable = ({ documents, tenantId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("uploadedAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const convertSizeToBytes = (sizeStr) => {
    const units = { KB: 1024, MB: 1024 * 1024, GB: 1024 * 1024 * 1024 };
    const match = String(sizeStr).match(/^(\d+(?:\.\d+)?)\s*(KB|MB|GB)$/i);
    if (match && match[2]) {
      return parseFloat(match[1]) * (units[match[2].toUpperCase()] || 1);
    }
    return 0;
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      (doc.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (doc.uploadedBy?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (doc.type?.toLowerCase() || "").includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
    const matchesType =
      typeFilter === "all" ||
      (doc.type?.toLowerCase() || "") === typeFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesType;
  });

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (sortField === "uploadedAt") {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    }

    if (sortField === "size") {
      aVal = convertSizeToBytes(aVal);
      bVal = convertSizeToBytes(bVal);
    }

    if (typeof aVal === "string") aVal = aVal.toLowerCase();
    if (typeof bVal === "string") bVal = bVal.toLowerCase();

    return sortDirection === "asc"
      ? aVal > bVal ? 1 : -1
      : aVal < bVal ? 1 : -1;
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      processed: "success",
      processing: "warning",
      failed: "danger",
      pending: "info",
    };

    const safeStatus = status?.toLowerCase?.() || "unknown";
    const badgeColor = statusColors[safeStatus] || "default";

    return (
      <span className={`status-badge status-${badgeColor}`}>
        {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
      </span>
    );
  };

  const getFileIcon = (type = "") => {
    const iconMap = {
      pdf: FiFileText,
      doc: FiFileText,
      docx: FiFileText,
      txt: FiFileText,
      jpg: FiImage,
      jpeg: FiImage,
      png: FiImage,
      gif: FiImage,
    };
    const IconComponent = iconMap[type.toLowerCase()] || FiFile;
    return <IconComponent className="file-icon" />;
  };

  const getTypeColors = (type = "") => {
    const typeColors = {
      pdf: "type-pdf",
      doc: "type-doc",
      docx: "type-doc",
      txt: "type-txt",
      jpg: "type-image",
      jpeg: "type-image",
      png: "type-image",
      gif: "type-image",
    };
    return typeColors[type.toLowerCase()] || "type-default";
  };

  const uniqueTypes = [...new Set(documents.map((doc) => doc.type || ""))];

  const handleDownload = (document) => {
    console.log("Downloading document:", document.name);
  };

  const handleView = (document) => {
    console.log("Viewing document:", document.name);
  };

  return (
    <div className="document-table-container">
      <div className="table-controls">
        <div className="search-and-filters">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-section">
            <div className="filter-group">
              <label className="filter-label">Status:</label>
              <select
                className="filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="processed">Processed</option>
                <option value="processing">Processing</option>
                <option value="failed">Failed</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Type:</label>
              <select
                className="filter-select"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                {uniqueTypes.map((type) => (
                  <option key={type || "unknown"} value={type}>
                    {(type || "Unknown").toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="document-stats">
        <div className="stat-item">
          <div className="stat-value">{documents.length}</div>
          <div className="stat-label">Total Documents</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">
            {documents.filter((d) => d.status === "processed").length}
          </div>
          <div className="stat-label">Processed</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">
            {documents.filter((d) => d.status === "processing").length}
          </div>
          <div className="stat-label">Processing</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">
            {documents
              .reduce((total, doc) => {
                const sizeInMB = convertSizeToBytes(doc.size) / (1024 * 1024);
                return total + sizeInMB;
              }, 0)
              .toFixed(1)}{" "}
            MB
          </div>
          <div className="stat-label">Total Size</div>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {["name", "type", "size", "uploadedBy", "uploadedAt"].map((field) => (
                <th
                  key={field}
                  className="sortable"
                  onClick={() => handleSort(field)}
                >
                  {field === "uploadedAt" ? "Uploaded" : field.charAt(0).toUpperCase() + field.slice(1)}
                  {sortField === field && (
                    <span className="sort-indicator">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
              ))}
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedDocuments.length === 0 ? (
              <tr>
                <td colSpan={7} className="no-data">
                  {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                    ? "No documents found matching your criteria."
                    : "No documents available for this tenant."}
                </td>
              </tr>
            ) : (
              sortedDocuments.map((document) => (
                <tr key={document.id}>
                  <td>
                    <div className="document-cell">
                      <div className={`document-icon ${getTypeColors(document.type)}`}>
                        {getFileIcon(document.type)}
                      </div>
                      <div className="document-info">
                        <div className="document-name">{document.name}</div>
                        <div className="document-id">ID: {document.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`type-badge ${getTypeColors(document.type)}`}>
                      {(document.type || "Unknown").toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div className="size-cell">
                      <FiHardDrive className="size-icon" />
                      {document.size}
                    </div>
                  </td>
                  <td>
                    <div className="uploader-cell">
                      <FiUser className="uploader-icon" />
                      {document.uploadedBy || "Unknown"}
                    </div>
                  </td>
                  <td>{getStatusBadge(document.status)}</td>
                  <td>
                    <div className="date-cell">
                      <FiCalendar className="date-icon" />
                      {formatDate(document.uploadedAt)}
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn view-btn"
                        onClick={() => handleView(document)}
                        title="View document"
                      >
                        <FiEye />
                      </button>
                      <button
                        className="action-btn download-btn"
                        onClick={() => handleDownload(document)}
                        title="Download document"
                      >
                        <FiDownload />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <p className="showing-count">
          Showing {sortedDocuments.length} of {documents.length} documents
        </p>
      </div>
    </div>
  );
};

export default DocumentTable;
