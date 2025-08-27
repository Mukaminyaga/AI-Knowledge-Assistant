import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiBell,
  FiShield,
  FiSave,
  FiEdit3,
  FiMessageCircle,
  FiArrowLeft,
  FiMoon,
  FiEye,
  FiEyeOff,
  FiLock,
} from "react-icons/fi";
import DashboardLayout from "../components/DashboardLayout";
import ThemeToggle from "../components/ThemeToggle";

import "../styles/Settings.css";

function Settings() {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [editedInfo, setEditedInfo] = useState({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUserInfo(res.data);
        setEditedInfo(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch profile:", err);
        if (err.response?.status === 401) navigate("/login");
      });
  }, [navigate, token]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    axios
      .put(`${process.env.REACT_APP_API_URL}/user/profile`, editedInfo, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUserInfo(res.data);
        setIsEditing(false);
      })
      .catch((err) => console.error("Failed to update profile:", err));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedInfo(userInfo);
  };

  const handleInputChange = (field, value) => {
    setEditedInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Password change handlers
  const handlePasswordEdit = () => {
    setIsChangingPassword(true);
  };

  const handlePasswordCancel = () => {
    setIsChangingPassword(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    setPasswordErrors({});
    setPasswordSuccess("");
  };

  const handlePasswordInputChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (passwordErrors[field]) {
      setPasswordErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
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

  const handlePasswordSave = async () => {
    const newErrors = {};

    // Current password validation
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    // New password validation
    if (!passwordData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else {
      const passwordValidationErrors = validatePassword(passwordData.newPassword);
      if (passwordValidationErrors.length > 0) {
        newErrors.newPassword = passwordValidationErrors[0];
      }
    }

    // Confirm password validation
    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    // Check if new password is same as current
    if (passwordData.currentPassword && passwordData.newPassword &&
        passwordData.currentPassword === passwordData.newPassword) {
      newErrors.newPassword = "New password must be different from current password";
    }

    if (Object.keys(newErrors).length > 0) {
      setPasswordErrors(newErrors);
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/change-password`,
        {
          current_password: passwordData.currentPassword,
          new_password: passwordData.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPasswordSuccess("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setPasswordErrors({});

      // Reset editing state after success
      setTimeout(() => {
        setIsChangingPassword(false);
        setPasswordSuccess("");
      }, 2000);

    } catch (error) {
      console.error("Password change error:", error);
      const detail = error.response?.data?.detail;

      if (detail?.includes("current password")) {
        setPasswordErrors({ currentPassword: "Current password is incorrect" });
      } else {
        setPasswordErrors({ general: detail || "Failed to change password. Please try again." });
      }
    }
  };

  if (!userInfo) return <div>Loading...</div>;

  return (
    <DashboardLayout>
        <div className="settings-container">
          <div className="settings-header">
            {/* <div className="header-top">
              <Link to="/dashboard" className="back-button">
                <FiArrowLeft size={20} />
                <span>Back to Dashboard</span>
              </Link>
            </div> */}
            <h1 className="settings-title">Settings</h1>
            <p className="settings-subtitle">
              Manage your account and preferences
            </p>
          </div>

          <div className="settings-content">
            <div className="settings-grid">
            {/* Profile Information Card */}
            <div className="settings-card profile-card">
              <div className="card-header">
                <div className="card-title-section">
                  <FiUser className="card-icon" />
                  <h2 className="card-title">Profile Information</h2>
                   <div className="form-group">
                    {/* <label className="form-label">Role</label> */}

                  </div>
                   <div className="form-display role-badge">
                      {userInfo.role}
                    </div>
                </div>

              </div>

              <div className="card-content">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label1">First Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-input"
                        value={editedInfo.first_name}
                        onChange={(e) =>
                          handleInputChange("first_name", e.target.value)
                        }
                      />
                    ) : (
                      <div className="form-display">{userInfo.first_name}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label1">Last Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-input"
                        value={editedInfo.last_name}
                        onChange={(e) =>
                          handleInputChange("last_name", e.target.value)
                        }
                      />
                    ) : (
                      <div className="form-display">{userInfo.last_name}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label1">Email Address</label>
                    {isEditing ? (
                      <input
                        type="email"
                        className="form-input"
                        value={editedInfo.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                      />
                    ) : (
                      <div className="form-display">{userInfo.email}</div>
                    )}
                  </div>
                    {!isEditing && (
                  <button className="edit-button" onClick={handleEdit}>
                    <FiEdit3 size={16} />
                    <span>Edit Profile</span>
                  </button>
                )}

                </div>

                {isEditing && (
                  <div className="form-actions">
                    <button className="save-button" onClick={handleSave}>
                      <FiSave size={16} />
                      <span>Save Changes</span>
                    </button>
                    <button className="cancel-button" onClick={handleCancel}>
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="settings-card">
              <div className="card-header">
             <div className="card-title-section">
                  <FiMessageCircle className="card-icon" />
                  <h2 className="card-title">AI Assistant</h2>
                </div>

              </div>

              <div className="card-content">
                <div className="settings-list">
                  <div className="setting-item">
                    <div className="setting-info">
                      <h3 className="setting-name">Response Detail Level</h3>
                      <p className="setting-description">
                        Choose how detailed AI responses should be
                      </p>
                    </div>
                    <select className="setting-select" defaultValue="standard">
                      <option value="brief">Brief</option>
                      <option value="standard">Standard</option>
                      <option value="detailed">Detailed</option>
                    </select>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <h3 className="setting-name">Auto-suggestions</h3>
                      <p className="setting-description">
                        Show suggested questions while typing
                      </p>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <h3 className="setting-name">Source Citations</h3>
                      <p className="setting-description">
                        Always show document sources in responses
                      </p>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="settings-card">
              <div className="card-header">
                <div className="card-title-section">
                  <FiBell className="card-icon" />
                  <h2 className="card-title">Notifications</h2>
                </div>
              </div>

              <div className="card-content">
                <div className="settings-list">
                  <div className="setting-item">
                    <div className="setting-info">
                      <h3 className="setting-name">Email Notifications</h3>
                      <p className="setting-description">
                        Receive updates via email
                      </p>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <h3 className="setting-name">Push Notifications</h3>
                      <p className="setting-description">
                        Get notifications in your browser
                      </p>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <h3 className="setting-name">Weekly Summary</h3>
                      <p className="setting-description">
                        Receive weekly activity summaries
                      </p>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Account & Notification Settings */}
            <div className="settings-card">
              <div className="card-header">
                <div className="card-title-section">
                  <FiShield className="card-icon" />
                  <h2 className="card-title">Account & Security</h2>
                </div>
              </div>

              <div className="card-content">
                <div className="settings-list">
                  <div className="setting-item password-setting">
                    <div className="setting-info">
                      <h3 className="setting-name">Password</h3>
                      <p className="setting-description">
                        Change your account password
                      </p>
                    </div>
                    {!isChangingPassword ? (
                      <button
                        className="setting-action4"
                        onClick={handlePasswordEdit}
                      >
                        <FiEdit3 size={16} />
                        Change
                      </button>
                    ) : (
                      <div className="password-change-form">
                        {passwordErrors.general && (
                          <div className="error-message general-error">
                            {passwordErrors.general}
                          </div>
                        )}
                        {passwordSuccess && (
                          <div className="success-message">
                            {passwordSuccess}
                          </div>
                        )}

                        <div className="password-form-grid">
                          {/* Current Password */}
                          <div className="form-group">
                            <label className="form-label1">Current Password</label>
                            <div className="password-input-wrapper">
                              <input
                                type={showPasswords.current ? "text" : "password"}
                                className={`form-input ${passwordErrors.currentPassword ? "error" : ""}`}
                                value={passwordData.currentPassword}
                                onChange={(e) => handlePasswordInputChange("currentPassword", e.target.value)}
                                placeholder="Enter current password"
                              />
                              <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => togglePasswordVisibility("current")}
                              >
                                {showPasswords.current ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                              </button>
                            </div>
                            {passwordErrors.currentPassword && (
                              <span className="error-text">{passwordErrors.currentPassword}</span>
                            )}
                          </div>

                          {/* New Password */}
                          <div className="form-group">
                            <label className="form-label1">New Password</label>
                            <div className="password-input-wrapper">
                              <input
                                type={showPasswords.new ? "text" : "password"}
                                className={`form-input ${passwordErrors.newPassword ? "error" : ""}`}
                                value={passwordData.newPassword}
                                onChange={(e) => handlePasswordInputChange("newPassword", e.target.value)}
                                placeholder="Enter new password"
                              />
                              <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => togglePasswordVisibility("new")}
                              >
                                {showPasswords.new ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                              </button>
                            </div>
                            {passwordErrors.newPassword && (
                              <span className="error-text">{passwordErrors.newPassword}</span>
                            )}
                          </div>

                          {/* Confirm Password */}
                          <div className="form-group">
                            <label className="form-label1">Confirm New Password</label>
                            <div className="password-input-wrapper">
                              <input
                                type={showPasswords.confirm ? "text" : "password"}
                                className={`form-input ${passwordErrors.confirmPassword ? "error" : ""}`}
                                value={passwordData.confirmPassword}
                                onChange={(e) => handlePasswordInputChange("confirmPassword", e.target.value)}
                                placeholder="Confirm new password"
                              />
                              <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => togglePasswordVisibility("confirm")}
                              >
                                {showPasswords.confirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                              </button>
                            </div>
                            {passwordErrors.confirmPassword && (
                              <span className="error-text">{passwordErrors.confirmPassword}</span>
                            )}
                          </div>
                        </div>

                        <div className="form-actions">
                          <button className="save-button" onClick={handlePasswordSave}>
                            <FiSave size={16} />
                            <span>Save Password</span>
                          </button>
                          <button className="cancel-button" onClick={handlePasswordCancel}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>


                  <div className="setting-item">
                    <div className="setting-info">
                      <h3 className="setting-name">
                        Two-Factor Authentication
                      </h3>
                      <p className="setting-description">
                        Add an extra layer of security
                      </p>
                    </div>
                    <button className="setting-action">Enable</button>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <h3 className="setting-name">Login Sessions</h3>
                      <p className="setting-description">
                        Manage your active sessions
                      </p>
                    </div>
                    <button className="setting-action">View</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Theme Settings Card */}
            <div className="settings-card">
              <div className="card-header">
                <div className="card-title-section">
                  <FiMoon className="card-icon" />
                  <h2 className="card-title">Appearance</h2>
                </div>
              </div>

              <div className="card-content">
                <div className="settings-list">
                  <div className="setting-item">
                    <div className="setting-info">
                      <h3 className="setting-name">Theme</h3>
                      <p className="setting-description">
                        Choose between light and dark mode
                      </p>
                    </div>
                    <ThemeToggle className="settings-theme-toggle" showLabel={true} />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
        </div>

    </DashboardLayout>
  );
}

export default Settings;
