package com.cinema_e_booking_system.db;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "ticket")
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int seatRow;
    private int seatCol;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ticket_category_id")
    @JsonBackReference("category-tickets")
    private TicketCategory ticketCategory;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "showroom_id")
    @JsonBackReference("showroom-tickets")
    private Showroom showroom;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "show_id")
    @JsonBackReference("show-tickets")
    private Show show;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id")
    @JsonBackReference("booking-tickets")
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paymenty_method_id")
    @JsonBackReference("payment_method-tickets")
    private PaymentMethod paymentMethod;

    protected Ticket() {
        // JPA requirement
    }

    public Ticket(int seatRow, int seatCol, TicketCategory ticketCategory, Show show, Showroom showroom, PaymentMethod paymentMethod) {
        this.seatRow = seatRow;
        this.seatCol = seatCol;
        this.ticketCategory = ticketCategory;
        this.show = show;
        this.showroom = showroom;
        this.paymentMethod = paymentMethod;
    }

    public Long getId() {
        return id;
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

    public Show getShow() {
        return show;
    }

    public void setShow(Show show) {
        this.show = show;
    }

    public Booking getBooking() {
        return booking;
    }

    public void setBooking(Booking booking) {
        this.booking = booking;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}
