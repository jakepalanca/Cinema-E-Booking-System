import './Navbar.css';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check login status based on cinemaUser key
        const storedUser = localStorage.getItem("cinemaUser");
        setIsLoggedIn(!!storedUser);

        // Update automatically if login changes (e.g. in another tab)
        const handleStorageChange = () => {
            const updatedUser = localStorage.getItem("cinemaUser");
            setIsLoggedIn(!!updatedUser);
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    // Logout clears cinemaUser + cinemaAuth
    const handleLogout = () => {
        localStorage.removeItem("cinemaUser");
        localStorage.removeItem("cinemaAuth");
        setIsLoggedIn(false);
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

                    {isLoggedIn ? (
                        <>
                            <li><Link to="/edit-profile" className="nav-item">Edit Profile</Link></li>
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
