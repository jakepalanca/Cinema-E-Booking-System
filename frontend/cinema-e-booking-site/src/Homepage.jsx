import React, { useState, useEffect } from "react";
import Navbar from "./Navbar.jsx"
import MovieDisplay from "./Movie-Display.jsx";
import './Homepage.css';

function Homepage() {
  const [selectedCategory, setSelectedCategory] = useState("nowShowing");
  const [movies, setMovies] = useState({ nowShowing: [], upcoming: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Fetch data
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("http://localhost:8080/all-movies");
        if (!response.ok) {
          throw new Error("Failed to fetch movies");
        }
        const data = await response.json();
        setMovies(data);
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
      <div className='buttons'>
        <button onClick={() => setSelectedCategory("nowShowing")}>
          Now Showing
        </button>
        <button onClick={() => setSelectedCategory("upcoming")}>
          Upcoming
        </button>
      </div>
      <div>
        {displayedMovies.map((movie) => (
          <MovieDisplay key={movie.id} title = {movie.title} poster={movie.poster}/>
        ))}
      </div>
    </>
  );
}

export default Homepage