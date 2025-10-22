package com.cinema_e_booking_system.backend;

import com.cinema_e_booking_system.db.Movie;
import com.cinema_e_booking_system.db.MovieRepository;
import com.cinema_e_booking_system.db.Review;
import com.cinema_e_booking_system.db.Showtime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Date;
import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

/**
 * The controller for the web.
 */
@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class WebController {

    /**
     * Movie repository object.
     */
    @Autowired
    MovieRepository movieRepository;

    /**
     * Movie service object.
     */
    @Autowired
    MovieService movieService;

    /**
     * The endpoint to check if the backend is healthy.
     */
    @GetMapping("/health")
    public int getHealth() {
        return 200;
    }

    /**
     * The endpoint to filter movies by genre.
     */
    @GetMapping("/by-genre")
    public Page<Movie> filterByGenre(@RequestParam(name = "genre") Movie.MovieCategory genre) {
        return movieRepository.findByMovieCategory(Movie.MovieCategory.valueOf(genre.toString()), Pageable.unpaged());
    }

    /**
     * The endpoint to return all movies.
     */
    @GetMapping("/return-all")
    public Page<Movie> returnAll() {
        return movieService.listSorted(0, 10);
    }

    /**
     * The endpoint to search for movies by title.
     */
    @GetMapping("/search-title")
    public Page<Movie> searchByTitle(
            @RequestParam(name = "title") String title,
            @RequestParam(name = "genre", required = false) Movie.MovieCategory genre,
            Pageable pageable) {
        String titlePart = (title == null) ? "" : title;

        return movieRepository.searchByTitleAndOptionalMovieCategory(
                titlePart,
                genre,
                pageable
        );
    }

    // *** BELOW THIS LINE IS FOR TESTING AND DEVELOPMENT ONLY. ***

    /**
     * The endpoint to initialize the database.
     */
    @GetMapping("/initialize-db")
    public void initializeDb() {
        Date today = Date.valueOf(LocalDate.now());
        Date tomorrow = Date.valueOf(LocalDate.now().plusDays(1));
        Date dayAfterTomorrow = Date.valueOf(LocalDate.now().plusDays(2));

        Time afternoon = Time.valueOf(LocalTime.of(11, 0));
        Time night = Time.valueOf(LocalTime.of(13, 0));
        Time lateNight = Time.valueOf(LocalTime.of(14, 0));

        List<Movie> seed = List.of(
                new Movie(
                        "Interstellar",
                        Movie.MovieCategory.SCI_FI,
                        java.util.List.of("Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"),
                        "Christopher Nolan",
                        "Emma Thomas",
                        "Explorers venture through a wormhole to save humanity.",
                        "https://youtu.be/zSWdZVtXT7E",
                        "https://cdn.cinematerial.com/p/297x/ctpnz4mq/interstellar-movie-poster-md.jpg?v=1456424450",
                        new java.util.ArrayList<>(), new java.util.ArrayList<>(), Movie.MPAA_rating.PG_13
                ),
                new Movie(
                        "Inception",
                        Movie.MovieCategory.SCI_FI,
                        java.util.List.of("Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"),
                        "Christopher Nolan",
                        "Emma Thomas",
                        "A thief who invades dreams is offered a clean slate.",
                        "https://youtu.be/YoHD9XEInc0",
                        "https://www.movieposters.com/cdn/shop/products/20664117398ad7301d9a9af6d2e5aa5c_1e3ea98b-b962-4982-9f74-2e44381fc6ff_1024x1024.jpg?v=1573618694",
                        new java.util.ArrayList<>(), new java.util.ArrayList<>(), Movie.MPAA_rating.PG_13
                ),
                new Movie(
                        "The Dark Knight",
                        Movie.MovieCategory.ACTION,
                        java.util.List.of("Christian Bale", "Heath Ledger", "Aaron Eckhart"),
                        "Christopher Nolan",
                        "Emma Thomas",
                        "Batman faces the Joker’s reign of chaos in Gotham.",
                        "https://youtu.be/EXeTwQWrcwY",
                        "https://i.ebayimg.com/images/g/CEEAAOSw9NdXr8OJ/s-l1200.jpg",
                        new java.util.ArrayList<>(), new java.util.ArrayList<>(), Movie.MPAA_rating.PG_13
                ),
                new Movie(
                        "Parasite",
                        Movie.MovieCategory.THRILLER,
                        java.util.List.of("Song Kang-ho", "Lee Sun-kyun", "Cho Yeo-jeong"),
                        "Bong Joon-ho",
                        "Kwak Sin-ae",
                        "A poor family infiltrates a wealthy household.",
                        "https://youtu.be/SEUXfv87Wpk",
                        "https://m.media-amazon.com/images/I/91KArYP03YL._AC_SL1500_.jpg",
                        new java.util.ArrayList<>(), new java.util.ArrayList<>(), Movie.MPAA_rating.R
                ),
                new Movie(
                        "Toy Story",
                        Movie.MovieCategory.ANIMATION,
                        java.util.List.of("Tom Hanks", "Tim Allen", "Annie Potts"),
                        "John Lasseter",
                        "Bonnie Arnold",
                        "Woody and Buzz learn to work together.",
                        "https://youtu.be/v-PjgYDrg70",
                        "https://m.media-amazon.com/images/I/71aBLaC4TzL.jpg",
                        new java.util.ArrayList<>(), new java.util.ArrayList<>(), Movie.MPAA_rating.G
                ),
                new Movie(
                        "Titanic",
                        Movie.MovieCategory.ROMANCE,
                        java.util.List.of("Leonardo DiCaprio", "Kate Winslet", "Billy Zane"),
                        "James Cameron",
                        "James Cameron",
                        "A love story aboard the ill-fated RMS Titanic.",
                        "https://youtu.be/kVrqfYjkTdQ",
                        "https://m.media-amazon.com/images/I/811lT7khIrL._UF894,1000_QL80_.jpg",
                        new java.util.ArrayList<>(), new java.util.ArrayList<>(), Movie.MPAA_rating.PG_13
                ),
                new Movie(
                        "The Matrix",
                        Movie.MovieCategory.SCI_FI,
                        java.util.List.of("Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"),
                        "Lana Wachowski, Lilly Wachowski",
                        "Joel Silver",
                        "A hacker discovers reality is a simulation.",
                        "https://youtu.be/vKQi3bBA1y8",
                        "https://m.media-amazon.com/images/I/71PfZFFz9yL._UF894,1000_QL80_.jpg",
                        new java.util.ArrayList<>(), new java.util.ArrayList<>(), Movie.MPAA_rating.R
                ),
                new Movie(
                        "Spirited Away",
                        Movie.MovieCategory.ANIMATION,
                        java.util.List.of("Rumi Hiiragi", "Miyu Irino", "Mari Natsuki"),
                        "Hayao Miyazaki",
                        "Toshio Suzuki",
                        "A girl must free her parents in a spirit world.",
                        "https://youtu.be/ByXuk9QqQkk",
                        "https://m.media-amazon.com/images/M/MV5BNTEyNmEwOWUtYzkyOC00ZTQ4LTllZmUtMjk0Y2YwOGUzYjRiXkEyXkFqcGc@._V1_.jpg",
                        new java.util.ArrayList<>(), new java.util.ArrayList<>(), Movie.MPAA_rating.PG
                ),
                new Movie(
                        "Notice to Quit",
                        Movie.MovieCategory.COMEDY,
                        java.util.List.of("Fake casts"),
                        "Dummy Directors",
                        "Dummy Producers",
                        "Andy Singer, an out-of-work actor now struggling as a New York City realtor, finds his world crashing down around him when his estranged 10-year-old daughter, Anna, shows up unannounced on his doorstep in the middle of his eviction.",
                        "https://youtu.be/ByXuk9QqQkk",
                        "https://m.media-amazon.com/images/M/MV5BODA2MDI2YzUtNzFkZS00MTQyLTg2YmQtZTBhMTk4ODRkMGU0XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
                        new java.util.ArrayList<>(), new java.util.ArrayList<>(), Movie.MPAA_rating.PG_13
                ),
                new Movie(
                        "Black Panther",
                        Movie.MovieCategory.ACTION,
                        java.util.List.of("Chadwick Boseman", "Michael B. Jordan", "Lupita Nyong'o"),
                        "Ryan Coogler",
                        "Kevin Feige",
                        "T’Challa returns to Wakanda to claim the throne.",
                        "https://youtu.be/xjDjIWPwcPU",
                        "https://m.media-amazon.com/images/M/MV5BMTg1MTY2MjYzNV5BMl5BanBnXkFtZTgwMTc4NTMwNDI@._V1_.jpg",
                        new java.util.ArrayList<>(), new java.util.ArrayList<>(), Movie.MPAA_rating.PG_13
                )
        );

        for (Movie m : seed) {
            Movie saved = movieService.create(m);
            Long movieId = saved.getId();

            // Only creates showtime for half of the test data
            if (seed.indexOf(m) % 2 == 1) {
                Showtime s1 = new Showtime(today, lateNight);
                Showtime s2 = new Showtime(tomorrow, afternoon);
                Showtime s3 = new Showtime(dayAfterTomorrow, night);

                movieService.addShowtime(movieId, s1);
                movieService.addShowtime(movieId, s2);
                movieService.addShowtime(movieId, s3);
            }

            Review r1 = new Review(5, "Amazing. Visuals & score are top tier.");
            Review r2 = new Review(4, "Great pacing and performances.");
            movieService.addReview(movieId, r1);
            movieService.addReview(movieId, r2);
        }
    }

    /**
     * The endpoint to clear the database.
     */
    @GetMapping("/clear-db")
    public void clearDb() {
        movieRepository.deleteAll();
    }
}
