import '../css/Navbar.css';
import React from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, logout, isAdmin, loading } = useAuth();
    const { pathname } = location;

    const isActive = (path) => {
        if (path === "/") return pathname === "/";
        return pathname === path || pathname.startsWith(`${path}/`);
    };

    // Logout clears all auth data
    const handleLogout = () => {
        logout();
        navigate("/");
    };

    // Don't render auth-specific UI until we've checked authentication status
    if (loading) {
        return (
            <header className="navbar-header">
                <nav className="navbar">
                    <div className="navbar-container">
                        <Link to="/" className="logo-link">
                            <img src="/logo.png" alt="Cinema Logo" className="navbar-logo"/>
                        </Link>
                        <ul className="nav-list">
                            <li><Link to="/showtimes" className={`nav-item ${isActive("/showtimes") ? "active" : ""}`}>Showtimes</Link></li>
                            <li><Link to="/contact" className={`nav-item ${isActive("/contact") ? "active" : ""}`}>Contact Us</Link></li>
                            <li><Link to="/browse" className={`nav-item ${isActive("/browse") ? "active" : ""}`}>Browse</Link></li>
                        </ul>
                    </div>
                </nav>
            </header>
        );
    }

    return (
        <header className="navbar-header">
            <nav className="navbar">
                <div className="navbar-container">
                    <Link to="/" className="logo-link">
                        <img src="/logo.png" alt="Cinema Logo" className="navbar-logo"/>
                    </Link>
                    <ul className="nav-list">
                        <li><Link to="/showtimes" className={`nav-item ${isActive("/showtimes") ? "active" : ""}`}>Showtimes</Link></li>
                        {isAuthenticated && (
                            <li><Link to="/promotions" className={`nav-item ${isActive("/promotions") ? "active" : ""}`}>Promotions</Link></li>
                        )}
                        <li><Link to="/contact" className={`nav-item ${isActive("/contact") ? "active" : ""}`}>Contact Us</Link></li>
                        <li><Link to="/browse" className={`nav-item ${isActive("/browse") ? "active" : ""}`}>Browse</Link></li>

                        {isAuthenticated ? (
                            <>
                                {isAdmin && (
                                    <li><Link to="/admin-homepage" className={`nav-item ${isActive("/admin-homepage") ? "active" : ""}`}>Admin</Link></li>
                                )}
                                {!isAdmin && (
                                    <li><Link to="/edit-profile" className={`nav-item ${isActive("/edit-profile") ? "active" : ""}`}>Edit Profile</Link></li>
                                )}
                                <li>
                                    <Link
                                        to="/"
                                        className="nav-item"
                                        onClick={(e) => { e.preventDefault(); handleLogout(); }}
                                    >
                                        Log Out
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li><Link to="/register" className={`nav-item ${isActive("/register") ? "active" : ""}`}>Sign Up</Link></li>
                                <li><Link to="/login" className={`nav-item ${isActive("/login") ? "active" : ""}`}>Sign In</Link></li>
                            </>
                        )}
                    </ul>
                </div>
            </nav>
        </header>
    );
}

export default Navbar;
