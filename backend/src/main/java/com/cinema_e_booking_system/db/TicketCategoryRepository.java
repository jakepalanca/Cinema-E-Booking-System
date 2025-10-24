package com.cinema_e_booking_system.db;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * The repository for the TicketCategory entity.
 */
public interface TicketCategoryRepository extends JpaRepository<TicketCategory, Long> {
}