import './Navbar.css';
import React from 'react';
import { Link } from "react-router-dom";
function Navbar(){
    return(
        <header>
            <nav>
                <ul className="flex-list">
                    <div className="logo">
                    <li>
                        <a href="/">
                        <img src="TODO" alt="Team 14"></img>
                        </a>
                    </li>
                    </div>
                    <li><a href="#">Showtimes</a></li>
                    <li><a href="#">Promotions</a></li>
                    <li><a href="#">Contact Us</a></li>
                    <li><Link to="/browse" className="nav-item">Browse</Link></li>
                    <li><a href="#">Sign In</a></li>
                </ul>
            </nav>
            <hr></hr>
        </header>
    );
}

export default Navbar