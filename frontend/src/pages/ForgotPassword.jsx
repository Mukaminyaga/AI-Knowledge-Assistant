import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FiMail, FiArrowLeft, FiCheck, FiAlertCircle } from "react-icons/fi";
import "../styles/auth.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ text: "", type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ text: "", type: "" });

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/reset/forgot-password`, {
        email,
      });
      setStatus({
        text: "Check your email for a reset link! We've sent instructions to reset your password.",
        type: "success"
      });

       setTimeout(() => {
        navigate("/login", { replace: true });
      }, 3500);

    } catch (error) {
      setStatus({
        text: error.response?.data?.detail || "Error sending reset link. Please try again.",
        type: "error"
      });
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
                  <FiMail className="auth-icon" size={32} />
                </div>
                <h1 className="auth-title">Forgot Password?</h1>
                <p className="auth-subtitle">
                  No worries! Enter your email address and we'll send you a link to reset your password.
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
                      {status.type === "success" && (
                        <p className="status-note">
                          Didn't receive an email? Check your spam folder or try again.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <div className="input-wrapper">
                    {/* <FiMail className="input-icon" /> */}
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-input with-icon"
                      placeholder="Enter your email address"
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !email.trim()}
                  className={`auth-submit-btn modern-btn ${isSubmitting ? "loading" : ""}`}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading-spinner"></span>
                      Sending Link...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>

              <div className="auth-footer">
                <p className="auth-footer-text">
                  Remember your password?{" "}
                  <Link to="/login" className="auth-link">
                    Sign in
                  </Link>
                </p>
              </div>

              <div className="help-section">
                <h3 className="help-title">Need more help?</h3>
                <div className="help-content">
                  <div className="help-item">
                    <strong>Can't access your email?</strong>
                    <p>Contact your system administrator or our support team for assistance.</p>
                  </div>
                  <div className="help-item">
                    <strong>Security concerns?</strong>
                    <p>If you suspect unauthorized access, change your password immediately after resetting.</p>
                  </div>
                </div>
                <Link to="/contact" className="help-link">
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-visual">
          <div className="visual-content">
            <div className="security-info">
              <h3 className="security-title">Secure Password Reset</h3>
              <div className="security-features">
                <div className="security-feature">
                  {/* <div className="feature-icon">🔒</div> */}
                  <div className="feature-text">
                    <h4>Encrypted Communication</h4>
                    <p>All reset links are sent securely and expire after 24 hours</p>
                  </div>
                </div>
                <div className="security-feature">
                  {/* <div className="feature-icon">⏱️</div> */}
                  <div className="feature-text">
                    <h4>Time-Limited Access</h4>
                    <p>Reset links expire quickly to maintain account security</p>
                  </div>
                </div>
                <div className="security-feature">
                  {/* <div className="feature-icon">🛡️</div> */}
                  <div className="feature-text">
                    <h4>Account Protection</h4>
                    <p>We verify your identity before allowing password changes</p>
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

export default ForgotPassword;
