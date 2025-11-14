import React, {useState} from "react";
import Navbar from "./Navbar";
import "./ManagePromotions.css"

function ManagePromotions(){
    const [promotion, setPromotion] = useState({
        code: "",
        discountPercentage: "",
        startDate: "",
        endDate: "",
    });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

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
            const res = await fetch("http://localhost:8080/promotions", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
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
        try {
            setLoading(true);
            setMessage("Sending promotion emails.");
            const res = await fetch("http://localhost:8080/promotions/email", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    code: promotion.code,
                }),
            });
            if (res.ok) {
                setMessage("Promotion emailed to subscribed users!");
            } else {
                const err = await res.json();
                setMessage(err.message || "Failed to email promotion.");
            }
        } catch (err) {
            console.error(err);
            setMessage(err.message || "Failed to email promotion.");
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
                            <button
                                type="button"
                                className="email-btn"
                                onClick={handleEmailPromotion}
                                disabled={loading}
                            >
                                {loading ? "Sending..." : "Email Promotion"}
                            </button>
                        </div>
                </form>
                {message && <p className="info-message">{message}</p>}
            </div>
        </>
    );
}

export default ManagePromotions;