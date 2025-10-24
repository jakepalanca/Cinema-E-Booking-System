package com.cinema_e_booking_system.db;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ticket_category")
public class TicketCategory {

    /**
     * The primary key of the ticket category.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Child, adult, senior
    private String name;

    private double price;

    @OneToMany(mappedBy = "ticketCategory", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("category-tickets")
    private List<Ticket> tickets = new ArrayList<>();

    protected TicketCategory() {
        // JPA requirement
    }

    public TicketCategory(String name, double price) {
        this.name = name;
        this.price = price;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public Long getId() {
        return id;
    }

    public List<Ticket> getTickets() {
        return tickets;
    }

    public void setTickets(List<Ticket> tickets) {
        this.tickets = tickets;
    }
}
