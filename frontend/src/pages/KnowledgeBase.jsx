import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout"; // Sidebar wrapper
import "../styles/KnowledgeBase.css"; // Optional: create or update this CSS file

const KnowledgeBase = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/documents/`);
      setDocuments(res.data);
    } catch (error) {
      console.error(error);
      alert("Error loading documents");
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (docId) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/documents/${docId}`);
      setDocuments((docs) => docs.filter((d) => d.id !== docId));
    } catch (error) {
      console.error(error);
      alert("Error deleting the document");
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <DashboardLayout>
      <div className="documents-list-container">
        <h2>Uploaded Documents</h2>
        {loading ? (
          <p>Loading documents...</p>
        ) : documents.length === 0 ? (
          <p>No documents uploaded yet.</p>
        ) : (
          <table className="documents-table">
            <thead>
              <tr>
                <th>Filename</th>
                <th>Type</th>
                <th>Size (bytes)</th>
                <th>Chunks</th>
                <th>Preview</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td>{doc.filename}</td>
                  <td>{doc.file_type}</td>
                  <td>{doc.size}</td>
                  <td>{doc.num_chunks}</td>
                  <td>{doc.preview}</td>
                  <td>
                    <button onClick={() => deleteDocument(doc.id)} style={{ color: "red" }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default KnowledgeBase;
