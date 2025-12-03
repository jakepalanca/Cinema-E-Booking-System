import '../css/Navbar.css';
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, logout, isAdmin, loading } = useAuth();
    const { pathname } = location;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isActive = (path) => {
        if (path === "/") return pathname === "/";
        return pathname === path || pathname.startsWith(`${path}/`);
    };

    const handleLogout = () => {
        logout();
        navigate("/");
        setMobileMenuOpen(false);
    };

    const handleNavClick = () => {
        setMobileMenuOpen(false);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    if (loading) {
        return (
            <header className="navbar-header">
                <nav className="navbar">
                    <div className="navbar-container">
                        <Link to="/" className="logo-link">
                            <img src="/logo.png" alt="Cinema Logo" className="navbar-logo"/>
                        </Link>
                        <button 
                            className={`mobile-menu-toggle ${mobileMenuOpen ? 'is-open' : ''}`}
                            onClick={toggleMobileMenu}
                            aria-label="Toggle menu"
                        >
                            <div className="hamburger">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </button>
                        <ul className={`nav-list ${mobileMenuOpen ? 'is-open' : ''}`}>
                            <li><Link to="/showtimes" className={`nav-item ${isActive("/showtimes") ? "active" : ""}`} onClick={handleNavClick}>Showtimes</Link></li>
                            <li><Link to="/browse" className={`nav-item ${isActive("/browse") ? "active" : ""}`} onClick={handleNavClick}>Browse</Link></li>
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
                    <Link to="/" className="logo-link" onClick={handleNavClick}>
                        <img src="/logo.png" alt="Cinema Logo" className="navbar-logo"/>
                    </Link>
                    <button 
                        className={`mobile-menu-toggle ${mobileMenuOpen ? 'is-open' : ''}`}
                        onClick={toggleMobileMenu}
                        aria-label="Toggle menu"
                    >
                        <div className="hamburger">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </button>
                    <ul className={`nav-list ${mobileMenuOpen ? 'is-open' : ''}`}>
                        <li><Link to="/showtimes" className={`nav-item ${isActive("/showtimes") ? "active" : ""}`} onClick={handleNavClick}>Showtimes</Link></li>
                        {isAuthenticated && (
                            <li><Link to="/promotions" className={`nav-item ${isActive("/promotions") ? "active" : ""}`} onClick={handleNavClick}>Promotions</Link></li>
                        )}
                        <li><Link to="/browse" className={`nav-item ${isActive("/browse") ? "active" : ""}`} onClick={handleNavClick}>Browse</Link></li>

                        {isAuthenticated ? (
                            <>
                                {isAdmin && (
                                    <li><Link to="/admin-homepage" className={`nav-item ${isActive("/admin-homepage") ? "active" : ""}`} onClick={handleNavClick}>Admin</Link></li>
                                )}
                                {!isAdmin && (
                                    <li><Link to="/edit-profile" className={`nav-item ${isActive("/edit-profile") ? "active" : ""}`} onClick={handleNavClick}>Edit Profile</Link></li>
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
                                <li><Link to="/register" className={`nav-item ${isActive("/register") ? "active" : ""}`} onClick={handleNavClick}>Sign Up</Link></li>
                                <li><Link to="/login" className={`nav-item ${isActive("/login") ? "active" : ""}`} onClick={handleNavClick}>Sign In</Link></li>
                            </>
                        )}
                    </ul>
                </div>
            </nav>
        </header>
    );
}

export default Navbar;
