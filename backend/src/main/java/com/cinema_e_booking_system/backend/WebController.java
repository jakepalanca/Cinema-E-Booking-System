package com.cinema_e_booking_system.backend;

import com.cinema_e_booking_system.db.*;
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
import java.util.ArrayList;
import java.util.Arrays;
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

    @Autowired
    ShowRepository showRepository;

    @Autowired
    CinemaRepository cinemaRepository;

    @Autowired
    TheaterRepository theaterRepository;

    @Autowired
    ShowroomRepository showroomRepository;

    @Autowired
    TicketCategoryRepository ticketCategoryRepository;

    @Autowired
    TicketRepository ticketRepository;

    @Autowired
    BookingRepository bookingRepository;

    @Autowired
    CustomerRepository customerRepository;

    @Autowired
    PromotionRepository promotionRepository;

    @Autowired
    PaymentMethodRepository paymentMethodRepository;

    @Autowired
    AdminRepository adminRepository;

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
    public Page<Movie> filterByGenre(@RequestParam(name = "genre") Movie.Genre genre) {
        return movieRepository.findByMovieGenre(genre, Pageable.unpaged());
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
            @RequestParam(name = "genre", required = false) Movie.Genre genre,
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
        clearAllData();

        Date today = Date.valueOf(LocalDate.now());
        Date tomorrow = Date.valueOf(LocalDate.now().plusDays(1));
        Date weekend = Date.valueOf(LocalDate.now().plusDays(2));

        Time matinee = Time.valueOf(LocalTime.of(12, 0));
        Time evening = Time.valueOf(LocalTime.of(18, 30));
        Time lateShow = Time.valueOf(LocalTime.of(21, 30));

        Cinema downtown = cinemaRepository.save(new Cinema("Downtown Cinema"));
        Cinema uptown = cinemaRepository.save(new Cinema("Uptown Screens"));

        Theater auditoriumOne = theaterRepository.save(new Theater(downtown, "Auditorium 1", "123 Main Street"));
        Theater auditoriumTwo = theaterRepository.save(new Theater(downtown, "Auditorium 2", "123 Main Street"));
        Theater premiereHall = theaterRepository.save(new Theater(uptown, "Premiere Hall", "456 High Street"));

        Showroom showroomA = showroomRepository.save(new Showroom(auditoriumOne, 8, 10));
        Showroom showroomB = showroomRepository.save(new Showroom(auditoriumTwo, 10, 12));
        Showroom showroomC = showroomRepository.save(new Showroom(premiereHall, 12, 14));

        TicketCategory adultCategory = ticketCategoryRepository.save(new TicketCategory("Adult", 15.00));
        TicketCategory childCategory = ticketCategoryRepository.save(new TicketCategory("Child", 9.50));
        TicketCategory seniorCategory = ticketCategoryRepository.save(new TicketCategory("Senior", 11.00));

        Promotion welcomePromo = promotionRepository.save(new Promotion("WELCOME10", 0.10));
        Promotion loyaltyPromo = promotionRepository.save(new Promotion("LOYAL15", 0.15));

        adminRepository.save(new Admin("admin@cinemae.com", "sysadmin", "System", "Admin", "admin123"));

        List<Movie> seedMovies = Arrays.asList(
                new Movie(
                        "Interstellar",
                        Movie.Genre.SCI_FI,
                        List.of("Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"),
                        "Christopher Nolan",
                        "Emma Thomas",
                        "Explorers venture through a wormhole to save humanity.",
                        "https://youtu.be/zSWdZVtXT7E",
                        "https://cdn.cinematerial.com/p/297x/ctpnz4mq/interstellar-movie-poster-md.jpg?v=1456424450",
                        new ArrayList<>(), new ArrayList<>(), Movie.MPAA_Rating.PG_13
                ),
                new Movie(
                        "Inception",
                        Movie.Genre.SCI_FI,
                        List.of("Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"),
                        "Christopher Nolan",
                        "Emma Thomas",
                        "A thief who invades dreams is offered a clean slate.",
                        "https://youtu.be/YoHD9XEInc0",
                        "https://www.movieposters.com/cdn/shop/products/20664117398ad7301d9a9af6d2e5aa5c_1e3ea98b-b962-4982-9f74-2e44381fc6ff_1024x1024.jpg?v=1573618694",
                        new ArrayList<>(), new ArrayList<>(), Movie.MPAA_Rating.PG_13
                ),
                new Movie(
                        "The Dark Knight",
                        Movie.Genre.ACTION,
                        List.of("Christian Bale", "Heath Ledger", "Aaron Eckhart"),
                        "Christopher Nolan",
                        "Emma Thomas",
                        "Batman faces the Joker’s reign of chaos in Gotham.",
                        "https://youtu.be/EXeTwQWrcwY",
                        "https://i.ebayimg.com/images/g/CEEAAOSw9NdXr8OJ/s-l1200.jpg",
                        new ArrayList<>(), new ArrayList<>(), Movie.MPAA_Rating.PG_13
                ),
                new Movie(
                        "Parasite",
                        Movie.Genre.THRILLER,
                        List.of("Song Kang-ho", "Lee Sun-kyun", "Cho Yeo-jeong"),
                        "Bong Joon-ho",
                        "Kwak Sin-ae",
                        "A poor family infiltrates a wealthy household.",
                        "https://youtu.be/SEUXfv87Wpk",
                        "https://m.media-amazon.com/images/I/91KArYP03YL._AC_SL1500_.jpg",
                        new ArrayList<>(), new ArrayList<>(), Movie.MPAA_Rating.R
                ),
                new Movie(
                        "Toy Story",
                        Movie.Genre.ANIMATION,
                        List.of("Tom Hanks", "Tim Allen", "Annie Potts"),
                        "John Lasseter",
                        "Bonnie Arnold",
                        "Woody and Buzz learn to work together.",
                        "https://youtu.be/v-PjgYDrg70",
                        "https://m.media-amazon.com/images/I/71aBLaC4TzL.jpg",
                        new ArrayList<>(), new ArrayList<>(), Movie.MPAA_Rating.G
                ),
                new Movie(
                        "Titanic",
                        Movie.Genre.ROMANCE,
                        List.of("Leonardo DiCaprio", "Kate Winslet", "Billy Zane"),
                        "James Cameron",
                        "James Cameron",
                        "A love story aboard the ill-fated RMS Titanic.",
                        "https://youtu.be/kVrqfYjkTdQ",
                        "https://m.media-amazon.com/images/I/811lT7khIrL._UF894,1000_QL80_.jpg",
                        new ArrayList<>(), new ArrayList<>(), Movie.MPAA_Rating.PG_13
                ),
                new Movie(
                        "The Matrix",
                        Movie.Genre.SCI_FI,
                        List.of("Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"),
                        "Lana Wachowski, Lilly Wachowski",
                        "Joel Silver",
                        "A hacker discovers reality is a simulation.",
                        "https://youtu.be/vKQi3bBA1y8",
                        "https://m.media-amazon.com/images/I/71PfZFFz9yL._UF894,1000_QL80_.jpg",
                        new ArrayList<>(), new ArrayList<>(), Movie.MPAA_Rating.R
                ),
                new Movie(
                        "Spirited Away",
                        Movie.Genre.ANIMATION,
                        List.of("Rumi Hiiragi", "Miyu Irino", "Mari Natsuki"),
                        "Hayao Miyazaki",
                        "Toshio Suzuki",
                        "A girl must free her parents in a spirit world.",
                        "https://youtu.be/ByXuk9QqQkk",
                        "https://m.media-amazon.com/images/M/MV5BNTEyNmEwOWUtYzkyOC00ZTQ4LTllZmUtMjk0Y2YwOGUzYjRiXkEyXkFqcGc@._V1_.jpg",
                        new ArrayList<>(), new ArrayList<>(), Movie.MPAA_Rating.PG
                ),
                new Movie(
                        "Notice to Quit",
                        Movie.Genre.COMEDY,
                        List.of("Ken Marino", "Paul Rudd", "Rebecca Naomi Jones"),
                        "Francis Lawrence",
                        "Dummy Producers",
                        "Andy Singer, an out-of-work actor now struggling as a New York City realtor, finds his world crashing down around him when his estranged daughter shows up unannounced on his doorstep.",
                        "https://youtu.be/ByXuk9QqQkk",
                        "https://m.media-amazon.com/images/M/MV5BODA2MDI2YzUtNzFkZS00MTQyLTg2YmQtZTBhMTk4ODRkMGU0XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
                        new ArrayList<>(), new ArrayList<>(), Movie.MPAA_Rating.PG_13
                ),
                new Movie(
                        "Black Panther",
                        Movie.Genre.ACTION,
                        List.of("Chadwick Boseman", "Michael B. Jordan", "Lupita Nyong'o"),
                        "Ryan Coogler",
                        "Kevin Feige",
                        "T’Challa returns to Wakanda to claim the throne.",
                        "https://youtu.be/xjDjIWPwcPU",
                        "https://m.media-amazon.com/images/M/MV5BMTg1MTY2MjYzNV5BMl5BanBnXkFtZTgwMTc4NTMwNDI@._V1_.jpg",
                        new ArrayList<>(), new ArrayList<>(), Movie.MPAA_Rating.PG_13
                )
        );

        List<Showroom> showrooms = Arrays.asList(showroomA, showroomB, showroomC);
        List<Show> scheduledShows = new ArrayList<>();

        int roomIndex = 0;
        for (Movie movie : seedMovies) {
            Movie savedMovie = movieService.create(movie);
            Long movieId = savedMovie.getId();

            Showroom firstRoom = showrooms.get(roomIndex % showrooms.size());
            Show matineeShow = new Show(
                    135,
                    today,
                    matinee,
                    Time.valueOf(matinee.toLocalTime().plusMinutes(135))
            );
            matineeShow.setShowroom(firstRoom);
            Show savedMatinee = movieService.addShow(movieId, matineeShow);
            scheduledShows.add(savedMatinee);
            roomIndex++;

            Showroom eveningRoom = showrooms.get(roomIndex % showrooms.size());
            Show eveningShow = new Show(
                    135,
                    tomorrow,
                    evening,
                    Time.valueOf(evening.toLocalTime().plusMinutes(135))
            );
            eveningShow.setShowroom(eveningRoom);
            Show savedEvening = movieService.addShow(movieId, eveningShow);
            scheduledShows.add(savedEvening);
            roomIndex++;

            Showroom weekendRoom = showrooms.get(roomIndex % showrooms.size());
            Show weekendShow = new Show(
                    135,
                    weekend,
                    lateShow,
                    Time.valueOf(lateShow.toLocalTime().plusMinutes(135))
            );
            weekendShow.setShowroom(weekendRoom);
            Show savedWeekend = movieService.addShow(movieId, weekendShow);
            scheduledShows.add(savedWeekend);
            roomIndex++;

            movieService.addReview(movieId, new Review(5, "Captivating cinema experience."));
            movieService.addReview(movieId, new Review(4, "Worth watching with friends."));
        }

        Customer alice = customerRepository.save(
                new Customer(
                        "alice@example.com",
                        "alice1",
                        "Alice",
                        "Johnson",
                        "password123",
                        Customer.CustomerState.ACTIVE,
                        new ArrayList<>(),
                        new ArrayList<>(List.of(welcomePromo))
                )
        );

        Customer bob = customerRepository.save(
                new Customer(
                        "bob@example.com",
                        "bobby",
                        "Bob",
                        "Miller",
                        "password123",
                        Customer.CustomerState.ACTIVE,
                        new ArrayList<>(),
                        new ArrayList<>(List.of(welcomePromo, loyaltyPromo))
                )
        );

        PaymentMethod aliceCard = paymentMethodRepository.save(
                new PaymentMethod(
                        alice,
                        4111111111111111L,
                        "Alice",
                        "Johnson",
                        Date.valueOf(LocalDate.now().plusYears(3)),
                        123
                )
        );
        alice.addPaymentMethod(aliceCard);
        customerRepository.save(alice);

        PaymentMethod bobCard = paymentMethodRepository.save(
                new PaymentMethod(
                        bob,
                        5500000000000004L,
                        "Bob",
                        "Miller",
                        Date.valueOf(LocalDate.now().plusYears(4)),
                        456
                )
        );
        bob.addPaymentMethod(bobCard);
        customerRepository.save(bob);

        Booking aliceBooking = bookingRepository.save(new Booking(new ArrayList<>(), alice));
        Booking bobBooking = bookingRepository.save(new Booking(new ArrayList<>(), bob));

        if (!scheduledShows.isEmpty()) {
            Show firstShow = scheduledShows.get(0);
            Ticket aliceAdult = new Ticket(2, 5, adultCategory, firstShow, firstShow.getShowroom());
            aliceAdult.setBooking(aliceBooking);
            ticketRepository.save(aliceAdult);
            aliceBooking.getTickets().add(aliceAdult);

            Ticket aliceChild = new Ticket(2, 6, childCategory, firstShow, firstShow.getShowroom());
            aliceChild.setBooking(aliceBooking);
            ticketRepository.save(aliceChild);
            aliceBooking.getTickets().add(aliceChild);

            bookingRepository.save(aliceBooking);
        }

        if (scheduledShows.size() > 1) {
            Show secondShow = scheduledShows.get(1);
            Ticket bobSenior = new Ticket(5, 8, seniorCategory, secondShow, secondShow.getShowroom());
            bobSenior.setBooking(bobBooking);
            ticketRepository.save(bobSenior);
            bobBooking.getTickets().add(bobSenior);
            bookingRepository.save(bobBooking);
        }
    }

    /**
     * The endpoint to clear the database.
     */
    @GetMapping("/clear-db")
    public void clearDb() {
        clearAllData();
    }

    private void clearAllData() {
        ticketRepository.deleteAll();
        bookingRepository.deleteAll();
        showRepository.deleteAll();
        movieRepository.deleteAll();
        paymentMethodRepository.deleteAll();
        customerRepository.deleteAll();
        promotionRepository.deleteAll();
        ticketCategoryRepository.deleteAll();
        showroomRepository.deleteAll();
        theaterRepository.deleteAll();
        cinemaRepository.deleteAll();
        adminRepository.deleteAll();
    }
}
