import React, {useEffect, useState} from 'react';
import "../css/Homepage.css";
import Navbar from './Navbar.jsx';
import MovieDisplay from './Movie-Display.jsx';
import '../css/Browse.css';

function Browse() {
    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const genreOptions = ['All', 'ACTION', 'SCI_FI', 'ROMANCE', 'CRIME', 'THRILLER', 'ANIMATION', 'COMEDY'];
    // fetch data
    useEffect(() => {
        const fetchFilteredMovies = async () => {
            setLoading(true);
            setError(null);
            const params = new URLSearchParams();
            params.append('title', searchTerm);
            if (selectedGenre !== 'All'){
                params.append('genre', selectedGenre);
            }
            try {
                const response = await fetch(`http://localhost:8080/search-title?${params.toString()}`);
                if (!response.ok) {
                throw new Error("Failed to fetch movies");
                }
                const data = await response.json();
                setMovies(data.content || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchFilteredMovies();
    }, []);

    const filteredMovies = movies.filter((movie) => {
        const matchesTitle = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGenre = selectedGenre === "All" || movie.movieGenre === selectedGenre;
        return matchesTitle && matchesGenre;
    });

    return (
        <>
            <Navbar />
            <div className="browse-controls">
                <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                >
                {genreOptions.map((genre, idx) => (
                    <option key={idx} value={genre}>
                        {genre === 'All' ? 'All Genres' : genre.replace('_', ' ')}
                    </option>
                ))}
                </select>
            </div>
            <div className="movie-grid">
                {filteredMovies.map((movie) => (
                    <MovieDisplay key={movie.id} movie={movie} />
                ))}
            </div>
        </>
    );
}
export default Browse;