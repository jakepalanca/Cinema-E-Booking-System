import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import Navbar from './Navbar.jsx';
import authService from './services/authService';
import { useAuth } from './contexts/AuthContext';

function Login() {
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
            // Send correct JSON format expected by backend
            const res = await fetch("http://localhost:8080/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    emailOrUsername: credentials.emailOrUsername,
                    password: credentials.password,
                }),
            });

            if (res.ok) {
                const data = await res.json();

                // Store JWT token and user data
                if (data.token) {
                    const userData = {
                        email: data.email,
                        id: data.id,
                        role: data.role,
                        username: data.username,
                        firstName: data.firstName,
                        lastName: data.lastName,
                    };
                    
                    authService.setAuth(data.token, userData);
                    login(data.token, userData);

                    // Also store for backward compatibility with existing code
                    localStorage.setItem(
                        "cinemaAuth",
                        JSON.stringify({ email: data.email })
                    );
                    localStorage.setItem("cinemaUser", JSON.stringify(userData));

                    setMessage("Login successful");
                    
                    // Redirect based on role
                    if (data.role === 'admin') {
                        navigate("/admin-homepage");
                    } else {
                        navigate("/");
                    }
                } else {
                    setMessage("Login failed: No token received");
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
        const {emailOrUsername } = credentials;
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
                    <label>
                        Email or Username:
                        <input
                            type="text"
                            name="emailOrUsername"
                            value={credentials.emailOrUsername}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Password:
                        <input
                            type="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <button type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                    {message && <p className="info-message">{message}</p>}
                </form>
                <p className="forgotPass-redirect">
                    Forgot your password? <Link to="/forgot-password">Click Here</Link>
                </p>
                <p className="signup-redirect">
                    Don't have an account? <Link to="/register">Sign Up</Link>
                </p>
                <hr/>
                <p className="admin-redirect">
                    <Link to="/admin-login">Admin Sign In</Link>
                </p>
            </div>
        </>
    );
}

export default Login;
