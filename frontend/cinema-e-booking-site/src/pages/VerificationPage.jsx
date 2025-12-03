import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import "../css/Login.css";

function VerificationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const prefillEmail = location.state?.email || "";

  const email = prefillEmail;
  const [verificationCode, setVerificationCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:8080/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailforVerification: email,
          verificationCode,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setMessage("Verification confirmed! You can now sign in.");
        setTimeout(() => navigate("/login"), 1200);
      } else {
        setMessage(data.message || "Verification failed. Please check the code and try again.");
      }
    } catch (err) {
      console.error("Error verifying account", err);
      setMessage("Error verifying account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-div">
        <h2>Email Verification</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          Enter the code sent to <strong>{email}</strong>
        </p>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Verification code"
            required
            autoComplete="one-time-code"
          />
          <button type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify"}
          </button>
          {message && <p className="info-message">{message}</p>}
        </form>
      </div>
    </>
  );
}

export default VerificationPage;
