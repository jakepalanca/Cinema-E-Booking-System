package com.cinema_e_booking_system.backend;

import com.cinema_e_booking_system.backend.security.JwtTokenProvider;
import com.cinema_e_booking_system.db.Admin;
import com.cinema_e_booking_system.db.AdminRepository;
import com.cinema_e_booking_system.db.Customer;
import com.cinema_e_booking_system.db.CustomerRepository;
import com.cinema_e_booking_system.db.StringCryptoConverter;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Controller for authentication endpoints.
 */
@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class AuthController {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    /**
     * Login endpoint that sets JWT token as HTTP-only cookie.
     */
    @PostMapping(
        value = "/login",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials, HttpServletResponse response) {
        String emailOrUsername = credentials.get("emailOrUsername");
        String password = credentials.get("password");

        if (emailOrUsername == null || password == null) {
            return ResponseEntity.status(400).body(Map.of("message", "Email/username and password are required."));
        }

        StringCryptoConverter crypto = new StringCryptoConverter();

        // Try to find as customer first
        Optional<Customer> customerOpt = customerRepository.findByEmail(emailOrUsername);
        if (customerOpt.isEmpty()) {
            customerOpt = customerRepository.findByUsername(emailOrUsername);
        }

        if (customerOpt.isPresent()) {
            Customer customer = customerOpt.get();
            
            // Decrypt password for verification
            String decryptedPassword = null;
            try {
                decryptedPassword = crypto.convertToEntityAttribute(customer.getPassword());
            } catch (Exception e) {
                // Password might be plain text or encryption failed
                System.out.println("Password decryption failed, trying plain text comparison");
            }

            // Verify password - check both encrypted (if decryption failed) and decrypted
            boolean passwordMatches = false;
            if (decryptedPassword != null) {
                passwordMatches = password.equals(decryptedPassword);
            }
            // Also check against stored password (in case it's plain text)
            if (!passwordMatches) {
                passwordMatches = password.equals(customer.getPassword());
            }

            if (!passwordMatches) {
                return ResponseEntity.status(401).body(Map.of("message", "Incorrect password."));
            }

            // Check if account is verified
            if (!customer.isVerified()) {
                return ResponseEntity.status(401).body(Map.of("message", "Account not verified. Please verify your email."));
            }

            // Generate JWT token
            String token = jwtTokenProvider.generateToken(customer.getEmail(), "CUSTOMER", customer.getId());

            // Set JWT token as HTTP-only cookie
            Cookie jwtCookie = new Cookie("jwt_token", token);
            jwtCookie.setHttpOnly(true);
            jwtCookie.setSecure(false); // Set to true in production with HTTPS
            jwtCookie.setPath("/");
            jwtCookie.setMaxAge(86400); // 24 hours in seconds
            response.addCookie(jwtCookie);

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("message", "Login successful for " + customer.getFirstName());
            responseBody.put("role", "customer");
            responseBody.put("email", customer.getEmail());
            responseBody.put("id", customer.getId());
            responseBody.put("username", customer.getUsername());
            responseBody.put("firstName", customer.getFirstName());
            responseBody.put("lastName", customer.getLastName());

            return ResponseEntity.ok(responseBody);
        }

        // Try to find as admin
        Optional<Admin> adminOpt = adminRepository.findByEmail(emailOrUsername);
        if (adminOpt.isEmpty()) {
            adminOpt = adminRepository.findByUsername(emailOrUsername);
        }
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            
            // Decrypt password for verification (admin passwords are now encrypted in production)
            String decryptedPassword = null;
            try {
                decryptedPassword = crypto.convertToEntityAttribute(admin.getPassword());
            } catch (Exception e) {
                // Password might be plain text or encryption failed
                System.out.println("Admin password decryption failed, trying plain text comparison");
            }

            // Verify password - check both encrypted (if decryption failed) and decrypted
            boolean passwordMatches = false;
            if (decryptedPassword != null) {
                passwordMatches = password.equals(decryptedPassword);
            }
            // Also check against stored password (in case it's plain text for backward compatibility)
            if (!passwordMatches) {
                passwordMatches = password.equals(admin.getPassword());
            }

            if (!passwordMatches) {
                return ResponseEntity.status(401).body(Map.of("message", "Incorrect password."));
            }

            // Generate JWT token
            String token = jwtTokenProvider.generateToken(admin.getEmail(), "ADMIN", admin.getId());

            // Set JWT token as HTTP-only cookie
            Cookie jwtCookie = new Cookie("jwt_token", token);
            jwtCookie.setHttpOnly(true);
            jwtCookie.setSecure(true);
            jwtCookie.setPath("/");
            jwtCookie.setMaxAge(86400); // 24 hours in seconds
            response.addCookie(jwtCookie);

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("message", "Login successful for admin " + admin.getFirstName());
            responseBody.put("role", "admin");
            responseBody.put("email", admin.getEmail());
            responseBody.put("id", admin.getId());
            responseBody.put("username", admin.getUsername());
            responseBody.put("firstName", admin.getFirstName());
            responseBody.put("lastName", admin.getLastName());

            return ResponseEntity.ok(responseBody);
        }

        return ResponseEntity.status(401).body(Map.of("message", "User not found."));
    }

    /**
     * Endpoint to get current user info from JWT token cookie.
     */
    @GetMapping("/auth/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(@CookieValue(value = "jwt_token", required = false) String token) {
        try {
            if (token == null || token.isEmpty()) {
                return ResponseEntity.status(401).body(Map.of("message", "No token found."));
            }
            
            String email = jwtTokenProvider.getUsernameFromToken(token);
            String role = jwtTokenProvider.getRoleFromToken(token);
            Long userId = jwtTokenProvider.getUserIdFromToken(token);

            Map<String, Object> response = new HashMap<>();
            response.put("email", email);
            response.put("role", role);
            response.put("id", userId);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid token."));
        }
    }

    /**
     * Logout endpoint that clears the JWT cookie.
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(HttpServletResponse response) {
        // Clear the JWT cookie by setting it to expire immediately
        Cookie jwtCookie = new Cookie("jwt_token", "");
        jwtCookie.setHttpOnly(true);
        jwtCookie.setSecure(false);
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(0); // Expire immediately
        response.addCookie(jwtCookie);

        return ResponseEntity.ok(Map.of("message", "Logout successful"));
    }
}

