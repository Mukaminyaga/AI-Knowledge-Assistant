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
} from "react-icons/fi";
import DashboardLayout from "../components/DashboardLayout";

import "../styles/Settings.css";

function Settings() {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [editedInfo, setEditedInfo] = useState({});
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

  if (!userInfo) return <div>Loading...</div>;

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
                    <label className="form-label">Last Name</label>
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
                    <label className="form-label">Role</label>
                    <div className="form-display role-badge">
                      {userInfo.role}
                    </div>
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
                  <div className="setting-item">
  <div className="setting-info">
    <h3 className="setting-name">Password</h3>
    <p className="setting-description">
      Change your account password
    </p>
  </div>
  <Link to="/forgot" className="setting-action">
    Change
  </Link>
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

          </div>
        </div>
        </div>
    </DashboardLayout>
  );
}

export default Settings;
