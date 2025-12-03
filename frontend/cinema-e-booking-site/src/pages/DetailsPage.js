// src/DetailsPage.js
import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Navbar from './Navbar.jsx';
import { useAuth } from '../contexts/AuthContext';

export default function DetailsPage() {
  const { movieId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [movie, setMovie] = useState(state?.movie || null);
  const [loading, setLoading] = useState(!state?.movie);
  const [error, setError] = useState(null);

  // If no movie in state, fetch from API
  useEffect(() => {
    if (state?.movie) {
      setMovie(state.movie);
      setLoading(false);
      return;
    }

    // Fetch movie by matching the URL slug to the movie title
    const fetchMovie = async () => {
      try {
        const response = await fetch("http://localhost:8080/return-all");
        if (!response.ok) throw new Error("Failed to fetch movies");
        const data = await response.json();
        
        // Find movie where title slug matches the URL param
        const found = (data.content || []).find(m => 
          m.title.replace(/\s+/g, "-").toLowerCase() === movieId
        );
        
        if (found) {
          setMovie(found);
        } else {
          setError("Movie not found");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [movieId, state?.movie]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ padding: 20, textAlign: "center", color: "white" }}>Loading movie details...</div>
      </>
    );
  }

  if (error || !movie) {
    return (
      <>
        <Navbar />
        <div style={{ padding: 20, textAlign: "center", color: "white" }}>
          {error || "Movie not found. Please navigate from the homepage."}
        </div>
      </>
    );
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
    <>
      <Navbar />
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
            {!isAuthenticated ? (
              <div style={{ marginTop: 8, padding: "10px 16px", backgroundColor: "#f8f9fa", borderRadius: 6, color: "#495057" }}>
                Please <a href="/login" style={{ color: "#dc3545", textDecoration: "underline" }}>log in</a> to book tickets
              </div>
            ) : movie.shows?.length > 0 ? (
              <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 10 }}>
                {movie.shows.map((show) => (
                  <button
                    key={show.id}
                    onClick={() => navigate(`/booking/${movieId}`, {
                      state: {
                        movie,
                        show,
                        showtime: `${formatDate(show.date)} at ${formatTime(show.startTime)}`
                      }
                    })}
                    style={{
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: 6,
                      padding: "10px 16px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "500",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = "#c82333"}
                    onMouseLeave={(e) => e.target.style.backgroundColor = "#dc3545"}
                  >
                    {formatDate(show.date)} at {formatTime(show.startTime)}
                  </button>
                ))}
              </div>
            ) : (
              <span> No showtimes available</span>
            )}
          </div>

          <p><strong>Genre:</strong> {formatGenre(movie.movieGenre)}</p>
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
    </>
  );
}
