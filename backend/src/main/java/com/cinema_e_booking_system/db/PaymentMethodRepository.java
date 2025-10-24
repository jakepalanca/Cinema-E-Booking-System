package com.cinema_e_booking_system.db;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * The repository for the PaymentMethod entity.
 */
public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, Long> {
}