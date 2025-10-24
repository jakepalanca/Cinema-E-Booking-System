package com.cinema_e_booking_system.db;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * The repository for the User entity.
 */
public interface UserRepository extends JpaRepository<User, Long> {
}