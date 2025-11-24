import React, {useState} from "react";
import "../css/ManageMovies.css";
import Navbar from "./Navbar";

function ManageMovies(){
    const [movie, setMovie] = useState({
        title: "",
        director: "",
        producer: "",
        movieGenre: "",
        mpaaRating: "",
        synopsis: "",
        posterLink: "",
        trailerLink: "",
    });
    const [castList, setCastList] = useState([""]);
    const [message, setMessage] = useState("");
    const handleChange = (e) => {
        const { name, value } = e.target;
        setMovie((prev) => ({ ...prev, [name]: value}));
    };
    const handleCastChange = (index,value) => {
        const updated = [...castList];
        updated[index] = value;
        setCastList(updated);
    };
    const addCastField = () => setCastList([...castList, ""]);
    const removeCastField = (index) => {
        const updated = castList.filter((_, i) => i !== index);
        setCastList(updated);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        try{
            const movieRes = await fetch("http://localhost:8080/movies", {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(movie),
            });
            if (!movieRes.ok){
                const err = await movieRes.json();
                throw new Error(err.message || "Failed to add movie");
            }
            const movieData = await movieRes.json();
            for (const cast of castList){
                if(cast.trim() === "") continue;
                await fetch("http://localhost:8080/movie_cast",{
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        Movie_id: movieData.id,
                        cast,
                    }),
                });
            }
            setMessage("Movie added successfully!");
            setMovie({
                title: "",
                director: "",
                producer: "",
                movieGenre: "",
                mpaaRating: "",
                synopsis: "",
                posterLink: "",
                trailerLink: "",
            });
            setCastList([""]);
        } catch (err) {
            console.error(err);
            setMessage("Error adding movie.");
        }
    };
    return (
        <>
            <Navbar/>
            <form className="movie-form" onSubmit={handleSubmit}>
                <input name="title" value={movie.title} onChange={handleChange} placeholder="Title" required />
                <input name="director" value={movie.director} onChange={handleChange} placeholder="Director" required />
                <input name="producer" value={movie.producer} onChange={handleChange} placeholder="Producer" required />
                <input name="movieGenre" value={movie.movieGenre} onChange={handleChange} placeholder="Genre" required />
                <input name="mpaaRating" value={movie.mpaaRating} onChange={handleChange} placeholder="MPAA Rating" required />
                <input name="posterLink" value={movie.posterLink} onChange={handleChange} placeholder="Poster Link URL" />
                <input name="trailerLink" value={movie.trailerLink} onChange={handleChange} placeholder="Trailer Link URL" />
                <textarea name="synopsis" value={movie.synopsis} onChange={handleChange} placeholder="Synopsis" required />
                <h3>Cast</h3>
                {castList.map((cast, index) => (
                    <div key={index} className="cast-field">
                        <input
                            value={cast}
                            onChange={(e) => handleCastChange(index, e.target.value)}
                            placeholder={`Cast member #${index +1}`}
                            required={index === 0}
                        />
                        {index > 0 && (
                            <button type="button" onClick={() => removeCastField(index)}>
                                Remove
                            </button>
                        )}
                    </div>
                ))}
                <button type="button" onClick={addCastField}>
                    Add Cast Member
                </button>
                <button type="submit" className="add-movie-button">
                    Add Movie
                </button>
                {message && <p className="info-message">{message}</p>}
            </form>
        </>
    );
}
export default ManageMovies;
