package com.cinema_e_booking_system.backend;

import com.cinema_e_booking_system.backend.security.JwtTokenProvider;
import com.cinema_e_booking_system.db.Admin;
import com.cinema_e_booking_system.db.AdminRepository;
import com.cinema_e_booking_system.db.Customer;
import com.cinema_e_booking_system.db.CustomerRepository;
import com.cinema_e_booking_system.db.StringCryptoConverter;
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
     * Login endpoint that returns JWT token.
     */
    @PostMapping(
        value = "/login",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
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

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("type", "Bearer");
            response.put("message", "Login successful for " + customer.getFirstName());
            response.put("role", "customer");
            response.put("email", customer.getEmail());
            response.put("id", customer.getId());
            response.put("username", customer.getUsername());
            response.put("firstName", customer.getFirstName());
            response.put("lastName", customer.getLastName());

            return ResponseEntity.ok(response);
        }

        // Try to find as admin
        Optional<Admin> adminOpt = adminRepository.findByEmail(emailOrUsername);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            
            // For admin, password is stored as plain text in the seed data
            // In production, this should also be encrypted
            if (!admin.getPassword().equals(password)) {
                return ResponseEntity.status(401).body(Map.of("message", "Incorrect password."));
            }

            // Generate JWT token
            String token = jwtTokenProvider.generateToken(admin.getEmail(), "ADMIN", admin.getId());

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("type", "Bearer");
            response.put("message", "Login successful for admin " + admin.getFirstName());
            response.put("role", "admin");
            response.put("email", admin.getEmail());
            response.put("id", admin.getId());
            response.put("username", admin.getUsername());
            response.put("firstName", admin.getFirstName());
            response.put("lastName", admin.getLastName());

            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(401).body(Map.of("message", "User not found."));
    }

    /**
     * Endpoint to get current user info from JWT token.
     */
    @GetMapping("/auth/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7); // Remove "Bearer " prefix
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
}

