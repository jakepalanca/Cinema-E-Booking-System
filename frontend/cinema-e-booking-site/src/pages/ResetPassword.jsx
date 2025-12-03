import React, { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import "../css/Login.css";

function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    if (!token) {
        return (
            <>
                <Navbar />
                <div className="login-div">
                    <h2>Invalid Link</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        The password link was either invalid or has expired.
                    </p>
                    <ul className="login-links">
                        <li><Link to="/forgot-password">Request a new reset link</Link></li>
                        <li><Link to="/login">Back to Sign In</Link></li>
                    </ul>
                </div>
            </>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!password || !confirmPassword) {
            setMessage("Please fill in all fields.");
            return;
        }
        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        setLoading(true);
        setMessage("");
        try {
            const res = await fetch("http://localhost:8080/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();
            if (res.ok) {
                setMessage("Password successfully reset. Redirecting to login...");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                setMessage(data.message || "Failed to reset password");
            }
        } catch (err) {
            console.error("Error resetting password:", err);
            setMessage("Error contacting the server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="login-div">
                <h2>Reset Password</h2>
                <form onSubmit={handleSubmit} className="login-form">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="New password"
                        required
                        autoComplete="new-password"
                    />
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        required
                        autoComplete="new-password"
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                    {message && <p className="info-message">{message}</p>}
                </form>
            </div>
        </>
    );
}

export default ResetPassword;