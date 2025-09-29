package com.cinema_e_booking_system.db;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface MovieRepository extends JpaRepository<Movie, Long> {

    Optional<Movie> findByTitle(String title);

    List<Movie> findByTitleContainingIgnoreCase(String q, Sort sort);

    Page<Movie> findByMovieCategory(Movie.MovieCategory movieCategory, Pageable pageable);

    boolean existsByTitle(String title);

    long countByMpaaRating(Movie.MPAA_rating mpaaRating);

    // Example of sql query
    @Query("""
            select m
            from Movie m
            where lower(m.title) like lower(concat('%', ?1, '%'))
              and (coalesce(?2, m.movieCategory) = m.movieCategory)
            """)

    Page<Movie> searchByTitleAndOptionalMovieCategory(String titlePart, Movie.MovieCategory movieCategory, Pageable pageable);
}
