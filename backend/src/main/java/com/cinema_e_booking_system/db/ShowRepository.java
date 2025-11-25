package com.cinema_e_booking_system.db;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Date;
import java.sql.Time;

/**
 * Repository for movie shows.
 */
public interface ShowRepository extends JpaRepository<Show, Long> {

    // Any overlap in same showroom/date
    @Query("""
        SELECT CASE WHEN COUNT(s) > 0 THEN true ELSE false END
        FROM Show s
        WHERE s.showroom.id = :showroomId
          AND s.date = :date
          AND (:startTime < s.endTime AND :endTime > s.startTime)
    """)
    boolean existsOverlapConflict(
            @Param("showroomId") Long showroomId,
            @Param("date") Date date,
            @Param("startTime") Time startTime,
            @Param("endTime") Time endTime
    );
}
