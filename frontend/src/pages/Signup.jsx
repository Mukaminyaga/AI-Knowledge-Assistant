import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Signup.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    serialCode: "",
    jobTitle: "",
    teamSize: "",
    agreeToTerms: false,
  });

 


  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();


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
    switch (fieldName) {
      case "firstName":
      case "lastName":
        if (
          formData[fieldName].trim().length >= 2 &&
          /^[a-zA-Z\s-']+$/.test(formData[fieldName].trim())
        ) {
          return "success";
        }
        break;
      case "email":
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData[fieldName])) {
          return "success";
        }
        break;
      case "password":
        if (
          formData[fieldName].length >= 8 &&
          /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(
            formData[fieldName],
          )
        ) {
          return "success";
        }
        break;
      case "confirmPassword":
        if (formData[fieldName] && formData[fieldName] === formData.password) {
          return "success";
        }
        break;
    }

    return "";
  };

  const validateForm = () => {
    const newErrors = {};

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    } else if (formData.firstName.trim().length > 50) {
      newErrors.firstName = "First name is too long";
    } else if (!/^[a-zA-Z\s-']+$/.test(formData.firstName.trim())) {
      newErrors.firstName = "First name contains invalid characters";
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    } else if (formData.lastName.trim().length > 50) {
      newErrors.lastName = "Last name is too long";
    } else if (!/^[a-zA-Z\s-']+$/.test(formData.lastName.trim())) {
      newErrors.lastName = "Last name contains invalid characters";
    }

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
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (formData.password.length > 128) {
      newErrors.password = "Password is too long";
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one lowercase letter";
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter";
    } else if (!/(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain at least one number";
    } else if (
      !/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(formData.password)
    ) {
      newErrors.password =
        "Password must contain at least one special character";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    // Company name validation
// Serial Code validation
if (!formData.serialCode.trim()) {
  newErrors.serialCode = "Serial code is required";
} else if (formData.serialCode.trim().length !== 6) {
  newErrors.serialCode = "Serial code must be exactly 6 characters";
} else if (!/^[A-Za-z0-9]+$/.test(formData.serialCode.trim())) {
  newErrors.serialCode = "Serial code must be alphanumeric only";
}


    // Job title validation (optional field)
    if (formData.jobTitle.trim() && formData.jobTitle.trim().length > 100) {
      newErrors.jobTitle = "Job title is too long";
    }

    // Team size validation
    // if (!formData.teamSize) {
    //   newErrors.teamSize = "Please select your team size";
    // }

    // Terms agreement validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
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

  const payload = {
    first_name: formData.firstName,
    last_name: formData.lastName,
    email: formData.email,
    password: formData.password,
    role: formData.jobTitle || "User",
    serial_code: formData.serialCode, // correctly mapped
  };

  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/auth/register`,
      payload
    );

    console.log("Signup successful:", response.data);
    setSuccessMessage(
      "Signup successful! Redirecting to Home Page for login as you await approval..."
    );

    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      serialCode: "",        // ✅ reset it too
      jobTitle: "",
      teamSize: "",
      agreeToTerms: false,
    });
    setErrors({});

    // Redirect after delay
    setTimeout(() => {
      navigate("/");
    }, 3000);
  } catch (error) {
    console.error("Signup error:", error);
    const detail = error.response?.data?.detail;

    if (Array.isArray(detail)) {
      setErrors({
        general: detail.map((err) => err.msg).join(" "),
      });
    } else {
      setErrors({
        general: detail || "Signup failed. Please try again.",
      });
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
                <h1 className="auth-title">Create your account</h1>
                <p className="auth-subtitle">
                  Join thousands of teams already using AI to work smarter
                </p>
              </div>

              <form onSubmit={handleSubmit} className="auth-form">
                {errors.general && (
                  <div className="error-message general-error">
                    {errors.general}
                  </div>
                )}

                <div className="form-row">
                  
                  <div className="form-group">
                    <label htmlFor="firstName" className="form-label">
                      First name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`form-input ${getInputValidationClass("firstName")}`}
                      placeholder="Enter your first name"
                      autoComplete="given-name"
                    />
                    {errors.firstName && (
                      <span className="error-message">{errors.firstName}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName" className="form-label">
                      Last name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`form-input ${errors.lastName ? "error" : ""}`}
                      placeholder="Enter your last name"
                      autoComplete="family-name"
                    />
                    {errors.lastName && (
                      <span className="error-message">{errors.lastName}</span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Work email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`form-input ${errors.email ? "error" : ""}`}
                    placeholder="Enter your work email"
                    autoComplete="email"
                  />
                  {errors.email && (
                    <span className="error-message">{errors.email}</span>
                  )}
                </div>

               <div className="form-row">
  {/* Password Field */}
  <div className="form-group">
    <label htmlFor="password" className="form-label">Password</label>
    <div className="password-input-wrapper">
      <input
        type={showPassword ? "text" : "password"}
        id="password"
        name="password"
        value={formData.password}
        onChange={handleInputChange}
        className={`form-input password-input ${errors.password ? "error" : ""}`}
        placeholder="Create password"
        autoComplete="new-password"
      />
      <span
        className="password-toggle-btn"
        onClick={() => setShowPassword(!showPassword)}
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {/* Show icon for hiding password (i.e. eye open) */}
        {showPassword ? (
          // Eye Open (Hide)
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        ) : (
          // Eye Slash (Show)
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M3 3L21 21M9.9 4.24C10.5 4.07 11.2 4 12 4C19 4 23 12 23 12S22.393 13.1 21.413 14.169M16.5 12.5C16.8 11.8 17 11.2 17 10.5C17 8 15 6 12.5 6C11.8 6 11.2 6.2 10.5 6.5M6.5 6.5C4.5 8.5 2 12 2 12S6 20 13 20C14.5 20 15.8 19.6 17 18.9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
    </div>
    {errors.password && (
      <span className="error-message">{errors.password}</span>
    )}
  </div>

  {/* Confirm Password Field */}
  <div className="form-group">
    <label htmlFor="confirmPassword" className="form-label">Confirm password</label>
    <div className="password-input-wrapper">
      <input
        type={showConfirmPassword ? "text" : "password"}
        id="confirmPassword"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleInputChange}
        className={`form-input password-input ${errors.confirmPassword ? "error" : ""}`}
        placeholder="Confirm password"
        autoComplete="new-password"
      />
      <span
        className="password-toggle-btn"
        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
      >
        {showConfirmPassword ? (
          // Eye Open (Hide)
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        ) : (
          // Eye Slash (Show)
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M3 3L21 21M9.9 4.24C10.5 4.07 11.2 4 12 4C19 4 23 12 23 12S22.393 13.1 21.413 14.169M16.5 12.5C16.8 11.8 17 11.2 17 10.5C17 8 15 6 12.5 6C11.8 6 11.2 6.2 10.5 6.5M6.5 6.5C4.5 8.5 2 12 2 12S6 20 13 20C14.5 20 15.8 19.6 17 18.9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
    </div>
    {errors.confirmPassword && (
      <span className="error-message">{errors.confirmPassword}</span>
    )}
  </div>
</div>

<div className="form-group">
  <label htmlFor="serialCode" className="form-label">
    Serial Code
  </label>
  <input
    type="text"
    id="serialCode"
    name="serialCode"
    value={formData.serialCode}
    onChange={handleInputChange}
    className={`form-input ${errors.serialCode ? "error" : ""}`}
    placeholder="Enter 6-digit serial code"
    autoComplete="off"
  />
  {errors.serialCode && (
    <span className="error-message">{errors.serialCode}</span>
  )}
</div>


                <div className="form-group">
                  <label htmlFor="role" className="form-label">
                    Job Title(Role)
                  </label>
                  <input
                    type="text"
                    id="jobTitle"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    className={`form-input ${errors.jobTitle ? "error" : ""}`}
                    placeholder="e.g. Product Manager"
                    autoComplete="organization"
                  />
                  {errors.companyName && (
                    <span className="error-message">{errors.companyName}</span>
                  )}
                </div>
                 
                {/* <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="jobTitle" className="form-label">
                      Job title (optional)
                    </label>
                    <input
                      type="text"
                      id="jobTitle"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="e.g. Product Manager"
                      autoComplete="organization-title"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="teamSize" className="form-label">
                      Team size
                    </label>
                    <select
                      id="teamSize"
                      name="teamSize"
                      value={formData.teamSize}
                      onChange={handleInputChange}
                      className={`form-select ${errors.teamSize ? "error" : ""}`}
                    >
                      <option value="">Select team size</option>
                      <option value="1-10">1-10 people</option>
                      <option value="11-50">11-50 people</option>
                      <option value="51-200">51-200 people</option>
                      <option value="201-1000">201-1000 people</option>
                      <option value="1000+">1000+ people</option>
                    </select>
                    {errors.teamSize && (
                      <span className="error-message">{errors.teamSize}</span>
                    )}
                  </div>
                </div> */}

                <div className="form-group">
                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id="agreeToTerms"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      className={`form-checkbox ${errors.agreeToTerms ? "error" : ""}`}
                    />
                    <label htmlFor="agreeToTerms" className="checkbox-label">
                      I agree to the{" "}
                      <Link to="/terms" className="terms-link">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy" className="terms-link">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                  {errors.agreeToTerms && (
                    <span className="error-message">{errors.agreeToTerms}</span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`auth-submit-btn ${isSubmitting ? "loading" : ""}`}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading-spinner"></span>
                      Creating account...
                    </>
                  ) : (
                    "Create account"
                  )}
                </button>
              </form>
              {successMessage && (
                <p className="success-message">{successMessage}</p>
              )}

              <div className="auth-footer">
                <p className="auth-footer-text">
                  Already have an account?{" "}
                  <Link to="/login" className="auth-link">
                    Sign in
                  </Link>
                </p>
              </div>

              <div className="demo-section">
                <div className="demo-divider">
                  <span className="demo-divider-text">or</span>
                </div>
                <Link to="/contact" className="demo-link">
                  <div className="demo-button">
                    <span className="demo-icon">🚀</span>
                    Try a Demo First
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-visual">
          <div className="visual-content">
            <div className="success-metrics">
              <h3 className="metrics-title">Join successful teams</h3>
              <div className="metrics-grid1">
                <div className="metric-item">
                  <div className="metric-value1">5 hours</div>
                  <div className="metric-label1">saved per week</div>
                </div>
                <div className="metric-item">
                  <div className="metric-value1">80%</div>
                  <div className="metric-label1">fewer questions</div>
                </div>
                <div className="metric-item">
                  <div className="metric-value1">3x faster</div>
                  <div className="metric-label1">onboarding</div>
                </div>
              </div>
            </div>

            <div className="feature-list">
              <div className="feature-item">
                <div className="feature-check">✅</div>
                <div className="feature-text">Instant AI-powered answers</div>
              </div>
              <div className="feature-item">
                <div className="feature-check">✅</div>
                <div className="feature-text">Secure document processing</div>
              </div>
              <div className="feature-item">
                <div className="feature-check">✅</div>
                <div className="feature-text">Team collaboration tools</div>
              </div>
            </div>

            <div className="trust-indicators">
              <div className="trust-item">
                {/* <div className="trust-icon">🔒</div> */}
                <div className="trust-text">
                  <div className="trust-title">Enterprise Security</div>
                  <div className="trust-description">
                    SOC 2 Type II certified
                  </div>
                </div>
              </div>
              <div className="trust-item">
                {/* <div className="trust-icon">🌍</div> */}
                <div className="trust-text">
                  <div className="trust-title">Global Compliance</div>
                  <div className="trust-description">GDPR & CCPA compliant</div>
                </div>
              </div>
           
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
