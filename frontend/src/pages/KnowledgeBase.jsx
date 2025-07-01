import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/KnowledgeBase.css";

const ITEMS_PER_PAGE = 5;

const KnowledgeBase = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocs, setFilteredDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchDocuments = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/documents/`);
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
    const interval = setInterval(fetchDocuments);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let result = [...documents];

    // Filter
    if (filter === "indexed") result = result.filter((doc) => doc.num_chunks > 0);
    if (filter === "indexing") result = result.filter((doc) => doc.num_chunks === 0);

    // Search
    if (searchTerm.trim()) {
      result = result.filter((doc) =>
        doc.filename.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredDocs(result);
    setCurrentPage(1);
  }, [documents, filter, searchTerm]);

  const deleteDocument = async (docId) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/documents/${docId}`);
      setDocuments((docs) => docs.filter((d) => d.id !== docId));
      toast.success("Document deleted");
    } catch (error) {
      console.error(error);
      toast.error("Error deleting the document");
    }
  };

  const handleDownload = (filename) => {
    const link = document.createElement("a");
    link.href = `${process.env.REACT_APP_API_URL}/uploads/${filename}`;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`✅ Download started for ${filename}`);
  };

  // Pagination
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentDocs = filteredDocs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDocs.length / ITEMS_PER_PAGE);

  const paginate = (page) => setCurrentPage(page);

  return (
    <DashboardLayout>
      <div className="documents-list-container">
        <div className="documents-header">
          <h2>Uploaded Documents</h2>

          <div className="top-controls">
            <input
              type="text"
              placeholder="Search by filename..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-box"
            />

            <div className="filter-buttons">
              <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>
                All
              </button>
              <button
                className={filter === "indexed" ? "active" : ""}
                onClick={() => setFilter("indexed")}
              >
                ✅ Indexed
              </button>
              <button
                className={filter === "indexing" ? "active" : ""}
                onClick={() => setFilter("indexing")}
              >
                ⏳ Indexing
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <p>Loading documents...</p>
        ) : currentDocs.length === 0 ? (
          <p>No documents match your filter.</p>
        ) : (
          <>
            <table className="documents-table">
              <thead>
                <tr>
                  <th>Filename</th>
                  <th>Type</th>
                  <th>Size</th>
                  {/* <th>Chunks</th> */}
                  <th>Status</th>
                  <th>Preview</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentDocs.map((doc) => (
                  <tr key={doc.id}>
                    <td>{doc.filename}</td>
                    <td>{doc.file_type.toUpperCase()}</td>
                    <td>{(doc.size / 1024).toFixed(1)} KB</td>
                    {/* <td>{doc.num_chunks}</td> */}
                    <td>
                      {doc.num_chunks > 0 ? (
                        <span className="status indexed"> Indexed</span>
                      ) : (
                        <span className="status indexing"> Indexing</span>
                      )}
                    </td>
                    <td className="preview-column">
                      {doc.preview?.slice(0, 60) || "-"}
                    </td>
                    <td>
                      <button onClick={() => deleteDocument(doc.id)} className="delete-btn">
                        Delete
                      </button>
                      {/* <button
                        onClick={() => handleDownload(doc.filename)}
                        className="download-btn"
                      >
                        Download
                      </button> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination">
              {[...Array(totalPages).keys()].map((num) => (
                <button
                  key={num + 1}
                  className={currentPage === num + 1 ? "active" : ""}
                  onClick={() => paginate(num + 1)}
                >
                  {num + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      <ToastContainer position="top-right" />
    </DashboardLayout>
  );
};

export default KnowledgeBase;
