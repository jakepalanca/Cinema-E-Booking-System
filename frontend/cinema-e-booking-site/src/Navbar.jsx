import './Navbar.css';
import React, {useEffect, useState} from 'react';
import { Link, useNavigate } from "react-router-dom";
function Navbar(){
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        setIsLoggedIn(!!storedUser);
    }, []);
    //Logout
    const handleLogout = () => {
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        navigate("/");
    };

    return(
        <header>
            <nav>
                <ul className="flex-list">
                    <div className="logo">
                    <li>
                        <a href="/">
                        <img src="logo192.png" alt="Team 14"></img>
                        </a>
                    </li>
                    </div>
                    <li><a href="#">Showtimes</a></li>
                    <li><a href="#">Promotions</a></li>
                    <li><a href="#">Contact Us</a></li>
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
            <hr></hr>
        </header>
    );
}

export default Navbar