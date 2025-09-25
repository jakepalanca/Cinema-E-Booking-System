package com.cinema_e_booking_system.backend;

import com.cinema_e_booking_system.db.Movie;
import com.cinema_e_booking_system.db.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class WebController {

    @Autowired
    MovieRepository movieRepository;
    @Autowired
    MovieService movieService;

	@GetMapping("/health")
	public int getHealth() {
		return 200;
	}

    @GetMapping("/filter")
    public Page<Movie> filterByGenre(@RequestParam(name = "genre", required = true) Movie.MovieCategory genre) {

        Page<Movie> results = movieRepository.findByMovieCategory(Movie.MovieCategory.valueOf(genre.toString()), Pageable.unpaged());

        return results;
    }
}
