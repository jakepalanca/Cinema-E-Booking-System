package com.cinema_e_booking_system.db;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "ticket_category")
public class TicketCategory {

    /**
     * The primary key of the ticket category.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * A ticket category can "have" many movies
     * One-To-Many
     */
    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id") // Foreign Key
    @JsonBackReference("ticket-category-of-ticket")
    private Ticket ticket;

    // Child, adult, senior
    private String name;

    private double price;

    public TicketCategory(Ticket ticket, String name, double price) {
        this.ticket = ticket;
        this.name = name;
        this.price = price;
    }

    public void  setTicket(Ticket ticket) {
        this.ticket = ticket;
    }

    public Ticket getTicket() {
        return ticket;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
