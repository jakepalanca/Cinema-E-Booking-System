package com.cinema_e_booking_system.db;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.sql.Date;
import java.sql.Time;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "show")
public class Show {

    @OneToMany(mappedBy = "show", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("show-tickets")
    private final List<Ticket> tickets = new ArrayList<>();
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    // duration in minutes
    private int duration;
    private Date date;
    private Time startTime;
    private Time endTime;
    /**
     * The movie being shown.
     * Many-to-One
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "movie_id") // Foreign Key
    @JsonBackReference("movie-shows")
    private Movie movie;
    /**
     * The showroom hosting this show.
     * Many-to-One
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "showroom_id") // Foreign Key
    @JsonBackReference("showroom-shows")
    private Showroom showroom;

    protected Show() {
        // JPA requirement
    }

    public Show(int duration, Date date, Time startTime, Time endTime) {
        this.duration = duration;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public Long getId() {
        return id;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Time getStartTime() {
        return startTime;
    }

    public void setStartTime(Time startTime) {
        this.startTime = startTime;
    }

    public Time getEndTime() {
        return endTime;
    }

    public void setEndTime(Time endTime) {
        this.endTime = endTime;
    }

    public Movie getMovie() {
        return movie;
    }

    public void setMovie(Movie movie) {
        this.movie = movie;
    }

    public Showroom getShowroom() {
        return showroom;
    }

    public void setShowroom(Showroom showroom) {
        this.showroom = showroom;
    }

    public List<Ticket> getTickets() {
        return tickets;
    }
}
