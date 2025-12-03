import React, { useState, useEffect } from "react";
import Navbar from "./Navbar.jsx";
import "../css/Homepage.css";

function Promotions() {
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [feedback, setFeedback] = useState("");

    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                const response = await fetch("http://localhost:8080/promotions");
                if (!response.ok) {
                    throw new Error("Failed to fetch promotions");
                }
                const data = await response.json();
                // Filter to show only active promotions (current date is between start and end)
                const now = new Date();
                const activePromotions = data.filter(promo => {
                    // If seed promos don't have dates, show them by default
                    if (!promo.startDate || !promo.endDate) return true;
                    const start = new Date(promo.startDate);
                    const end = new Date(promo.endDate);
                    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return true;
                    return now >= start && now <= end;
                });
                setPromotions(activePromotions);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPromotions();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return null;
        const parsed = new Date(dateString);
        if (Number.isNaN(parsed.getTime())) return null;
        return parsed.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    };

    const handleUsePromo = async (promo) => {
        localStorage.setItem("selectedPromoCode", promo.code);
        setFeedback(`Promo ${promo.code} saved. It will auto-fill on the booking page.`);

        try {
            await navigator.clipboard.writeText(promo.code);
            setFeedback(`Promo ${promo.code} copied and saved for checkout.`);
        } catch {
            // Clipboard may fail in some browsers; ignore
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="loading-state">Loading promotions...</div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <div className="error-state">Error loading promotions: {error}</div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div style={{ 
                maxWidth: "1200px", 
                margin: "0 auto", 
                padding: "2rem",
                color: "var(--text-primary)"
            }}>
                <div className="welcome-blurb">
                    <h2 style={{ marginBottom: "0.5rem" }}>Current Promotions</h2>
                    <p style={{ color: "var(--text-muted)" }}>
                        Use these codes at checkout to save on your next movie experience!
                    </p>
                    {feedback && (
                        <p style={{ marginTop: "0.5rem", color: "var(--success, #7dd87d)" }}>{feedback}</p>
                    )}
                </div>

                {promotions.length === 0 ? (
                    <div style={{ 
                        textAlign: "center", 
                        padding: "3rem",
                        background: "var(--surface)",
                        borderRadius: "var(--radius)",
                        border: "1px solid var(--border)"
                    }}>
                        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>
                            No active promotions at this time. Check back soon!
                        </p>
                    </div>
                ) : (
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                        gap: "1rem",
                        marginTop: "1.25rem"
                    }}>
                        {promotions.map((promo) => (
                            <div
                                key={promo.id}
                                style={{
                                    background: "var(--surface)",
                                    borderRadius: "12px",
                                    border: "1px solid var(--border)",
                                    padding: "1.1rem",
                                    display: "grid",
                                    gap: "0.75rem"
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                    <div style={{
                                        background: "var(--uga-red)",
                                        color: "var(--paper)",
                                        borderRadius: "10px",
                                        padding: "0.35rem 0.7rem",
                                        fontWeight: 700,
                                        minWidth: "72px",
                                        textAlign: "center"
                                    }}>
                                        {Math.round(promo.discountPercentage * 100)}% OFF
                                    </div>
                                    <div style={{ fontFamily: "monospace", fontSize: "1.1rem", fontWeight: 700 }}>
                                        {promo.code}
                                    </div>
                                </div>

                                <div style={{ display: "grid", gap: "0.35rem", fontSize: "0.95rem", color: "var(--text-muted)" }}>
                                    <span>Valid from: {formatDate(promo.startDate) || "Available now"}</span>
                                    <span>Expires: {formatDate(promo.endDate) || "No end date set"}</span>
                                </div>

                                <button
                                    onClick={() => handleUsePromo(promo)}
                                    style={{
                                        width: "100%",
                                        padding: "0.75rem",
                                        borderRadius: "8px",
                                        border: "none",
                                        background: "var(--uga-red)",
                                        color: "var(--paper)",
                                        fontWeight: 700,
                                        cursor: "pointer"
                                    }}
                                >
                                    Use this code
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

export default Promotions;
