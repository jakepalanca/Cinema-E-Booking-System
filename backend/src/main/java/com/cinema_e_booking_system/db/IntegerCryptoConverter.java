package com.cinema_e_booking_system.db;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import org.jasypt.encryption.pbe.StandardPBEBigIntegerEncryptor;
import org.jasypt.encryption.pbe.StandardPBEStringEncryptor;

import java.math.BigInteger;
import java.util.Optional;

/**
 * JPA Attribute Converter for encrypting and decrypting integer attributes. This
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
public class IntegerCryptoConverter implements AttributeConverter<Integer, Integer> {

    // Property name for the encryption password
    private static final String ENCRYPTION_PASSWORD_PROPERTY = "jasypt.encryptor.password";
    private static final String ENCRYPTION_PASSWORD_ENV = "JASYPT_ENCRYPTOR_PASSWORD";
    private static final String DEFAULT_PASSWORD = "cinema-e-booking";

    // Jasypt StringEncryptor for performing encryption and decryption
    private static final StandardPBEBigIntegerEncryptor encryptor = new StandardPBEBigIntegerEncryptor();

    static {
        // Initialize encryptor using system property or environment variable with fallback
        String password = Optional
                .ofNullable(System.getProperty(ENCRYPTION_PASSWORD_PROPERTY))
                .orElseGet(() -> Optional
                        .ofNullable(System.getenv(ENCRYPTION_PASSWORD_ENV))
                        .orElse(DEFAULT_PASSWORD));
        encryptor.setPassword(password);
    }

    public IntegerCryptoConverter() {
        // Default constructor
    }

    @Override
    public Integer convertToEntityAttribute(Integer dbData) {
        if (dbData == null) {
            return null;
        }
        return encryptor.decrypt(BigInteger.valueOf(dbData)).intValue();
    }

    @Override
    public Integer convertToDatabaseColumn(Integer attribute) {
        if (attribute == null) {
            return null;
        }
        BigInteger bigIntValue = BigInteger.valueOf(attribute);
        return encryptor.encrypt(bigIntValue).intValue();
    }
}
