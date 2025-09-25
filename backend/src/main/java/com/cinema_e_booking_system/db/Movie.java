package com.cinema_e_booking_system.db;

import java.util.List;

import jakarta.persistence.*;

@Entity
public class Movie {
    // TODO: Add remaining categories
    public enum MovieCategory {
        SCI_FI, 
        ROMANCE, 
        ACTION
    }

    public enum MPAA_rating {
        G,
        PG,
        PG_13,
        R,
        NC_17
    }

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
    }

    public String getTitle() {
          return title;
    }

    public String setTitle(String newTitle) {
          return title = newTitle;
    }
}
   

