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

    private Long cardNumber;

    private String cardHolderFirstName;

    private String cardHolderLastName;

    // java.sql not java.util
    private Date expirationDate;

    // 3 or 4 digits
    private int securityCode;

    protected PaymentMethod() {
        // JPA requirement
    }

    public PaymentMethod(Customer customer, Long cardNumber, String cardHolderFirstName, String cardHolderLastName, Date expirationDate,  int securityCode) {
        this.customer = customer;
        this.cardNumber = cardNumber;
        this.cardHolderFirstName = cardHolderFirstName;
        this.cardHolderLastName = cardHolderLastName;
        this.expirationDate = expirationDate;
        this.securityCode = securityCode;
    }

    public void  setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Long getCardNumber() {
        return cardNumber;
    }

    public void setCardNumber(Long cardNumber) {
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
