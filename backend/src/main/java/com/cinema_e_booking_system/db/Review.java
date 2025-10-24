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
     * The primary key of the review.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The movie of the review.
     * Many-to-One
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "movie_id") // Foreign Key
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

    protected Review() {
        // JPA requirement
    }

    public Review(int rating, String comment) {
        this.rating = rating;
        this.comment = comment;
    }

    /**
     * The constructor for a review without a comment.
     */
    public Review(int rating) {
        this.rating = rating;
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
