package com.cinema_e_booking_system.backend;

import com.cinema_e_booking_system.db.Customer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailSenderService {
  @Autowired
  private JavaMailSender mailSender;

  public void sendEmail(
    String toEmail,
    String subject,
    String body
  ) {
    SimpleMailMessage message = new SimpleMailMessage();
    message.setFrom("ashvijhosdurg@gmail.com");
    message.setTo(toEmail);
    message.setText(body);
    message.setSubject(subject);

    mailSender.send(message);
    System.out.println("message sent");
  }

  public void sendVerificationEmail(Customer customer, String token) {
    String baseUrl = "http://localhost:8080/users/confirm";
    String verificationLink = baseUrl + "?token=" + token;

    String subject = "Confirm your Cinema E-Booking Account";
    String body = String.format(
        "Hello %s,\n\n" +
        "Thank you for registering. Please click the link below to confirm your account:\n\n" +
        "%s\n\n" +
        "This link will expire soon.\n\n" +
        "The Cinema Team",
      customer.getFirstName(), verificationLink
    );

    SimpleMailMessage message = new SimpleMailMessage();
    message.setFrom("ashvijhosdurg@gmail.com");
    message.setTo(customer.getEmail());
    message.setSubject(subject);
    message.setText(body);

    mailSender.send(message);
  }

  public void sendPasswordResetLink(Customer customer, String token) {
    String baseUrl = "http://localhost:8080/reset-password";
    String passwordResetLink = baseUrl + "?token=" + token;

    String subject = "Reset your Password";

    String body = String.format(
      "Hello %s,\n\n" +
        "Please click the link to reset your password:\n\n" +
        "%s\n\n" +
        "This link will expire soon.\n\n" +
        "The Cinema Team",
      customer.getFirstName(), passwordResetLink
    );

    SimpleMailMessage message = new SimpleMailMessage();
    message.setFrom("ashvijhosdurg@gmail.com");
    message.setTo(customer.getEmail());
    message.setSubject(subject);
    message.setText(body);

    mailSender.send(message);


  }
}

