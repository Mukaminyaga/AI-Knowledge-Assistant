import React, { useState } from "react";
import { FiPlus, FiEdit3, FiTrash2, FiFolderPlus, FiUsers, FiFolder } from "react-icons/fi";
import { useDepartments } from "../context/DepartmentContext";
import DepartmentForm from "./DepartmentForm";
import "../styles/Settings.css";

const DepartmentsSection = () => {
  const { departments, loading, createDepartment, updateDepartment, deleteDepartment } = useDepartments();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);

  const handleCreateDepartment = async (departmentData) => {
    await createDepartment(departmentData);
    setIsFormOpen(false);
  };

  const handleUpdateDepartment = async (departmentData) => {
    await updateDepartment(editingDepartment.id, departmentData);
    setEditingDepartment(null);
    setIsFormOpen(false);
  };

  const handleEditClick = (department) => {
    setEditingDepartment(department);
    setIsFormOpen(true);
  };

  const handleDeleteClick = async (department) => {
    if (window.confirm(`Are you sure you want to delete the "${department.name}" department? This action cannot be undone.`)) {
      await deleteDepartment(department.id);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingDepartment(null);
  };

  return (
    <div className="settings-card">
      <div className="card-header">
        <div className="card-title-section">
          <FiFolderPlus className="card-icon" />
          <h2 className="card-title">Departments</h2>
        </div>
        <button 
          className="edit-button" 
          onClick={() => setIsFormOpen(true)}
          disabled={loading}
        >
          <FiPlus size={16} />
          <span>Add Department</span>
        </button>
      </div>

      <div className="card-content">
        {loading ? (
          <div className="departments-loading">
            <p>Loading departments...</p>
          </div>
        ) : departments.length === 0 ? (
          <div className="departments-empty">
            <div className="empty-state">
              <FiFolderPlus className="empty-icon" />
              <h3>No departments yet</h3>
              <p>Create your first department to start organizing documents by category.</p>
              <button 
                className="save-button"
                onClick={() => setIsFormOpen(true)}
              >
                <FiPlus size={16} />
                <span>Create Department</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="departments-grid">
            {departments.map(department => (
              <div key={department.id} className="department-card">
                <div className="department-header">
                  <div className="department-color" style={{ backgroundColor: department.color }} />
                  <div className="department-info">
                    <h3 className="department-name">{department.name}</h3>
                    <p className="department-description">{department.description}</p>
                  </div>
                  <div className="department-actions">
                    <button
                      className="action-btn edit-btn"
                      onClick={() => handleEditClick(department)}
                      title="Edit department"
                    >
                      <FiEdit3 size={14} />
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDeleteClick(department)}
                      title="Delete department"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
                
                <div className="department-stats">
                  <div className="stat-item">
                    <FiFolder className="stat-icon" />
                    <span className="stat-text">
                      {department.document_count || 0} documents
                    </span>
                  </div>
          
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="departments-info">
          <h4 className="info-title">About Departments</h4>
          <ul className="info-list">
            <li>Organize documents by department for better categorization</li>
            <li>Each department can have its own color for easy identification</li>
            <li>Use departments to control document access and visibility</li>
            <li>Documents uploaded with a department will be filtered accordingly in the knowledge base</li>
          </ul>
        </div>
      </div>

      <DepartmentForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={editingDepartment ? handleUpdateDepartment : handleCreateDepartment}
        initialData={editingDepartment}
      />
    </div>
  );
};

export default DepartmentsSection;
