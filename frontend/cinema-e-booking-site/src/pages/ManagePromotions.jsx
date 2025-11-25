import React, {useState, useEffect} from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import "../css/ManagePromotions.css"

function ManagePromotions(){
    const [promotion, setPromotion] = useState({
        code: "",
        discountPercentage: "",
        startDate: "",
        endDate: "",
    });
    const [promotions, setPromotions] = useState([]);
    const [selectedPromotion, setSelectedPromotion] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [authorized, setAuthorized] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const isAdmin = localStorage.getItem("isAdmin") === "true";
        if (!isAdmin) navigate("/");
        else setAuthorized(true);
    }, [navigate]);

    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                const res = await fetch("http://localhost:8080/promotions");
                const data = await res.json();
                setPromotions(data);
            } catch (err) {
                console.error(err);
                setMessage("Failed to fetch promotions.")
            }
        };
        fetchPromotions();
    }, []);
    if (authorized === null) return null;
    const handleChange = (e) => {
        const {name, value} = e.target;
        setPromotion((prev) => ({ ...prev, [name]: value}));
    };
    const validateForm = () => {
        const { code, discountPercentage, startDate, endDate } = promotion;
        if (!code || !discountPercentage || !startDate || !endDate){
            setMessage("Please fill in all fields.");
            return false;
        }
        if (isNaN(discountPercentage) || discountPercentage <= 0 || discountPercentage > 100) {
            setMessage("Discount percentage must be between 1 and 100.");
            return false;
        }
        if (new Date(startDate) > new Date(endDate)){
            setMessage("Start date cannot be after end date.");
            return false;
        }
        return true;
    };
    const handleCreatePromotion = async (e) => {
        e.preventDefault();
        setMessage("");
        if (!validateForm()) return;
        try {
            setLoading(true);
            const res = await fetch("http://localhost:8080/admin/promotions", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: 'include',
                body: JSON.stringify({
                    code: promotion.code,
                    discountPercentage: Number(promotion.discountPercentage),
                    startDate: promotion.startDate,
                    endDate: promotion.endDate,
                    hasBeenApplied: false,
                }),
            });
            if (res.ok) {
                setMessage("Promotion Created Successfully");
                setPromotion({
                    code: "",
                    discountPercentage: "",
                    startDate: "",
                    endDate: "",
                });
            } else {
                const err = await res.json();
                setMessage(err.message || "Failed to create promotion");
            }
        } catch (err) {
            console.error(err);
            setMessage("Error connecting to the server.");
        } finally {
            setLoading(false);
        }
    };
    const handleEmailPromotion = async () => {
        if ( !selectedPromotion) {
            setMessage("Please select a promotion to email.");
            return;
        }
        try {
            setLoading(true);
            setMessage("Sending promotion email...");
            const res = await fetch(`http://localhost:8080/admin/sendPromotion/${selectedPromotion}`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: 'include',

            });
            if (res.ok) {
                setMessage("Promotion email sent successfully.");
            } else {
                const err = await res.json();
                setMessage(err.message || "Failed to send promotion email.");
            }
        } catch (err) {
            console.error(err);
            setMessage("Error connecting to the server.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <Navbar />
            <div className="manage-promotions-container">
                <h2>Manage Promotions</h2>
                <form className="promotion-form" onSubmit={handleCreatePromotion}>
                    <label>
                        Promo Code:
                        <input
                            name="code"
                            type="text"
                            value={promotion.code}
                            onChange={handleChange}
                            required
                        />
                        </label>
                        <label>
                        Discount Percentage:
                        <input
                            name="discountPercentage"
                            type="number"
                            value={promotion.discountPercentage}
                            onChange={handleChange}
                            min="1"
                            max="100"
                            required
                        />
                        </label>
                        <label>
                        Start Date:
                        <input
                            name="startDate"
                            type="date"
                            value={promotion.startDate}
                            onChange={handleChange}
                            required
                        />
                        </label>
                        <label>
                        End Date:
                        <input
                            name="endDate"
                            type="date"
                            value={promotion.endDate}
                            onChange={handleChange}
                            required
                        />
                        </label>
                        <div className="button-group">
                            <button type="submit" disabled={loading}>
                                {loading ? "Creating..." : "Create Promotion"}
                            </button>
                        </div>
                </form>
                <div className="send-section">
                    <h3>Send Existing Promotion</h3>
                    <select
                        value={selectedPromotion}
                        onChange={(e) => setSelectedPromotion(e.target.value)}
                    >
                        <option value="">-- Select Promotion --</option>
                        {promotions.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.code} — {p.discountPercentage}% off
                            </option>
                        ))}
                    </select>

                    <button
                        type="button"
                        className="email-btn"
                        onClick={handleEmailPromotion}
                        disabled={loading}
                    >
                        {loading ? "Sending..." : "Send Promotion"}
                    </button>
                </div>
                {message && <p className="info-message">{message}</p>}
            </div>
        </>
    );
}

export default ManagePromotions;
