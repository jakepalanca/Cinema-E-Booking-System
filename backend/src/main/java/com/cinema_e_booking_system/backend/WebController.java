package com.cinema_e_booking_system.backend;

import java.sql.Date;
import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cinema_e_booking_system.db.Admin;
import com.cinema_e_booking_system.db.AdminRepository;
import com.cinema_e_booking_system.db.Booking;
import com.cinema_e_booking_system.db.BookingRepository;
import com.cinema_e_booking_system.db.Cinema;
import com.cinema_e_booking_system.db.CinemaRepository;
import com.cinema_e_booking_system.db.Customer;
import com.cinema_e_booking_system.db.CustomerRepository;
import com.cinema_e_booking_system.db.Movie;
import com.cinema_e_booking_system.db.MovieRepository;
import com.cinema_e_booking_system.db.PaymentMethod;
import com.cinema_e_booking_system.db.PaymentMethodRepository;
import com.cinema_e_booking_system.db.Promotion;
import com.cinema_e_booking_system.db.PromotionRepository;
import com.cinema_e_booking_system.db.Review;
import com.cinema_e_booking_system.db.ReviewRepository;
import com.cinema_e_booking_system.db.Show;
import com.cinema_e_booking_system.db.ShowRepository;
import com.cinema_e_booking_system.db.Showroom;
import com.cinema_e_booking_system.db.ShowroomRepository;
import com.cinema_e_booking_system.db.Theater;
import com.cinema_e_booking_system.db.TheaterRepository;
import com.cinema_e_booking_system.db.Ticket;
import com.cinema_e_booking_system.db.TicketCategory;
import com.cinema_e_booking_system.db.TicketCategoryRepository;
import com.cinema_e_booking_system.db.TicketRepository;
import com.cinema_e_booking_system.db.User;
import com.cinema_e_booking_system.db.UserRepository;

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

    @Autowired
    ReviewRepository reviewRepository;

    @Autowired
    UserRepository userRepository;

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
     * Returns all movies with their associated shows and reviews.
     */
    @Transactional(readOnly = true)
    @GetMapping("/movies")
    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    /**
     * Returns a single movie by id.
     */
    @Transactional(readOnly = true)
    @GetMapping("/movies/{id}")
    public ResponseEntity<Movie> getMovieById(@PathVariable Long id) {
        return movieRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Returns all customers with nested payment methods, promotions, and bookings.
     */
    @Transactional(readOnly = true)
    @GetMapping("/customers")
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    /**
     * Returns a single customer by id.
     */
    @Transactional(readOnly = true)
    @GetMapping("/customers/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable Long id) {
        return customerRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Returns all bookings with nested tickets.
     */
    @Transactional(readOnly = true)
    @GetMapping("/bookings")
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    /**
     * Returns a single booking by id.
     */
    @Transactional(readOnly = true)
    @GetMapping("/bookings/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable Long id) {
        return bookingRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Returns all scheduled shows.
     */
    @Transactional(readOnly = true)
    @GetMapping("/shows")
    public List<Show> getAllShows() {
        return showRepository.findAll();
    }

    /**
     * Returns a single show by id.
     */
    @Transactional(readOnly = true)
    @GetMapping("/shows/{id}")
    public ResponseEntity<Show> getShowById(@PathVariable Long id) {
        return showRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Returns all cinemas.
     */
    @Transactional(readOnly = true)
    @GetMapping("/cinemas")
    public List<Cinema> getAllCinemas() {
        return cinemaRepository.findAll();
    }

    /**
     * Returns a single cinema by id.
     */
    @Transactional(readOnly = true)
    @GetMapping("/cinemas/{id}")
    public ResponseEntity<Cinema> getCinemaById(@PathVariable Long id) {
        return cinemaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Returns all theaters.
     */
    @Transactional(readOnly = true)
    @GetMapping("/theaters")
    public List<Theater> getAllTheaters() {
        return theaterRepository.findAll();
    }

    /**
     * Returns a single theater by id.
     */
    @Transactional(readOnly = true)
    @GetMapping("/theaters/{id}")
    public ResponseEntity<Theater> getTheaterById(@PathVariable Long id) {
        return theaterRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Returns all showrooms.
     */
    @Transactional(readOnly = true)
    @GetMapping("/showrooms")
    public List<Showroom> getAllShowrooms() {
        return showroomRepository.findAll();
    }

    /**
     * Returns a single showroom by id.
     */
    @Transactional(readOnly = true)
    @GetMapping("/showrooms/{id}")
    public ResponseEntity<Showroom> getShowroomById(@PathVariable Long id) {
        return showroomRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Returns all ticket categories.
     */
    @Transactional(readOnly = true)
    @GetMapping("/ticket-categories")
    public List<TicketCategory> getAllTicketCategories() {
        return ticketCategoryRepository.findAll();
    }

    /**
     * Returns a single ticket category by id.
     */
    @Transactional(readOnly = true)
    @GetMapping("/ticket-categories/{id}")
    public ResponseEntity<TicketCategory> getTicketCategoryById(@PathVariable Long id) {
        return ticketCategoryRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Returns all tickets.
     */
    @Transactional(readOnly = true)
    @GetMapping("/tickets")
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    /**
     * Returns a single ticket by id.
     */
    @Transactional(readOnly = true)
    @GetMapping("/tickets/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable Long id) {
        return ticketRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Returns all promotions.
     */
    @Transactional(readOnly = true)
    @GetMapping("/promotions")
    public List<Promotion> getAllPromotions() {
        return promotionRepository.findAll();
    }

    /**
     * Returns a single promotion by id.
     */
    @Transactional(readOnly = true)
    @GetMapping("/promotions/{id}")
    public ResponseEntity<Promotion> getPromotionById(@PathVariable Long id) {
        return promotionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Returns all payment methods.
     */
    @Transactional(readOnly = true)
    @GetMapping("/payment-methods")
    public List<PaymentMethod> getAllPaymentMethods() {
        return paymentMethodRepository.findAll();
    }

    /**
     * Returns a single payment method by id.
     */
    @Transactional(readOnly = true)
    @GetMapping("/payment-methods/{id}")
    public ResponseEntity<PaymentMethod> getPaymentMethodById(@PathVariable Long id) {
        return paymentMethodRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Returns all admins.
     */
    @Transactional(readOnly = true)
    @GetMapping("/admins")
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    /**
     * Returns a single admin by id.
     */
    @Transactional(readOnly = true)
    @GetMapping("/admins/{id}")
    public ResponseEntity<Admin> getAdminById(@PathVariable Long id) {
        return adminRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Returns all users (customers and admins).
     */
    @Transactional(readOnly = true)
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Returns a single user by id.
     */
    @Transactional(readOnly = true)
    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Returns all reviews.
     */
    @Transactional(readOnly = true)
    @GetMapping("/reviews")
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    /**
     * Returns a single review by id.
     */
    @Transactional(readOnly = true)
    @GetMapping("/reviews/{id}")
    public ResponseEntity<Review> getReviewById(@PathVariable Long id) {
        return reviewRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
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

    /**
     * The endpoint to initialize the database.
     */
    @GetMapping("/initialize-db")
    public void initializeDb() {
        clearAllData();

        Date today = Date.valueOf(LocalDate.now());
        Date tomorrow = Date.valueOf(LocalDate.now().plusDays(1));
        Date weekend = Date.valueOf(LocalDate.now().plusDays(2));
        Date nextWeek = Date.valueOf(LocalDate.now().plusDays(7));

        Time matinee = Time.valueOf(LocalTime.of(12, 0));
        Time afternoon = Time.valueOf(LocalTime.of(15, 15));
        Time evening = Time.valueOf(LocalTime.of(18, 45));
        Time lateShow = Time.valueOf(LocalTime.of(21, 30));

        TicketCategory adultCategory = ticketCategoryRepository.save(new TicketCategory("Adult", 15.00));
        TicketCategory childCategory = ticketCategoryRepository.save(new TicketCategory("Child", 9.50));
        TicketCategory seniorCategory = ticketCategoryRepository.save(new TicketCategory("Senior", 11.00));

        Promotion welcomePromo = promotionRepository.save(new Promotion("WELCOME10", 0.10));
        Promotion loyaltyPromo = promotionRepository.save(new Promotion("LOYAL15", 0.15));
        Promotion blockbusterPromo = promotionRepository.save(new Promotion("BLOCKBUSTER20", 0.20));

        adminRepository.save(new Admin("admin@cinemae.com", "sysadmin", "System", "Admin", "admin123"));
        adminRepository.save(new Admin("manager@cinemae.com", "cinemamgr", "Morgan", "Reeves", "managersafe"));

        Cinema downtown = cinemaRepository.save(new Cinema("Downtown Cinema"));
        Cinema uptown = cinemaRepository.save(new Cinema("Uptown Screens"));

        Theater auditoriumOne = theaterRepository.save(new Theater(downtown, "Auditorium 1", "123 Main Street"));
        Theater auditoriumTwo = theaterRepository.save(new Theater(downtown, "Auditorium 2", "123 Main Street"));
        Theater premiereHall = theaterRepository.save(new Theater(uptown, "Premiere Hall", "456 High Street"));
        Theater indieHall = theaterRepository.save(new Theater(uptown, "Indie Hall", "456 High Street"));

        List<Showroom> showrooms = List.of(
                showroomRepository.save(new Showroom(auditoriumOne, 8, 10)),
                showroomRepository.save(new Showroom(auditoriumOne, 6, 8)),
                showroomRepository.save(new Showroom(auditoriumTwo, 10, 12)),
                showroomRepository.save(new Showroom(premiereHall, 12, 14)),
                showroomRepository.save(new Showroom(indieHall, 7, 9))
        );

        List<Movie> savedMovies = new ArrayList<>();
        List<Movie> seedMovies = List.of(
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

        for (Movie movie : seedMovies) {
            Movie savedMovie = movieService.create(movie);
            savedMovies.add(savedMovie);
        }

        List<Show> scheduledShows = new ArrayList<>();
        int roomIndex = 0;
        for (Movie movie : savedMovies) {
            Showroom matineeRoom = showrooms.get(roomIndex % showrooms.size());
            Showroom afternoonRoom = showrooms.get((roomIndex + 1) % showrooms.size());
            Showroom eveningRoom = showrooms.get((roomIndex + 2) % showrooms.size());
            roomIndex++;

            int matineeDuration = 120 + (movie.getTitle().length() % 20);
            int afternoonDuration = 130 + (movie.getTitle().length() % 15);
            int eveningDuration = 110 + (movie.getTitle().length() % 10);

            Show matineeShow = new Show(matineeDuration, today, matinee, addMinutes(matinee, matineeDuration));
            matineeShow.setShowroom(matineeRoom);
            scheduledShows.add(movieService.addShow(movie.getId(), matineeShow));

            Show afternoonShow = new Show(afternoonDuration, tomorrow, afternoon, addMinutes(afternoon, afternoonDuration));
            afternoonShow.setShowroom(afternoonRoom);
            scheduledShows.add(movieService.addShow(movie.getId(), afternoonShow));

            Show lateNightShow = new Show(eveningDuration, weekend, lateShow, addMinutes(lateShow, eveningDuration));
            lateNightShow.setShowroom(eveningRoom);
            scheduledShows.add(movieService.addShow(movie.getId(), lateNightShow));

            movieService.addReview(movie.getId(), new Review(5, movie.getTitle() + " was incredible on the big screen."));
            movieService.addReview(movie.getId(), new Review(4, "Crowd loved the show and sound design."));
        }

        Customer alice = new Customer(
                "alice@example.com",
                "alice1",
                "Alice",
                "Johnson",
                "password123",
                Customer.CustomerState.ACTIVE,
                new ArrayList<>(),
                new ArrayList<>()
        );
        alice.addPromotion(welcomePromo);
        alice = customerRepository.save(alice);

        Customer bob = new Customer(
                "bob@example.com",
                "bobby",
                "Bob",
                "Miller",
                "password123",
                Customer.CustomerState.ACTIVE,
                new ArrayList<>(),
                new ArrayList<>()
        );
        bob.addPromotion(welcomePromo);
        bob.addPromotion(loyaltyPromo);
        bob = customerRepository.save(bob);

        Customer carol = new Customer(
                "carol@example.com",
                "carolc",
                "Carol",
                "Nguyen",
                "password123",
                Customer.CustomerState.SUSPENDED,
                new ArrayList<>(),
                new ArrayList<>()
        );
        carol.addPromotion(blockbusterPromo);
        carol = customerRepository.save(carol);

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

        PaymentMethod carolCard = paymentMethodRepository.save(
                new PaymentMethod(
                        carol,
                        6011000990139424L,
                        "Carol",
                        "Nguyen",
                        Date.valueOf(LocalDate.now().plusYears(2)),
                        789
                )
        );
        carol.addPaymentMethod(carolCard);

        customerRepository.saveAll(List.of(alice, bob, carol));

        if (!scheduledShows.isEmpty()) {
            Booking aliceMatinee = bookingRepository.save(new Booking(new ArrayList<>(), alice));
            alice.addBooking(aliceMatinee);
            Booking bobEvening = bookingRepository.save(new Booking(new ArrayList<>(), bob));
            bob.addBooking(bobEvening);
            Booking carolLate = bookingRepository.save(new Booking(new ArrayList<>(), carol));
            carol.addBooking(carolLate);

            issueTicket(aliceMatinee, scheduledShows.get(0), adultCategory, 1, 4);
            issueTicket(aliceMatinee, scheduledShows.get(0), childCategory, 1, 5);
            bookingRepository.save(aliceMatinee);

            if (scheduledShows.size() > 1) {
                issueTicket(bobEvening, scheduledShows.get(1), adultCategory, 2, 3);
                issueTicket(bobEvening, scheduledShows.get(1), seniorCategory, 2, 4);
                bookingRepository.save(bobEvening);
            }

            if (scheduledShows.size() > 2) {
                issueTicket(carolLate, scheduledShows.get(2), adultCategory, 0, 2);
                bookingRepository.save(carolLate);
            }

            if (scheduledShows.size() > 3) {
                Booking aliceWeekend = bookingRepository.save(new Booking(new ArrayList<>(), alice));
                alice.addBooking(aliceWeekend);
                issueTicket(aliceWeekend, scheduledShows.get(3), adultCategory, 3, 3);
                bookingRepository.save(aliceWeekend);
            }

            if (scheduledShows.size() > 4) {
                Booking bobFamily = bookingRepository.save(new Booking(new ArrayList<>(), bob));
                bob.addBooking(bobFamily);
                issueTicket(bobFamily, scheduledShows.get(4), childCategory, 4, 1);
                issueTicket(bobFamily, scheduledShows.get(4), childCategory, 4, 2);
                bookingRepository.save(bobFamily);
            }
        }

        customerRepository.saveAll(List.of(alice, bob, carol));
        promotionRepository.saveAll(List.of(welcomePromo, loyaltyPromo, blockbusterPromo));
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
        reviewRepository.deleteAll();
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

    private Time addMinutes(Time startTime, int minutes) {
        return Time.valueOf(startTime.toLocalTime().plusMinutes(minutes));
    }

    private void issueTicket(Booking booking, Show show, TicketCategory category, int seatRow, int seatCol) {
        Ticket ticket = new Ticket(seatRow, seatCol, category, show, show.getShowroom());
        booking.addTicket(ticket);
        show.getShowroom().occupySeat(seatRow, seatCol);
        ticketRepository.save(ticket);
    }
}
