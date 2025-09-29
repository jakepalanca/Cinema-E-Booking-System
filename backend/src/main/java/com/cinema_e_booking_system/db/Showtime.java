package com.cinema_e_booking_system.db;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

import java.sql.Date;
import java.sql.Time;

@Entity
@Table(name = "showtimes")
public class Showtime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "movie_id")
    @JsonBackReference("movie-showtimes")
    private Movie movie;

    private Date date;
    private Time time;

    public Showtime(Date date, Time time) {
        this.date = date;
        this.time = time;
    }

    public Showtime() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Movie getMovie() {
        return movie;
    }

    public void setMovie(Movie movie) {
        this.movie = movie;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Time getTime() {
        return time;
    }

    public void setTime(Time time) {
        this.time = time;
    }


}