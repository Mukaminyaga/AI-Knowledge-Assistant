import React, { useState } from "react";
import { FiX, FiEye, FiEyeOff, FiLock } from "react-icons/fi";
import axios from "axios";
import "../styles/ChangePasswordModal.css";

function ChangePasswordModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validatePassword = (password) => {
    const errors = [];
    
    if (password.length < 8) {
      errors.push("Must be at least 8 characters");
    }
    if (password.length > 128) {
      errors.push("Must be less than 128 characters");
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push("Must contain at least one lowercase letter");
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push("Must contain at least one uppercase letter");
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push("Must contain at least one number");
    }
    if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) {
      errors.push("Must contain at least one special character");
    }
    
    return errors;
  };

  const validateForm = () => {
    const newErrors = {};

    // Current password validation
    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    // New password validation
    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else {
      const passwordErrors = validatePassword(formData.newPassword);
      if (passwordErrors.length > 0) {
        newErrors.newPassword = passwordErrors[0]; // Show first error
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    // Check if new password is same as current
    if (formData.currentPassword && formData.newPassword && 
        formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = "New password must be different from current password";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/change-password`,
        {
          current_password: formData.currentPassword,
          new_password: formData.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccessMessage("Password changed successfully!");
      
      // Reset form
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setErrors({});
      
      // Close modal after success
      setTimeout(() => {
        onClose();
        setSuccessMessage("");
      }, 2000);
      
    } catch (error) {
      console.error("Password change error:", error);
      const detail = error.response?.data?.detail;
      
      if (detail?.includes("current password")) {
        setErrors({ currentPassword: "Current password is incorrect" });
      } else {
        setErrors({ general: detail || "Failed to change password. Please try again." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setErrors({});
    setSuccessMessage("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="change-password-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-section">
            <FiLock className="modal-icon" />
            <h2 className="modal-title">Change Password</h2>
          </div>
          <button className="modal-close-btn" onClick={handleClose}>
            <FiX size={20} />
          </button>
        </div>

        <div className="modal-content">
          <p className="modal-description">
            Enter your current password and choose a new secure password for your account.
          </p>

          <form onSubmit={handleSubmit} className="change-password-form">
            {errors.general && (
              <div className="error-message general-error">
                {errors.general}
              </div>
            )}

            {successMessage && (
              <div className="success-message">
                {successMessage}
              </div>
            )}

            {/* Current Password */}
            <div className="form-group">
              <label htmlFor="currentPassword" className="form-label">
                Current Password <span className="required">*</span>
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className={`form-input ${errors.currentPassword ? "error" : ""}`}
                  placeholder="Enter your current password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => togglePasswordVisibility("current")}
                  aria-label={showPasswords.current ? "Hide password" : "Show password"}
                >
                  {showPasswords.current ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              {errors.currentPassword && (
                <span className="error-text">{errors.currentPassword}</span>
              )}
            </div>

            {/* New Password */}
            <div className="form-group">
              <label htmlFor="newPassword" className="form-label">
                New Password <span className="required">*</span>
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className={`form-input ${errors.newPassword ? "error" : ""}`}
                  placeholder="Enter your new password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => togglePasswordVisibility("new")}
                  aria-label={showPasswords.new ? "Hide password" : "Show password"}
                >
                  {showPasswords.new ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              {errors.newPassword && (
                <span className="error-text">{errors.newPassword}</span>
              )}
              
        
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm New Password <span className="required">*</span>
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`form-input ${errors.confirmPassword ? "error" : ""}`}
                  placeholder="Confirm your new password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => togglePasswordVisibility("confirm")}
                  aria-label={showPasswords.confirm ? "Hide password" : "Show password"}
                >
                  {showPasswords.confirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="error-text">{errors.confirmPassword}</span>
              )}
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Changing..." : "Change Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChangePasswordModal;
