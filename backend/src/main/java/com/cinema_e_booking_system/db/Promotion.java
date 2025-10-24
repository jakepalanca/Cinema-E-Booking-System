package com.cinema_e_booking_system.db;

import jakarta.persistence.*;

import java.security.InvalidParameterException;
import java.util.InvalidPropertiesFormatException;

@Entity
@Table(name = "promotion")
public class Promotion {

    /**
     * The primary key of promotion.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    Long id;

    String code;

    // 0.00 - 1.00
    double discountPercentage;

    public Promotion(String code, double discountPercentage) throws InvalidParameterException {
        if ((discountPercentage < 0.00 || discountPercentage > 1.00) || code == null) {
            throw new InvalidParameterException("Invalid Promotion code or discount percentage.");
        }
        this.code = code;
        this.discountPercentage = discountPercentage;
    }

}
