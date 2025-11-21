import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const formatGenre = (genre) => {
    if (!genre) return "Genre unavailable";
    return genre
        .split("_")
        .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
        .join(" ");
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
    });
};

const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
};

function MovieDisplay({ movie, dispShowtimes }) {
    const [posterRatio, setPosterRatio] = useState(null);
    const showtimes = movie?.shows || [];
    const badgeLabel = dispShowtimes
        ? "Now Showing"
        : showtimes.length > 0
        ? "Available"
        : "Coming Soon";
    const rating = (movie.mpaaRating || "NR").replace(/_/g, " ");

    const formattedShowtimes = useMemo(
        () =>
            showtimes.map((show) => ({
                id: show.id,
                label: `${formatDate(show.date)} Â· ${formatTime(show.startTime)}`,
            })),
        [showtimes]
    );

    const detailsLink = `/details/${movie.title.replace(/\s+/g, "-").toLowerCase()}`;

    return (
        <div className="moviecard">
            <div
                className="moviecard__poster-wrap"
                style={{ "--poster-ratio": posterRatio || undefined }}
            >
                <Link
                    to={detailsLink}
                    state={{ movie }}
                    style={{ textDecoration: "none", color: "inherit" }}
                >
                    <img
                        className="moviecard__poster"
                        src={movie.posterLink}
                        alt={`${movie.title} Poster`}
                        onLoad={(e) => {
                            const { naturalWidth, naturalHeight } = e.target;
                            if (naturalWidth && naturalHeight) {
                                setPosterRatio(naturalWidth / naturalHeight);
                            }
                        }}
                    />
                </Link>
                <div className="moviecard__badge">{badgeLabel}</div>
            </div>

            <div className="moviecard__body">
                <Link
                    to={detailsLink}
                    state={{ movie }}
                    style={{ textDecoration: "none", color: "inherit" }}
                >
                    <h2 className="movie-title">{movie.title || "Movie Title"}</h2>
                </Link>
                <div className="moviecard__meta">
                    <span className="moviecard__pill">{formatGenre(movie.movieGenre)}</span>
                    <span className="moviecard__pill moviecard__pill--ghost">
                        {rating}
                    </span>
                </div>
                <p className="moviecard__synopsis">
                    {movie.synopsis ||
                        "No synopsis yet — check back soon for more about this title."}
                </p>

                {dispShowtimes && showtimes.length > 0 && (
                    <div className="moviecard__showtimes">
                        <div className="moviecard__showtime-list">
                            {formattedShowtimes.map((show) => (
                                <span key={show.id} className="moviecard__showtime">
                                    {show.label}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="moviecard__footer">
                    <Link
                        to={detailsLink}
                        state={{ movie }}
                        className="moviecard__cta"
                    >
                        View details
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default MovieDisplay;

