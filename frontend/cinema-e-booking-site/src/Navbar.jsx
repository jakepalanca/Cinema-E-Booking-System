import './Navbar.css';
import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from './contexts/AuthContext';

function Navbar() {
    const navigate = useNavigate();
    const { isAuthenticated, logout, isAdmin } = useAuth();

    // Logout clears all auth data
    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <header>
            <nav>
                <ul className="flex-list">
                    <div className="logo">
                        <li>
                            <a href="/">
                                <img src="logo192.png" alt="Team 14" />
                            </a>
                        </li>
                    </div>

                    <li><Link to="/showtimes" className="nav-item">Showtimes</Link></li>
                    <li><Link to="/promotions" className="nav-item">Promotions</Link></li>
                    <li><Link to="/contact" className="nav-item">Contact Us</Link></li>
                    <li><Link to="/browse" className="nav-item">Browse</Link></li>

                    {isAuthenticated ? (
                        <>
                            {isAdmin && (
                                <li><Link to="/admin-homepage" className="nav-item">Admin</Link></li>
                            )}
                            {!isAdmin && (
                                <li><Link to="/edit-profile" className="nav-item">Edit Profile</Link></li>
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
                            <li><Link to="/register" className="nav-item">Sign Up</Link></li>
                            <li><Link to="/login" className="nav-item">Sign In</Link></li>
                        </>
                    )}
                </ul>
            </nav>
            <hr />
        </header>
    );
}

export default Navbar;
