import React, { useEffect, useState } from "react";
import axios from "axios";
// import { FiHardDrive } from "react-icons/fi";
import "../../styles/SuperAdmin.css";

const DocumentStats = ({ tenantId }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const convertSizeToBytes = (sizeInBytes) => {
    return typeof sizeInBytes === "number" ? sizeInBytes : 0;
  };

  const fetchDocuments = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/documents/tenants/${tenantId}/documents`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setDocuments(res.data || []);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tenantId) fetchDocuments();
  }, [tenantId]);

  const totalDocuments = documents.length;
  const processed = documents.filter((d) => d.status === "processed").length;
  const processing = documents.filter((d) => d.status === "processing").length;
  const pending = documents.filter((d) => d.status === "pending").length;
  const failed = documents.filter((d) => d.status === "failed").length;
  const totalSizeMB = (
    documents.reduce((sum, d) => sum + convertSizeToBytes(d.size), 0) /
    (1024 * 1024)
  ).toFixed(1);

  return (
    <div className="document-table-container">
      {loading ? (
        <div className="no-data">Loading stats...</div>
      ) : (
        <div className="document-stats">
          <div className="stat-item">
            <div className="stat-value">{totalDocuments}</div>
            <div className="stat-label">Total Documents</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{processed}</div>
            <div className="stat-label">Processed</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{processing}</div>
            <div className="stat-label">Processing</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{pending}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{failed}</div>
            <div className="stat-label">Failed</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{totalSizeMB} MB</div>
            <div className="stat-label">Total Size</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentStats;
