import React, { useState } from "react";
import axios from "axios";
import { useLocation, Link } from "react-router-dom";
import "../styles/auth.css";
import { FiEye, FiEyeOff } from "react-icons/fi";

function ResetPassword() {
  const location = useLocation();
  const token = new URLSearchParams(location.search).get("token");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState({ text: "", type: "" }); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ text: "resetting...", type: "" });
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/reset/reset-password`, {
        token,
        new_password: newPassword,
      });
      setStatus({ text: "Password reset successfully! You can now log in.", type: "success" });
    } catch (error) {
      setStatus({
        text: error.response?.data?.detail || "Error resetting password.",
        type: "error",
      });
    }
  };
  
  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password..."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <span
              className="toggle-visibility"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>
          <button type="submit">Reset Password</button>
        </form>
        {status.text && <p className={status.type}>{status.text}</p>}

        {status.type === "success" && (
          <div className="back-to-login">
            <Link to="/login">Go to Login</Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
