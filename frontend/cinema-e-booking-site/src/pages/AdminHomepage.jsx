import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "./Navbar";
import "../css/AdminHomepage.css";

function AdminHomepage() {
    const navigate = useNavigate();
    //useEffect(() => {
    //    const isAdmin = localStorage.getItem("isAdmin") === "true";
    //    if (!isAdmin) {
    //        navigate("/");
    //    }
    //}, [navigate]);
    return(
        <>
            <Navbar isAdmin={true}/>
            <div className="admin-homepage-container">
                <h1>Admin Page</h1>
                <p>Admin Options:</p>
                <div className="admin-links">
                    <Link to="/admin/manage-movies" className="admin-card">Manage Movies</Link>
                    <Link to="/admin/manage-showings" className="admin-card">Manage Showings</Link>
                    <Link to="/admin/manage-users" className="admin-card">Manage Users</Link>
                    <Link to="/admin/manage-promotions" className="admin-card">Manage Promotions</Link>
                </div>
            </div>
        </>
    );
}

export default AdminHomepage;
