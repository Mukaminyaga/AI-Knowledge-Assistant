import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Login.css";
import axios from "axios";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const getInputValidationClass = (fieldName) => {
    if (!formData[fieldName]) return "";
    if (errors[fieldName]) return "error";

    // Show success state for valid inputs
    if (
      fieldName === "email" &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData[fieldName])
    ) {
      return "success";
    }
    if (fieldName === "password" && formData[fieldName].length >= 6) {
      return "success";
    }

    return "";
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    } else if (formData.email.length > 254) {
      newErrors.email = "Email is too long";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (formData.password.length > 128) {
      newErrors.password = "Password is too long";
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
    const response = await axios.post("http://127.0.0.1:8000/auth/login", {
      email: formData.email,
      password: formData.password,
    });

    const { access_token, token_type } = response.data;

    // ✅ Save the token in localStorage
    localStorage.setItem("token", access_token);

    // ✅ Redirect to another page, like dashboard
    window.location.href = "/dashboard"; // or use useNavigate()

  } catch (error) {
    console.error("Login error:", error);

    if (error.response && error.response.status === 401) {
      setErrors({ general: "Invalid credentials. Please try again." });
    } else if (error.response && error.response.status === 422) {
      setErrors({ general: "Validation error. Please check your input." });
    } else {
      setErrors({ general: "Login failed. Please try again later." });
    }
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-content">
          <div className="auth-header">
            <Link to="/" className="brand-link">
              <div className="brand-title">
                AI Knowledge <br />
                Assistant
              </div>
            </Link>
          </div>

          <div className="auth-main">
            <div className="auth-card">
              <div className="auth-card-header">
                <h1 className="auth-title">Welcome back</h1>
                <p className="auth-subtitle">
                  Sign in to your account to continue your AI-powered knowledge
                  journey
                </p>
              </div>

              <form onSubmit={handleSubmit} className="auth-form">
                {errors.general && (
                  <div className="error-message general-error">
                    {errors.general}
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`form-input ${getInputValidationClass("email")}`}
                    placeholder="Enter your email"
                    autoComplete="email"
                  />
                  {errors.email && (
                    <span className="error-message">{errors.email}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`form-input password-input ${getInputValidationClass("password")}`}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3 3L21 21M9.9 4.24C10.5 4.07 11.2 4 12 4C19 4 23 12 23 12S22.393 13.1 21.413 14.169M16.5 12.5C16.8 11.8 17 11.2 17 10.5C17 8 15 6 12.5 6C11.8 6 11.2 6.2 10.5 6.5M6.5 6.5C4.5 8.5 2 12 2 12S6 20 13 20C14.5 20 15.8 19.6 17 18.9"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <circle
                            cx="12"
                            cy="12"
                            r="3"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <span className="error-message">{errors.password}</span>
                  )}
                </div>

                <div className="form-options">
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="form-checkbox"
                    />
                    <label htmlFor="rememberMe" className="checkbox-label">
                      Remember me
                    </label>
                  </div>
                  <Link to="/forgot-password" className="forgot-link">
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`auth-submit-btn ${isSubmitting ? "loading" : ""}`}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading-spinner"></span>
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </form>

              <div className="auth-footer">
                <p className="auth-footer-text">
                  Don't have an account?{" "}
                  <Link to="/signup" className="auth-link">
                    Sign up
                  </Link>
                </p>
              </div>

              <div className="demo-section">
                <div className="demo-divider">
                  <span className="demo-divider-text">or</span>
                </div>
                <Link to="/" className="demo-link">
                  <div className="demo-button">
                    <span className="demo-icon">🚀</span>
                    Try a Demo Instead
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-visual">
          <div className="visual-content">
            <div className="feature-highlight">
              <div className="feature-icon">🤖</div>
              <h3 className="feature-title">AI-Powered Knowledge</h3>
              <p className="feature-description">
                Get instant answers from your organization's knowledge base with
                our intelligent AI assistant.
              </p>
            </div>

            <div className="stats-preview">
              <div className="stat-item">
                <div className="stat-number">95%</div>
                <div className="stat-label">Accuracy Rate</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">2.5s</div>
                <div className="stat-label">Avg Response</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">10k+</div>
                <div className="stat-label">Happy Users</div>
              </div>
            </div>

            {/* <div className="testimonial">
              <blockquote className="testimonial-text">
                "This AI assistant has transformed how our team finds
                information. We save hours every week!"
              </blockquote>
              <div className="testimonial-author">
                <div className="author-info">
                  <div className="author-name">Sarah Chen</div>
                  <div className="author-role">
                    Head of Operations, TechCorp
                  </div> */}
                {/* </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
