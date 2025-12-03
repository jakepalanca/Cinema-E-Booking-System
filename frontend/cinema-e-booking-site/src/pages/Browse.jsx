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
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem", color: "var(--text-primary)" }}>
        <div className="welcome-blurb" style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ marginBottom: "0.5rem" }}>Browse</h2>
          <p style={{ color: "var(--text-muted)" }}>Search by title and refine by genre to find your next film.</p>
          {error && <p style={{ color: "var(--uga-red)", marginTop: "0.5rem" }}>Error: {error}</p>}
        </div>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
          <input
            type="text"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: "1",
              minWidth: "200px",
              padding: "0.75rem 0.9rem",
              borderRadius: "var(--radius)",
              border: "1px solid var(--border)",
              backgroundColor: "#0f1118",
              color: "var(--text-primary)",
              boxSizing: "border-box"
            }}
          />
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            style={{
              minWidth: "160px",
              padding: "0.75rem 0.9rem",
              borderRadius: "var(--radius)",
              border: "1px solid var(--border)",
              backgroundColor: "#0f1118",
              color: "var(--text-primary)",
              cursor: "pointer"
            }}
          >
            {genreOptions.map((genre, idx) => (
              <option key={idx} value={genre}>
                {genre === "All" ? "All Genres" : genre.replace("_", " ")}
              </option>
            ))}
          </select>
          {loading && <span style={{ alignSelf: "center", fontSize: "0.85rem", color: "var(--text-muted)" }}>Searching...</span>}
        </div>

        <div className="movie-grid">
          {filteredMovies.map((movie) => (
            <MovieDisplay key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </>
  );
}
export default Browse;
