import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import com.cinema_e_booking_system.db.*;

@data
public class RegisterUserRequestDTO {

  // --- MANDATORY FIELDS ----
  @NotBlank(message = "Email is required.")
  @Email(message = "Invalid email format.")
  private String email;

  @NotBlank(message = "Username is required.")
  private String username;

  @NotBlank(message = "First name is required.")
  private String firstName;

  @NotBlank(message = "Last name is required.")
  private String lastName;

  @Size(min = 8, message = "Password must be at least 8 characters.")
  private String password;

  // --- OPTIONAL FIELDS (No Validation Annotations) ---
  private String phoneNumber;

  private String address; // If missing in JSON, this will be null.

  private String city; // If missing in JSON, this will be null.

  private String state;

  private String zipCode;

  private String country;


}
