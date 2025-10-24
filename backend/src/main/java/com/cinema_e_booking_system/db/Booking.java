package com.cinema_e_booking_system.db;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.ArrayList;
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
    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("booking-tickets")
    private List<Ticket> tickets = new ArrayList<>();

    /**
     * The customer that owns this booking.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id") // Foreign Key
    @JsonBackReference("customer-bookings")
    private Customer customer;

    protected Booking() {
        // JPA requirement
    }

    public Booking(List<Ticket> tickets, Customer customer) {
        setTickets(tickets);
        setCustomer(customer);
    }

    public Long getId() {
        return id;
    }

    public List<Ticket> getTickets() {
        return tickets;
    }

    public void setTickets(List<Ticket> tickets) {
        this.tickets.clear();
        if (tickets != null) {
            tickets.forEach(this::addTicket);
        }
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public void addTicket(Ticket ticket) {
        if (ticket == null) {
            return;
        }
        if (!this.tickets.contains(ticket)) {
            ticket.setBooking(this);
            this.tickets.add(ticket);
        }
    }

    public void removeTicket(Ticket ticket) {
        if (ticket == null) {
            return;
        }
        if (this.tickets.remove(ticket)) {
            ticket.setBooking(null);
        }
    }
}
