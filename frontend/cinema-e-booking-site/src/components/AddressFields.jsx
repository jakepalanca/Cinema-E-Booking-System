import React from 'react';

/**
 * Reusable Address Fields Component
 * @param {Object} props
 * @param {Object} props.address - Address object { address, city, state, zipCode, country }
 * @param {Function} props.onChange - Handler for field changes (receives { name, value })
 * @param {string} props.prefix - Optional prefix for field names (e.g., "billingAddress.")
 * @param {boolean} props.required - Whether fields are required
 */
function AddressFields({ address, onChange, prefix = "", required = false }) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onChange({ name: `${prefix}${name}`, value });
    };

    // Validation patterns
    const patterns = {
        zipCode: "^[0-9]{5}(-[0-9]{4})?$|^[A-Za-z][0-9][A-Za-z] ?[0-9][A-Za-z][0-9]$",
        city: "^[A-Za-z\\s\\-'.]+$",
        state: "^[A-Za-z\\s\\-'.]+$",
    };

    return (
        <div className="address-fields">
            <input
                type="text"
                name="address"
                value={address.address || ""}
                onChange={handleChange}
                placeholder={`Street address${required ? " *" : ""}`}
                required={required}
                autoComplete="street-address"
            />
            <input
                type="text"
                name="city"
                value={address.city || ""}
                onChange={handleChange}
                placeholder={`City${required ? " *" : ""}`}
                pattern={patterns.city}
                title="City name (letters, spaces, hyphens, apostrophes)"
                required={required}
                autoComplete="address-level2"
            />
            <div className="address-row">
                <input
                    type="text"
                    name="state"
                    value={address.state || ""}
                    onChange={handleChange}
                    placeholder={`State / Province${required ? " *" : ""}`}
                    pattern={patterns.state}
                    title="State or province name"
                    required={required}
                    autoComplete="address-level1"
                />
                <input
                    type="text"
                    name="zipCode"
                    value={address.zipCode || ""}
                    onChange={handleChange}
                    placeholder={`ZIP / Postal${required ? " *" : ""}`}
                    pattern={patterns.zipCode}
                    title="US ZIP (12345 or 12345-6789) or Canadian postal code (A1A 1A1)"
                    required={required}
                    autoComplete="postal-code"
                />
            </div>
            <input
                type="text"
                name="country"
                value={address.country || ""}
                onChange={handleChange}
                placeholder={`Country${required ? " *" : ""}`}
                required={required}
                autoComplete="country-name"
            />
        </div>
    );
}

export default AddressFields;
