package com.cinema_e_booking_system.db;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

/**
 * The repository for the User entity.
 */
public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByEmail(String email);
}
