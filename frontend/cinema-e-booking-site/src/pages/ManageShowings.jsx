import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import "../css/ManageShowings.css";

function ManageShowings(){
    const navigate = useNavigate();
    const [authorized, setAuthorized] = useState(null);
    const [movies, setMovies] = useState([]);
    const [showrooms, setShowrooms] = useState([]);
    const [showtimes, setShowtimes] = useState([]);
    const [form, setForm] = useState({
        movie_id: "",
        showroom_id: "",
        date: "",
        startTime: "",
        endTime: "",
    });
    const [message,setMessage] = useState("");
    useEffect(() => {
        const isAdmin = localStorage.getItem("isAdmin") === "true";
        if (!isAdmin) {
            navigate("/");
        } else {
            setAuthorized(true);
        }
    }, [navigate]);

    useEffect(() => {
        const fetchData = async () => {
            try{
                const [movieRes, showroomRes, showRes] = await Promise.all([
                    fetch("http://localhost:8080/movies"),
                    fetch("http://localhost:8080/showrooms"),
                    fetch("http://localhost:8080/shows"),
                ]);
                if (movieRes.ok) setMovies(await movieRes.json());
                if (showroomRes.ok) setShowrooms(await showroomRes.json());
                if (showRes.ok) setShowtimes(await showRes.json());
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
        fetchData();
    }, []);
    if (authorized === null) {
        return null;
    }
    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };
    const hasConflict = () => {
        const {showroom_id, date, startTime, endTime} = form;
        const start = new Date(`${date}T${startTime}`);
        const end = new Date(`${date}T${endTime}`);
        return showtimes.some(
            (show) =>
                show.showroom_id === parseInt(showroom_id) &&
                show.date === date &&
                ((start >= new Date(`${date}T${show.startTime}`) &&
                start < new Date(`${date}T${show.endTime}`)) ||
                (end > new Date(`${date}T${show.startTime}`) &&
                    end <= new Date(`${date}T${show.endTime}`)))
        );
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        if (hasConflict()) {
            setMessage("Error: There is already a show scheduled in this showroom at that time.");
            return;
        }
        try {
            const res = await fetch("http://localhost:8080/admin/shows", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: 'include',
                body: JSON.stringify(form),
            });
            if (res.ok){
                setMessage("Showtime added successfully!");
                setForm({
                    movie_id: "",
                    showroom_id: "",
                    date: "",
                    startTime: "",
                    endTime: "",
                });
            } else {
                const err = await res.json();
                setMessage(err.message || "Error adding showtime");
            }
        } catch (err) {
            console.error(err);
            setMessage("Error connecting to the server");
        }
    };
    return(
        <>
            <Navbar />
            <div className="manage-showings-container">
                <h2>Manage Showings</h2>
                <form className="showtime-form" onSubmit={handleSubmit}>
                    <label>
                        Movie:
                        <select name="movie_id" value={form.movie_id} onChange={handleChange} required>
                            <option value="">Select a Movie</option>
                            {movies.map((m) => (
                                <option key={m.id} value={m.id}>
                                    {m.title}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Showroom:
                        <select name="showroom_id" value={form.showroom_id} onChange={handleChange} required>
                            <option value="">Select a Showroom</option>
                            {showrooms.map((s) => (
                                <option key={s.id} value={s.id}>
                                    Showroom {s.id}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Date:
                        <input type="date" name="date" value={form.date} onChange={handleChange} required />
                    </label>
                    <label>
                        Start Time:
                        <input type="time" name="startTime" value={form.startTime} onChange={handleChange} required />
                    </label>
                    <label>
                        End Time:
                        <input type="time" name="endTime" value={form.endTime} onChange={handleChange} required />
                    </label>
                    <button type="submit" className="add-showtime-button">
                        Add Showing
                    </button>
                </form>
                {message && <p className="info-message">{message}</p>}
            </div>
        </>
    );
}
export default ManageShowings;
