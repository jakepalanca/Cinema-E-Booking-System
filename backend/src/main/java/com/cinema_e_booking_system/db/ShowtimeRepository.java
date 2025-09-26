package com.cinema_e_booking_system.db;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ShowtimeRepository extends JpaRepository<Showtime, Long> {
    // leave blank
}