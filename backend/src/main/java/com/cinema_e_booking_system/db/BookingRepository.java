package com.cinema_e_booking_system.db;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * The repository for the Booking entity.
 */
public interface BookingRepository extends JpaRepository<Booking, Long> {

    /**
     * Find all bookings for a customer, ordered by most recent first.
     */
    @Query("SELECT b FROM Booking b WHERE b.customer.id = :customerId ORDER BY b.createdAt DESC")
    List<Booking> findByCustomerIdOrderByCreatedAtDesc(@Param("customerId") Long customerId);
}