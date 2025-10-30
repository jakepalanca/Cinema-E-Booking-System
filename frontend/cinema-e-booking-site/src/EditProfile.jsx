import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import "./EditProfile.css";

export default function Profile() {
    const [customer, setCustomer] = useState(null);
    const [form, setForm] = useState({ firstName: '', lastName: '', phoneNumber: '', address: '', city: '', state: '', zipCode: '', country: '' });
    const [oldPassword, setOldPassword] = useState('');
    const [password, setPassword] = useState('');
    const [currentPasswordInput, setCurrentPasswordInput] = useState('');
    const [promotions, setPromotions] = useState([]);
    const [allPromotions, setAllPromotions] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [newCard, setNewCard] = useState({ cardNumber: '', cardHolderFirstName: '', cardHolderLastName: '', expirationDate: '', securityCode: '', zipCode: '', country: '', state: '', city: '', address: '' });
    const [msg, setMsg] = useState('');
    const [localOnly, setLocalOnly] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const authRaw = localStorage.getItem('cinemaAuth');
        const storedUserRaw = localStorage.getItem('cinemaUser');
        const storedUser = storedUserRaw ? JSON.parse(storedUserRaw) : null;

        if (!authRaw) {
            if (storedUser) {
                setCustomer(storedUser);
                setForm({
                    firstName: storedUser.firstName || '',
                    lastName: storedUser.lastName || '',
                    phoneNumber: storedUser.phoneNumber || '',
                    address: storedUser.address || '',
                    city: storedUser.city || '',
                    state: storedUser.state || '',
                    zipCode: storedUser.zipCode || '',
                    country: storedUser.country || ''
                });
                setPaymentMethods(storedUser.paymentMethods || []);
                setPromotions(storedUser.promotions || []);
                setLocalOnly(true);
                return;
            }
            navigate('/login');
            return;
        }

        let parsed;
        try { parsed = JSON.parse(authRaw); } catch (e) { parsed = null; }
        const email = parsed?.email;

        if (!email) {
            if (storedUser) {
                setCustomer(storedUser);
                setForm({
                    firstName: storedUser.firstName || '',
                    lastName: storedUser.lastName || '',
                    phoneNumber: storedUser.phoneNumber || '',
                    address: storedUser.address || '',
                    city: storedUser.city || '',
                    state: storedUser.state || '',
                    zipCode: storedUser.zipCode || '',
                    country: storedUser.country || ''
                });
                setPaymentMethods(storedUser.paymentMethods || []);
                setPromotions(storedUser.promotions || []);
                setLocalOnly(true);
                return;
            }
            navigate('/login');
            return;
        }

        // fetch customer by email from backend
        fetch(`http://localhost:8080/customers/by-email?email=${encodeURIComponent(email)}`)
            .then(r => {
                if (!r.ok) throw new Error('Customer not found');
                return r.json();
            })
            .then(data => {
                setCustomer(data);
                setForm({
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    phoneNumber: data.phoneNumber || '',
                    address: data.address || '',
                    city: data.city || '',
                    state: data.state || '',
                    zipCode: data.zipCode || '',
                    country: data.country || ''
                });
                setPaymentMethods(data.paymentMethods || []);
                setPromotions(data.promotions || []);
            })
            .catch(() => {
                // fallback: if backend didn't find user but local stored user exists, use it
                if (storedUser && storedUser.email === email) {
                    setCustomer(storedUser);
                    setForm({
                        firstName: storedUser.firstName || '',
                        lastName: storedUser.lastName || '',
                        phoneNumber: storedUser.phoneNumber || '',
                        address: storedUser.address || '',
                        city: storedUser.city || '',
                        state: storedUser.state || '',
                        zipCode: storedUser.zipCode || '',
                        country: storedUser.country || ''
                    });
                    setPaymentMethods(storedUser.paymentMethods || []);
                    setPromotions(storedUser.promotions || []);
                    setLocalOnly(true);
                    return;
                }
                // otherwise redirect to signin
                navigate('/login');
            });

        // fetch all promotions
        fetch('http://localhost:8080/promotions')
            .then(r => r.json())
            .then(list => setAllPromotions(list))
            .catch(() => setAllPromotions([]));
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!customer) return;
    
        // Prepare base payload with profile info (excluding password)
        const payload = { 
            ...customer, 
            firstName: form.firstName,
            lastName: form.lastName,
            phoneNumber: form.phoneNumber,
            address: form.address,
            city: form.city,
            state: form.state,
            zipCode: form.zipCode,
            country: form.country
        };
    
        // Handle password update logic
        if (password) {
            // If trying to change password, current password is required
            if (!currentPasswordInput) {
                setMsg('Please enter your current password to change password');
                return;
            }
            
            // Verify current password against backend before allowing update
            try {
                const verifyResponse = await fetch('http://localhost:8080/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        emailOrUsername: customer.email,
                        password: currentPasswordInput
                    })
                });
                
                if (!verifyResponse.ok) {
                    setMsg('Current password is incorrect');
                    return;
                }
                
                // Only add new password to payload if current password was correct
                payload.password = password;
            } catch (error) {
                setMsg('Failed to verify current password');
                return;
            }
        }
        
        // Local save (no backend user)
        if (localOnly || !customer?.id) {
            const stored = JSON.parse(localStorage.getItem('cinemaUser') || '{}');
            Object.assign(stored, payload);
            localStorage.setItem('cinemaUser', JSON.stringify(stored));
            setCustomer(stored);
            setMsg(password ? 'Password and profile updated successfully' : 'Profile updated successfully');
            setPassword('');
            setCurrentPasswordInput('');
            return;
        }
    
        // Backend save
        fetch(`http://localhost:8080/customers/${customer.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(r => {
                if (!r.ok) throw new Error('Save failed');
                return r.json();
            })
            .then(updated => {
                setCustomer(updated);
                setMsg(password ? 'Password and profile updated successfully' : 'Profile updated successfully');
                setPassword('');
                setCurrentPasswordInput('');
            })
            .catch(() => setMsg('Failed to save profile'));
    };
    


    const handleAddCard = (e) => {
        e.preventDefault();
        if (!customer) return;


        if ((paymentMethods || []).length >= 4) {
            setMsg('Cannot add more than 3 payment cards');
            return;
        }
      const ExpirationDate = `20${newCard.expYear}-${newCard.expMonth}-01`;

        // Prepare PaymentMethod object similar to backend entity
        const pmPayload = {
            cardNumber: Number(newCard.cardNumber),
            cardHolderFirstName: newCard.cardHolderFirstName,
            cardHolderLastName: newCard.cardHolderLastName,
            expirationDate: ExpirationDate, // should be yyyy-mm-dd
            securityCode: Number(newCard.securityCode),
            //changed due to casting issue
            zipCode: 30338,
            country: newCard.country,
            state: newCard.state,
            city: newCard.city,
            address: newCard.address
        };

        if (localOnly || !customer?.id) {
            // create local payment method (fake id)
            const fake = { ...pmPayload, id: Date.now() };
            const updated = [...paymentMethods, fake];
            setPaymentMethods(updated);
            // persist to local storage
            const storedRaw = localStorage.getItem('cinemaUser');
            const stored = storedRaw ? JSON.parse(storedRaw) : {};
            stored.paymentMethods = updated;
            localStorage.setItem('cinemaUser', JSON.stringify(stored));
            setNewCard({ cardNumber: '', cardHolderFirstName: '', cardHolderLastName: '', expirationDate: '', securityCode: '', zipCode: '', country: '', state: '', city: '', address: '' });
            setMsg('Card added');
            return;
        }

        fetch(`http://localhost:8080/customers/${customer.id}/payment-methods`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pmPayload)
        })
            .then(r => r.json())
            .then(saved => {
                setPaymentMethods(prev => [...prev, saved]);
                setNewCard({ cardNumber: '', cardHolderFirstName: '', cardHolderLastName: '', expirationDate: '', securityCode: '', zipCode: '', country: '', state: '', city: '', address: '' });
                setMsg('Card added');
            })
            .catch(() => setMsg('Failed to add card'));
    };

    const handleDeleteCard = (id) => {
        if (localOnly || !customer?.id) {
            const updated = paymentMethods.filter(p => p.id !== id);
            setPaymentMethods(updated);
            const storedRaw = localStorage.getItem('cinemaUser');
            const stored = storedRaw ? JSON.parse(storedRaw) : {};
            stored.paymentMethods = updated;
            localStorage.setItem('cinemaUser', JSON.stringify(stored));
            setMsg('Card removed');
            return;
        }

        fetch(`http://localhost:8080/payment-methods/${id}`, { method: 'DELETE' })
            .then(r => {
                if (!r.ok) throw new Error('Delete failed');
                setPaymentMethods(prev => prev.filter(p => p.id !== id));
                setMsg('Card removed');
            })
            .catch(() => setMsg('Failed to remove card'));
    };

    const isPromoRegistered = (promo) => {
        return promotions.some(p => p.id === promo.id);
    };

    const togglePromotion = (promo) => {
    
        if (!customer) {
            return <div style={{ color: "white", textAlign: "center", marginTop: "100px" }}>
                Loading your profile...
            </div>;
        }
    
        const registered = isPromoRegistered(promo);
        const url = `http://localhost:8080/customers/${customer.id}/promotions/${promo.id}`;
        const method = registered ? 'DELETE' : 'POST';
        fetch(url, { method })
            .then(r => {
                if (!r.ok) throw new Error('Promo toggle failed');
                if (registered) {
                    setPromotions(prev => prev.filter(p => p.id !== promo.id));
                } else {
                    setPromotions(prev => [...prev, promo]);
                }
            })
            .catch(() => setMsg('Failed to update promotions'));
    };

    if (!customer) return null;

    return (
        <>
        <Navbar />
        <div className="profile" style={{ padding: 20, maxWidth: 900, margin: '0 auto', color: 'white' }}>
            <h2>My Profile</h2>
            {msg && <div style={{ marginBottom: 12, color: '#0f0' }}>{msg}</div>}

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <fieldset style={{ border: '1px solid #444', padding: 12 }}>
                <legend>Personal Information</legend>
                <label>
                    Email
                    <input value={customer.email} disabled style={{ marginLeft: 8 }} />
                </label>
                <label>
                    First name
                    <input name="firstName" value={form.firstName} onChange={handleChange} style={{ marginLeft: 8 }} />
                </label>
                <label>
                    Last name
                    <input name="lastName" value={form.lastName} onChange={handleChange} style={{ marginLeft: 8 }} />
                </label>
                <label>
                    Phone number
                    <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} style={{ marginLeft: 8 }} />
                </label>
                </fieldset>

                <fieldset style={{ border: '1px solid #444', padding: 12 }}>
                    <legend>Billing address</legend>
                    <label>Address <input name="address" value={form.address} onChange={handleChange} /></label>
                    <label>City <input name="city" value={form.city} onChange={handleChange} /></label>
                    <label>State <input name="state" value={form.state} onChange={handleChange} /></label>
                    <label>Zip <input name="zipCode" value={form.zipCode} onChange={handleChange} /></label>
                    <label>Country <input name="country" value={form.country} onChange={handleChange} /></label>
                </fieldset>

                <label>
                    Current password
                    <input type="password" value={currentPasswordInput} onChange={e => setCurrentPasswordInput(e.target.value)} style={{ marginLeft: 8 }} required={!!password} // required only if changing password
                    />
                </label>

                <label>
                    New password
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ marginLeft: 8 }} />
                </label>

                <div>
                    <button type="submit" style={{ marginRight: 8 }}>Save</button>
                </div>
            </form>

            <section style={{ marginTop: 24 }}>
                <h3>Payment Methods</h3>
                <div>Maximum 3 cards allowed.</div>
                <ul>
                    {paymentMethods.map(pm => (
                        <li key={pm.id} style={{ marginBottom: 8 }}>
                            **** **** **** {String(pm.cardNumber).slice(-4)} — {pm.cardHolderFirstName} {pm.cardHolderLastName}
                            <button style={{ marginLeft: 8 }} onClick={() => handleDeleteCard(pm.id)}>Remove</button>
                        </li>
                    ))}
                </ul>

                <form onSubmit={handleAddCard} style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
                    <fieldset style={{ border: '1px solid #444', padding: 8 }}>
                        <legend>Add card</legend>
                        <div>
                        <input
                            placeholder="First name"
                            name="cardHolderFirstName"
                            value={newCard.cardHolderFirstName}
                            onChange={e => setNewCard({...newCard, cardHolderFirstName: e.target.value})}
                            required
                        />
                        <input
                            placeholder="Last Name"
                            name="cardHolderLastName"
                            value={newCard.cardHolderLastName}
                            onChange={e => setNewCard({...newCard, cardHolderLastName: e.target.value})}
                            required
                        />
                        </div>

                        <div>
                        <input
                            placeholder="Card number"
                            name="cardNumber"
                            maxLength={16}
                            inputMode="numeric"
                            pattern="\d{16}"
                            title="Card number must be 16 digits"
                            value={newCard.cardNumber}
                            onChange={e => setNewCard({...newCard, cardNumber: e.target.value})}
                            required
                        />

                        <input
                            placeholder="CVV"
                            name="securityCode"
                            maxLength={4}
                            inputMode="numeric"
                            pattern="\d{3,4}"
                            title="CVV must be 3-4 digits"
                            value={newCard.securityCode}
                            onChange={e => setNewCard({...newCard, securityCode: e.target.value})}
                            />
                        <div>
                            <div style={{ display: 'inline-block', marginLeft: 8 }}> Expiration:</div>
                            <select
                                name="expMonth"
                                required
                                value={newCard.expMonth || ""}
                                onChange={e => setNewCard({ ...newCard, expMonth: e.target.value })}
                            >
                                <option value="">MM</option>
                                {[...Array(12)].map((_, i) => {
                                const month = String(i + 1).padStart(2, "0");
                                return <option key={month} value={month}>{month}</option>;
                                })}
                            </select>

                            <select
                                name="expYear"
                                required
                                value={newCard.expYear || ""}
                                onChange={e => setNewCard({ ...newCard, expYear: e.target.value })}
                            >
                                <option value="">YY</option>
                                {[...Array(12)].map((_, i) => {
                                    const year = new Date().getFullYear() + i;
                                    return <option key={year} value={String(year).slice(-2)}>{year}</option>;
                                })}
                            </select>
                            </div>
                        </div>

                        <div style={{ marginTop: 8 }}>
                            <button type="submit" disabled={(paymentMethods||[]).length >= 3}>Add card</button>
                        </div>
                    </fieldset>
                </form>
            </section>
            
            <section style={{ marginTop: 24 }}>
                <h3>Promotions</h3>

                <label className="toggle-wrapper">
                <input
                    type="checkbox"
                    className="toggle-input"
                    checked={promotions.length === allPromotions.length && allPromotions.length > 0}
                    onChange={() => {
                        if (!customer) return;

                        const selectingAll = promotions.length !== allPromotions.length;
                        setPromotions(selectingAll ? allPromotions : []);
                        const requestList = selectingAll? allPromotions: promotions;

                        Promise.all(
                        requestList.map(promo =>
                        fetch(`http://localhost:8080/customers/${customer.id}/promotions/${promo.id}`, {
                            method: selectingAll ? "POST" : "DELETE"
                            })
                        )
                    )
                    .then(() => {
                        setPromotions(selectingAll ? allPromotions : []);
                        setMsg(selectingAll
                            ? "Registered for promotions"
                            : "Unregistered from promotions"
                        );
                    })
                    .catch(() => setMsg("Failed to update promotions"));
            }}
        />
        <span className="toggle-switch"></span>
        Receive promotional emails
        </label>
    </section>

        </div>
        </>
    );
}
