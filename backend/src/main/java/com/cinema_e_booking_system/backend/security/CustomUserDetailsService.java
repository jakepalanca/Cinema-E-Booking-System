package com.cinema_e_booking_system.backend.security;

import com.cinema_e_booking_system.db.Admin;
import com.cinema_e_booking_system.db.AdminRepository;
import com.cinema_e_booking_system.db.Customer;
import com.cinema_e_booking_system.db.CustomerRepository;
import com.cinema_e_booking_system.db.StringCryptoConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Custom UserDetailsService implementation for loading user details.
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String emailOrUsername) throws UsernameNotFoundException {
        // Try to find as customer first
        Optional<Customer> customerOpt = customerRepository.findByEmail(emailOrUsername);
        if (customerOpt.isEmpty()) {
            customerOpt = customerRepository.findByUsername(emailOrUsername);
        }

        if (customerOpt.isPresent()) {
            Customer customer = customerOpt.get();
            // Decrypt password if needed
            StringCryptoConverter crypto = new StringCryptoConverter();
            try {
                String decryptedPassword = crypto.convertToEntityAttribute(customer.getPassword());
                customer.setPassword(decryptedPassword);
            } catch (Exception e) {
                // Password might already be plain text, keep as is
            }
            return new CustomUserDetails(customer, "CUSTOMER");
        }

        // Try to find as admin
        Optional<Admin> adminOpt = adminRepository.findByEmail(emailOrUsername);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            return new CustomUserDetails(admin, "ADMIN");
        }

        throw new UsernameNotFoundException("User not found: " + emailOrUsername);
    }
}

