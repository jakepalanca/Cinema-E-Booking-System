import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import Navbar from "./Navbar.jsx";

function AdminLogin(){
    const [credentials, setCredentials] = useState({
        username: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name, value} = e.target;
        setCredentials({...credentials, [name]: value});
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            const res = await fetch("http://localhost:8080/admin-login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    username: credentials.username,
                    password: credentials.password,
                }),
            });
            if (res.ok) {
                const data = await res.json();
                localStorage.setItem("isAdmin", "true");
                setMessage("Admin login successful");
                navigate("/admin-home");
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
                        Username:
                        <input
                            type="text"
                            name="username"
                            value={credentials.username}
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