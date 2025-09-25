package com.cinema_e_booking_system.db;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "review")
public class Review {

  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "movie_id")
  private Movie movie;
  private int rating;
  private String comment;
  public void setMovie(Movie m) {
        this.movie = m;
    }
  public void setRating(int rating) {
    this.rating = rating;
  }
  public void setComment(String comment) {
    this.comment = comment;
  }
}