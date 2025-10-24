package com.cinema_e_booking_system.db;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * The repository for the Booking entity.
 */
public interface BookingRepository extends JpaRepository<Booking, Long> {
}