package com.cinema_e_booking_system.db;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repository for movie shows.
 */
public interface ShowRepository extends JpaRepository<Show, Long> {
}
