import { Link } from "react-router-dom";
function MovieDisplay({ movie }){
    return (
        <div className="moviecard">
            <Link
                to={`/details/${movie.title.replace(/\s+/g, '-').toLowerCase()}`}
                state={{ movie }}
                style={{ textDecoration: 'none', color: 'inherit' }}
                >
            <img
                src={movie.posterLink}
                alt={`${movie.title} Poster`}
                style={{ width: "200px", height: "300px"}}
            />
            </Link>
            <Link
                to={`/details/${movie.title.replace(/\s+/g, '-').toLowerCase()}`}
                state={{ movie }}
                style={{ textDecoration: 'none', color: 'inherit' }}
                >
            <h2 className="movie-title">{movie.title || "Movie Title"}</h2>
            </Link>
            <div className="showtimes">
                <ul>
                    <li>
                        Monday, September 29, 2025 at 2:00 PM
                    </li>
                    <li>
                        Tuesday, September 30, 2025 at 11:00 AM 
                    </li>
                    <li>
                        Wednesday, October 1, 2025 at 1:00 PM
                    </li>
                </ul>
            </div>

        </div>

    );
}

export default MovieDisplay