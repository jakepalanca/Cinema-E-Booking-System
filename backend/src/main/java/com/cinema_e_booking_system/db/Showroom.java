package com.cinema_e_booking_system.db;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.security.InvalidParameterException;

@Entity
@Table(name = "showroom")
public class Showroom {

    /**
     * The primary key of a showroom.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    Long id;

    /**
     * The cinema associated with this theater.
     * One-To-One
     */
    @OneToMany(mappedBy = "seat", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference("seats-in-showroom") // NOT Foreign Key
    boolean[][] seats;

    @ManyToOne
    @JoinColumn(name = "theater_id")
    Theater theater;

    int seatCount;
    int roomWidth; // # of seat rows [MUST BE 1 OR MORE] (increasing from top facing theater to bottom back wall
    int roomHeight; // # of seat columns [MUST BE 1 OR MORE] (increasing from left of lefter to right of theater

    public Showroom(int roomHeight, int roomWidth) throws InvalidParameterException {
        if (roomHeight <= 0 || roomWidth <= 0) {
            throw new InvalidParameterException("Room height and room width are invalid");
        }
        this.seats = new boolean[roomHeight - 1][roomWidth - 1]; // subtract one for 0-indexing of arrays
        for (int x = 0; x < roomHeight - 1; x++) {
            for (int y = 0; y < roomWidth - 1; y++) {
                seats[x][y] = false;
            }
        }
        int seatCount = roomHeight * roomWidth;
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
}

