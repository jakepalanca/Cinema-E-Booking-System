package com.cinema_e_booking_system.db;

import jakarta.persistence.Entity;

public class Review {
    
    public enum Rating {
        ONE, 
        TWO, 
        THREE,
        FOUR, 
        FIVE
    }

    String reviewMessage;
    Rating reviewRating;

    public Review(String m, Rating r) {
        this.reviewMessage = m;
        this.reviewRating = r;
    }

    
}
