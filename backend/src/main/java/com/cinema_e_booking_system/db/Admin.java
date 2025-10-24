package com.cinema_e_booking_system.db;

import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;

/**
 * The entity for the admin.
 */
@Entity
@Table(name = "admin")
@PrimaryKeyJoinColumn(name = "user_id")
public class Admin extends User {

    protected Admin() {}

    /**
     * The constructor for the admin.
     */
    public Admin(String  email, String username, String firstName, String lastName, String password) {
        super(email, username, firstName, lastName, password);
    }
}
