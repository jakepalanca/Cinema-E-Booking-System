import { useMemo } from "react";
import { Link } from "react-router-dom";

const formatGenre = (genre) => {
    if (!genre) return "Genre unavailable";
    return genre
        .split("_")
        .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
        .join(" ");
};

const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
};

const formatDateShort = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
    });
};

const formatDateLong = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    });
};

function MovieDisplay({ movie, dispShowtimes }) {
    const rating = (movie.mpaaRating || "NR").replace(/_/g, " ");

    // Group showtimes by date
    const groupedShowtimes = useMemo(() => {
        const showtimes = movie?.shows || [];
        if (!showtimes.length) return [];
        
        const grouped = showtimes.reduce((acc, show) => {
            const dateKey = show.date;
            if (!acc[dateKey]) {
                acc[dateKey] = {
                    date: dateKey,
                    shows: [],
                };
            }
            acc[dateKey].shows.push(show);
            return acc;
        }, {});

        // Sort by date and limit to first 3 dates
        return Object.values(grouped)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 3);
    }, [movie]);

    const detailsLink = `/details/${movie.title.replace(/\s+/g, "-").toLowerCase()}`;

    return (
        <Link
            to={detailsLink}
            state={{ movie }}
            className="moviecard"
            style={{ textDecoration: "none", color: "inherit" }}
        >
            <div className="moviecard__poster-wrap">
                <img
                    className="moviecard__poster"
                    src={movie.posterLink}
                    alt={`${movie.title} Poster`}
                />
            </div>

            <div className="moviecard__body">
                <h2 className="movie-title">{movie.title || "Movie Title"}</h2>
                
                <div className="moviecard__meta">
                    <span className="moviecard__pill">{formatGenre(movie.movieGenre)}</span>
                    <span className="moviecard__pill moviecard__pill--ghost">{rating}</span>
                </div>

                {dispShowtimes && groupedShowtimes.length > 0 && (
                    <div className="moviecard__showtimes" onClick={(e) => e.stopPropagation()}>
                        <span className="moviecard__showtimes-label">Showtimes</span>
                        {groupedShowtimes.map((group) => (
                            <div key={group.date} className="moviecard__showtime-group">
                                <span className="moviecard__showtime-date">
                                    {formatDateShort(group.date)}
                                </span>
                                <div className="moviecard__showtime-times">
                                    {group.shows.map((show) => (
                                        <Link
                                            key={show.id}
                                            to={`/booking/${movie.title.replace(/\s+/g, "-").toLowerCase()}`}
                                            state={{
                                                movie,
                                                show,
                                                showtime: `${formatDateLong(show.date)} at ${formatTime(show.startTime)}`,
                                            }}
                                            className="moviecard__showtime moviecard__showtime--link"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {formatTime(show.startTime)}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Link>
    );
}

export default MovieDisplay;
