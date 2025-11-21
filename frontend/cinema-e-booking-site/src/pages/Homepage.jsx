import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import MovieDisplay from "./Movie-Display.jsx";
import "../css/Homepage.css";

function Homepage() {
  const [selectedCategory, setSelectedCategory] = useState("nowShowing");
  const [movies, setMovies] = useState({ nowShowing: [], upcoming: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const storedName =
    typeof window !== "undefined" ? localStorage.getItem("userName") : null;
  const greetingName = storedName || "Guest";
  // Fetch data
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("http://localhost:8080/return-all");
        if (!response.ok) {
          throw new Error("Failed to fetch movies");
        }
        const data = await response.json();
        setMovies({
          nowShowing: data.content.filter(movie => movie.shows.length > 0),
          upcoming: data.content.filter(movie => movie.shows.length === 0)
        })
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const displayedMovies = movies[selectedCategory] || [];
  if (loading) return <p>Loading movies</p>;
  if (error) return <p>Error loading movies: {error}</p>;
  return(
    <>
      <Navbar/>
      <div className="home-header">
        <div className="welcome-blurb">
          {storedName ? (
            <h3>Welcome back, {greetingName}!</h3>
          ) : (
            <h3>
              Welcome! <Link to="/register" className="signup-link">Sign up today</Link>
            </h3>
          )}
        </div>
        <div className="buttons">
          <button
            type="button"
            className={`category-button ${selectedCategory === "nowShowing" ? "is-active" : ""}`}
            onClick={() => setSelectedCategory("nowShowing")}
          >
            Currently Running
          </button>
          <button
            type="button"
            className={`category-button ${selectedCategory === "upcoming" ? "is-active" : ""}`}
            onClick={() => setSelectedCategory("upcoming")}
          >
            Coming Soon
          </button>
        </div>
      </div>
      <div className='movie-grid'>
        {displayedMovies.map((movie) => (
          <MovieDisplay
          key={movie.id}
          movie={movie}
          dispShowtimes={selectedCategory === "nowShowing"}
          />
        ))}
      </div>
    </>
  );
}

export default Homepage
