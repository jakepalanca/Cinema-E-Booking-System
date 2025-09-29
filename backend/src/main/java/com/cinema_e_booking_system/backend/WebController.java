package com.cinema_e_booking_system.backend;

import com.cinema_e_booking_system.db.Movie;
import com.cinema_e_booking_system.db.MovieRepository;
import com.cinema_e_booking_system.db.Review;
import com.cinema_e_booking_system.db.Showtime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Date;
import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;

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
        //Page<Movie> results = movieService.listSorted() return results
        return results;
    }

  @GetMapping("/returnAll")
  public java.util.List<Movie> returnAll() {
      return movieService.listSorted();
  }

  @GetMapping("/movies")
  public java.util.List<Movie> movies() {
    java.util.List<Movie> nowShowing = java.util.Arrays.asList(
      new Movie(
        "Inception",
        Movie.MovieCategory.SCI_FI,
        java.util.List.of("Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"),
        "Christopher Nolan",
        "Emma Thomas",
        "A thief who invades dreams is offered a clean slate.",
        "https://youtu.be/YoHD9XEInc0",
        "https://m.media-amazon.com/images/I/51nbVEuw1HL._AC_.jpg",
        new java.util.ArrayList<>(), new java.util.ArrayList<>(), Movie.MPAA_rating.PG_13
      ),
      new Movie(
        "Titanic",
        Movie.MovieCategory.ROMANCE,
        java.util.List.of("Leonardo DiCaprio", "Kate Winslet", "Billy Zane"),
        "James Cameron",
        "James Cameron",
        "A love story aboard the ill-fated RMS Titanic.",
        "https://youtu.be/kVrqfYjkTdQ",
        "https://m.media-amazon.com/images/I/71d7n5v1iSL._AC_SY679_.jpg",
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
        "https://m.media-amazon.com/images/I/51vpnbwFHrL._AC_.jpg",
        new java.util.ArrayList<>(), new java.util.ArrayList<>(), Movie.MPAA_rating.R
      )
    );
    for (Movie movie : nowShowing) {
      Movie created = movieService.create(movie);
    }
    return nowShowing;
  }

    @GetMapping("/initialize-db")
    public void initializeDb() {
        int moviesCreated = 0, showtimesCreated = 0, reviewsCreated = 0;

        // tiny helpers
        Date today = Date.valueOf(LocalDate.now());
        Date tomorrow = Date.valueOf(LocalDate.now().plusDays(1));
        Date dayAfterTomorrow = Date.valueOf(LocalDate.now().plusDays(2));

        Time afternoon = Time.valueOf(LocalTime.of(11, 0));
        Time night = Time.valueOf(LocalTime.of(13, 0));
        Time lateNight = Time.valueOf(LocalTime.of(14, 0));

        java.util.List<Movie> seed = java.util.List.of(
                new Movie(
                        "Interstellar",
                        Movie.MovieCategory.SCI_FI,
                        java.util.List.of("Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"),
                        "Christopher Nolan",
                        "Emma Thomas",
                        "Explorers venture through a wormhole to save humanity.",
                        "https://youtu.be/zSWdZVtXT7E",
                        "https://m.media-amazon.com/images/I/81F9ZQk2lXL._AC_SY679_.jpg",
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
                        "https://m.media-amazon.com/images/I/51nbVEuw1HL._AC_.jpg",
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
                        "https://m.media-amazon.com/images/I/71pox3P3v+L._AC_SY679_.jpg",
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
                        "https://m.media-amazon.com/images/I/81HyW8pXGmL._AC_SL1500_.jpg",
                        new java.util.ArrayList<>(), new java.util.ArrayList<>(), Movie.MPAA_rating.R
                ),
                new Movie(
                        "The Godfather",
                        Movie.MovieCategory.CRIME,
                        java.util.List.of("Marlon Brando", "Al Pacino", "James Caan"),
                        "Francis Ford Coppola",
                        "Albert S. Ruddy",
                        "The Corleone family navigates power, loyalty, and betrayal.",
                        "https://youtu.be/sY1S34973zA",
                        "https://m.media-amazon.com/images/I/51rOnIjLqzL._AC_.jpg",
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
                        "https://m.media-amazon.com/images/I/81aA7hEEykL._AC_SL1500_.jpg",
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
                        "https://m.media-amazon.com/images/I/71d7n5v1iSL._AC_SY679_.jpg",
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
                        "https://m.media-amazon.com/images/I/51vpnbwFHrL._AC_.jpg",
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
                        "https://m.media-amazon.com/images/I/81oZKQWb2LL._AC_SL1500_.jpg",
                        new java.util.ArrayList<>(), new java.util.ArrayList<>(), Movie.MPAA_rating.PG
                ),
                new Movie(
                        "Black Panther",
                        Movie.MovieCategory.ACTION,
                        java.util.List.of("Chadwick Boseman", "Michael B. Jordan", "Lupita Nyong'o"),
                        "Ryan Coogler",
                        "Kevin Feige",
                        "T’Challa returns to Wakanda to claim the throne.",
                        "https://youtu.be/xjDjIWPwcPU",
                        "https://m.media-amazon.com/images/I/81LZ8q9QW-L._AC_SL1500_.jpg",
                        new java.util.ArrayList<>(), new java.util.ArrayList<>(), Movie.MPAA_rating.PG_13
                )
        );

        for (Movie m : seed) {
            // 1) Persist movie to get ID (owner id)
            Movie saved = movieService.create(m);
            Long movieId = saved.getId();
            moviesCreated++;

            // 2) Create showtimes (after movie exists)
            Showtime s1 = new Showtime(today, lateNight);
            Showtime s2 = new Showtime(tomorrow, afternoon);
            Showtime s3 = new Showtime(dayAfterTomorrow, night);

            movieService.addShowtime(movieId, s1);
            movieService.addShowtime(movieId, s2);
            showtimesCreated += 2;

            // 3) Create reviews (after movie exists)
            Review r1 = new Review(5, "Amazing. Visuals & score are top tier.");
            Review r2 = new Review(4, "Great pacing and performances.");
            movieService.addReview(movieId, r1);
            movieService.addReview(movieId, r2);
            reviewsCreated += 2;
        }
    }


    @GetMapping("/clear-db")
    public void clearDb() {
        movieRepository.deleteAll();
    }
}
