// src/Pages/DetailsPage.js
import { useParams, useLocation } from "react-router-dom";

export default function DetailsPage() {
  const { movieId } = useParams();
  const { state } = useLocation();
  const movie = state?.movie;

  if (!movie) {
    return <div style={{ padding: 20, textAlign: "center" }}>Movie not found. Please navigate from the homepage.</div>;
  }

  return (
    <div style={{ padding: 20, maxWidth: 960, margin: "0 auto" }}>
      <h2>Movie Details</h2>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: 16,
          marginBottom: 16,
          display: "flex",
          gap: 20,
        }}
      >
        {movie.posterLink && (
          <img
            src={movie.posterLink}
            alt={movie.title}
            style={{
              width: 200,
              height: "auto",
              borderRadius: 8,
              objectFit: "cover",
            }}
          />
        )}

        <div style={{ flex: 1 }}>
          <h3 style={{ marginTop: 0 }}>{movie.title}</h3>
          <p><strong>Showtime:</strong> {movie.showtimes?.length > 0 ? movie.showtimes.join(", ") : "No showtimes available"}</p>
          <p><strong>Genre:</strong> {movie.movieCategory || "Genre not available"}</p>
          <p><strong>Director:</strong> {movie.director || "Not available"}</p>
          <p><strong>Producer:</strong> {movie.producer || "Not available"}</p>
          <p><strong>Cast:</strong> {movie.cast?.join(", ") || "Not available"}</p>
          <p><strong>Rating:</strong> {movie.mpaaRating || "Not Rated"}</p>
          <p style={{ marginTop: 12 }}>{movie.synopsis || "No description provided. This is placeholder text for the details page."}</p>

          {movie.trailerLink && (
            <p>
              <a href={movie.trailerLink} target="_blank" rel="noopener noreferrer" style={{ color: "#007bff" }}>
                Watch Trailer
              </a>
            </p>
          )}

          <small style={{ color: "#666" }}>movieId: {movieId}</small>
        </div>
      </div>

      {movie.reviews && movie.reviews.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <h4>Reviews</h4>
          {movie.reviews.map(review => (
            <div
              key={review.id}
              style={{
                border: "1px solid #eee",
                borderRadius: 4,
                padding: 12,
                marginBottom: 8,
              }}
            >
              <p><strong>Rating:</strong> {review.rating}/5</p>
              <p>{review.comment}</p>
            </div>
          ))}
        </div>
      )}

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
