package com.cinema_e_booking_system.db;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * The repository for the Showtime entity.
 */
public interface ShowtimeRepository extends JpaRepository<Showtime, Long> {
}