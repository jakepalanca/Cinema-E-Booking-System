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
      <div className='buttons'>
        <button onClick={() => setSelectedCategory("nowShowing")}>
          Currently Running
        </button>
        <button onClick={() => setSelectedCategory("upcoming")}>
          Coming Soon
        </button>
      </div>
      <div className='movie-grid'>
        {displayedMovies.map((movie) => (
          <MovieDisplay
          key={movie.id}
          movie={movie}
          />
        ))}
      </div>
    </>
  );
}

export default Homepage