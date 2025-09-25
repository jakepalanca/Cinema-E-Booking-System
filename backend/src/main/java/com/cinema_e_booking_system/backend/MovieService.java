package com.cinema_e_booking_system.backend;

import com.cinema_e_booking_system.db.*;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MovieService {
  private final MovieRepository repo;

  @Transactional
  public Movie create(Movie b) { return repo.save(b); }        // C/U

  public java.util.Optional<Movie> get(Long id) { return repo.findById(id); } // R

  @Transactional
  public void delete(Long id) { repo.deleteById(id); }       // D

  public java.util.List<Movie> listSorted() {
    return repo.findAll(Sort.by("title").ascending());       // sorting
  }

  public Page<Movie> page(int page, int size) {
    return repo.findAll(PageRequest.of(page, size, Sort.by("title"))); // paging
  }

  private final ReviewRepository reviewRepo;
  public MovieService(MovieRepository repo, ReviewRepository reviewRepo) {
    this.repo = repo;
    this.reviewRepo = reviewRepo;
  }

  @Transactional
  public Review addReview(long movieId, int rating, String comment) {
    Movie m = repo.findById(movieId).orElseThrow();
    Review r = new Review();
    r.setMovie(m);
    r.setRating(rating);
    r.setComment(comment);
    return reviewRepo.save(r);
  }
}
