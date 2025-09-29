package com.cinema_e_booking_system.backend;

import com.cinema_e_booking_system.db.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MovieService {
    private final MovieRepository repo;
    private final ReviewRepository reviewRepo;
    private final ShowtimeRepository showtimeRepository;

    public MovieService(MovieRepository repo, ReviewRepository reviewRepo, ShowtimeRepository showtimeRepository) {
        this.repo = repo;
        this.reviewRepo = reviewRepo;
        this.showtimeRepository = showtimeRepository;
    }

    @Transactional
    public Movie create(Movie b) {
        return repo.save(b);
    }

    public java.util.Optional<Movie> get(Long id) {
        return repo.findById(id);
    }

    @Transactional
    public void delete(Long id) {
        repo.deleteById(id);
    }

    public Page<Movie> listSorted(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("title").ascending());
        return repo.findAll(pageable);
    }

    public Page<Movie> page(int page, int size) {
        return repo.findAll(PageRequest.of(page, size, Sort.by("title")));
    }

    @Transactional
    public Review addReview(long movieId, Review review) {
        Movie movie = repo.findById(movieId).orElseThrow();
        review.setMovie(movie);
        return reviewRepo.save(review);
    }

    @Transactional
    public Showtime addShowtime(long movieId, Showtime showtime) {
        Movie movie = repo.findById(movieId).orElseThrow();
        showtime.setMovie(movie);
        return showtimeRepository.save(showtime);
    }
}
