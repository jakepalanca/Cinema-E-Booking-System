// src/Pages/DetailsPage.js
import { useParams, useLocation, useNavigate } from "react-router-dom";

export default function DetailsPage() {
  const { movieId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const movie = state?.movie;

  if (!movie) {
    return <div style={{ padding: 20, textAlign: "center" }}>Movie not found. Please navigate from the homepage.</div>;
  }

  // Extract YouTube video ID from trailer link
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([^&]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  const embedUrl = getYouTubeEmbedUrl(movie.trailerLink);

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

          <div style={{ marginBottom: 12 }}>
            <strong>Showtimes:</strong>
            {movie.showtimes?.length > 0 ? (
              <ul style={{ marginTop: 4, paddingLeft: 20 }}>
                {movie.showtimes.map((showtime) => (
                  <li key={showtime.id}>
                    {showtime.date} at {showtime.time}
                  </li>
                ))}
              </ul>
            ) : (
              <span> No showtimes available</span>
            )}
          </div>

          <p><strong>Genre:</strong> {movie.movieCategory || "Genre not available"}</p>
          <p><strong>Director:</strong> {movie.director || "Not available"}</p>
          <p><strong>Producer:</strong> {movie.producer || "Not available"}</p>
          <p><strong>Cast:</strong> {movie.cast?.join(", ") || "Not available"}</p>
          <p><strong>Rating:</strong> {movie.mpaaRating || "Not Rated"}</p>
          <p style={{ marginTop: 12 }}>{movie.synopsis || "No description provided. This is placeholder text for the details page."}</p>

          <small style={{ color: "#666" }}>movieId: {movieId}</small>
        </div>
      </div>

      {embedUrl && (
        <div style={{ marginBottom: 16 }}>
          <h4>Trailer</h4>
          <iframe
            width="100%"
            height="480"
            src={embedUrl}
            title="Movie Trailer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ borderRadius: 8, border: "none" }}
          ></iframe>
        </div>
      )}

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
        onClick={() => navigate(`/booking/${movieId}`, { state: { movie } })}
        style={{
          padding: "10px 20px",
          borderRadius: 6,
          background: "#007bff",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Book Now
      </button>
    </div>
  );
}
