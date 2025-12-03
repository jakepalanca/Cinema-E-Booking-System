import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import "../css/RegistrationPage.css";
import AddressFields from '../components/AddressFields.jsx';
import PaymentCardForm from '../components/PaymentCardForm.jsx';
import api from '../services/api.js';
import { useAuth } from '../contexts/AuthContext';
import { getCardDisplay } from '../utils/cardDisplay.js';

export default function EditProfile() {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const [customer, setCustomer] = useState(null);
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        currentPassword: "",
        newPassword: "",
        registeredForPromos: false,
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
    });
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    // Fetch customer data and prefill form
    useEffect(() => {
        if (authLoading) return;

        if (!isAuthenticated || !user) {
            navigate('/login');
            return;
        }

        const email = user.email;

        api.get(`/customers/by-email?email=${encodeURIComponent(email)}`)
            .then(r => {
                if (!r.ok) throw new Error('Customer not found');
                return r.json();
            })
            .then(data => {
                setCustomer(data);
                setPaymentMethods(data.paymentMethods || []);
                // Prefill form with existing data
                setFormData({
                    email: data.email || "",
                    username: data.username || "",
                    firstName: data.firstName || "",
                    lastName: data.lastName || "",
                    phoneNumber: data.phoneNumber || "",
                    currentPassword: "",
                    newPassword: "",
                    registeredForPromos: data.registeredForPromos || false,
                    address: data.address || "",
                    city: data.city || "",
                    state: data.state || "",
                    zipCode: data.zipCode || "",
                    country: data.country || "",
                });
            })
            .catch((err) => {
                console.error('Failed to fetch customer data:', err);
                // Use auth context data as fallback
                setCustomer({ 
                    email: user.email, 
                    firstName: user.firstName || '',
                    id: user.id
                });
                setFormData(prev => ({
                    ...prev,
                    email: user.email || "",
                    firstName: user.firstName || "",
                }));
                setMessage('Could not load full profile data. Some features may be limited.');
            })
            .finally(() => {
                setDataLoading(false);
            });
    }, [authLoading, isAuthenticated, user, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData, 
            [name]: type === "checkbox" ? checked : value, 
        });
    };

    const handleAddressChange = ({ name, value }) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleAddCard = (card) => {
        if (!customer?.id) {
            // Local-only: just add to state
            const fakeCard = { ...card, id: Date.now() };
            setPaymentMethods(prev => [...prev, fakeCard]);
            setMessage('Card added (local only)');
            return;
        }

        // Convert card for backend
        const [year, month] = card.expirationDate.split("-");
        const pmPayload = {
            cardNumber: card.cardNumber,
            cardHolderFirstName: card.cardHolderFirstName,
            cardHolderLastName: card.cardHolderLastName,
            expirationDate: `${year}-${month}-01`,
            securityCode: Number(card.securityCode),
            zipCode: parseInt(card.billingAddress?.zipCode) || 0,
            country: card.billingAddress?.country || "",
            state: card.billingAddress?.state || "",
            city: card.billingAddress?.city || "",
            address: card.billingAddress?.address || "",
        };

        api.put(`/customers/${customer.id}/payment-methods`, pmPayload)
            .then(r => r.json())
            .then(saved => {
                const displayCard = {
                    id: saved.id,
                    cardHolderFirstName: saved.cardHolderFirstName || card.cardHolderFirstName,
                    cardHolderLastName: saved.cardHolderLastName || card.cardHolderLastName,
                    cardNumber: saved.cardNumberLast4
                        ? `****${saved.cardNumberLast4}`
                        : card.cardNumber,
                    cardNumberLast4: saved.cardNumberLast4 || String(card.cardNumber).slice(-4),
                    expirationDate: saved.expirationDate || pmPayload.expirationDate,
                };
                setPaymentMethods(prev => [...prev, displayCard]);
                setMessage('Card added successfully');
            })
            .catch(() => setMessage('Failed to add card'));
    };

    const removeCard = (cardId) => {
        if (!customer?.id) {
            setPaymentMethods(prev => prev.filter(c => c.id !== cardId));
            setMessage('Card removed');
            return;
        }

        api.delete(`/payment-methods/${cardId}`)
            .then(r => {
                if (!r.ok) throw new Error('Delete failed');
                setPaymentMethods(prev => prev.filter(c => c.id !== cardId));
                setMessage('Card removed');
            })
            .catch(() => setMessage('Failed to remove card'));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!customer) return;

        setLoading(true);
        setMessage("");

        // Prepare payload
        const payload = {
            ...customer,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phoneNumber: formData.phoneNumber,
            address: formData.address || undefined,
            city: formData.city || undefined,
            state: formData.state || undefined,
            zipCode: formData.zipCode || undefined,
            country: formData.country || undefined,
            registeredForPromos: formData.registeredForPromos,
        };

        // Handle password change
        if (formData.newPassword) {
            if (!formData.currentPassword) {
                setMessage('Please enter your current password to change password');
                setLoading(false);
                return;
            }

            try {
                const verifyResponse = await fetch('http://localhost:8080/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                        emailOrUsername: customer.email,
                        password: formData.currentPassword
                    })
                });

                if (!verifyResponse.ok) {
                    setMessage('Current password is incorrect');
                    setLoading(false);
                    return;
                }

                payload.password = formData.newPassword;
            } catch (error) {
                setMessage('Failed to verify current password');
                setLoading(false);
                return;
            }
        }

        // Save to backend
        if (!customer?.id) {
            setMessage('Profile updated locally');
            setLoading(false);
            return;
        }

        try {
            const response = await api.put(`/customers/${customer.id}`, payload);
            if (!response.ok) throw new Error('Save failed');
            const updated = await response.json();
            setCustomer(updated);
            setFormData(prev => ({
                ...prev,
                currentPassword: "",
                newPassword: "",
            }));
            setMessage(formData.newPassword ? 'Profile and password updated successfully!' : 'Profile updated successfully!');
        } catch (error) {
            setMessage('Failed to save profile');
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

    // Loading state
    if (authLoading || dataLoading) {
        return (
            <>
                <Navbar />
                <div className="registration-div">
                    <p style={{ color: 'var(--text-muted)' }}>Loading your profile...</p>
                </div>
            </>
        );
    }

    if (!customer) return null;

    return (
        <>
            <Navbar />
            <div className="registration-div">
                <form onSubmit={handleSubmit} className="registration-form">
                    <h3>Account Information</h3>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled
                        placeholder="Email"
                        autoComplete="email"
                        style={{ opacity: 0.6, cursor: 'not-allowed' }}
                    />
                    <input 
                        type="text"
                        name="username"
                        value={formData.username}
                        disabled
                        placeholder="Username"
                        autoComplete="username"
                        style={{ opacity: 0.6, cursor: 'not-allowed' }}
                    />
                    
                    <h4>Change Password</h4>
                    <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        placeholder="Current password"
                        autoComplete="current-password"
                    />
                    <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="New password (leave blank to keep current)"
                        autoComplete="new-password"
                    />

                    <label className="inline-checkbox">
                        <input
                            type="checkbox"
                            name="registeredForPromos"
                            checked={formData.registeredForPromos}
                            onChange={handleChange}
                        />
                        Receive promotional emails
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

                    <h3>Payment Methods</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '0 0 0.5rem' }}>
                        Maximum 3 cards allowed. You have {paymentMethods.length} card(s).
                    </p>
                    
                    <PaymentCardForm
                        onAddCard={handleAddCard}
                        defaultAddress={defaultAddress}
                        currentCardCount={paymentMethods.length}
                    />

                    {paymentMethods.length > 0 && (
                        <div className="saved-cards">
                            <h4>Saved Cards</h4>
                            <ul>
                                {paymentMethods.map((card) => (
                                    <li key={card.id}>
                                        {getCardDisplay(card).label}
                                        <button type="button" onClick={() => removeCard(card.id)}>Remove</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="form-actions">
                        <button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                    {message && <p className="info-message">{message}</p>}
                </form>
            </div>
        </>
    );
}
