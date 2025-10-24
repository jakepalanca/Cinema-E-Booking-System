package com.cinema_e_booking_system.db;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.util.List;

/**
 * The entity for the user.
 */
@Entity
@Table(name = "customer")
public class Customer extends User {

    // CUSTOMER STATE ENUMERATION
    enum CustomerState {
        ACTIVE, INACTIVE, SUSPENDED
    }
    /**
     * The primary key of the user.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // NOT USERID ANYMORE

    private CustomerState state;

    @Convert(converter = StringCryptoConverter.class)
    private List<PaymentMethod>  paymentMethods;

    private List<Promotion>  promotions;

    /**
     * The constructor for the user.
     */
    public Customer(String  email, String username, String firstName, String lastName, String password, CustomerState state, List<PaymentMethod> paymentMethods,  List<Promotion> promotions) {
        super(email, username, firstName, lastName, password);
        this.state = state;
        this.paymentMethods = paymentMethods;
        this.promotions = promotions;
    }

    /**
     * The getter for the id of the user.
     */
    public Long getId() {
        return id;
    }

    public void setState(CustomerState state) {
        this.state = state;
    }

    public CustomerState getState() {
        return state;
    }

    public void removePaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethods.remove(paymentMethod);
    }

    public void addPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethods.add(paymentMethod);
    }

    public void removePromotion(Promotion promotion) {
        this.promotions.remove(promotion);
    }

    public void addPromotion(Promotion promotion) {
        this.promotions.add(promotion);
    }

    public void setPaymentMethods(List<PaymentMethod> paymentMethods) {
        this.paymentMethods = paymentMethods;
    }

    public List<PaymentMethod> getPaymentMethods() {
        return paymentMethods;
    }

    public void setPromotions(List<Promotion> promotions) {
        this.promotions = promotions;
    }

    public List<Promotion> getPromotions() {
        return promotions;
    }
}