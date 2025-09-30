package com.cinema_e_booking_system.db;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/**
 * The repository for the Movie entity.
 */
public interface MovieRepository extends JpaRepository<Movie, Long> {

    /**
     * The query to find movies by movie category.
     */
    Page<Movie> findByMovieCategory(Movie.MovieCategory movieCategory, Pageable pageable);

    /**
     * The query to search for a movie by title and optional movie category.
     */
    @Query("""
            select m
            from Movie m
            where lower(m.title) like lower(concat('%', ?1, '%'))
              and (coalesce(?2, m.movieCategory) = m.movieCategory)
            """)
    Page<Movie> searchByTitleAndOptionalMovieCategory(String titlePart, Movie.MovieCategory movieCategory, Pageable pageable);
}
