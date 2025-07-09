import React, { useState, useRef } from "react";
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout";
import "../styles/UploadDocuments.css";
import {
  FiFileText,
  FiTag,
  FiFolder,
  FiRefreshCcw,
} from "react-icons/fi";


function UploadDocuments() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e) => {
    e.preventDefault();
    handleFiles(e.target.files);
  };

  const onButtonClick = () => fileInputRef.current?.click();

  function formatFileSize(b) {
    if (b === 0) return "0 Bytes";
    const k = 1024, sizes = ["Bytes","KB","MB","GB"], i = Math.floor(Math.log(b)/Math.log(k));
    return (b / Math.pow(k, i)).toFixed(2) + " " + sizes[i];
  }

  function getFileIcon(type) {
    // if (type.includes("pdf")) return "📄";
    // if (type.includes("text")) return "📝";
    // if (type.includes("word")) return "📘";
    return <img src="/icons/folder.png" alt="Folder icon" width={24} />;
  }

  const handleFiles = (files) => {
    const newFiles = Array.from(files).map((file) => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      status: "ready",
      progress: 0,
    }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (id) =>
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));

const processDocs = async () => {
  if (!uploadedFiles.length) return;

  setIsUploading(true);

  const form = new FormData();
  uploadedFiles.forEach((fileObj) => {
    form.append("files", fileObj.file);  // must be "files" (matches FastAPI param name)
  });

  try {
    await axios.post(`${process.env.REACT_APP_API_URL}/documents/upload`, form, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
      onUploadProgress: (e) => {
        const percent = Math.round((e.loaded * 100) / e.total);
        setUploadedFiles((prev) =>
          prev.map((f) => ({
            ...f,
            progress: percent,
            status: percent === 100 ? "completed" : "uploading",
          }))
        );
      },
    });

    // Mark all as completed once done
    setUploadedFiles((prev) =>
      prev.map((f) => ({
        ...f,
        status: "completed",
        progress: 100,
      }))
    );
  } catch (err) {
    console.error(err);
    setUploadedFiles((prev) =>
      prev.map((f) => ({
        ...f,
        status: "error",
      }))
    );
  } finally {
    setIsUploading(false);
  }
};


  return (
    <DashboardLayout>
      <div className="upload-page-container">
        <div className="upload-header">
          <div className="header-content">
            <h1 className="upload-title">Upload Documents</h1>
          </div>
        </div>

        <div className="upload-content">
            <div className="upload-section">
    <div
      className={`upload-dropzone ${dragActive ? "drag-active" : ""}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={onButtonClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.docx,.txt"
        onChange={handleChange}
        style={{ display: "none" }}
      />
      <div className="dropzone-content">
        <div className="upload-icon">
  {isUploading ? " " : <img src="/icons/folder.png" alt="Folder icon" width={40} />}
</div>

        <h3 className="dropzone-title">
          {dragActive ? "Drop files here" : "Drag & drop files here"}
        </h3>
        <p className="dropzone-text">
          or <span className="browse-link">browse files</span>
        </p>
        <div className="file-types">
          <span className="file-type">PDF</span>
          <span className="file-type">DOC</span>
          <span className="file-type">TXT</span>
        </div>
      </div>
    </div>
  </div>

  {/* Right side: Uploaded files list */}
  {uploadedFiles.length > 0 && (
    <div className="uploaded-files">
      <h3 className="files-title">
        Uploaded Files ({uploadedFiles.length})
      </h3>
      <div className="files-list">
        {uploadedFiles.map((f) => (
          <div key={f.id} className="file-item">
            <div className="file-info">
              <div className="file-icon">{getFileIcon(f.type)}</div>
              <div className="file-details">
                <h4 className="file-name">{f.name}</h4>
                <p className="file-meta">{formatFileSize(f.size)}</p>
                {f.status !== "ready" && (
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${f.progress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="file-actions">
              <div className="file-status">
                {f.status === "completed"
                  ? "✅ Uploaded"
                  : f.status === "uploading"
                  ? `${f.progress}%`
                  : f.status === "error"
                  ? "❌ Error"
                  : null}
              </div>
              <button
                className="remove-button"
                onClick={() => removeFile(f.id)}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="upload-actions">
        <button
          className="process-button"
          onClick={processDocs}
          disabled={isUploading}
        >
          Process Documents
        </button>
        <button
          className="clear-button"
          onClick={() => setUploadedFiles([])}
          disabled={isUploading}
        >
          Clear All
        </button>
      </div>
    </div>
  )}
</div>
        <div className="upload-tips">
  <h3 className="tips-title"> Tips for better results</h3>
  <div className="tips-grid">
    <div className="tip-item">
      <div className="tip-icon"><FiFileText size={24} /></div>
      <h4>Clear text documents</h4>
      <p>
        Ensure text is readable and well-formatted for better AI
        understanding
      </p>
    </div>
    <div className="tip-item">
      <div className="tip-icon"><FiTag size={24} /></div>
      <h4>Descriptive filenames</h4>
      <p>
        Use clear, descriptive names that reflect the document content
      </p>
    </div>
    <div className="tip-item">
      <div className="tip-icon"><FiFolder size={24} /></div>
      <h4>Organize by topic</h4>
      <p>Upload related documents together for better categorization</p>
    </div>
    <div className="tip-item">
      <div className="tip-icon"><FiRefreshCcw size={24} /></div>
      <h4>Regular updates</h4>
      <p>
        Keep your knowledge base fresh by uploading updated versions
      </p>

            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default UploadDocuments;
