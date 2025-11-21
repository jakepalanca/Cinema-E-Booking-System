import React, { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import "../css/ResetPassword.css";

function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    if (!token){
        return (
            <>
                <Navbar />
                <div className="reset-password-container">
                    <h2>Invalid Link</h2>
                    <p>The password link was either invalid or has expired.</p>
                    <p>Please <Link to="/forgot-password">try requesting a new password again!</Link></p>
                </div>
            </>
        );
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!password || !confirmPassword){
            setMessage("Please fill in all fields.");
            return;
        }

        setLoading(true);
        setMessage("");
        try {
            const res = await fetch("http://localhost:8080/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();
            if (res.ok) {
                setMessage("Password successfully reset. Redirecting to login...");
                setTimeout(() => navigate("/login"), 3000);
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
            <div className="reset-password-container">
                <h2>Reset Password</h2>
                <form onSubmit={handleSubmit} className="reset-password-form">
                    <label>
                        New Password:
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Confirm New Password:
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </label>
                    <button type="submit" disabled={loading}>
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>

            {message && <p className="info-message">{message}</p>}
            </div>
        </>
    );
}
export default ResetPassword;