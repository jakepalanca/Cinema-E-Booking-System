import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import "../css/Homepage.css";

function Showtimes() {
    const [movies, setMovies] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Generate next 7 days for date filter
    const getDateOptions = () => {
        const dates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            dates.push({
                value: date.toISOString().split('T')[0],
                label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : 
                    date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
            });
        }
        return dates;
    };

    const dateOptions = getDateOptions();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch movies with shows
                const moviesRes = await fetch("http://localhost:8080/return-all");
                if (!moviesRes.ok) throw new Error("Failed to fetch movies");
                const moviesData = await moviesRes.json();
                
                // Filter to only movies with shows
                const moviesWithShows = (moviesData.content || []).filter(movie => movie.shows?.length > 0);
                setMovies(moviesWithShows);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(":");
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? "PM" : "AM";
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minutes} ${ampm}`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric"
        });
    };

    // Group by date then by movie
    const getShowtimesByDate = () => {
        const dateGroups = {};

        movies.forEach(movie => {
            movie.shows?.forEach(show => {
                // Apply date filter if selected
                if (selectedDate && show.date !== selectedDate) return;

                if (!dateGroups[show.date]) {
                    dateGroups[show.date] = {};
                }

                if (!dateGroups[show.date][movie.id]) {
                    dateGroups[show.date][movie.id] = {
                        ...movie,
                        filteredShows: []
                    };
                }

                dateGroups[show.date][movie.id].filteredShows.push(show);
            });
        });

        // Sort dates
        const sortedDates = Object.keys(dateGroups).sort((a, b) => new Date(a) - new Date(b));
        
        return sortedDates.map(date => ({
            date,
            movies: Object.values(dateGroups[date])
        }));
    };

    const showtimesByDate = getShowtimesByDate();

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="loading-state">Loading showtimes...</div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <div className="error-state">Error loading showtimes: {error}</div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div style={{ 
                maxWidth: "1200px", 
                margin: "0 auto", 
                padding: "2rem",
                color: "var(--text-primary)"
            }}>
                <div className="welcome-blurb">
                    <h2 style={{ marginBottom: "0.5rem" }}>Showtimes</h2>
                    <p style={{ color: "var(--text-muted)" }}>
                        Select a date to view available showtimes
                    </p>
                </div>

                {/* Date filter */}
                <div style={{
                    display: "flex",
                    gap: "0.5rem",
                    flexWrap: "wrap",
                    marginBottom: "2rem",
                    padding: "1rem",
                    background: "var(--surface)",
                    borderRadius: "var(--radius)",
                    border: "1px solid var(--border)"
                }}>
                    <button
                        onClick={() => setSelectedDate("")}
                        style={{
                            padding: "0.5rem 1rem",
                            borderRadius: "9999px",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: "500",
                            transition: "all 0.2s",
                            background: selectedDate === "" ? "var(--uga-red)" : "var(--surface-alt)",
                            color: selectedDate === "" ? "var(--paper)" : "var(--text-primary)"
                        }}
                    >
                        All Dates
                    </button>
                    {dateOptions.map(option => (
                        <button
                            key={option.value}
                            onClick={() => setSelectedDate(option.value)}
                            style={{
                                padding: "0.5rem 1rem",
                                borderRadius: "9999px",
                                border: "none",
                                cursor: "pointer",
                                fontWeight: "500",
                                transition: "all 0.2s",
                                background: selectedDate === option.value ? "var(--uga-red)" : "var(--surface-alt)",
                                color: selectedDate === option.value ? "var(--paper)" : "var(--text-primary)"
                            }}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>

                {showtimesByDate.length === 0 ? (
                    <div style={{ 
                        textAlign: "center", 
                        padding: "3rem",
                        background: "var(--surface)",
                        borderRadius: "var(--radius)",
                        border: "1px solid var(--border)"
                    }}>
                        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>
                            No showtimes available for the selected date.
                        </p>
                    </div>
                ) : (
                    showtimesByDate.map(({ date, movies }) => (
                        <div key={date} style={{ marginBottom: "2rem" }}>
                            <h3 style={{
                                fontSize: "1.25rem",
                                marginBottom: "1rem",
                                paddingBottom: "0.5rem",
                                borderBottom: "2px solid var(--uga-red)"
                            }}>
                                {formatDate(date)}
                            </h3>

                            <div style={{
                                display: "grid",
                                gap: "1rem"
                            }}>
                                {movies.map(movie => (
                                    <div
                                        key={movie.id}
                                        style={{
                                            display: "flex",
                                            gap: "1.5rem",
                                            background: "linear-gradient(135deg, var(--surface) 0%, var(--surface-alt) 100%)",
                                            borderRadius: "var(--radius)",
                                            border: "1px solid var(--border)",
                                            padding: "1rem",
                                            alignItems: "flex-start"
                                        }}
                                    >
                                        {/* Movie poster */}
                                        <Link 
                                            to={`/details/${movie.title.replace(/\s+/g, "-").toLowerCase()}`}
                                            state={{ movie }}
                                            style={{ flexShrink: 0 }}
                                        >
                                            <img
                                                src={movie.posterLink}
                                                alt={movie.title}
                                                style={{
                                                    width: "100px",
                                                    height: "150px",
                                                    objectFit: "cover",
                                                    borderRadius: "8px"
                                                }}
                                            />
                                        </Link>

                                        {/* Movie info and showtimes */}
                                        <div style={{ flex: 1 }}>
                                            <Link 
                                                to={`/details/${movie.title.replace(/\s+/g, "-").toLowerCase()}`}
                                                state={{ movie }}
                                                style={{ textDecoration: "none", color: "inherit" }}
                                            >
                                                <h4 style={{ 
                                                    margin: "0 0 0.5rem 0",
                                                    fontSize: "1.1rem",
                                                    color: "var(--paper)"
                                                }}>
                                                    {movie.title}
                                                </h4>
                                            </Link>
                                            
                                            <div style={{
                                                display: "flex",
                                                gap: "0.5rem",
                                                marginBottom: "1rem",
                                                flexWrap: "wrap"
                                            }}>
                                                <span style={{
                                                    fontSize: "0.75rem",
                                                    padding: "0.25rem 0.5rem",
                                                    background: "var(--surface-alt)",
                                                    borderRadius: "4px",
                                                    color: "var(--text-muted)"
                                                }}>
                                                    {movie.mpaaRating?.replace(/_/g, " ") || "NR"}
                                                </span>
                                                <span style={{
                                                    fontSize: "0.75rem",
                                                    padding: "0.25rem 0.5rem",
                                                    background: "var(--surface-alt)",
                                                    borderRadius: "4px",
                                                    color: "var(--text-muted)"
                                                }}>
                                                    {movie.movieGenre?.replace(/_/g, " ") || "Genre"}
                                                </span>
                                            </div>

                                            {/* Showtimes */}
                                            <div style={{
                                                display: "flex",
                                                gap: "0.5rem",
                                                flexWrap: "wrap"
                                            }}>
                                                {movie.filteredShows
                                                    .sort((a, b) => a.startTime.localeCompare(b.startTime))
                                                    .map(show => (
                                                        <Link
                                                            key={show.id}
                                                            to={`/booking/${movie.title.replace(/\s+/g, "-").toLowerCase()}`}
                                                            state={{
                                                                movie,
                                                                show,
                                                                showtime: `${formatDate(show.date)} at ${formatTime(show.startTime)}`
                                                            }}
                                                            style={{
                                                                display: "inline-block",
                                                                padding: "0.5rem 1rem",
                                                                background: "var(--uga-red)",
                                                                color: "var(--paper)",
                                                                borderRadius: "6px",
                                                                textDecoration: "none",
                                                                fontSize: "0.875rem",
                                                                fontWeight: "600",
                                                                transition: "background 0.2s"
                                                            }}
                                                        >
                                                            {formatTime(show.startTime)}
                                                        </Link>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </>
    );
}

export default Showtimes;

