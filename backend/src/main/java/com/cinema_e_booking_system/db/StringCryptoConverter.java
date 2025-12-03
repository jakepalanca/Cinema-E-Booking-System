package com.cinema_e_booking_system.db;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.jasypt.encryption.pbe.StandardPBEStringEncryptor;

import java.util.concurrent.atomic.AtomicBoolean;
import java.util.Optional;

/**
 * JPA Attribute Converter for encrypting and decrypting String attributes. This
 * converter uses the Jasypt library for encryption and decryption operations.
 * It is configured with an environment variable for the encryption password.
 * <p>
 * Note: Ensure that the Jasypt library is correctly configured in your project.
 * The encryption password should be provided through the
 * "jasypt.encryptor.password" property.
 *
 * @author rahul.chauhan
 * @modifiedby Jake Palanca
 */
@Converter
public class StringCryptoConverter implements AttributeConverter<String, String> {

    // Property name for the encryption password
    private static final String ENCRYPTION_PASSWORD_PROPERTY = "jasypt.encryptor.password";
    private static final String ENCRYPTION_PASSWORD_ENV = "JASYPT_ENCRYPTOR_PASSWORD";
    private static final String DEFAULT_PASSWORD = "cinema-e-booking";

    // Jasypt StringEncryptor for performing encryption and decryption
    private static final StandardPBEStringEncryptor encryptor = new StandardPBEStringEncryptor();
    private static final AtomicBoolean encryptWarned = new AtomicBoolean(false);
    private static final AtomicBoolean decryptWarned = new AtomicBoolean(false);

    static {
        // Initialize encryptor using system property or environment variable with fallback
        String password = Optional
                .ofNullable(System.getProperty(ENCRYPTION_PASSWORD_PROPERTY))
                .orElseGet(() -> Optional
                        .ofNullable(System.getenv(ENCRYPTION_PASSWORD_ENV))
                        .orElse(DEFAULT_PASSWORD));
        encryptor.setPassword(password);
    }

    public StringCryptoConverter() {
        // Default constructor
    }

    /**
     * Converts the attribute value to the encrypted form.
     *
     * @param attribute The original attribute value to be encrypted.
     * @return The encrypted form of the attribute.
     */
    @Override
    public String convertToDatabaseColumn(String attribute) {
        if (attribute == null) {
            return null;
        }
        try {
            return encryptor.encrypt(attribute);
        } catch (Exception e) {
            if (encryptWarned.compareAndSet(false, true)) {
                System.err.println("[StringCryptoConverter] Encrypt failed, storing plain text value (subsequent failures suppressed): " + e.getMessage());
            }
            return attribute;
        }
    }

    /**
     * Converts the encrypted database value to its decrypted form.
     *
     * @param dbData The encrypted value stored in the database.
     * @return The decrypted form of the database value.
     */
    @Override
    public String convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        try {
            return encryptor.decrypt(dbData);
        } catch (Exception e) {
            if (decryptWarned.compareAndSet(false, true)) {
                System.err.println("[StringCryptoConverter] Decrypt failed, returning stored value as-is (subsequent failures suppressed): " + e.getMessage());
            }
            return dbData;
        }
    }
}
