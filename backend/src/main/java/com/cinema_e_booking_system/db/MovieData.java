package com.cinema_e_booking_system.db;

import java.util.List;

public class MovieData {
  private List<Movie> nowShowing;
  private List<Movie> upcoming;

  public MovieData(List<Movie> nowShowing, List<Movie> upcoming) {
    this.nowShowing = nowShowing;
    this.upcoming = upcoming;
  }

  public List<Movie> getNowShowing() { return nowShowing; }
  public void setNowShowing(List<Movie> nowShowing) { this.nowShowing = nowShowing; }
  public List<Movie> getUpcoming() { return upcoming; }
  public void setUpcoming(List<Movie> upcoming) { this.upcoming = upcoming; }
}
