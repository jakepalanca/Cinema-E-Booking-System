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

        </div>

    );
}

export default MovieDisplay