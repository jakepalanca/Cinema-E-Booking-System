import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../css/Login.css";
import Navbar from "./Navbar.jsx";
import authService from '../services/authService.js';
import { useAuth } from '../contexts/AuthContext.jsx';

function AdminLogin(){
    const [credentials, setCredentials] = useState({
        emailOrUsername: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        const {name, value} = e.target;
        setCredentials({...credentials, [name]: value});
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            // Use the same login endpoint
            const res = await fetch("http://localhost:8080/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: 'include', // Include cookies
                body: JSON.stringify({
                    emailOrUsername: credentials.emailOrUsername,
                    password: credentials.password,
                }),
            });
            if (res.ok) {
                const data = await res.json();
                
                // Verify it's an admin
                if (data.role !== 'admin') {
                    setMessage("Access denied. Admin credentials required.");
                    return;
                }

                // Token is now in HTTP-only cookie, so we only store user data
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
                <h2>Admin Sign In</h2>
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
            </div>
        </>
    );
}
export default AdminLogin;
