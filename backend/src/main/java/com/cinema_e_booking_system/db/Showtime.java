package com.cinema_e_booking_system.db;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.sql.Date;
import java.sql.Time;

/**
 * The entity for the showtime.
 */
@Entity
@Table(name = "showtimes")
public class Showtime {

    /**
     * The primary key of the showtime.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The movie of the showtime.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "movie_id") // Foreign Key
    @JsonBackReference("movie-showtimes")
    private Movie movie;

    /**
     * The date of the showtime.
     */
    private Date date;

    /**
     * The time of the showtime.
     */
    private Time time;

    /**
     * The constructor for the showtime.
     */
    public Showtime(Date date, Time time) {
        this.date = date;
        this.time = time;
    }

    /**
     * The constructor for the showtime.
     */
    public Showtime() {
    }

    /**
     * The getter for the id of the showtime.
     */
    public Long getId() {
        return id;
    }

    /**
     * The setter for the id of the showtime.
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * The getter for the movie of the showtime.
     */
    public Movie getMovie() {
        return movie;
    }

    /**
     * The setter for the movie of the showtime.
     */
    public void setMovie(Movie movie) {
        this.movie = movie;
    }

    /**
     * The getter for the date of the showtime.
     */
    public Date getDate() {
        return date;
    }

    /**
     * The setter for the date of the showtime.
     */
    public void setDate(Date date) {
        this.date = date;
    }

    /**
     * The getter for the time of the showtime.
     */
    public Time getTime() {
        return time;
    }

    /**
     * The setter for the time of the showtime.
     */
    public void setTime(Time time) {
        this.time = time;
    }
}