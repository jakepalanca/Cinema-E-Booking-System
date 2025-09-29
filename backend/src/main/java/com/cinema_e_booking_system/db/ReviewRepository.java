package com.cinema_e_booking_system.db;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * The repository for the Review entity.
 */
public interface ReviewRepository extends JpaRepository<Review, Long> {
}