function MovieDisplay({title, poster }){
    return(
        <div className="moviecard">
            <img 
                src={poster} 
                alt={`${title} Poster`}
                style={{ width: "200px", height: "300px"}}
            />
            <h2 className="movie-title">{title || "Movie Title"}</h2>
        </div>

    );
}

export default MovieDisplay