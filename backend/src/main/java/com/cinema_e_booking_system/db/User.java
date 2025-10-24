package com.cinema_e_booking_system.db;

import jakarta.persistence.*;

/**
 * The entity for the user.
 */
@Entity
@Table(name = "user")
@Inheritance(strategy = InheritanceType.JOINED)
public class User {

    /**
     * The primary key of the user.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // NOT USERID ANYMORE

    private String email;

    private String username;

    private String firstName;

    private String lastName;

    @Convert(converter = StringCryptoConverter.class)
    private String password;

    protected User() {
        // JPA requirement
    }

    /**
     * The constructor for the user.
     */
    public User(String email, String username, String firstName, String lastName, String password) {
        this.email = email;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
    }

    /**
     * The getter for the id of the user.
     */
    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    /**
     * The getter for the email of the user.
     */
    public String getEmail() {
        return email;
    }

    /**
     * The setter for the email of the user.
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * The getter for the first name of the user.
     */
    public String getFirstName() {
        return firstName;
    }

    /**
     * The setter for the first name of the user.
     */
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    /**
     * The getter for the last name of the user.
     */
    public String getLastName() {
        return lastName;
    }

    /**
     * The setter for the last name of the user.
     */
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    /**
     * The getter for the password of the user.
     */
    public String getPassword() {
        return password;
    }

    /**
     * The setter for the password of the user.
     */
    public void setPassword(String password) {
        this.password = password;
    }
}
