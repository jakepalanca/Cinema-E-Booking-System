package com.cinema_e_booking_system.backend;

import com.cinema_e_booking_system.db.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.cinema_e_booking_system")
@EnableJpaRepositories(basePackages = "com.cinema_e_booking_system")
@EntityScan(basePackages = "com.cinema_e_booking_system")
public class BackendApplication {
    @Autowired
    MovieRepository movieRepository;

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }
}
