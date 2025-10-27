import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import "./RegistrationPage.css";
import Navbar from './Navbar.jsx';

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

    const [currentCard, setCurrentCard] = useState({
        cardNumber: "",
        cardHolderFirstName: "",
        cardHolderLastName: "",
        expirationDate: "",
        securityCode: "",
        billingAddress: "",
    });
    const [step, setStep] = useState("register"); // register | verify | success
    const [verificationCode, setVerificationCode] = useState("");
    const [emailForVerification, setEmailForVerification] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // promotion fetching
    const [availablePromotions, setAvailablePromotions] = useState([]);
    useEffect(() => {
        async function fetchPromotions() {
            try {
            const response = await fetch("http://localhost:8080/promotions");
            if (!response.ok) throw new Error("Failed to fetch promotions");
            const data = await response.json();
            setAvailablePromotions(data);
            } catch (error) {
                console.error("Error fetching promotions:", error);
            }
        }
        fetchPromotions();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData, 
            [name]: type === "checkbox" ? checked : value, 
        });
    };

    const handleCardChange =  (e) => {
        const { name, value } = e.target;
        setCurrentCard({...currentCard, [name]: value });
    };

    const addCard = () => {
        // if there are already 3 cards
        if (formData.paymentMethods.length >= 3) {
            alert("You may only have up to 3 payment cards.");
            return;
        }
        // if missing info
        if (
            !currentCard.cardNumber || !currentCard.cardHolderFirstName ||
            !currentCard.cardHolderLastName || !currentCard.securityCode ||
            !currentCard.expirationDate
        ){
            alert("Missing payment info. Please fill out all required fields.");
            return;
        }
        setFormData({
            ...formData,
            paymentMethods: [...formData.paymentMethods, currentCard],
        });
        setCurrentCard({
            cardNumber: "",
            cardHolderFirstName: "",
            cardHolderLastName: "",
            expirationDate: "",
            securityCode: "",
            billingAddress: "",
        });
    }; // addCard

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
            const res = await fetch("http://localhost:8080/register", { //replace with whatever our verification process is in backend
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(newUser),
            });

            if (res.ok){
                setEmailForVerification(formData.email);
                setStep("verify");
                setMessage("A verification code has been sent to your email.");
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

    const handleVerificationSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            const res = await fetch("http://localhost:8080/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({
                    email: emailForVerification,
                    verificationCode,
                }),
            });
            if (res.ok) {
                setStep("success");
                setMessage("Verification Confirmed");
            } else {
                const err = await res.json();
                setMessage(err.message || "Verification code expired or incorrect.");
            }
        } catch (error) {
            console.error(error);
            setMessage("Error verifying account.");
        } finally {
            setLoading(false);
        }
    };

    if (step === "verify"){
        return (
            <div className="registration-div">
                <h2>Email Verification</h2>
                <p>A verification code has been sent to <strong>{emailForVerification}</strong></p>
                <form onSubmit={handleVerificationSubmit}>
                    <label>
                        Verification Code:
                        <input
                            type="text"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            required
                        />
                    </label>
                    <button type="submit" disabled={loading}>
                        {loading ? "Verifying..." : "Verify"}
                    </button>
                </form>
                {message && <p className="info-message">{message}</p>}
            </div>
        );
    }
    if (step === "success") {
        return (
            <div className="registration-div">
                <h2>Verification Confirmed</h2>
                <p>Your email was successfully verified. You may now log in to your new account!</p>
            </div>
        );
    }

    // Page Content
    return(
        <>
            <Navbar />
            <div className="registration-div">
                <h2>Create an Account!</h2>
                <form onSubmit={handleSubmit} className="registration-form">
                    <h3>Account Information</h3>
                    <label>
                        Email:
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Username:
                        <input 
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Password:
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <h3>Personal Information</h3>
                    <div className="naming-section">
                        <label>
                            First Name:
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </label>
                        <label>
                            Last Name:
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </label>
                    </div>
                    <label>
                        Phone Number:
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <h3>Address</h3>
                    <label>
                        Address:
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </label>
                    <div className="address-row">
                        <label>
                            City:
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            State/Province:
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                    <div className="address-row">
                        <label>
                            ZIP Code:
                            <input
                                type="text"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Country:
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                    <h3>Payment Methods</h3>
                    <div className="payment-form">
                        <label>
                            Card Number:
                            <input
                                type="text"
                                name="cardNumber"
                                value={currentCard.cardNumber}
                                onChange={handleCardChange}
                            />
                        </label>
                        <div className="name-fields">
                            <label>
                                Cardholder First Name:
                                <input
                                    type="text"
                                    name="cardHolderFirstName"
                                    value={currentCard.cardHolderFirstName}
                                    onChange={handleCardChange}
                                />
                            </label>
                            <label>
                                Cardholder Last Name:
                                <input
                                    type="text"
                                    name="cardHolderLastName"
                                    value={currentCard.cardHolderLastName}
                                    onChange={handleCardChange}
                                />
                            </label>
                        </div>
                        <div className="payment-row">
                            <label>
                                Expiration Date:
                                <input
                                    type="month"
                                    name="expirationDate"
                                    value={currentCard.expirationDate}
                                    onChange={handleCardChange}
                                />
                            </label>
                            <label>
                                Security Code (CVV):
                                <input
                                    type="text"
                                    name="securityCode"
                                    value={currentCard.securityCode}
                                    onChange={handleCardChange}
                                />
                            </label>
                        </div>
                        <label>
                            Billing Address:
                            <input
                                type="text"
                                name="billingAddress"
                                value={currentCard.billingAddress}
                                onChange={handleCardChange}
                            />
                        </label>
                        <button type="button" onClick={addCard}>Add Card</button>
                    </div>
                    {formData.paymentMethods.length > 0 && (
                        <div className="saved-cards">
                            <h4>Saved Cards</h4>
                            <ul>
                                {formData.paymentMethods.map((card, index) => (
                                    <li key={index}>
                                        **** **** **** {card.cardNumber.slice(-4)} — {card.cardHolderFirstName} {card.cardHolderLastName}
                                        <button type="button" onClick={() => removeCard(index)}>Remove</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <h3>Promotions</h3>
                    <label className="promo-checkbox">
                        <input
                            type="checkbox"
                            name="registeredForPromos"
                            checked={formData.registeredForPromos}
                            onChange={handleChange}
                        />
                        Check if you would like to receive promotional offers!
                    </label>
                    <button type="submit" disabled={loading}>
                        {loading ? "Registering..." : "Create Account"}
                    </button>
                    {message && <p className="info-message">{message}</p>}
                </form>
            </div>
        </>
    );
};

export default RegistrationPage;