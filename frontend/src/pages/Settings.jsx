import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiBell,
  FiShield,
  FiSave,
  FiEdit3,
  FiArrowLeft,
} from "react-icons/fi";
import DashboardLayout from "../components/DashboardLayout";
import "../styles/Settings.css";

function Settings() {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@company.com",
    phone: "+1 (555) 123-4567",
    role: "Administrator",
    department: "IT",
  });

  const [editedInfo, setEditedInfo] = useState(userInfo);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedInfo(userInfo);
  };

  const handleSave = () => {
    setUserInfo(editedInfo);
    setIsEditing(false);
    // Here you would typically make an API call to save the changes
    console.log("Saving user info:", editedInfo);
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

  return (
    <DashboardLayout>
      <div className="settings-container">
        <div className="settings-header">
          <div className="header-top">
            <Link to="/dashboard" className="back-button">
              <FiArrowLeft size={20} />
              <span>Back to Dashboard</span>
            </Link>
          </div>
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
                </div>
                {!isEditing && (
                  <button className="edit-button" onClick={handleEdit}>
                    <FiEdit3 size={16} />
                    <span>Edit</span>
                  </button>
                )}
              </div>

              <div className="card-content">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-input"
                        value={editedInfo.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                      />
                    ) : (
                      <div className="form-display">{userInfo.firstName}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-input"
                        value={editedInfo.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                      />
                    ) : (
                      <div className="form-display">{userInfo.lastName}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
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

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        className="form-input"
                        value={editedInfo.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                      />
                    ) : (
                      <div className="form-display">{userInfo.phone}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Role</label>
                    <div className="form-display role-badge">
                      {userInfo.role}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <div className="form-display">{userInfo.department}</div>
                  </div>
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

            {/* Account Settings Card */}
            <div className="settings-card">
              <div className="card-header">
                <div className="card-title-section">
                  <FiShield className="card-icon" />
                  <h2 className="card-title">Account & Security</h2>
                </div>
              </div>

              <div className="card-content">
                <div className="settings-list">
                  <div className="setting-item">
                    <div className="setting-info">
                      <h3 className="setting-name">Password</h3>
                      <p className="setting-description">
                        Change your account password
                      </p>
                    </div>
                    <button className="setting-action">Change</button>
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

            {/* Notification Settings Card */}
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

            {/* AI Assistant Settings Card */}
            <div className="settings-card">
              <div className="card-header">
                <div className="card-title-section">
                  <span className="card-icon">🤖</span>
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
                    <select className="setting-select">
                      <option value="brief">Brief</option>
                      <option value="standard" selected>
                        Standard
                      </option>
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
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Settings;
