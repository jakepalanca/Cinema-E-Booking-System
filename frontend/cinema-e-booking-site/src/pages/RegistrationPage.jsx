import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/RegistrationPage.css";
import Navbar from './Navbar.jsx';
import AddressFields from '../components/AddressFields.jsx';
import PaymentCardForm from '../components/PaymentCardForm.jsx';
import { getCardDisplay } from '../utils/cardDisplay.js';

function RegistrationPage() {
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        password: "",
        registeredForPromos: false,
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        paymentMethods: [],
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData, 
            [name]: type === "checkbox" ? checked : value, 
        });
    };

    const handleAddressChange = ({ name, value }) => {
        setFormData((prev) => {
            const nextAddress = {
                address: name === "address" ? value : prev.address,
                city: name === "city" ? value : prev.city,
                state: name === "state" ? value : prev.state,
                zipCode: name === "zipCode" ? value : prev.zipCode,
                country: name === "country" ? value : prev.country,
            };

            const updatedPayments = prev.paymentMethods.map((card) =>
                card.useDefaultAddress
                    ? { ...card, billingAddress: { ...nextAddress } }
                    : card
            );

            return {
                ...prev,
                ...nextAddress,
                paymentMethods: updatedPayments,
            };
        });
    };

    const handleAddCard = (card) => {
        setFormData({
            ...formData,
            paymentMethods: [...formData.paymentMethods, card],
        });
    };

    const removeCard = (index) => {
        setFormData({
            ...formData,
            paymentMethods: formData.paymentMethods.filter((_, i) => i !== index),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        const newUser = {
            email: formData.email,
            username: formData.username,
            firstName: formData.firstName,
            lastName: formData.lastName,
            password: formData.password,
            phoneNumber: formData.phoneNumber,
            address: formData.address || undefined,
            city: formData.city || undefined,
            state: formData.state || undefined,
            zipCode: formData.zipCode || undefined,
            country: formData.country || undefined,
            paymentMethods: formData.paymentMethods,
            registeredForPromos: formData.registeredForPromos,
            customerState: "PENDING_VERIFICATION",
        };
        try {
            const res = await fetch("http://localhost:8080/register", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(newUser),
            });

            if (res.ok){
                setMessage("A verification code has been sent to your email.");
                navigate("/verify", { state: { email: formData.email } });
            } else {
                const err = await res.json();
                setMessage(err.message || "Registration Failed");
            }
        } catch (error) {
            console.error(error);
            setMessage("Error connecting to the server.");
        } finally {
            setLoading(false);
        }
    };

    const defaultAddress = {
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
    };

    return(
        <>
            <Navbar />
            <div className="registration-div">
                <form onSubmit={handleSubmit} className="registration-form">
                    <h3>Account Information</h3>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email *"
                        required
                        autoComplete="email"
                    />
                    <input 
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Username *"
                        required
                        autoComplete="username"
                    />
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password *"
                        required
                        autoComplete="new-password"
                    />
                    <label className="inline-checkbox">
                        <input
                            type="checkbox"
                            name="registeredForPromos"
                            checked={formData.registeredForPromos}
                            onChange={handleChange}
                        />
                        Sign up for promotional offers
                    </label>

                    <h3>Personal Information</h3>
                    <div className="naming-section">
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="First name *"
                            required
                            autoComplete="given-name"
                        />
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Last name *"
                            required
                            autoComplete="family-name"
                        />
                    </div>
                    <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="Phone number *"
                        required
                        pattern="^[\d\s\-\(\)\+]+$"
                        title="Phone number (digits, spaces, dashes, parentheses)"
                        autoComplete="tel"
                    />

                    <h3>Address</h3>
                    <AddressFields
                        address={defaultAddress}
                        onChange={handleAddressChange}
                    />

                    <h3>Payment Methods (Optional)</h3>
                    <PaymentCardForm
                        onAddCard={handleAddCard}
                        defaultAddress={defaultAddress}
                        currentCardCount={formData.paymentMethods.length}
                    />

                    {formData.paymentMethods.length > 0 && (
                        <div className="saved-cards">
                            <h4>Saved Cards</h4>
                            <ul>
                                {formData.paymentMethods.map((card, index) => (
                                    <li key={index}>
                                        {getCardDisplay(card).label}
                                        <button type="button" onClick={() => removeCard(index)}>Remove</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="form-actions">
                        <button type="submit" disabled={loading}>
                            {loading ? "Registering..." : "Sign Up"}
                        </button>
                    </div>
                    {message && <p className="info-message">{message}</p>}
                </form>
            </div>
        </>
    );
}

export default RegistrationPage;
