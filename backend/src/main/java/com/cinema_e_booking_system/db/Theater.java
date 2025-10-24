package com.cinema_e_booking_system.db;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "theater")
public class Theater {

    /**
     * The primary key of a theater.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    Long id;

    /**
     * The cinema associated with this theater.
     * One-To-One
     */
    @OneToOne(mappedBy = "cinema", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference("theater-cinema") // NOT Foreign Key
    Cinema cinema;

    String name;

    String address;

    public Theater(Cinema cinema, String name, String address) {
        this.cinema = cinema;
        this.name = name;
        this.address = address;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Cinema getCinema() {
        return cinema;
    }

    public void setCinema(Cinema cinema) {
        this.cinema = cinema;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}