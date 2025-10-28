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

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("customer-paymentMethods")
    private final List<PaymentMethod> paymentMethods = new ArrayList<>();
    @ManyToMany
    @JoinTable(
            name = "customer_promotion",
            joinColumns = @JoinColumn(name = "customer_id"),
            inverseJoinColumns = @JoinColumn(name = "promotion_id")
    )
    @JsonManagedReference("customer-promotions")
    private final List<Promotion> promotions = new ArrayList<>();
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("customer-bookings")
    private final List<Booking> bookings = new ArrayList<>();
    @Enumerated(EnumType.STRING)
    private CustomerState customerState;

    private String phoneNumber;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private String country;

    protected Customer() {
        // JPA requirement
    }

    /**
     * The constructor for the user.
     */
    public Customer(String email, String username, String firstName, String lastName, String password, CustomerState customerState, List<PaymentMethod> paymentMethods, List<Promotion> promotions, String phoneNumber, String address, String city, String state, String zipCode, String country) {
        super(email, username, firstName, lastName, password);
        this.customerState = customerState;
        setPaymentMethods(paymentMethods);
        setPromotions(promotions);
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.city = city;
        this.state = state;
        this.zipCode = zipCode;
        this.country = country;
    }

    public CustomerState getCustomerState() {
        return customerState;
    }

    public void setCustomerState(CustomerState state) {
        this.customerState = state;
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

    public List<PaymentMethod> getPaymentMethods() {
        return paymentMethods;
    }

    public void setPaymentMethods(List<PaymentMethod> paymentMethods) {
        this.paymentMethods.clear();
        if (paymentMethods != null) {
            paymentMethods.forEach(this::addPaymentMethod);
        }
    }

    public List<Promotion> getPromotions() {
        return promotions;
    }

    public void setPromotions(List<Promotion> promotions) {
        this.promotions.clear();
        if (promotions != null) {
            promotions.forEach(this::addPromotion);
        }
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

    // CUSTOMER STATE ENUMERATION
    public enum CustomerState {
        ACTIVE, INACTIVE, SUSPENDED
    }

    public void setCustomerState(String state) {
        this.state = state;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public String getZipCode() {
        return zipCode;
    }

    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }
}
