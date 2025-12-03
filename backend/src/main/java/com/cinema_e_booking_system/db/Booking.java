package com.cinema_e_booking_system.db;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * The entity for a booking.
 */
@Entity
@Table(name = "booking")
public class Booking {

    /**
     * The tickets that belong to this booking.
     */
    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("booking-tickets")
    private final List<Ticket> tickets = new ArrayList<>();
    /**
     * The primary key of the booking.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    /**
     * The customer that owns this booking.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id") // Foreign Key
    @JsonBackReference("customer-bookings")
    private Customer customer;

    /**
     * When the booking was created.
     */
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    /**
     * Total price at time of booking (after discounts).
     */
    @Column(name = "total_price")
    private Double totalPrice;

    /**
     * Promo code used, if any.
     */
    @Column(name = "promo_code")
    private String promoCode;

    /**
     * The show this booking is for.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "show_id")
    private Show show;

    protected Booking() {
        // JPA requirement
    }

    public Booking(List<Ticket> tickets, Customer customer) {
        setTickets(tickets);
        setCustomer(customer);
        this.createdAt = LocalDateTime.now();
    }

    public Booking(Customer customer, Show show, Double totalPrice, String promoCode) {
        setCustomer(customer);
        this.show = show;
        this.totalPrice = totalPrice;
        this.promoCode = promoCode;
        this.createdAt = LocalDateTime.now();
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getPromoCode() {
        return promoCode;
    }

    public void setPromoCode(String promoCode) {
        this.promoCode = promoCode;
    }

    public Show getShow() {
        return show;
    }

    public void setShow(Show show) {
        this.show = show;
    }
}
