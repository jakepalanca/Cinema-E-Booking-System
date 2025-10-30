import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ForgotPassword.css"
import Navbar from "./Navbar.jsx";

function ForgotPassword() {
    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!emailOrUsername.trim()) {
            setMessage("Please enter your email");
            return;
        }
        setLoading(true);
        setMessage("");
        try {
            const res = await fetch("http://localhost:8080/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({ emailOrUsername }),
            });
            const data = await res.json();
            if (res.ok) {
                setMessage(data.message || "Password reset link sent to your email!");
            } else {
                setMessage(data.message || "Unable to send password reset link.");
            }
        } catch (err) {
            console.error("Error sending forgot password request:", err);
            setMessage("Error contacting the server.");
        } finally {
            setLoading(false);
        }
    };
    return(
        <>
            <Navbar />
            <div className="forgot-password-container">
                <h2>Forgot Password</h2>
                <form onSubmit={handleSubmit} className="forgot-password-form">
                    <label>
                        Enter your email:
                        <input
                            type="text"
                            value={emailOrUsername}
                            onChange={(e) => setEmailOrUsername(e.target.value)}
                            required
                        />
                    </label>
                    <button type="submit" disabled={loading}>
                        {loading ? "Sending..." : "Submit"}
                    </button>
                </form>

                {message && <p className="info-message">{message}</p>}
            </div>
        </>
    )
};

export default ForgotPassword;