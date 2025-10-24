package com.cinema_e_booking_system.db;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * The repository for the Cinema entity.
 */
public interface CinemaRepository extends JpaRepository<Cinema, Long> {
}