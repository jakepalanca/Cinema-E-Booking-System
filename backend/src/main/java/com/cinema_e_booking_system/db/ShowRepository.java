package com.cinema_e_booking_system.db;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Date;
import java.sql.Time;

public interface ShowRepository extends JpaRepository<Show, Long> {

    @Query("""
        SELECT CASE WHEN COUNT(s) > 0 THEN true ELSE false END
        FROM Show s
        WHERE s.showroom.id = :showroomId
          AND s.date = :date
          AND s.startTime = :startTime
    """)
    boolean existsExactConflict(
            @Param("showroomId") Long showroomId,
            @Param("date") Date date,
            @Param("startTime") Time startTime
    );
}
