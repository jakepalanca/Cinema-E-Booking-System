package com.cinema_e_booking_system.db;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
/**
 * The repository for the Customer entity.
 */
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByEmail(String email);
    Optional<Customer> findByVerificationToken(String verificationToken);
}
