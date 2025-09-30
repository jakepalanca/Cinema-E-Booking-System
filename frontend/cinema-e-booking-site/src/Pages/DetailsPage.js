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

  // Format genre from enum style to readable text
  const formatGenre = (genre) => {
    if (!genre) return "Genre not available";
    return genre
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format time to 12-hour format
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const embedUrl = getYouTubeEmbedUrl(movie.trailerLink);

  return (
    <div style={{ padding: 20, maxWidth: 960, margin: "0 auto", color: "white" }}>
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
            <strong>Book Now:</strong>
            {movie.showtimes?.length > 0 ? (
              <ul style={{ marginTop: 4, paddingLeft: 20 }}>
                {movie.showtimes.map((showtime) => (
                  <li key={showtime.id} style={{ marginBottom: 4 }}>
                    <a
                      onClick={() => navigate(`/booking/${movieId}`, {
                        state: {
                          movie,
                          showtime: `${formatDate(showtime.date)} at ${formatTime(showtime.time)}`
                        }
                      })}
                      style={{
                        color: "#dc3545",
                        cursor: "pointer",
                        textDecoration: "underline"
                      }}
                    >
                      {formatDate(showtime.date)} at {formatTime(showtime.time)}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <span> No showtimes available</span>
            )}
          </div>

          <p><strong>Genre:</strong> {formatGenre(movie.movieCategory)}</p>
          <p><strong>Director:</strong> {movie.director || "Not available"}</p>
          <p><strong>Producer:</strong> {movie.producer || "Not available"}</p>
          <p><strong>Cast:</strong> {movie.cast?.join(", ") || "Not available"}</p>
          <p><strong>Rating:</strong> {movie.mpaaRating || "Not Rated"}</p>
          <p style={{ marginTop: 12 }}>{movie.synopsis || "No description provided. This is placeholder text for the details page."}</p>
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
    </div>
  );
}
