import { Link } from "react-router-dom";
function MovieDisplay({ title, poster, showtimes }){
    return (
        <div className="moviecard">
            <Link
                to={`/details/${title.replace(/\s+/g, '-').toLowerCase()}`}
                state={{ title, poster, showtimes }}
                style={{ textDecoration: 'none', color: 'inherit' }}
                >
            <img 
                src={poster} 
                alt={`${title} Poster`}
                style={{ width: "200px", height: "300px"}}
            />
            </Link>
            <Link
                to={`/details/${title.replace(/\s+/g, '-').toLowerCase()}`}
                state={{ title, poster, showtimes }}
                style={{ textDecoration: 'none', color: 'inherit' }}
                >
            <h2 className="movie-title">{title || "Movie Title"}</h2>
            </Link>
      
        </div>

    );
}

export default MovieDisplay