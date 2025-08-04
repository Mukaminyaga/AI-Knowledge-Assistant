import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout";
import { DepartmentProvider, useDepartments } from "../context/DepartmentContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FiSearch,
  FiFile,
  FiFileText,
  FiImage,
  FiDownload,
  FiEye,
  FiHardDrive,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
  FiFolder,
} from "react-icons/fi";
import "../styles/SuperAdmin.css";

const ITEMS_PER_PAGE = 5;

const KnowledgeBaseContent = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocs, setFilteredDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("filename");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedDocuments, setSelectedDocuments] = useState(new Set());
  const [assignmentDepartment, setAssignmentDepartment] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);
  const { departments, loading: departmentsLoading } = useDepartments();

  const fetchDocuments = async () => {
    console.log("Fetching documents...");
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/documents/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setDocuments(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Error loading documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);
  useEffect(() => {
    let result = [...documents];

    // Filter by status
    if (filter === "indexed")
      result = result.filter((doc) => doc.status === "processed");
    else if (filter === "indexing")
      result = result.filter((doc) => doc.status === "processing");
    else if (filter === "failed")
      result = result.filter((doc) => doc.status === "failed");
    else if (filter === "pending")
      result = result.filter((doc) => doc.status === "pending");

    // Filter by department
    if (selectedDepartment !== "all") {
      if (selectedDepartment === "unassigned") {
        result = result.filter((doc) => !doc.department_id);
      } else {
        result = result.filter((doc) => doc.department_id === parseInt(selectedDepartment));
      }
    }

    // Filter by search term
    if (searchTerm.trim()) {
      result = result.filter((doc) =>
        doc.filename.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredDocs(result);
    setCurrentPage(1);
  }, [documents, filter, searchTerm, selectedDepartment]);

  const handleView = async (filename) => {
    const encodedFilename = encodeURIComponent(filename);

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/documents/view/${encodedFilename}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          responseType: "blob",
        },
      );

      const fileBlob = new Blob([res.data], {
        type: res.headers["content-type"],
      });
      const fileURL = URL.createObjectURL(fileBlob);
      window.open(fileURL, "_blank");
    } catch (err) {
      console.error("View error", err);
      toast.error("Failed to preview document");
    }
  };

  const handleDownload = async (filename) => {
    const encodedFilename = encodeURIComponent(filename);

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/documents/download/${encodedFilename}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          responseType: "blob",
        },
      );

      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download error", err);
      toast.error("Failed to download document");
    }
  };

  const deleteDocument = async (docId) => {
    if (!window.confirm("Are you sure you want to delete this document?"))
      return;

    const token = localStorage.getItem("token");

    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/documents/${docId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setDocuments((docs) => docs.filter((d) => d.id !== docId));
      toast.success("Document deleted");
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.status === 401
          ? "Unauthorized: Please log in again"
          : "Error deleting the document",
      );
    }
  };

  const handleDocumentSelect = (docId) => {
    const newSelected = new Set(selectedDocuments);
    if (newSelected.has(docId)) {
      newSelected.delete(docId);
    } else {
      newSelected.add(docId);
    }
    setSelectedDocuments(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedDocuments.size === currentDocs.length) {
      setSelectedDocuments(new Set());
    } else {
      setSelectedDocuments(new Set(currentDocs.map(doc => doc.id)));
    }
  };

  const assignDocumentsToDepartment = async () => {
    if (selectedDocuments.size === 0) {
      toast.warning("Please select documents to assign");
      return;
    }

    if (!assignmentDepartment) {
      toast.warning("Please select a department");
      return;
    }

    setIsAssigning(true);
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/documents/assign-department`,
        {
          document_ids: Array.from(selectedDocuments),
          department_id: assignmentDepartment === "unassigned" ? null : assignmentDepartment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Update local state
      setDocuments(docs =>
        docs.map(doc =>
          selectedDocuments.has(doc.id)
            ? { ...doc, department_id: assignmentDepartment === "unassigned" ? null : parseInt(assignmentDepartment) }
            : doc
        )
      );

      setSelectedDocuments(new Set());
      setAssignmentDepartment("");
      toast.success(`Successfully assigned ${selectedDocuments.size} documents to department`);
    } catch (error) {
      console.error("Assignment error:", error);
      toast.error("Failed to assign documents to department");
    } finally {
      setIsAssigning(false);
    }
  };

  // const handleDownload = (filename) => {
  //   const link = document.createElement("a");
  //   link.href = `${process.env.REACT_APP_API_URL}/uploads/${filename}`;
  //   link.setAttribute("download", filename);
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  //   toast.success(`✅ Download started for ${filename}`);
  // };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
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

  const getStatusBadge = (status) => {
    const statusColors = {
      processed: "status-success", // green
      processing: "status-warning", // yellow
      failed: "status-danger", // red
      pending: "status-info", // blue
    };

    return (
      <span
        className={`status-badge ${statusColors[status] || "status-default"}`}
      >
        {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
      </span>
    );
  };

  const formatFileSize = (sizeInBytes) => {
    return (sizeInBytes / 1024).toFixed(1) + " KB";
  };

  // Sort documents
  const sortedDocuments = [...filteredDocs].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (sortField === "size") {
      aVal = a.size;
      bVal = b.size;
    }

    if (typeof aVal === "string") aVal = aVal.toLowerCase();
    if (typeof bVal === "string") bVal = bVal.toLowerCase();

    return sortDirection === "asc"
      ? aVal > bVal
        ? 1
        : -1
      : aVal < bVal
        ? 1
        : -1;
  });

  // Pagination
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentDocs = sortedDocuments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedDocuments.length / ITEMS_PER_PAGE);

  const paginate = (page) => setCurrentPage(page);

  const uniqueTypes = [...new Set(documents.map((doc) => doc.file_type || ""))];

  return (
    <DashboardLayout>
      <div className="document-table-container">
        <div className="page-header">
          <div className="page-header-content">
            <h1 className="page-title">Knowledge Base</h1>
            <p className="page-subtitle">
              Manage your uploaded documents and their indexing status
            </p>
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
            <div className="stat-label">Indexed</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">
              {documents.filter((d) => d.status === "processing").length}
            </div>
            <div className="stat-label">Processing</div>
          </div>
          <div className="stat-item pending-highlight">
            <div className="stat-value">
              {documents.filter((d) => d.status === "pending").length}
            </div>
            <div className="stat-label">Pending Approval</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-value">
              {(
                documents.reduce((total, doc) => total + (doc.size || 0), 0) /
                (1024 * 1024)
              ).toFixed(1)}{" "}
              MB
            </div>
            <div className="stat-label">Total Size</div>
          </div>
        </div>


        {/* Department Filter Cards */}
        <div className="department-filter-cards">
          <div className="department-cards-grid">
            <div
              className={`department-filter-card ${selectedDepartment === "all" ? "active" : ""}`}
              onClick={() => setSelectedDepartment("all")}
            >
              <div className="department-card-content">
                <div className="department-color all-departments" />
                <div className="department-info">
                  <h3 className="department-name">All Departments</h3>
                  <p className="department-count">{documents.length} documents</p>
                </div>
              </div>
            </div>
            {departments.map((dept) => {
              const deptDocCount = documents.filter(doc => doc.department_id === dept.id).length;
              return (
                <div
                  key={dept.id}
                  className={`department-filter-card ${selectedDepartment === dept.id.toString() ? "active" : ""}`}
                  onClick={() => setSelectedDepartment(dept.id.toString())}
                >
                  <div className="department-card-content">
                    <div className="department-color" style={{ backgroundColor: dept.color }} />
                    <div className="department-info">
                      <h3 className="department-name">{dept.name}</h3>
                      <p className="department-count">{deptDocCount} documents</p>
                    </div>
                  </div>
                </div>
              );
            })}
            <div
              className={`department-filter-card ${selectedDepartment === "unassigned" ? "active" : ""}`}
              onClick={() => setSelectedDepartment("unassigned")}
            >
              <div className="department-card-content">
                <div className="department-color unassigned" />
                <div className="department-info">
                  <h3 className="department-name">Unassigned</h3>
                  <p className="department-count">{documents.filter(doc => !doc.department_id).length} documents</p>
                </div>
              </div>
            </div>
          </div>
        </div>

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
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="indexed">Indexed</option>{" "}
                  {/* maps to processed */}
                  <option value="indexing">Indexing</option>{" "}
                  {/* maps to processing */}
                  <option value="failed">Failed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          </div>
        </div>

      
        {/* Bulk Assignment Controls */}
        {selectedDocuments.size > 0 && (
          <div className="bulk-assignment-controls">
            <div className="bulk-assignment-info">
              <span className="selected-count">
                {selectedDocuments.size} document{selectedDocuments.size !== 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="bulk-assignment-actions">
              <select
                value={assignmentDepartment}
                onChange={(e) => setAssignmentDepartment(e.target.value)}
                className="assignment-select"
                disabled={isAssigning}
              >
                <option value="">Select Department</option>
                <option value="unassigned">Unassigned</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              <button
                onClick={assignDocumentsToDepartment}
                disabled={!assignmentDepartment || isAssigning}
                className="assign-button"
              >
                {isAssigning ? "Assigning..." : "Assign to Department"}
              </button>
              <button
                onClick={() => setSelectedDocuments(new Set())}
                className="clear-selection-button"
                disabled={isAssigning}
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="table-wrapper">
            <div className="no-data">Loading documents...</div>
          </div>
        ) : (
          <>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th className="checkbox-column">
                      <input
                        type="checkbox"
                        checked={selectedDocuments.size === currentDocs.length && currentDocs.length > 0}
                        onChange={handleSelectAll}
                        disabled={currentDocs.length === 0}
                      />
                    </th>
                    <th
                      className="sortable"
                      onClick={() => handleSort("filename")}
                    >
                      Document
                      {/* {sortField === "filename" && (
                        <span className="sort-indicator">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )} */}
                    </th>
                    {/* <th>Department</th> */}
                    <th
                      className="sortable"
                      onClick={() => handleSort("file_type")}
                    >
                      Type
                      {sortField === "file_type" && (
                        <span className="sort-indicator">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </th>
                    <th className="sortable" onClick={() => handleSort("size")}>
                      Size
                      {sortField === "size" && (
                        <span className="sort-indicator">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentDocs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="no-data">
                      {searchTerm || filter !== "all" || selectedDepartment !== "all"
                        ? "No documents found matching your criteria."
                        : "No documents available."}
                    </td>
                  </tr>
                  ) : (
                    currentDocs.map((doc) => {
                      const department = departments.find(d => d.id === doc.department_id);
                      return (
                        <tr key={doc.id}>
                          <td className="checkbox-column">
                            <input
                              type="checkbox"
                              checked={selectedDocuments.has(doc.id)}
                              onChange={() => handleDocumentSelect(doc.id)}
                            />
                          </td>
                          <td>
                            <div className="document-cell">
                              <div
                                className={`document-icon ${getTypeColors(doc.file_type)}`}
                              >
                                {getFileIcon(doc.file_type)}
                              </div>
                              <div className="document-info">
                                <div className="document-name">
                                  {doc.filename}
                                </div>
                                {/* <div className="document-id">ID: {doc.id}</div> */}
                              </div>
                            </div>
                          </td>
                          {/* <td>
                            {department ? (
                              <div className="department-cell">
                                <div
                                  className="department-indicator"
                                  style={{ backgroundColor: department.color }}
                                />
                                <span className="department-name">{department.name}</span>
                              </div>
                            ) : (
                              <span className="no-department">No Department</span>
                            )}
                          </td> */}
                          <td>
                            <span
                              className={`type-badge ${getTypeColors(doc.file_type)}`}
                            >
                              {(doc.file_type || "Unknown").toUpperCase()}
                            </span>
                          </td>
                          <td>
                            <div className="size-cell">
                              <FiHardDrive className="size-icon" />
                              {formatFileSize(doc.size)}
                            </div>
                          </td>
                          <td>{getStatusBadge(doc.status)}</td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="action-btn view-btn"
                                onClick={() => handleView(doc.filename)}
                                title="View document"
                              >
                                <FiEye />
                              </button>

                              <button
                                className="action-btn download-btn"
                                onClick={() => handleDownload(doc.filename)}
                                title="Download document"
                              >
                                <FiDownload />
                              </button>

                              <button
                                className="action-btn delete-btn"
                                onClick={() => deleteDocument(doc.id)}
                                title="Delete document"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="table-footer">
              <p className="showing-count">
                Showing {currentDocs.length} of {sortedDocuments.length}{" "}
                documents
              </p>
            </div>

            {totalPages >= 1 && (
              <div className="pagination-container">
                {currentPage > 1 && (
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    <FiChevronLeft size={16} />
                    Previous
                  </button>
                )}

                <div className="pagination-numbers">
                  {[...Array(totalPages).keys()].map((num) => (
                    <button
                      key={num + 1}
                      className={`pagination-number ${currentPage === num + 1 ? "active" : ""}`}
                      onClick={() => paginate(num + 1)}
                    >
                      {num + 1}
                    </button>
                  ))}
                </div>

                {currentPage < totalPages && (
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                    <FiChevronRight size={16} />
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
      <ToastContainer position="top-right" />
    </DashboardLayout>
  );
};

const KnowledgeBase = () => {
  return (
    <DepartmentProvider>
      <KnowledgeBaseContent />
    </DepartmentProvider>
  );
};

export default KnowledgeBase;
