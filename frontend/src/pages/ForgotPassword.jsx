import React, { useState } from "react";
import axios from "axios";
import "../styles/auth.css"; // Import the styles

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ text: "", type: "" }); // {text, type}

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ text: "sending...", type: "" });
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/reset/forgot-password`, {
        email,
      });
      setStatus({ text: "Check your email for a reset link!", type: "success" });
    } catch (error) {
      setStatus({ text: error.response?.data?.detail || "Error sending reset link.", type: "error" });
    }
  };
  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Send Reset Link</button>
        </form>
        {status.text && <p className={status.type}>{status.text}</p>}
      </div>
    </div>
  );
}
export default ForgotPassword;