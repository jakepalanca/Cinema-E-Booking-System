package com.cinema_e_booking_system.db;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

/**
 * The repository for the Promotion entity.
 */
public interface PromotionRepository extends JpaRepository<Promotion, Long> {
  Optional<Promotion> findByCode(String code);
}
