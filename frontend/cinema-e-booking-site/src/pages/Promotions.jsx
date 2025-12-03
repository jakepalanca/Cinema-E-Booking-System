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
                    const start = new Date(promo.startDate);
                    const end = new Date(promo.endDate);
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
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
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
                        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                        gap: "1.5rem",
                        marginTop: "1.5rem"
                    }}>
                        {promotions.map((promo) => (
                            <div
                                key={promo.id}
                                style={{
                                    background: "linear-gradient(135deg, var(--surface) 0%, var(--surface-alt) 100%)",
                                    borderRadius: "var(--radius)",
                                    border: "1px solid var(--border)",
                                    padding: "1.5rem",
                                    boxShadow: "var(--shadow-strong)",
                                    position: "relative",
                                    overflow: "hidden"
                                }}
                            >
                                {/* Decorative accent */}
                                <div style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: "4px",
                                    background: "var(--uga-red)"
                                }} />
                                
                                <div style={{ 
                                    display: "flex", 
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    marginBottom: "1rem"
                                }}>
                                    <div>
                                        <span style={{
                                            display: "inline-block",
                                            background: "var(--uga-red)",
                                            color: "var(--paper)",
                                            padding: "0.25rem 0.75rem",
                                            borderRadius: "9999px",
                                            fontSize: "0.875rem",
                                            fontWeight: "600",
                                            marginBottom: "0.5rem"
                                        }}>
                                            {Math.round(promo.discountPercentage * 100)}% OFF
                                        </span>
                                    </div>
                                </div>

                                <div style={{
                                    background: "var(--near-black)",
                                    border: "2px dashed var(--border)",
                                    borderRadius: "8px",
                                    padding: "1rem",
                                    textAlign: "center",
                                    marginBottom: "1rem"
                                }}>
                                    <span style={{
                                        fontFamily: "monospace",
                                        fontSize: "1.5rem",
                                        fontWeight: "700",
                                        letterSpacing: "0.1em",
                                        color: "var(--paper)"
                                    }}>
                                        {promo.code}
                                    </span>
                                </div>

                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    fontSize: "0.875rem",
                                    color: "var(--text-muted)"
                                }}>
                                    <span>Valid from {formatDate(promo.startDate)}</span>
                                    <span>Expires {formatDate(promo.endDate)}</span>
                                </div>
                                <button
                                    onClick={() => handleUsePromo(promo)}
                                    style={{
                                        marginTop: "1rem",
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
