package com.cinema_e_booking_system.db;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.sql.Date;

/**
 * The entity for the review.
 */
@Entity
@Table(name = "payment_method")
public class PaymentMethod {

    /**
     * The primary key of the review.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The movie of the review.
     * Many-to-One
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id") // Foreign Key
    @JsonBackReference("customer-paymentMethods")
    private Customer customer;

    @Convert(converter = StringCryptoConverter.class)
    private String cardNumber;

    private String cardHolderFirstName;

    private String cardHolderLastName;

    // java.sql not java.util
    private Date expirationDate;

    private String address;
    private String city;
    private String state;
    private int zipCode;
    private String country;


    // 3 or 4 digits
    private int securityCode;

    protected PaymentMethod() {
        // JPA requirement
    }

    public PaymentMethod(Customer customer, String cardNumber, String cardHolderFirstName, String cardHolderLastName, Date expirationDate, int securityCode, int zipCode, String country, String state, String city, String address) {
        this.customer = customer;
        this.cardNumber = cardNumber;
        this.cardHolderFirstName = cardHolderFirstName;
        this.cardHolderLastName = cardHolderLastName;
        this.expirationDate = expirationDate;
        this.securityCode = securityCode;
        this.address = address;
        this.city = city;
        this.state = state;
        this.zipCode = zipCode;
        this.country = country;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public String getCardNumber() {
        return cardNumber;
    }

    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public String getCardHolderFirstName() {
        return cardHolderFirstName;
    }

    public void setCardHolderFirstName(String cardHolderFirstName) {
        this.cardHolderFirstName = cardHolderFirstName;
    }

    public String getCardHolderLastName() {
        return cardHolderLastName;
    }

    public void setCardHolderLastName(String cardHolderLastName) {
        this.cardHolderLastName = cardHolderLastName;
    }

    public Date getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(Date expirationDate) {
        this.expirationDate = expirationDate;
    }

    public int getSecurityCode() {
        return securityCode;
    }

    public void setSecurityCode(int securityCode) {
        this.securityCode = securityCode;
    }
}
