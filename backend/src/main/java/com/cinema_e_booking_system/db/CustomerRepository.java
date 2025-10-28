package com.cinema_e_booking_system.db;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * The repository for the Customer entity.
 */
public interface CustomerRepository extends JpaRepository<Customer, Long> {
}