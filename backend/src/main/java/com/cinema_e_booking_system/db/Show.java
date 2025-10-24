package com.cinema_e_booking_system.db;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.sql.Date;
import java.sql.Time;

@Entity
@Table(name = "show")
public class Show {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    Long id;

    // duration in minutes
    int duration;

    Date date;

    Time startTime;
    Time endTime;

    /**
     * The movie being shown.
     * Many-to-One
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "movie_id") // Foreign Key
    @JsonBackReference("show-movie")
    private Movie movie;

    /**
     * The movie being shown.
     * Many-to-One
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "showroom_id") // Foreign Key
    @JsonBackReference("showroom-show")
    private Showroom showroom;

    public Show(int duration, Date date, Time startTime, Time endTime) {
        this.duration = duration;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public void  setDuration(int duration) {
        this.duration = duration;
    }

    public int getDuration() {
        return duration;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Date getDate() {
        return date;
    }

    public void setStartTime(Time startTime) {
        this.startTime = startTime;
    }

    public Time getStartTime() {
        return startTime;
    }

    public void setEndTime(Time endTime) {
        this.endTime = endTime;
    }
}
