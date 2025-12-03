import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../css/Login.css";
import Navbar from "./Navbar.jsx";
import authService from '../services/authService.js';
import { useAuth } from '../contexts/AuthContext.jsx';

function AdminLogin() {
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
                headers: {"Content-Type": "application/json"},
                credentials: 'include',
                body: JSON.stringify({
                    emailOrUsername: credentials.emailOrUsername,
                    password: credentials.password,
                }),
            });
            if (res.ok) {
                const data = await res.json();
                
                if (data.role !== 'admin') {
                    setMessage("Access denied. Admin credentials required.");
                    return;
                }

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
                localStorage.setItem("isAdmin", "true");
                
                setMessage("Admin login successful");
                navigate("/admin-homepage");
            } else {
                const err = await res.json();
                setMessage(err.message || "Invalid admin credentials");
            }
        } catch (error) {
            console.error(error);
            setMessage("Error connecting to the server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="login-div">
                <h2>Admin Portal Sign In</h2>
                <form onSubmit={handleSubmit} className="login-form">
                    <input
                        type="text"
                        name="emailOrUsername"
                        value={credentials.emailOrUsername}
                        onChange={handleChange}
                        placeholder="Admin email or username"
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
                    {message && <p className="info-message">{message}</p>}
                </form>
                <ul className="login-links">
                    <li><Link to="/login">Back to Sign In</Link></li>
                </ul>
            </div>
        </>
    );
}

export default AdminLogin;
