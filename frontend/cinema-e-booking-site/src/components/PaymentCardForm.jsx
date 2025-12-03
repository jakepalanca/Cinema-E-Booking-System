import React, { useEffect, useState } from 'react';
import AddressFields from './AddressFields';

/**
 * Reusable Payment Card Form Component
 * @param {Object} props
 * @param {Function} props.onAddCard - Callback when card is added (receives card object)
 * @param {Object} props.defaultAddress - Default address to use for billing
 * @param {number} props.maxCards - Maximum number of cards allowed (default 3)
 * @param {number} props.currentCardCount - Current number of saved cards
 */
function PaymentCardForm({ onAddCard, defaultAddress = {}, maxCards = 3, currentCardCount = 0 }) {
    const [card, setCard] = useState({
        cardNumber: "",
        cardHolderFirstName: "",
        cardHolderLastName: "",
        expirationDate: "",
        securityCode: "",
        billingAddress: { ...defaultAddress },
        useDefaultAddress: true,
    });
    const [errors, setErrors] = useState({});

    // Keep billing address in sync when using the main address
    useEffect(() => {
        setCard(prev => {
            if (!prev.useDefaultAddress) {
                return prev;
            }
            return { ...prev, billingAddress: { ...defaultAddress } };
        });
    }, [defaultAddress]);

    // Validation patterns
    const patterns = {
        cardNumber: /^[0-9]{13,19}$/,
        securityCode: /^[0-9]{3,4}$/,
        name: /^[A-Za-z\s\-'.]+$/,
    };

    const formatCardNumber = (value) => {
        const digits = value.replace(/\D/g, "");
        return digits.replace(/(.{4})/g, "$1 ").trim().slice(0, 23);
    };

    const handleChange = (e) => {
        const { name, value, checked } = e.target;

        if (name === "useDefaultAddress") {
            setCard({
                ...card,
                useDefaultAddress: checked,
                billingAddress: checked ? { ...defaultAddress } : { address: "", city: "", state: "", zipCode: "", country: "" },
            });
            return;
        }

        if (name === "cardNumber") {
            setCard({ ...card, cardNumber: formatCardNumber(value) });
            return;
        }

        setCard({ ...card, [name]: value });
    };

    const handleBillingChange = ({ name, value }) => {
        const field = name.replace("billingAddress.", "");
        setCard({
            ...card,
            billingAddress: { ...card.billingAddress, [field]: value },
        });
    };

    const validate = () => {
        const newErrors = {};
        const rawCardNumber = card.cardNumber.replace(/\s/g, "");

        if (!patterns.cardNumber.test(rawCardNumber)) {
            newErrors.cardNumber = "Enter a valid card number (13-19 digits)";
        }
        if (!patterns.name.test(card.cardHolderFirstName)) {
            newErrors.cardHolderFirstName = "Enter a valid first name";
        }
        if (!patterns.name.test(card.cardHolderLastName)) {
            newErrors.cardHolderLastName = "Enter a valid last name";
        }
        if (!card.expirationDate) {
            newErrors.expirationDate = "Select expiration date";
        } else {
            const [year, month] = card.expirationDate.split("-").map(Number);
            const expDate = new Date(year, month);
            if (expDate < new Date()) {
                newErrors.expirationDate = "Card is expired";
            }
        }
        if (!patterns.securityCode.test(card.securityCode)) {
            newErrors.securityCode = "Enter a valid CVV (3-4 digits)";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddCard = () => {
        if (currentCardCount >= maxCards) {
            setErrors({ general: `Maximum ${maxCards} cards allowed` });
            return;
        }
        if (!validate()) return;

        const cardToAdd = {
            ...card,
            cardNumber: card.cardNumber.replace(/\s/g, ""),
            billingAddress: card.useDefaultAddress ? { ...defaultAddress } : card.billingAddress,
        };

        onAddCard(cardToAdd);

        setCard({
            cardNumber: "",
            cardHolderFirstName: "",
            cardHolderLastName: "",
            expirationDate: "",
            securityCode: "",
            billingAddress: { ...defaultAddress },
            useDefaultAddress: true,
        });
        setErrors({});
    };

    return (
        <div className="payment-form">
            <input
                type="text"
                name="cardNumber"
                value={card.cardNumber}
                onChange={handleChange}
                placeholder="Card number"
                maxLength="23"
                inputMode="numeric"
                autoComplete="cc-number"
            />
            {errors.cardNumber && <span className="field-error">{errors.cardNumber}</span>}

            <div className="name-fields">
                <div>
                    <input
                        type="text"
                        name="cardHolderFirstName"
                        value={card.cardHolderFirstName}
                        onChange={handleChange}
                        placeholder="Cardholder first name"
                        autoComplete="cc-given-name"
                    />
                    {errors.cardHolderFirstName && <span className="field-error">{errors.cardHolderFirstName}</span>}
                </div>
                <div>
                    <input
                        type="text"
                        name="cardHolderLastName"
                        value={card.cardHolderLastName}
                        onChange={handleChange}
                        placeholder="Cardholder last name"
                        autoComplete="cc-family-name"
                    />
                    {errors.cardHolderLastName && <span className="field-error">{errors.cardHolderLastName}</span>}
                </div>
            </div>

            <div className="payment-row">
                <div>
                    <input
                        type="month"
                        name="expirationDate"
                        value={card.expirationDate}
                        onChange={handleChange}
                        autoComplete="cc-exp"
                    />
                    {errors.expirationDate && <span className="field-error">{errors.expirationDate}</span>}
                </div>
                <div>
                    <input
                        type="text"
                        name="securityCode"
                        value={card.securityCode}
                        onChange={handleChange}
                        placeholder="CVV"
                        maxLength="4"
                        inputMode="numeric"
                        autoComplete="cc-csc"
                    />
                    {errors.securityCode && <span className="field-error">{errors.securityCode}</span>}
                </div>
            </div>

            <label className="inline-checkbox">
                <input
                    type="checkbox"
                    name="useDefaultAddress"
                    checked={card.useDefaultAddress}
                    onChange={handleChange}
                />
                Use main address for billing
            </label>

            {!card.useDefaultAddress && (
                <>
                    <h4>Billing Address</h4>
                    <AddressFields
                        address={card.billingAddress}
                        onChange={handleBillingChange}
                        prefix="billingAddress."
                    />
                </>
            )}

            <button type="button" className="btn-secondary" onClick={handleAddCard}>
                Add Card
            </button>

            {errors.general && <p className="field-error">{errors.general}</p>}
        </div>
    );
}

export default PaymentCardForm;
