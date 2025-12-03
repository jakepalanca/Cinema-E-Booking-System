package com.cinema_e_booking_system.backend;

import com.cinema_e_booking_system.backend.EmailRequest;
import com.cinema_e_booking_system.backend.TicketRequest;
import com.cinema_e_booking_system.backend.security.JwtTokenProvider;

import com.cinema_e_booking_system.db.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;

import java.sql.Date;
import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.Objects;
import java.lang.Integer;
import java.time.Duration;
import java.time.format.DateTimeParseException;
import java.util.NoSuchElementException;



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
    EmailSenderService senderService;

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

    @Autowired
    JwtTokenProvider jwtTokenProvider;

// ---------------------- USER AUTHENTICATION & PROFILE MANAGEMENT ----------------------

// ---------------------- REGISTER ----------------------
@PostMapping(
    value = "/register",
    consumes = MediaType.APPLICATION_JSON_VALUE,
    produces = MediaType.APPLICATION_JSON_VALUE
)
public ResponseEntity<Map<String, String>> register(@RequestBody Map<String, Object> newUser)
{
    String email = (String) newUser.get("email");
    String username = (String) newUser.get("username");
    String firstName = (String) newUser.get("firstName");
    String lastName = (String) newUser.get("lastName");
    String password = (String) newUser.get("password");
    String phoneNumber = (String) newUser.get("phoneNumber");
    String address = (String) newUser.get("address");
    String city = (String) newUser.get("city");
    String state = (String) newUser.get("state");
    String zipCode = (String) newUser.get("zipCode");
    String country = (String) newUser.get("country");

    @SuppressWarnings("unchecked")
    List<Map<String, Object>> paymentMethodsPayload = (List<Map<String, Object>>) newUser.get("paymentMethods");

    if (email == null || password == null || username == null) {
        return ResponseEntity.badRequest().body(Map.of("message", "Missing required fields."));
    }

    if (customerRepository.findByEmail(email).isPresent()) {
        return ResponseEntity.badRequest().body(Map.of("message", "Email already registered."));
    }

    if (customerRepository.findByUsername(username).isPresent()) {
        return ResponseEntity.badRequest().body(Map.of("message", "Username already registered."));
    }

    StringCryptoConverter crypto = new StringCryptoConverter();

   Customer c = new Customer(
    email,
    username,
    firstName,
    lastName,
    crypto.convertToDatabaseColumn(password),
    Customer.CustomerState.ACTIVE,
    null, null, // paymentMethods, promotions
    address, city, state, zipCode, country
);
    
    // Set phone number if provided
    if (phoneNumber != null) {
        c.setPhoneNumber(phoneNumber);
    }

  // Ensure you are using the token you generated!
  String generatedToken = UUID.randomUUID().toString();
  c.setVerificationToken(generatedToken);
  c.setVerified(false); // Use 'false' for initial state

  // Persist any payment methods sent during registration
  if (paymentMethodsPayload != null) {
      for (Map<String, Object> cardPayload : paymentMethodsPayload) {
          if (cardPayload == null) {
              continue;
          }

          // Use billing address if provided (falls back to customer address)
          @SuppressWarnings("unchecked")
          Map<String, Object> billing = (Map<String, Object>) cardPayload.get("billingAddress");
          String billAddress = billing != null ? (String) billing.getOrDefault("address", address) : address;
          String billCity = billing != null ? (String) billing.getOrDefault("city", city) : city;
          String billState = billing != null ? (String) billing.getOrDefault("state", state) : state;
          String billZip = billing != null ? Objects.toString(billing.getOrDefault("zipCode", zipCode), null) : zipCode;
          String billCountry = billing != null ? (String) billing.getOrDefault("country", country) : country;

          // Normalize expiration date to YYYY-MM-DD
          String expirationRaw = (String) cardPayload.get("expirationDate");
          String normalizedExp = null;
          if (expirationRaw != null) {
              normalizedExp = expirationRaw.length() == 7 ? expirationRaw + "-01" : expirationRaw;
          }

          PaymentMethod card = new PaymentMethod(
                  c,
                  (String) cardPayload.get("cardNumber"),
                  (String) cardPayload.get("cardHolderFirstName"),
                  (String) cardPayload.get("cardHolderLastName"),
                  normalizedExp != null ? java.sql.Date.valueOf(normalizedExp) : null,
                  toInteger(cardPayload.get("securityCode")),
                  toInteger(billZip),
                  billCountry,
                  billState,
                  billCity,
                  billAddress
          );

          c.addPaymentMethod(card);
      }
  }

  Customer savedCustomer = customerRepository.save(c);

// Pass the saved customer AND the token variable you know was saved
  senderService.sendVerificationEmail(savedCustomer, generatedToken);

    return ResponseEntity.ok(Map.of(
        "message", "Registration successful.",
        "email", savedCustomer.getEmail(),
        "id", String.valueOf(savedCustomer.getId()),
        "password",  ""
    ));
}

  @PostMapping("verify")
  public ResponseEntity<String> sendVerificationEmail(@RequestBody Map<String, String> verification) {
    String email = verification.get("emailforVerification");
    String token = verification.get("verificationCode");

    Optional<Customer> customerOptional = customerRepository.findByVerificationToken(token);

    if (customerOptional.isEmpty()) {
      return ResponseEntity.status(400).body(("Error: Invalid or expired token"));
    }
    Customer c = customerOptional.get();

    if (c.isVerified()) {
      return ResponseEntity.ok("Account is already confirmed");
    }
    //senderService.sendVerificationEmail(c,code);


    c.setVerified(true);
    c.setVerificationToken(null);
    customerRepository.save(c);
    return ResponseEntity.ok("Sucesss! Account confirmed.");
  }

  @GetMapping("users/confirm")
  public ResponseEntity<String> confirmedUser(@RequestParam("token") String token) {
    Optional<Customer> customerOptional = customerRepository.findByVerificationToken(token);

    if (customerOptional.isEmpty()) {
      return ResponseEntity.status(400).body(("Error: Invalid or expired token"));
    }
    Customer c = customerOptional.get();

    if (c.isVerified()) {
      return ResponseEntity.ok("Account is already confirmed");
    }

    c.setVerified(true);
    c.setVerificationToken(null);
    customerRepository.save(c);
    return ResponseEntity.ok("Sucesss! Account confirmed.");
  }


// ---------------------- LOGIN ----------------------
// Login endpoint moved to AuthController for JWT token generation!!!!

// ---------------------- ADMIN LOGIN (Sprint 3) ----------------------
@PostMapping(
    value = "/admin-login",
    consumes = MediaType.APPLICATION_JSON_VALUE,
    produces = MediaType.APPLICATION_JSON_VALUE
)
public ResponseEntity<Map<String, Object>> adminLogin(@RequestBody Map<String, String> body) {
    String username = body.get("username");
    String password = body.get("password");

    if (username == null || password == null) {
        return ResponseEntity
                .badRequest()
                .body(Map.<String, Object>of("message", "Missing username or password"));
    }

    Optional<Admin> adminOpt = adminRepository.findByUsername(username);

    if (adminOpt.isEmpty()) {
        return ResponseEntity
                .status(401)
                .body(Map.<String, Object>of("message", "Invalid admin credentials"));
    }

    Admin admin = adminOpt.get();

    if (!admin.getPassword().equals(password)) {
        return ResponseEntity
                .status(401)
                .body(Map.<String, Object>of("message", "Invalid admin credentials"));
    }

    return ResponseEntity.ok(Map.<String, Object>of(
            "message", "Admin login successful",
            "role", "admin",
            "id", admin.getId(),
            "username", admin.getUsername()
    ));

}


// ---------------------- FORGOT PASSWORD ----------------------
@PostMapping(
    value = "/forgot-password",
    consumes = MediaType.APPLICATION_JSON_VALUE,
    produces = MediaType.APPLICATION_JSON_VALUE
)
public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody Map<String, String> request) {
    String email = request.get("emailOrUsername");
    Optional<Customer> customerOpt = customerRepository.findByEmail(email);

    if (customerOpt.isEmpty()) {
        return ResponseEntity.status(404).body(Map.of("message", "No account found with that email."));
    }

    Customer c = customerOpt.get();
    if (!c.isVerified()) {
        return ResponseEntity.status(401).body(Map.of("message", "Account not verified."));
    }

    // Generate reset token
    String token = UUID.randomUUID().toString();
    c.setResetToken(token);
    customerRepository.save(c);

    // Teammate handles email sending later
    senderService.sendPasswordResetLink(c, token);

    System.out.println(token);
    return ResponseEntity.ok(Map.of("message", "Password reset link sent to your email."));
}


// ---------------------- RESET PASSWORD ----------------------

@PostMapping(
    value = "/reset-password",
    consumes = MediaType.APPLICATION_JSON_VALUE,
    produces = MediaType.APPLICATION_JSON_VALUE
)
public ResponseEntity<Map<String, String>> resetPassword(
        //@RequestParam("token") String token,
        @RequestBody Map<String, String> body

) {
    String newPassword = body.get("password");
    String token = body.get("token");

    if (newPassword == null || newPassword.isBlank()) {
        return ResponseEntity.status(400).body(Map.of("message", "Password cannot be empty."));
    }

    Optional<Customer> customerOpt = customerRepository.findByResetToken(token);
    if (customerOpt.isEmpty()) {
        return ResponseEntity.status(400).body(Map.of("message", "Invalid or expired reset token."));
    }

    Customer c = customerOpt.get();
    StringCryptoConverter crypto = new StringCryptoConverter();
    c.setPassword(crypto.convertToDatabaseColumn(newPassword));
    c.setResetToken(null); // clear token
    customerRepository.save(c);

    return ResponseEntity.ok(Map.of("message", "Password reset successful."));
}


// ---------------------- UPDATE PROFILE ----------------------
@PutMapping("/customers/{id}")
public ResponseEntity<Map<String, String>> updateCustomerProfile(
        @PathVariable Long id,
        @RequestBody Map<String, Object> body) {
    updateProfileFlexible(id, body); 
    return ResponseEntity.ok(Map.of("message", "Profile updated successfully."));
}


@PutMapping(
    value = {"/profile/{id}", "/customers/{id}"},
    consumes = MediaType.APPLICATION_JSON_VALUE,
    produces = MediaType.APPLICATION_JSON_VALUE
)
public ResponseEntity<Map<String, Object>> updateProfileFlexible(
        @PathVariable Long id,
        @RequestBody Map<String, Object> body) {

    Optional<Customer> opt = customerRepository.findById(id);
    if (opt.isEmpty()) {
        return ResponseEntity.status(404).build();
    }

    Customer c = opt.get();

    // 
    if (body.get("firstName") != null) c.setFirstName(body.get("firstName").toString());
    if (body.get("lastName") != null) c.setLastName(body.get("lastName").toString());
    if (body.get("phoneNumber") != null) c.setPhoneNumber(body.get("phoneNumber").toString());
    if (body.get("address") != null) c.setAddress(body.get("address").toString());
    if (body.get("city") != null) c.setCity(body.get("city").toString());
    if (body.get("state") != null) c.setState(body.get("state").toString());
    if (body.get("zipCode") != null) c.setZipCode(body.get("zipCode").toString());
    if (body.get("country") != null) c.setCountry(body.get("country").toString());

    if (body.get("password") != null && !body.get("password").toString().isBlank()) {
        StringCryptoConverter crypto = new StringCryptoConverter();
        c.setPassword(crypto.convertToDatabaseColumn(body.get("password").toString()));
    }

    customerRepository.save(c);

    // 
    Map<String, Object> response = new HashMap<>();
    response.put("id", c.getId());
    response.put("email", c.getEmail());
    response.put("firstName", c.getFirstName());
    response.put("lastName", c.getLastName());
    response.put("phoneNumber", c.getPhoneNumber());
    response.put("address", c.getAddress());
    response.put("city", c.getCity());
    response.put("state", c.getState());
    response.put("zipCode", c.getZipCode());
    response.put("country", c.getCountry());

    senderService.sendEditEmail(c);

    return ResponseEntity.ok(response);
}

  // ---------------------- ADD PAYMENT ----------------------
@PutMapping(
    //changed from /setUserPayment/{id} to match front end
    value = "/customers/{id}/payment-methods",
    consumes = MediaType.APPLICATION_JSON_VALUE,
    produces = MediaType.APPLICATION_JSON_VALUE
)
public ResponseEntity<Map<String, Object>> updatePayment(
        @RequestBody Map<String, Object> newCard,
        @PathVariable Long id
) {
    System.out.println("adding payment method to customer " + id);
    Optional<Customer> opt = customerRepository.findById(id);
    if (opt.isEmpty()) {
        return ResponseEntity.status(404).body(Map.<String, Object>of("message", "User not found."));
    }
    Customer currentCustomer = opt.get();


// Enforce 3-card limit
if (currentCustomer.getPaymentMethods().size() >= 3) {
    return ResponseEntity.badRequest().body(Map.<String, Object>of(
        "message", "You cannot add more than 3 payment methods."
    ));
}

    // Extract data from JSON and build the PaymentMethod object
    PaymentMethod card = new PaymentMethod(
            currentCustomer,
            (String)newCard.get("cardNumber"),
            (String)newCard.get("cardHolderFirstName"),
            (String)newCard.get("cardHolderLastName"),
            java.sql.Date.valueOf((String)newCard.get("expirationDate")),
            (Integer)newCard.get("securityCode"),
            (Integer)newCard.get("zipCode"),
            (String)newCard.get("country"),
            (String)newCard.get("state"),
            (String)newCard.get("city"),
            (String)newCard.get("address")
    );

    // Save it and link to the customer
    paymentMethodRepository.save(card);
    currentCustomer.addPaymentMethod(card);
    customerRepository.save(currentCustomer);

    String cardNum = card.getCardNumber();
    String last4 = (cardNum != null && cardNum.length() >= 4)
            ? cardNum.substring(cardNum.length() - 4)
            : cardNum;

    Map<String, Object> response = new HashMap<>();
    response.put("id", card.getId());
    response.put("cardHolderFirstName", card.getCardHolderFirstName());
    response.put("cardHolderLastName", card.getCardHolderLastName());
    response.put("cardNumberLast4", last4);
    response.put("expirationDate", card.getExpirationDate());
    response.put("message", "New card added to user " + currentCustomer.getFirstName());

    return ResponseEntity.ok(response);
}

// Remove a payment method
@DeleteMapping("/payment-methods/{paymentMethodId}")
public ResponseEntity<Map<String, String>> deletePaymentMethod(@PathVariable Long paymentMethodId) {
    Optional<PaymentMethod> cardOpt = paymentMethodRepository.findById(paymentMethodId);
    if (cardOpt.isEmpty()) {
        return ResponseEntity.status(404).body(Map.of("message", "Payment method not found."));
    }

    PaymentMethod card = cardOpt.get();
    Customer owner = card.getCustomer();

    if (owner != null) {
        owner.removePaymentMethod(card);
        customerRepository.save(owner); // orphanRemoval will delete the card
    } else {
        paymentMethodRepository.delete(card);
    }

    return ResponseEntity.ok(Map.of("message", "Payment method removed."));
}

// ---------------------- FRONTEND COMPATIBILITY HELPERS ----------------------


@GetMapping("/customers/by-email")
public ResponseEntity<Map<String, Object>> getCustomerByEmail(@RequestParam String email) {
    Optional<Customer> opt = customerRepository.findByEmail(email);
    if (opt.isEmpty()) {
        return ResponseEntity.status(404).body(Map.<String, Object>of("message", "Customer not found"));
    }

    Customer c = opt.get();

    Map<String, Object> response = new HashMap<>();
    response.put("id", c.getId());
    response.put("email", c.getEmail());
    response.put("username", c.getUsername());
    response.put("firstName", c.getFirstName());
    response.put("lastName", c.getLastName());
    response.put("phoneNumber", c.getPhoneNumber());
    response.put("address", c.getAddress());
    response.put("city", c.getCity());
    response.put("state", c.getState());
    response.put("zipCode", c.getZipCode());
    response.put("country", c.getCountry());
    response.put("registeredForPromos", c.getRegisteredForPromos());
    response.put("paymentMethods", c.getPaymentMethods());
    response.put("promotions", c.getPromotions());

    return ResponseEntity.ok(response);
}

// --------------------- ADD MOVIE ---------------------


  // -------------------- SCHEDULE MOVIE ---------------


// ---------------------- REMOVE PROMOTION ----------------------
@DeleteMapping("customers/{customerId}/promotions/{promotionId}")
public ResponseEntity<Map<String, String>> removePromotion(
  @PathVariable Long promotionId,
  @PathVariable Long customerId
) {
  Optional<Customer> opt = customerRepository.findById(customerId);
  if (opt.isEmpty()) {
    return ResponseEntity.status(404).body(Map.of("message", "User not found."));
  }
  Customer currentCustomer = opt.get();

  Optional<Promotion> promotionOptional = promotionRepository.findById(promotionId);
  if (promotionOptional.isEmpty()) {
    return ResponseEntity.status(404).body(Map.of("message", "Promotion not found."));
  }
  Promotion p = promotionOptional.get();

  currentCustomer.removePromotion(p);
  customerRepository.save(currentCustomer);
  return ResponseEntity.ok(Map.of("message", "Promotion removed from " + currentCustomer.getFirstName()));
}

// ---------------------- ADD PROMOTION TO CUSTOMER----------------------
@PostMapping("customers/{customerId}/promotions/{promotionId}")
public ResponseEntity<Map<String, String>> addPromotion(
  @PathVariable Long promotionId,
  @PathVariable Long customerId
) {
  Optional<Customer> opt = customerRepository.findById(customerId);
  if (opt.isEmpty()) {
    return ResponseEntity.status(404).body(Map.of("message", "User not found."));
  }
  Customer currentCustomer = opt.get();

  Optional<Promotion> promotionOptional = promotionRepository.findById(promotionId);
  if (promotionOptional.isEmpty()) {
    return ResponseEntity.status(404).body(Map.of("message", "Promotion not found."));
  }
  Promotion p = promotionOptional.get();

  currentCustomer.addPromotion(p);
  customerRepository.save(currentCustomer);
  return ResponseEntity.ok(Map.of("message", "Promotion added for " + currentCustomer.getFirstName()));
}

/**
// --------------------- MORE PROMOTION STUFF ----------------
  @PostMapping("/customers/{customerID}/promotion/{promotionId}")
public ResponseEntity<Map<>>
  */

// ----------------------ADD PROMO TO PROMO_REPO ------------------
@PostMapping("admin/promotions")
public ResponseEntity<Map<String, String>> addPromo(
  @RequestBody Map<String, Object> newPromo
) {
  String promoCode = (String)newPromo.get("code");
  double percentageValue = ((Number) newPromo.get("discountPercentage")).doubleValue();
  percentageValue = percentageValue / 100;
  Double promoDiscountPercentage = percentageValue;
  String promoEndDate = (String)newPromo.get("endDate");
  Boolean promoHasBeenApplied = (Boolean)newPromo.get("hasBeenApplied");
  String promoStartDate = (String)newPromo.get("startDate");

  Date startDate = null;
  Date endDate = null;
  try {
      if (promoStartDate != null && !promoStartDate.isBlank()) {
          startDate = Date.valueOf(LocalDate.parse(promoStartDate));
      }
      if (promoEndDate != null && !promoEndDate.isBlank()) {
          endDate = Date.valueOf(LocalDate.parse(promoEndDate));
      }
  } catch (Exception e) {
      return ResponseEntity.badRequest().body(Map.of("message", "Invalid start or end date format. Use YYYY-MM-DD."));
  }

  Promotion addThisPromo = new Promotion(promoCode, promoDiscountPercentage, startDate, endDate);
  promotionRepository.save(addThisPromo);
  return ResponseEntity.ok(Map.of("message", "Promo added successfully."));
  }



// ----------------------SEND PROMOTION EMAIL ----------------------
//works, current issue is registeredForPromo isn't getting set to true on frontend side, i think.
@PostMapping("/admin/sendPromotion/{promotionId}")
public ResponseEntity<Map<String, String>> sendPromotion(
  @PathVariable Long promotionId
) {
  //for every user, check if they signed up for promotions, then send email
  List<Customer> promoEmailList = customerRepository.findAllByRegisteredForPromosTrue();

  Optional<Promotion> p = promotionRepository.findById(promotionId);
  if (p.isEmpty()) {
    return ResponseEntity.status(404).body(Map.of("message", "Promotion not found."));
  }
  Promotion promo = p.get();


  for (Customer c : promoEmailList) {
    senderService.sendPromo(c, promo);
  }
  return ResponseEntity.ok(Map.of("message", "Promotion mail sent to " + promoEmailList.size() + " customers"));
}


// ---------------------- TEST ----------------------
@GetMapping("/test")
public String test() {
    return "User controller connected to DB!";
}



//-----------------------BOOK SEAT--------------------------
// Creates Booking and Ticket records, marks seats as occupied
@PostMapping("/bookseat/{showroomId}")
@Transactional
public ResponseEntity<Map<String, Object>> bookSeats(
  @PathVariable Long showroomId,
  @RequestBody Map<String, Object> bookingRequest,
  @CookieValue(value = "jwt_token", required = false) String token
  ) {
  try {
    // 1. Authenticate user
    if (token == null || token.isEmpty()) {
      return ResponseEntity.status(401).body(Map.of("message", "Not authenticated"));
    }
    
    Long userId = jwtTokenProvider.getUserIdFromToken(token);
    String role = jwtTokenProvider.getRoleFromToken(token);
    
    if (!"CUSTOMER".equalsIgnoreCase(role)) {
      return ResponseEntity.status(403).body(Map.of("message", "Only customers can book tickets"));
    }
    
    Optional<Customer> customerOpt = customerRepository.findById(userId);
    if (customerOpt.isEmpty()) {
      return ResponseEntity.status(404).body(Map.of("message", "Customer not found"));
    }
    Customer customer = customerOpt.get();
    
    // 2. Get showroom
    Optional<Showroom> sr = showroomRepository.findById(showroomId);
    if (sr.isEmpty()) {
      return ResponseEntity.status(404).body(Map.of("message", "Showroom not found."));
    }
    Showroom room = sr.get();
    boolean[][] roomMap = room.getSeats();
    
    // Initialize seats array if null (default 10x10)
    if (roomMap == null) {
      roomMap = new boolean[10][10];
      room.setSeats(roomMap);
    }
    
    // 3. Get show (optional but needed for proper ticket linking)
    Show show = null;
    if (bookingRequest.containsKey("showId")) {
      Long showId = ((Number) bookingRequest.get("showId")).longValue();
      Optional<Show> showOpt = showRepository.findById(showId);
      if (showOpt.isPresent()) {
        show = showOpt.get();
      }
    }
    
    // 4. Extract booking info
    @SuppressWarnings("unchecked")
    List<Map<String, Object>> seats = (List<Map<String, Object>>) bookingRequest.get("seats");
    Double totalPrice = bookingRequest.containsKey("totalPrice") 
        ? ((Number) bookingRequest.get("totalPrice")).doubleValue() 
        : null;
    String promoCode = (String) bookingRequest.get("promoCode");
    String movieTitle = (String) bookingRequest.get("movieTitle");
    String showtime = (String) bookingRequest.get("showtime");
    
    // 5. Validate seats are not already occupied
    for (Map<String, Object> seat : seats) {
      int seatRow = ((Number) seat.get("seatRow")).intValue();
      int seatCol = ((Number) seat.get("seatCol")).intValue();
      
      if (seatRow < 0 || seatRow >= roomMap.length || 
          seatCol < 0 || seatCol >= roomMap[0].length) {
        return ResponseEntity.status(400).body(Map.of("message", "Invalid seat position: " + seatRow + "-" + seatCol));
      }
      
      if (roomMap[seatRow][seatCol]) {
        return ResponseEntity.status(409).body(Map.of("message", "Seat " + seatRow + "-" + seatCol + " is already booked"));
      }
    }
    
    // 6. Create Booking record
    Booking booking = new Booking(customer, show, totalPrice, promoCode);
    
    // 7. Create Ticket records for each seat
    List<Ticket> ticketList = new ArrayList<>();
    for (Map<String, Object> seat : seats) {
      int seatRow = ((Number) seat.get("seatRow")).intValue();
      int seatCol = ((Number) seat.get("seatCol")).intValue();
      
      // Get ticket category if provided
      TicketCategory category = null;
      if (seat.containsKey("categoryId")) {
        Long categoryId = ((Number) seat.get("categoryId")).longValue();
        category = ticketCategoryRepository.findById(categoryId).orElse(null);
      }
      
      Ticket ticket = new Ticket(seatRow, seatCol, category, show, room, null);
      ticket.setBooking(booking);
      ticketList.add(ticket);
      
      // Mark seat as occupied
      roomMap[seatRow][seatCol] = true;
    }
    
    booking.setTickets(ticketList);
    
    // 8. Save everything
    bookingRepository.save(booking);
    showroomRepository.save(room);

    // 9. Send Email
    senderService.sendOrderConfirmation(customer, booking);
    
    // 10. Build response
    Map<String, Object> response = new HashMap<>();
    response.put("message", seats.size() + " tickets booked successfully");
    response.put("bookingId", booking.getId());
    response.put("ticketCount", ticketList.size());
    
    return ResponseEntity.ok(response);
  } catch (Exception e) {
    e.printStackTrace();
    return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
  }
}

//-----------------------BOOK SEAT (Legacy PUT)--------------------------
// Kept for backwards compatibility
@PutMapping("/bookseat/{showroomId}")
public ResponseEntity<Map<String, String>> bookSeatsLegacy(
  @PathVariable Long showroomId,
  @RequestBody TicketRequest tix
  ) {
  Optional<Showroom> sr = showroomRepository.findById(showroomId);
  if (sr.isEmpty()) {
    return ResponseEntity.status(404).body(Map.of("message", "Showroom not found."));
  }
  Showroom room = sr.get();
  boolean[][] roomMap = room.getSeats();

  for (Ticket ticket : tix.getTickets()) {
    int ticketRow = ticket.getSeatRow();
    int ticketCol = ticket.getSeatCol();
    roomMap[ticketRow][ticketCol] = true;
  }
  int tixSize = tix.getTickets().size();

  return ResponseEntity.ok(Map.of("message", tixSize + " tickets added"));
}

//-----------------------MY BOOKINGS--------------------------
// Get all bookings for the authenticated user
@GetMapping("/my-bookings")
public ResponseEntity<?> getMyBookings(
  @CookieValue(value = "jwt_token", required = false) String token
) {
  try {
    // 1. Authenticate user
    if (token == null || token.isEmpty()) {
      return ResponseEntity.status(401).body(Map.of("message", "Not authenticated"));
    }
    
    Long userId = jwtTokenProvider.getUserIdFromToken(token);
    String role = jwtTokenProvider.getRoleFromToken(token);
    
    if (!"CUSTOMER".equalsIgnoreCase(role)) {
      return ResponseEntity.status(403).body(Map.of("message", "Only customers can view bookings"));
    }
    
    // 2. Fetch bookings
    List<Booking> bookings = bookingRepository.findByCustomerIdOrderByCreatedAtDesc(userId);
    
    // 3. Transform to response DTOs with all necessary info
    List<Map<String, Object>> response = new ArrayList<>();
    for (Booking booking : bookings) {
      Map<String, Object> bookingData = new HashMap<>();
      bookingData.put("id", booking.getId());
      bookingData.put("createdAt", booking.getCreatedAt());
      bookingData.put("totalPrice", booking.getTotalPrice());
      bookingData.put("promoCode", booking.getPromoCode());
      
      // Get show/movie info
      Show show = booking.getShow();
      if (show == null) {
        for (Ticket ticket : booking.getTickets()) {
          if (ticket.getShow() != null) {
            show = ticket.getShow();
            break;
          }
        }
      }
      if (show != null) {
        bookingData.put("movieTitle", show.getMovie() != null ? show.getMovie().getTitle() : null);
        bookingData.put("showDate", show.getDate());
        bookingData.put("showTime", show.getStartTime());
        bookingData.put("theaterName", show.getTheaterName());
        bookingData.put("cinemaName", show.getCinemaName());
        bookingData.put("showroomLabel", show.getShowroomLabel());
      }
      
      // Get seats from tickets
      List<String> seats = new ArrayList<>();
      for (Ticket ticket : booking.getTickets()) {
        int row = ticket.getSeatRow();
        int col = ticket.getSeatCol();
        // Convert to letter+number format (e.g., A1, B5)
        String seatLabel = String.valueOf((char) ('A' + row)) + (col + 1);
        seats.add(seatLabel);
      }
      bookingData.put("seats", seats);
      bookingData.put("ticketCount", booking.getTickets().size());
      
      response.add(bookingData);
    }
    
    return ResponseEntity.ok(response);
  } catch (Exception e) {
    e.printStackTrace();
    return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
  }
}

// -----------------------------------------------------------


    /**
     * The endpoint to check if the backend is healthy.
     */
    @GetMapping("/health")
    public int getHealth() {
        return 200;
    }
  /**
   * Endpoint to send Emails
   */
    @PostMapping("/sendEmail")
    public ResponseEntity<Map<String, String>> sendEmail(
      @RequestBody Map<String, String> emailRequest
    ) {
      String toEmail = emailRequest.get("toEmail");
      String subject = emailRequest.get("subject");
      String body = emailRequest.get("body");

      senderService.sendEmail(toEmail, subject, body);
      return ResponseEntity.ok(Map.of("message", "Email sent successfully."));
    }

  /**
   * Endpoint to set new User
   * Don't use this
   */
  // attempting postmapping for setUser (registration)
  // also adds to customer repo
    @PostMapping("/setUser")
    public void receiveData(@RequestBody User newUser) {
      userRepository.save(newUser);
      //newUser = customerRepository.save(newUser);
      System.out.println("New user: " + newUser.getUsername());
    }
    // change url

  /**
   * Endpoint to set payment method by user

  @PostMapping("/setUserPayment/{id}")
  public void receiveData(@RequestBody PaymentMethod newCard, @PathVariable Long id) {
    List<Customer> currentCustomer = customerRepository.findById(id);
    paymentMethodRepository.save(newCard);
    currentCustomer.addPaymentMethod(newCard);
    customerRepository.save(currentCustomer);
    System.out.println("User " + id + ", Payment method: " + newCard.getCardNumber());
  }
   //Not actually sure if this works
   //findById isn't working, type incompatibility
   */


  /**
   * //edit profile
   * //Post Mapping to receive new values for Name, address, etc
   * //similar to setProfile but cannot allowed for email change
   */

    // ---------------------- ADMIN: ADD MOVIE (Sprint 3) ----------------------
@PostMapping(
        value = "admin/movies",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE
)
    public ResponseEntity<?> addMovie(@RequestBody Map<String, Object> body) {
        try {
            String title = (String) body.get("title");
            String director = (String) body.get("director");
            String producer = (String) body.get("producer");
        String synopsis = (String) body.get("synopsis");
        String posterLink = (String) body.get("posterLink");
        String trailerLink = (String) body.get("trailerLink");

        // Enum normalization (handles "Action", "action", "SCI FI", "pg-13", etc.)
        Object genreObj = body.get("movieGenre");
        if (genreObj == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "movieGenre is required"));
        }
        String genreStr = genreObj.toString().trim().toUpperCase().replace(" ", "_");
        if (genreStr.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "movieGenre cannot be empty"));
        }
        Movie.Genre genre;
        try {
            genre = Movie.Genre.valueOf(genreStr);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid genre: " + genreStr));
        }

        Object ratingObj = body.get("mpaaRating");
        if (ratingObj == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "mpaaRating is required"));
        }
        String ratingStr = ratingObj.toString().trim().toUpperCase().replace("-", "_").replace(" ", "_");
        if (ratingStr.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "mpaaRating cannot be empty"));
        }
        Movie.MPAA_Rating rating;
        try {
            rating = Movie.MPAA_Rating.valueOf(ratingStr);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid MPAA rating: " + ratingStr + ". Valid values are: G, PG, PG_13, R, NC_17"));
        }

      List<String> cast = (List<String>) body.get("castList");
if (cast == null) cast = new ArrayList<>();

Movie movie = new Movie(
        title,
        genre,
        cast,
        director,
        producer,
        synopsis,
        trailerLink,
        posterLink,
        new ArrayList<>(),   // shows
        new ArrayList<>(),   // reviews
        rating
);


        Movie saved = movieRepository.save(movie);
        return ResponseEntity.ok(saved);

    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.badRequest().body(
                Map.of("message", "Failed to add movie: " + e.getMessage())
        );
    }
}


    // ---------------------- ADMIN: ADD CAST MEMBER ----------------------
@PostMapping(
        value = "admin/movie_cast",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE
)
public ResponseEntity<?> addCastMember(@RequestBody Map<String, Object> body) {
    try {
        Long movieId = Long.valueOf(body.get("Movie_id").toString()); // frontend sends "Movie_id"
        String cast = (String) body.get("cast");

        if (cast == null || cast.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Cast name required."));
        }

        Optional<Movie> opt = movieRepository.findById(movieId);
        if (opt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Movie not found."));
        }

        Movie movie = opt.get();

        // assuming Movie has getCast() / setCast(List<String>)
        List<String> castList = movie.getCast();
        if (castList == null) castList = new ArrayList<>();
        castList.add(cast);

        movie.setCast(castList);
        movieRepository.save(movie);

        return ResponseEntity.ok(Map.of("message", "Cast added."));

    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(500).body(Map.of("message", "Failed to add cast."));
    }
}

    // ---------------------- ADMIN: ADD SHOWTIME ----------------------
@PostMapping(
        value = "admin/shows",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE
)
public ResponseEntity<?> addShow(@RequestBody Map<String, Object> body) {
    try {
        Object movieIdRaw = body.get("movie_id");
        Object showroomIdRaw = body.get("showroom_id");
        if (movieIdRaw == null || showroomIdRaw == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Missing movie or showroom id."));
        }

        Long movieId = Long.valueOf(movieIdRaw.toString());
        Long showroomId = Long.valueOf(showroomIdRaw.toString());
        if (movieService.get(movieId).isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Movie not found."));
        }

        String dateStr = (String) body.get("date");          // "YYYY-MM-DD"
        String startStr = (String) body.get("startTime");   // "HH:mm"
        String endStr = (String) body.get("endTime");       // "HH:mm"

        if (dateStr == null || startStr == null || endStr == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Missing date/time."));
        }

        LocalDate date = LocalDate.parse(dateStr);
        LocalTime start = LocalTime.parse(startStr);
        LocalTime end = LocalTime.parse(endStr);

        int duration = (int) Duration.between(start, end).toMinutes();
        if (duration <= 0 || !end.isAfter(start)) {
            return ResponseEntity.badRequest().body(Map.of("message", "End time must be after start time."));
        }

        Show show = new Show(
                duration,
                Date.valueOf(date),
                Time.valueOf(start),
                Time.valueOf(end)
        );

        Showroom showroom = showroomRepository.findById(showroomId)
                .orElseThrow(() -> new NoSuchElementException("Showroom not found."));

        show.setShowroom(showroom);

        Show savedShow = movieService.addShow(movieId, show);
        return ResponseEntity.ok(savedShow);

    } catch (SchedulingConflictException conflict) {
        return ResponseEntity.status(409).body(Map.of("message", conflict.getMessage()));
    } catch (DateTimeParseException e) {
        return ResponseEntity.badRequest().body(Map.of("message", "Invalid date or time format. Use YYYY-MM-DD and HH:mm."));
    } catch (IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
    } catch (NoSuchElementException e) {
        return ResponseEntity.status(404).body(Map.of("message", e.getMessage()));
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(500).body(Map.of("message", "Failed to add showtime."));
    }
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
    @Transactional
    @GetMapping("/initialize-db")
    public void initializeDb() {
        clearAllData();

        Date today = Date.valueOf(LocalDate.now());
        Date tomorrow = Date.valueOf(LocalDate.now().plusDays(1));
        Date weekend = Date.valueOf(LocalDate.now().plusDays(2));
        Date nextWeek = Date.valueOf(LocalDate.now().plusDays(7));

        Time brunch = Time.valueOf(LocalTime.of(10, 30));
        Time matinee = Time.valueOf(LocalTime.of(12, 0));
        Time afternoon = Time.valueOf(LocalTime.of(15, 15));
        Time evening = Time.valueOf(LocalTime.of(18, 45));
        Time lateShow = Time.valueOf(LocalTime.of(21, 30));

        TicketCategory adultCategory = ticketCategoryRepository.save(new TicketCategory("Adult", 15.00));
        TicketCategory childCategory = ticketCategoryRepository.save(new TicketCategory("Child", 9.50));
        TicketCategory seniorCategory = ticketCategoryRepository.save(new TicketCategory("Senior", 11.00));

        Date promoStart = Date.valueOf(LocalDate.now());
        Date promoEnd = Date.valueOf(LocalDate.now().plusDays(3));
        Promotion welcomePromo = promotionRepository.save(new Promotion("WELCOME10", 0.10, promoStart, promoEnd));
        Promotion loyaltyPromo = promotionRepository.save(new Promotion("LOYAL15", 0.15, promoStart, promoEnd));
        Promotion blockbusterPromo = promotionRepository.save(new Promotion("BLOCKBUSTER20", 0.20, promoStart, promoEnd));

        adminRepository.save(new Admin("admin@cinemae.com", "sysadmin", "System", "Admin", "admin123"));

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
                        "https://youtu.be/evAYWyfoZ4E?si=A9NEBQThCZM6FUid",
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
        List<Date> dateSlots = List.of(today, tomorrow, weekend, nextWeek);
        List<Time> timeSlots = List.of(brunch, matinee, afternoon, evening, lateShow);

        int moviesWithoutShowsCount = Math.min(2, savedMovies.size());
        List<Movie> moviesToSchedule = new ArrayList<>(savedMovies.subList(0, savedMovies.size() - moviesWithoutShowsCount));
        // Intentionally leave the remaining movies without scheduled showings (coming soon).

        class Slot {
            final Showroom showroom;
            final Time startTime;

            Slot(Showroom showroom, Time startTime) {
                this.showroom = showroom;
                this.startTime = startTime;
            }
        }

        List<Slot> slots = new ArrayList<>();
        for (Showroom room : showrooms) {
            for (Time start : timeSlots) {
                slots.add(new Slot(room, start));
            }
        }

        for (int dateIdx = 0; dateIdx < dateSlots.size(); dateIdx++) {
            Date showDate = dateSlots.get(dateIdx);

            for (int movieIdx = 0; movieIdx < moviesToSchedule.size(); movieIdx++) {
                Movie movie = moviesToSchedule.get(movieIdx);
                int duration = 105 + (movie.getTitle().length() % 25) + (dateIdx * 5);

                int attempt = 0;
                int slotSeed = (dateIdx * 5 + movieIdx * 3) % slots.size();
                boolean scheduled = false;

                while (attempt < slots.size() && !scheduled) {
                    Slot slot = slots.get((slotSeed + attempt) % slots.size());
                    Show scheduledShow = new Show(duration, showDate, slot.startTime, addMinutes(slot.startTime, duration));
                    scheduledShow.setShowroom(slot.showroom);

                    try {
                        scheduledShows.add(movieService.addShow(movie.getId(), scheduledShow));
                        scheduled = true;
                    } catch (SchedulingConflictException conflict) {
                        attempt++;
                    }
                }

                if (!scheduled) {
                    throw new IllegalStateException("Unable to schedule " + movie.getTitle() + " on " + showDate);
                }
            }
        }

        for (Movie movie : savedMovies) {
            movieService.addReview(movie.getId(), new Review(5, movie.getTitle() + " was incredible on the big screen."));
            movieService.addReview(movie.getId(), new Review(4, "Crowd loved the show and sound design."));
        }

        Customer demoUser = new Customer(
                "demo.user@cinemae.com",
                "demouser",
                "Demo",
                "User",
                "password123",
                Customer.CustomerState.ACTIVE,
                new ArrayList<>(),
                new ArrayList<>(),
                "123 Main St",
                "Anytown",
                "CA",
                "12345",
                "USA"
        );
        demoUser.setPhoneNumber("555-123-4567");
        demoUser.addPromotion(welcomePromo);
        demoUser.setRegisteredForPromos(true);
        demoUser.setVerified(true);
        demoUser = customerRepository.save(demoUser);

        // Payment method 1: Uses main address for billing (same as customer address)
        PaymentMethod demoCard1 = paymentMethodRepository.save(
                new PaymentMethod(
                        demoUser,
                        "4111111111111111",
                        "Demo",
                        "User",
                        java.sql.Date.valueOf(LocalDate.now().plusYears(3)),
                        123,
                        12345,
                        "USA",
                        "CA",
                        "Anytown",
                        "123 Main St"
                )
        );
        demoUser.addPaymentMethod(demoCard1);

        // Payment method 2: Different billing address
        PaymentMethod demoCard2 = paymentMethodRepository.save(
                new PaymentMethod(
                        demoUser,
                        "5500000000000004",
                        "Demo",
                        "User",
                        java.sql.Date.valueOf(LocalDate.now().plusYears(2)),
                        456,
                        30338,
                        "USA",
                        "GA",
                        "Atlanta",
                        "456 Peachtree St"
                )
        );
        demoUser.addPaymentMethod(demoCard2);

        // Payment method 3: Another different billing address
        PaymentMethod demoCard3 = paymentMethodRepository.save(
                new PaymentMethod(
                        demoUser,
                        "340000000000009",
                        "Demo",
                        "User",
                        java.sql.Date.valueOf(LocalDate.now().plusYears(4)),
                        789,
                        10001,
                        "USA",
                        "NY",
                        "New York",
                        "789 Broadway Ave"
                )
        );
        demoUser.addPaymentMethod(demoCard3);

        customerRepository.save(demoUser);

        if (!scheduledShows.isEmpty()) {
            Booking demoBooking = bookingRepository.save(new Booking(new ArrayList<>(), demoUser));
            demoUser.addBooking(demoBooking);

            issueTicket(demoBooking, scheduledShows.get(0), adultCategory, 1, 4, demoCard1);
            issueTicket(demoBooking, scheduledShows.get(0), childCategory, 1, 5, demoCard1);
            bookingRepository.save(demoBooking);

            if (scheduledShows.size() > 1) {
                Booking demoFollowUp = bookingRepository.save(new Booking(new ArrayList<>(), demoUser));
                demoUser.addBooking(demoFollowUp);
                issueTicket(demoFollowUp, scheduledShows.get(1), seniorCategory, 2, 3, demoCard2);
                bookingRepository.save(demoFollowUp);
            }
        }

        customerRepository.save(demoUser);
        promotionRepository.saveAll(List.of(welcomePromo, loyaltyPromo, blockbusterPromo));
    }

    /**
     * The endpoint to clear the database.
     */
    @Transactional
    @GetMapping("/clear-db")
    public void clearDb() {
        clearAllData();
    }

    @PersistenceContext
    private EntityManager entityManager;

    private void clearAllData() {
        // Use native SQL to avoid loading entities with encrypted fields that may fail decryption
        // Wrap each in try-catch since tables may not exist on fresh database
        String[] tables = {
            // delete from child tables first to avoid FK issues
            "ticket",
            "booking",
            "show",
            "review",
            "movie",
            "payment_method",
            "customer_promotion",
            "customer",
            "promotion",
            "ticket_category",
            "showroom",
            "theater",
            "cinema",
            "admin"
        };
        for (String table : tables) {
            try {
                entityManager.createNativeQuery("DELETE FROM " + table).executeUpdate();
            } catch (Exception e) {
                // Table may not exist on fresh database - ignore
            }
        }
    }

    private Time addMinutes(Time startTime, int minutes) {
        return Time.valueOf(startTime.toLocalTime().plusMinutes(minutes));
    }

    private void issueTicket(Booking booking, Show show, TicketCategory category, int seatRow, int seatCol, PaymentMethod paymentMethod) {
        Ticket ticket = new Ticket(seatRow, seatCol, category, show, show.getShowroom(), paymentMethod);
        booking.addTicket(ticket);
        if (booking.getShow() == null && show != null) {
            booking.setShow(show);
        }
        show.getShowroom().occupySeat(seatRow, seatCol);
        ticketRepository.save(ticket);
    }

    private Integer toInteger(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof Number) {
            return ((Number) value).intValue();
        }
        try {
            return Integer.parseInt(value.toString());
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
