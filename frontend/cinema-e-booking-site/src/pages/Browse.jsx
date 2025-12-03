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
        <div className="welcome-blurb">
          <h2 style={{ marginBottom: "0.5rem" }}>Browse</h2>
          <p style={{ color: "var(--text-muted)" }}>Search by title and refine by genre to find your next film.</p>
          {error && <p style={{ color: "var(--uga-red)", marginTop: "0.5rem" }}>Error: {error}</p>}
        </div>
        <div style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          marginTop: "1.25rem",
          marginBottom: "2rem",
          padding: "1rem",
          background: "var(--surface)",
          borderRadius: "var(--radius)",
          border: "1px solid var(--border)"
        }}>
          <div style={{ flex: "1", minWidth: "200px" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.25rem", display: "block" }}>Search</span>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Search movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.65rem 0.9rem",
                  paddingLeft: "2.25rem",
                  borderRadius: "var(--radius)",
                  border: "1px solid var(--border)",
                  background: "var(--surface-alt)",
                  color: "var(--text-primary)",
                  boxSizing: "border-box"
                }}
              />
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", width: "1rem", height: "1rem", color: "var(--text-muted)" }}
              >
                <path
                  fill="currentColor"
                  d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.71.71l.27.28v.78l5 4.99L20.49 19zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14"
                />
              </svg>
              {loading && <span style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", fontSize: "0.75rem", color: "var(--text-muted)" }}>Searching...</span>}
            </div>
          </div>
          <div style={{ minWidth: "160px" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.25rem", display: "block" }}>Genre</span>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              style={{
                width: "100%",
                padding: "0.65rem 0.9rem",
                borderRadius: "var(--radius)",
                border: "1px solid var(--border)",
                background: "var(--surface-alt)",
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
          </div>
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
