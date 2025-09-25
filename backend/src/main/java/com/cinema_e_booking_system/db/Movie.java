package com.cinema_e_booking_system.db;

import java.util.ArrayList;

import org.springframework.data.annotation.Id;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

@Entity
public class Movie {
    // TODO: Add remaining categories
    public enum MovieCategory {
        SCI_FI, 
        ROMANCE, 
        ACTION
    }

    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String title;
    private MovieCategory movieCategory;
    private ArrayList<String> cast; // TODO: confirm just need name of cast members. If not, change from String to a Cast object 
    private String director; // TODO: confirm singular. if not do same as above
    private String producer; // TODO: confirm singular. if not do same as above
    private String synopsis;
    private ArrayList<Review> reviews;

    public Movie(
        String title, 
        MovieCategory movieCategory, 
        ArrayList<String> cast, 
        String director,
        String producer, 
        String synopsis, 
        ArrayList<Review> reviews) {
            this.title = title;
            this.movieCategory = movieCategory;
            this.cast = cast;
            this.director = director;
            this.producer = producer;
            this.synopsis = synopsis;
            this.reviews = reviews;
    }
}
