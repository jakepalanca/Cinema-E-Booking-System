package com.cinema_e_booking_system.db;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

/**
 * The entity for the user.
 */
@Entity
@Table(name = "customer")
@PrimaryKeyJoinColumn(name = "user_id")
public class Customer extends User {

    // CUSTOMER STATE ENUMERATION
    public enum CustomerState {
        ACTIVE, INACTIVE, SUSPENDED
    }

    @Enumerated(EnumType.STRING)
    private CustomerState state;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("customer-paymentMethods")
    private List<PaymentMethod> paymentMethods = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "customer_promotion",
            joinColumns = @JoinColumn(name = "customer_id"),
            inverseJoinColumns = @JoinColumn(name = "promotion_id")
    )
    @JsonManagedReference("customer-promotions")
    private List<Promotion> promotions = new ArrayList<>();

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("customer-bookings")
    private List<Booking> bookings = new ArrayList<>();

    protected Customer() {
        // JPA requirement
    }

    /**
     * The constructor for the user.
     */
    public Customer(String  email, String username, String firstName, String lastName, String password, CustomerState state, List<PaymentMethod> paymentMethods,  List<Promotion> promotions) {
        super(email, username, firstName, lastName, password);
        this.state = state;
        setPaymentMethods(paymentMethods);
        setPromotions(promotions);
    }

    public void setState(CustomerState state) {
        this.state = state;
    }

    public CustomerState getState() {
        return state;
    }

    public void removePaymentMethod(PaymentMethod paymentMethod) {
        if (paymentMethod == null) {
            return;
        }
        this.paymentMethods.remove(paymentMethod);
        paymentMethod.setCustomer(null);
    }

    public void addPaymentMethod(PaymentMethod paymentMethod) {
        if (paymentMethod == null) {
            return;
        }
        if (!this.paymentMethods.contains(paymentMethod)) {
            paymentMethod.setCustomer(this);
            this.paymentMethods.add(paymentMethod);
        }
    }

    public void removePromotion(Promotion promotion) {
        if (promotion == null) {
            return;
        }
        if (this.promotions.remove(promotion)) {
            promotion.getCustomers().remove(this);
        }
    }

    public void addPromotion(Promotion promotion) {
        if (promotion == null) {
            return;
        }
        if (!this.promotions.contains(promotion)) {
            this.promotions.add(promotion);
            if (!promotion.getCustomers().contains(this)) {
                promotion.getCustomers().add(this);
            }
        }
    }

    public void setPaymentMethods(List<PaymentMethod> paymentMethods) {
        this.paymentMethods.clear();
        if (paymentMethods != null) {
            paymentMethods.forEach(this::addPaymentMethod);
        }
    }

    public List<PaymentMethod> getPaymentMethods() {
        return paymentMethods;
    }

    public void setPromotions(List<Promotion> promotions) {
        this.promotions.clear();
        if (promotions != null) {
            promotions.forEach(this::addPromotion);
        }
    }

    public List<Promotion> getPromotions() {
        return promotions;
    }

    public List<Booking> getBookings() {
        return bookings;
    }

    public void setBookings(List<Booking> bookings) {
        this.bookings.clear();
        if (bookings != null) {
            bookings.forEach(this::addBooking);
        }
    }

    public void addBooking(Booking booking) {
        if (booking == null) {
            return;
        }
        if (!this.bookings.contains(booking)) {
            booking.setCustomer(this);
            this.bookings.add(booking);
        }
    }

    public void removeBooking(Booking booking) {
        if (booking == null) {
            return;
        }
        if (this.bookings.remove(booking)) {
            booking.setCustomer(null);
        }
    }
}
