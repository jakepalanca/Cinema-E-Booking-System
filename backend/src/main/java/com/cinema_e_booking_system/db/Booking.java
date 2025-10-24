package com.cinema_e_booking_system.db;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.util.List;

/**
 * The entity for a booking.
 */
@Entity
@Table(name = "booking")
public class Booking {

    /**
     * The primary key of the review.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    /**
     * The tickets that belong to this booking.
     */
    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "tickets") // Foreign Key
    @JsonBackReference("booking-tickets")
    private List<Ticket> tickets;

    /**
     * The customer that owns this booking.
     */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer") // Foreign Key
    @JsonBackReference("booking-customer")
    private Customer customer;

    public Booking(List<Ticket> tickets, Customer customer) {
        this.tickets = tickets;
    }
}
