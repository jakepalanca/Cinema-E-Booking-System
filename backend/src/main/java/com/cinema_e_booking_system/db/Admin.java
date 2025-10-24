package com.cinema_e_booking_system.db;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

/**
 * The entity for the admin.
 */
@Entity
@Table(name = "admin")
public class Admin extends User {

    /**
     * The primary key of the admin.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // NOT USERID ANYMORE

    /**
     * The constructor for the admin.
     */
    public Admin(String  email, String username, String firstName, String lastName, String password) {
        super(email, username, firstName, lastName, password);
    }

    /**
     * The getter for the id of the admin.
     */
    public Long getId() {
        return id;
    }
}