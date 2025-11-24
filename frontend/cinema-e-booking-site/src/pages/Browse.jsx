import React, { useEffect, useState } from "react";
import "../css/Homepage.css";
import Navbar from "./Navbar.jsx";
import MovieDisplay from "./Movie-Display.jsx";
import "../css/Browse.css";

function Browse() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const genreOptions = [
    "All",
    "ACTION",
    "SCI_FI",
    "ROMANCE",
    "CRIME",
    "THRILLER",
    "ANIMATION",
    "COMEDY",
  ];

  useEffect(() => {
    const controller = new AbortController();
    const fetchFilteredMovies = async () => {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      params.append("title", searchTerm);
      if (selectedGenre !== "All") {
        params.append("genre", selectedGenre);
      }

      try {
        const response = await fetch(
          `http://localhost:8080/search-title?${params.toString()}`,
          { signal: controller.signal }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch movies");
        }
        const data = await response.json();
        setMovies(data.content || []);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchFilteredMovies, 200);
    return () => {
      clearTimeout(debounce);
      controller.abort();
    };
  }, [searchTerm, selectedGenre]);

  const filteredMovies = movies.filter((movie) => {
    const matchesTitle = movie.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesGenre =
      selectedGenre === "All" || movie.movieGenre === selectedGenre;
    return matchesTitle && matchesGenre;
  });

  return (
    <>
      <Navbar />
      <div className="browse-controls">
        <div className="browse-copy">
          <p className="browse-eyebrow">Browse</p>
          <h2 className="browse-title">Find your next film</h2>
          <p className="browse-sub">Search by title and refine by genre.</p>
          {error && <p className="browse-error">Error: {error}</p>}
        </div>
        <div className="filter-group">
          <div className="filter-field">
            <span className="field-label">Search</span>
            <div className="input-shell">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="input-icon"
              >
                <path
                  fill="currentColor"
                  d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.71.71l.27.28v.78l5 4.99L20.49 19zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14"
                />
              </svg>
              <input
                type="text"
                placeholder="Search movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {loading && <span className="pill-status">Searching...</span>}
            </div>
          </div>
          <div className="filter-field">
            <span className="field-label">Genre</span>
            <div className="select-shell">
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
              >
                {genreOptions.map((genre, idx) => (
                  <option key={idx} value={genre}>
                    {genre === "All" ? "All Genres" : genre.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="movie-grid">
        {filteredMovies.map((movie) => (
          <MovieDisplay key={movie.id} movie={movie} />
        ))}
      </div>
    </>
  );
}
export default Browse;
