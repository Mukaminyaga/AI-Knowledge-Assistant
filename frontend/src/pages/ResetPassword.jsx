import React, { useState } from "react";
import axios from "axios";
import { useLocation, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiLock, FiCheck, FiAlertCircle, FiArrowLeft } from "react-icons/fi";
import "../styles/auth.css";

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = new URLSearchParams(location.search).get("token");
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false,
  });
  const [status, setStatus] = useState({ text: "", type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validatePassword = (password) => {
    const errors = [];

    if (password.length < 8) {
      errors.push("Must be at least 8 characters");
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    // Validate new password
    if (!formData.newPassword) {
      newErrors.newPassword = "Password is required";
    } else {
      const passwordErrors = validatePassword(formData.newPassword);
      if (passwordErrors.length > 0) {
        newErrors.newPassword = passwordErrors[0];
      }
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setStatus({ text: "", type: "" });

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/reset/reset-password`, {
        token,
        new_password: formData.newPassword,
      });
      setStatus({
        text: "Password reset successfully! You can now log in with your new password.",
        type: "success"
      });

         setTimeout(() => {
        navigate("/login", { replace: true });
      }, 3500);

    } catch (error) {
      const detail = error.response?.data?.detail || "Error resetting password.";
      if (detail.includes("token")) {
        setStatus({
          text: "This reset link has expired or is invalid. Please request a new password reset.",
          type: "error",
        });
      } else {
        setStatus({
          text: detail,
          type: "error",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page modern-auth">
      <div className="auth-container">
        <div className="auth-content">
          <div className="auth-header">
            <Link to="/login" className="back-navigation">
              <FiArrowLeft size={20} />
              <span>Back to Login</span>
            </Link>
          </div>

          <div className="auth-main">
            <div className="auth-card modern-card">
              <div className="auth-card-header">
                <div className="auth-icon-wrapper">
                  <FiLock className="auth-icon" size={32} />
                </div>
                <h1 className="auth-title">Reset Your Password</h1>
                <p className="auth-subtitle">
                  Choose a strong password that you haven't used before for better security.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="auth-form modern-form">
                {status.text && (
                  <div className={`status-message ${status.type}`}>
                    <div className="status-icon">
                      {status.type === "success" ? (
                        <FiCheck size={20} />
                      ) : (
                        <FiAlertCircle size={20} />
                      )}
                    </div>
                    <div className="status-content">
                      <p>{status.text}</p>
                      {status.type === "error" && status.text.includes("expired") && (
                        <Link to="/forgot" className="status-action">
                          Request New Reset Link
                        </Link>
                      )}
                    </div>
                  </div>
                )}

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
                      required
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

                  {/* Password Requirements */}
                  {/* <div className="password-requirements">
                    <p className="requirements-title">Password must contain:</p>
                    <ul className="requirements-list">
                      <li className={formData.newPassword.length >= 8 ? "valid" : ""}>
                        At least 8 characters
                      </li>
                      <li className={/(?=.*[a-z])/.test(formData.newPassword) ? "valid" : ""}>
                        One lowercase letter
                      </li>
                      <li className={/(?=.*[A-Z])/.test(formData.newPassword) ? "valid" : ""}>
                        One uppercase letter
                      </li>
                      <li className={/(?=.*\d)/.test(formData.newPassword) ? "valid" : ""}>
                        One number
                      </li>
                      <li className={/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(formData.newPassword) ? "valid" : ""}>
                        One special character
                      </li>
                    </ul>
                  </div> */}
                </div>

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
                      required
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

                <button
                  type="submit"
                  disabled={isSubmitting || !formData.newPassword || !formData.confirmPassword}
                  className={`auth-submit-btn modern-btn ${isSubmitting ? "loading" : ""}`}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading-spinner"></span>
                      Resetting Password...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>

              {status.type === "success" && (
                <div className="success-actions">
                  <Link to="/login" className="success-link">
                    Continue to Login
                  </Link>
                </div>
              )}

              <div className="auth-footer">
                <p className="auth-footer-text">
                  Remember your password?{" "}
                  <Link to="/login" className="auth-link">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-visual">
          <div className="visual-content">
            <div className="security-tips">
              <h3 className="tips-title">Password Security Tips</h3>
              <div className="tips-list">
                <div className="tip-item">
                  {/* <div className="tip-icon">💡</div> */}
                  <div className="tip-text">
                    <h4>Use a unique password</h4>
                    <p>Don't reuse passwords from other accounts</p>
                  </div>
                </div>
                <div className="tip-item">
                  {/* <div className="tip-icon">🔐</div> */}
                  <div className="tip-text">
                    <h4>Make it complex</h4>
                    <p>Mix uppercase, lowercase, numbers, and symbols</p>
                  </div>
                </div>
                <div className="tip-item">
                  {/* <div className="tip-icon">📱</div> */}
                  <div className="tip-text">
                    <h4>Consider a password manager</h4>
                    <p>Store and generate secure passwords easily</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
