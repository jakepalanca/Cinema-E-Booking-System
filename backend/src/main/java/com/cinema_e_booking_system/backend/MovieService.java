package com.cinema_e_booking_system.backend;

import com.cinema_e_booking_system.db.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * The service for the movie.
 */
@Service
public class MovieService {
    /**
     * The repository for the movie.
     */
    private final MovieRepository repo;
    /**
     * The repository for the review.
     */
    private final ReviewRepository reviewRepo;
    /**
     * The repository for the showtime.
     */
    private final ShowtimeRepository showtimeRepository;

    /**
     * The constructor for the movie service.
     */
    public MovieService(MovieRepository repo, ReviewRepository reviewRepo, ShowtimeRepository showtimeRepository) {
        this.repo = repo;
        this.reviewRepo = reviewRepo;
        this.showtimeRepository = showtimeRepository;
    }

    /**
     * The method to create a movie.
     */
    @Transactional
    public Movie create(Movie b) {
        return repo.save(b);
    }

    /**
     * The method to get a movie.
     */
    public Optional<Movie> get(Long id) {
        return repo.findById(id);
    }

    /**
     * The method to delete a movie.
     */
    @Transactional
    public void delete(Long id) {
        repo.deleteById(id);
    }

    /**
     * The method to list sorted movies.
     */
    public Page<Movie> listSorted(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("title").ascending());
        return repo.findAll(pageable);
    }

    /**
     * The method to page movies.
     */
    public Page<Movie> page(int page, int size) {
        return repo.findAll(PageRequest.of(page, size, Sort.by("title")));
    }

    /**
     * The method to add a review to a movie.
     */
    @Transactional
    public Review addReview(long movieId, Review review) {
        Movie movie = repo.findById(movieId).orElseThrow();
        review.setMovie(movie);
        return reviewRepo.save(review);
    }

    /**
     * The method to add a showtime to a movie.
     */
    @Transactional
    public Showtime addShowtime(long movieId, Showtime showtime) {
        Movie movie = repo.findById(movieId).orElseThrow();
        showtime.setMovie(movie);
        return showtimeRepository.save(showtime);
    }
}
