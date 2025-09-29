package com.cinema_e_booking_system.db;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

/**
 * The repository for the Movie entity.
 */
public interface MovieRepository extends JpaRepository<Movie, Long> {

    /**
     * The query to find a movie by title.
     */
    Optional<Movie> findByTitle(String title);

    /**
     * The query to find movies by title containing a given string.
     */
    List<Movie> findByTitleContainingIgnoreCase(String q, Sort sort);

    /**
     * The query to find movies by movie category.
     */
    Page<Movie> findByMovieCategory(Movie.MovieCategory movieCategory, Pageable pageable);

    /**
     * The query to check if a movie exists by title.
     */
    boolean existsByTitle(String title);

    /**
     * The query to count the number of movies by MPAA rating.
     */
    long countByMpaaRating(Movie.MPAA_rating mpaaRating);

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
