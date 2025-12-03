package com.cinema_e_booking_system.db;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "theater")
public class Theater {

    /**
     * The primary key of a theater.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The cinema associated with this theater.
     * One-To-One
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cinema_id")
    @JsonBackReference("cinema-theaters")
    private Cinema cinema;

    private String name;

    private String address;

    @OneToMany(mappedBy = "theater", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("theater-showrooms")
    private List<Showroom> showrooms = new ArrayList<>();

    protected Theater() {
        // JPA requirement
    }

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

    public List<Showroom> getShowrooms() {
        return showrooms;
    }

    public void setShowrooms(List<Showroom> showrooms) {
        this.showrooms = showrooms;
    }
}
