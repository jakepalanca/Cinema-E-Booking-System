package com.cinema_e_booking_system.db;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

/**
 * The entity for the review.
 */
@Entity
@Table(name = "review")
public class Review {

    /**
     * The id of the review.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The movie of the review.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "movie_id")
    @JsonBackReference("movie-reviews")
    private Movie movie;
    /**
     * The rating of the review.
     */
    private int rating;
    /**
     * The comment of the review.
     */
    private String comment;

    /**
     * The constructor for the review.
     */
    public Review(int i, String s) {
        this.rating = i;
        this.comment = s;
    }

    /**
     * The constructor for the review.
     */
    public Review() {

    }

    /**
     * The getter for the id of the review.
     */
    public Long getId() {
        return id;
    }

    /**
     * The getter for the movie of the review.
     */
    public Movie getMovie() {
        return movie;
    }

    /**
     * The setter for the movie of the review.
     */
    public void setMovie(Movie m) {
        this.movie = m;
    }

    /**
     * The getter for the rating of the review.
     */
    public int getRating() {
        return rating;
    }

    /**
     * The setter for the rating of the review.
     */
    public void setRating(int rating) {
        this.rating = rating;
    }

    /**
     * The getter for the comment of the review.
     */
    public String getComment() {
        return comment;
    }

    /**
     * The setter for the comment of the review.
     */
    public void setComment(String comment) {
        this.comment = comment;
    }
}