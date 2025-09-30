// src/Pages/DetailsPage.js
import { useParams, useLocation } from "react-router-dom";

export default function DetailsPage() {
  const { movieId } = useParams();
  const { state } = useLocation();

  // fallback values if no state passed
  const title = state?.title || "Movie Title";
  const showtime = state?.showtime || "Showtime";
  const genre = state?.genre || "Genre not available";
  const duration = state?.duration || "Duration not available";
  const rating = state?.rating || "Not Rated";
  const description =
    state?.description ||
    "No description provided. This is placeholder text for the details page.";

  return (
    <div style={{ padding: 20, maxWidth: 720, margin: "0 auto" }}>
      <h2>Movie Details</h2>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: 16,
          marginBottom: 16,
        }}
      >
        <h3 style={{ marginTop: 0 }}>{title}</h3>
        <p><strong>Showtime:</strong> {showtime}</p>
        <p><strong>Genre:</strong> {genre}</p>
        <p><strong>Duration:</strong> {duration}</p>
        <p><strong>Rating:</strong> {rating}</p>
        <p style={{ marginTop: 12 }}>{description}</p>

        <small style={{ color: "#666" }}>movieId: {movieId}</small>
      </div>

      <button
        onClick={() => alert("Booking flow coming soon!")}
        style={{
          padding: "10px 20px",
          borderRadius: 6,
          background: "#007bff",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Book Now (Prototype)
      </button>

      <p style={{ color: "#777", marginTop: 8 }}>
        * Prototype details page for Sprint 1 — booking button not functional yet.
      </p>
    </div>
  );
}
