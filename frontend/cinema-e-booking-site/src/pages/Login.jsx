import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import "../css/Login.css";
import Navbar from './Navbar.jsx';
import authService from '../services/authService.js';
import { useAuth } from '../contexts/AuthContext.jsx';

function Login() {
    const NOT_VERIFIED_MSG = "Account not verified. Please verify your email.";
    const [credentials, setCredentials] = useState({
        emailOrUsername: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await fetch("http://localhost:8080/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify({
                    emailOrUsername: credentials.emailOrUsername,
                    password: credentials.password,
                }),
            });

            if (res.ok) {
                const data = await res.json();

                const userData = {
                    email: data.email,
                    id: data.id,
                    role: data.role,
                    username: data.username,
                    firstName: data.firstName,
                    lastName: data.lastName,
                };
                
                authService.setAuth(userData);
                login(userData);

                localStorage.setItem(
                    "cinemaAuth",
                    JSON.stringify({ email: data.email })
                );
                localStorage.setItem("cinemaUser", JSON.stringify(userData));

                setMessage("Login successful");
                
                if (data.role === 'admin') {
                    navigate("/admin-homepage");
                } else {
                    navigate("/");
                }
            } else {
                const err = await res.json();
                setMessage(err.message || "Invalid email or password");
            }
        } catch (error) {
            console.error(error);
            setMessage("Error connecting to the server.");
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async() => {
        const { emailOrUsername } = credentials;
        if(!emailOrUsername){
            setMessage("Please enter your email first.");
            return;
        }
        try {
            const res = await fetch("http://localhost:8080/forgot-password", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ emailOrUsername }),
            });
            const data = await res.json();
            if (res.ok){
                setMessage(data.message || "Password reset link sent to your email.");
            } else {
                setMessage(data.message || "Unable to send password reset link.");
            }
        } catch (err) {
            console.error("Error sending forgot password request:", err);
            setMessage("Error contacting the server.");
        }
    };

    return (
        <>
            <Navbar />
            <div className="login-div">
                <h2>Sign In</h2>
                <form onSubmit={handleSubmit} className="login-form">
                    <input
                        type="text"
                        name="emailOrUsername"
                        value={credentials.emailOrUsername}
                        onChange={handleChange}
                        placeholder="Email or username"
                        required
                        autoComplete="username"
                    />
                    <input
                        type="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        placeholder="Password"
                        required
                        autoComplete="current-password"
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                    {message && (
                        <p className="info-message">
                            {message === NOT_VERIFIED_MSG ? (
                                <>
                                    Account not verified.{" "}
                                    <Link
                                        to="/verify"
                                        state={{ email: credentials.emailOrUsername }}
                                        className="verify-link"
                                    >
                                        Verify your email
                                    </Link>
                                </>
                            ) : (
                                message
                            )}
                        </p>
                    )}
                </form>
                <ul className="login-links">
                    <li><Link to="/forgot-password">Forgot password?</Link></li>
                    <li><Link to="/register">Sign Up</Link></li>
                    <li><Link to="/admin-login">Admin Sign In</Link></li>
                </ul>
            </div>
        </>
    );
}

export default Login;
