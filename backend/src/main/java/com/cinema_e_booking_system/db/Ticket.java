package com.cinema_e_booking_system.db;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

@Entity
@Table(name = "ticket")
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int seatRow;
    private int seatCol;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference("ticket-ticketcategory") // NOT Foreign Key
    private TicketCategory ticketCategory;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference("showroom-ticketcategory") // NOT Foreign Key
    private Showroom showroom;

    public Ticket(int seatRow, int seatCol, TicketCategory ticketCategory,  Showroom showroom) {
        this.seatRow = seatRow;
        this.seatCol = seatCol;
        this.ticketCategory = ticketCategory;
        this.showroom = showroom;
    }

    public int getSeatRow() {
        return seatRow;
    }

    public void setSeatRow(int seatRow) {
        this.seatRow = seatRow;
    }

    public int getSeatCol() {
        return seatCol;
    }

    public void setSeatCol(int seatCol) {
        this.seatCol = seatCol;
    }

    public TicketCategory getTicketCategory() {
        return ticketCategory;
    }

    public void setTicketCategory(TicketCategory ticketCategory) {
        this.ticketCategory = ticketCategory;
    }

    public Showroom getShowroom() {
        return showroom;
    }

    public void setShowroom(Showroom showroom) {
        this.showroom = showroom;
    }
}
