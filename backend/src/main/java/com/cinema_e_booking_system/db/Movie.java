package com.cinema_e_booking_system.db;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.List;

@Entity
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    Long id;
    String title;
    @Enumerated(EnumType.STRING)
    MovieCategory movieCategory;
    @ElementCollection
    List<String> cast; // TODO: confirm just need name of cast members. If not, change from String to a Cast object
    String director;
    String producer; // TODO: confirm singular
    String synopsis;
    String trailerLink;
    String posterLink;
    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference("movie-reviews")
    List<Review> reviews;
    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference("movie-showtimes")
    List<Showtime> showtimes;
    @Enumerated(EnumType.STRING)
    MPAA_rating mpaaRating;

    public Movie() {
    }

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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public MovieCategory getMovieCategory() {
        return movieCategory;
    }

    public void setMovieCategory(MovieCategory movieCategory) {
        this.movieCategory = movieCategory;
    }

    public List<String> getCast() {
        return cast;
    }

    public void setCast(List<String> cast) {
        this.cast = cast;
    }

    public String getDirector() {
        return director;
    }

    public void setDirector(String newDirector) {
        director = newDirector;
    }

    public String getProducer() {
        return producer;
    }

    public void setProducer(String newProducer) {
        producer = newProducer;
    }

    public String getSynopsis() {
        return synopsis;
    }

    public void setSynopsis() {
        synopsis = synopsis;
    }

    public String getTrailerLink() {
        return trailerLink;
    }

    public void setTrailerLink(String trailerLink) {
        trailerLink = trailerLink;
    }

    public MPAA_rating getMpaaRating() {
        return mpaaRating;
    }

    public void setMpaaRating(MPAA_rating newMpaaRating) {
        mpaaRating = newMpaaRating;
    }

    public List<Review> getReviews() {
        return reviews;
    }

    public void setReviews(List<Review> reviews) {
        this.reviews = reviews;
    }

    public String getPosterLink() {
        return posterLink;
    }

    public void setPosterLink(String posterLink) {
        this.posterLink = posterLink;
    }

    public List<Showtime> getShowtimes() {
        return showtimes;
    }

    public void setShowtimes(List<Showtime> showtimes) {
        this.showtimes = showtimes;
    }

    public Long getId() {
        return id;
    }

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

    public enum MPAA_rating {
        G,
        PG,
        PG_13,
        R,
        NC_17
    }
}
   

