package com.cinema_e_booking_system.db;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;
/**
 * The repository for the Customer entity.
 */
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByEmail(String email);
    Optional<Customer> findByVerificationToken(String verificationToken);
    Optional<Customer> findByResetToken(String resetToken);
    Optional<Customer> findByUsername(String username);
    List<Customer> findAllByRegisteredForPromosTrue();
}
