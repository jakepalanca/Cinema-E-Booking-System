package com.cinema_e_booking_system.db;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.security.InvalidParameterException;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "showroom")
public class Showroom {

    /**
     * The primary key of a showroom.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    /**
     * The seat map - stored as JSON in the database via converter.
     */
    @Convert(converter = BooleanArrayConverter.class)
    @Column(name = "seats", columnDefinition = "TEXT")
    private boolean[][] seats;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "theater_id")
    @JsonBackReference("theater-showrooms")
    private Theater theater;

    private int seatCount;
    private int roomWidth; // # of seat rows [MUST BE 1 OR MORE] (increasing from top facing theater to bottom back wall
    private int roomHeight; // # of seat columns [MUST BE 1 OR MORE] (increasing from left of lefter to right of theater

    @OneToMany(mappedBy = "showroom", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("showroom-shows")
    private List<Show> shows = new ArrayList<>();

    @OneToMany(mappedBy = "showroom", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("showroom-tickets")
    private List<Ticket> tickets = new ArrayList<>();

    protected Showroom() {
        // JPA requirement
    }

    public Showroom(Theater theater, int roomHeight, int roomWidth) throws InvalidParameterException {
        if (roomHeight <= 0 || roomWidth <= 0) {
            throw new InvalidParameterException("Room height and room width are invalid");
        }
        this.theater = theater;
        this.roomHeight = roomHeight;
        this.roomWidth = roomWidth;
        this.seats = new boolean[roomHeight][roomWidth];
        for (int x = 0; x < roomHeight; x++) {
            for (int y = 0; y < roomWidth; y++) {
                seats[x][y] = false;
            }
        }
        this.seatCount = roomHeight * roomWidth;
    }

    // GETTERS AND SETTERS

    public Theater getTheater() {
        return theater;
    }

    public void setTheater(Theater theater) {
        this.theater = theater;
    }

    public boolean[][] getSeats() {
        return seats;
    }

    public void setSeats(boolean[][] seats) {
        this.seats = seats;
    }

    public int getSeatCount() {
        return seatCount;
    }

    public void setSeatCount(int seatCount) {
        this.seatCount = seatCount;
    }

    public int getRoomWidth() {
        return roomWidth;
    }

    public void setRoomWidth(int roomWidth) {
        this.roomWidth = roomWidth;
    }

    public int getRoomHeight() {
        return roomHeight;
    }

    public void setRoomHeight(int roomHeight) {
        this.roomHeight = roomHeight;
    }

    public List<Show> getShows() {
        return shows;
    }

    public void setShows(List<Show> shows) {
        this.shows = shows;
    }

    public List<Ticket> getTickets() {
        return tickets;
    }

    public void setTickets(List<Ticket> tickets) {
        this.tickets = tickets;
    }

    public Long getId() {
        return id;
    }

    public boolean seatIsTaken(int row, int col) {
        if (seats == null || row < 0 || col < 0 || row >= roomHeight || col >= roomWidth) {
            throw new InvalidParameterException("Seat coordinates are invalid.");
        }
        return seats[row][col];
    }

    public void occupySeat(int row, int col) {
        if (seats == null || row < 0 || col < 0 || row >= roomHeight || col >= roomWidth) {
            throw new InvalidParameterException("Seat coordinates are invalid.");
        }
        seats[row][col] = true;
    }
}
