package com.cinema_e_booking_system.db;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.security.InvalidParameterException;
import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "promotion")
public class Promotion {

    @ManyToMany(mappedBy = "promotions")
    @JsonBackReference("customer-promotions")
    private final List<Customer> customers = new ArrayList<>();
    /**
     * The primary key of promotion.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private boolean hasBeenApplied = false;

    @Column(nullable = false, unique = true)
    private String code;
    // 0.00 - 1.00
    private double discountPercentage;
    private Date startDate;
    private Date endDate;

    protected Promotion() {
        // JPA requirement
    }

    public Promotion(String code, double discountPercentage) throws InvalidParameterException {
        if ((discountPercentage < 0.00 || discountPercentage > 1.00) || code == null) {
            throw new InvalidParameterException("Invalid Promotion code or discount percentage.");
        }
        this.code = code;
        this.discountPercentage = discountPercentage;
    }

    public Promotion(String code, double discountPercentage, Date startDate, Date endDate) throws InvalidParameterException {
        this(code, discountPercentage);
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public Long getId() {
        return id;
    }

    public String getCode() {
        return code;
    }

    public double getDiscountPercentage() {
        return discountPercentage;
    }

    public List<Customer> getCustomers() {
        return customers;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public void setHasBeenApplied(boolean hasBeenApplied) {
        this.hasBeenApplied = hasBeenApplied;
    }

    public boolean getHasBeenApplied() {
        return hasBeenApplied;
    }
}
