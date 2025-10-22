package com.cinema_e_booking_system.db;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.List;

/**
 * Movie entity class for the cinema e-booking system.
 */
@Entity
public class Movie {
    /**
     * The primary key of movie.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    Long id;
    /**
     * The title of the movie.
     */
    String title;
    /**
     * The category of the movie.
     */
    @Enumerated(EnumType.STRING)
    MovieCategory movieCategory;
    /**
     * The cast of the movie.
     */
    @ElementCollection
    List<String> cast;
    /**
     * The director of the movie.
     */
    String director;
    /**
     * The producer of the movie.
     */
    String producer;
    /**
     * The synopsis/description of the movie.
     */
    String synopsis;
    /**
     * The trailer link of the movie.
     */
    String trailerLink;
    /**
     * The poster link of the movie.
     */
    String posterLink;
    /**
     * The reviews of the movie.
     * One-To-Many
     */
    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference("movie-reviews") // NOT Foreign Key
    List<Review> reviews;
    /**
     * The showtimes of the movie.
     * One-To-Many
     */
    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference("movie-showtimes") // NOT Foreign Key
    List<Showtime> showtimes;
    /**
     * The MPAA rating of the movie.
     */
    @Enumerated(EnumType.STRING)
    MPAA_rating mpaaRating;

    /**
     * The constructor for the Movie class.
     */
    public Movie() {
    }

    /**
     * The constructor for the Movie class.
     */
    public Movie(
            String title,
            MovieCategory movieCategory,
            List<String> cast,
            String director,
            String producer,
            String synopsis,
            String trailerLink,
            String posterLink,
            List<Showtime> showtimes,
            List<Review> reviews,
            MPAA_rating mpaaRating
    ) {
        this.title = title;
        this.movieCategory = movieCategory;
        this.cast = cast;
        this.director = director;
        this.producer = producer;
        this.synopsis = synopsis;
        this.trailerLink = trailerLink;
        this.mpaaRating = mpaaRating;
        this.reviews = reviews;
        this.posterLink = posterLink;
        this.showtimes = showtimes;
    }

    /**
     * The getter for the title of the movie.
     */
    public String getTitle() {
        return title;
    }

    /**
     * The setter for the title of the movie.
     */
    public void setTitle(String title) {
        this.title = title;
    }

    /**
     * The getter for the category of the movie.
     */
    public MovieCategory getMovieCategory() {
        return movieCategory;
    }

    /**
     * The setter for the category of the movie.
     */
    public void setMovieCategory(MovieCategory movieCategory) {
        this.movieCategory = movieCategory;
    }


    /**
     * The getter for the cast of the movie.
     */
    public List<String> getCast() {
        return cast;
    }

    /**
     * The setter for the cast of the movie.
     */
    public void setCast(List<String> cast) {
        this.cast = cast;
    }

    /**
     * The getter for the director of the movie.
     */
    public String getDirector() {
        return director;
    }

    /**
     * The setter for the director of the movie.
     */
    public void setDirector(String newDirector) {
        director = newDirector;
    }

    /**
     * The getter for the producer of the movie.
     */
    public String getProducer() {
        return producer;
    }

    /**
     * The setter for the producer of the movie.
     */
    public void setProducer(String newProducer) {
        producer = newProducer;
    }

    /**
     * The getter for the synopsis of the movie.
     */
    public String getSynopsis() {
        return synopsis;
    }

    /**
     * The setter for the synopsis of the movie.
     */
    public void setSynopsis() {
        synopsis = synopsis;
    }

    /**
     * The getter for the trailer link of the movie.
     */
    public String getTrailerLink() {
        return trailerLink;
    }

    /**
     * The setter for the trailer link of the movie.
     */
    public void setTrailerLink(String trailerLink) {
        trailerLink = trailerLink;
    }

    /**
     * The getter for the MPAA rating of the movie.
     */
    public MPAA_rating getMpaaRating() {
        return mpaaRating;
    }

    /**
     * The setter for the MPAA rating of the movie.
     */
    public void setMpaaRating(MPAA_rating newMpaaRating) {
        mpaaRating = newMpaaRating;
    }

    /**
     * The getter for the reviews of the movie.
     */
    public List<Review> getReviews() {
        return reviews;
    }

    /**
     * The setter for the reviews of the movie.
     */
    public void setReviews(List<Review> reviews) {
        this.reviews = reviews;
    }

    /**
     * The getter for the poster link of the movie.
     */
    public String getPosterLink() {
        return posterLink;
    }

    /**
     * The setter for the poster link of the movie.
     */
    public void setPosterLink(String posterLink) {
        this.posterLink = posterLink;
    }

    /**
     * The getter for the showtimes of the movie.
     */
    public List<Showtime> getShowtimes() {
        return showtimes;
    }

    /**
     * The setter for the showtimes of the movie.
     */
    public void setShowtimes(List<Showtime> showtimes) {
        this.showtimes = showtimes;
    }

    /**
     * The getter for the id of the movie.
     */
    public Long getId() {
        return id;
    }

    /**
     * The enum for the category of the movie.
     */
    public enum MovieCategory {
        SCI_FI,
        ROMANCE,
        ACTION,
        COMEDY,
        HORROR,
        DRAMA,
        THRILLER,
        FANTASY,
        ANIMATION,
        CRIME,
        WESTERN
    }

    /**
     * The enum for the MPAA rating of the movie.
     */
    public enum MPAA_rating {
        G,
        PG,
        PG_13,
        R,
        NC_17
    }
}
   

