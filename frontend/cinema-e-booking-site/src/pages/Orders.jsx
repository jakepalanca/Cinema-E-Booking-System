import React, { useEffect, useState } from "react";
import Navbar from "./Navbar.jsx";
import "../css/Homepage.css";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(stored);
  }, []);

  const clearOrders = () => {
    localStorage.removeItem("orders");
    setOrders([]);
  };

  const formatDateTime = (iso) => {
    if (!iso) return "—";
    const date = new Date(iso);
    return date.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem", color: "var(--text-primary)" }}>
        <div className="welcome-blurb" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: orders.length > 0 ? "1.5rem" : 0 }}>
          <div>
            <h2 style={{ marginBottom: "0.5rem" }}>My Orders</h2>
            <p style={{ color: "var(--text-muted)" }}>
              {user?.firstName ? `${user.firstName}'s tickets` : "Your saved ticket summaries"}
            </p>
          </div>
          {orders.length > 0 && (
            <button
              onClick={clearOrders}
              style={{
                background: "var(--surface-alt)",
                color: "var(--text-primary)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                padding: "0.65rem 1rem",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Clear saved orders
            </button>
          )}
        </div>

        {orders.length === 0 ? (
          <div style={{ 
            textAlign: "center", 
            padding: "3rem",
            marginTop: "0.5rem",
            background: "var(--surface)",
            borderRadius: "var(--radius)",
            border: "1px solid var(--border)"
          }}>
            <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", margin: 0 }}>
              No orders saved yet. Complete a booking to see it here.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "1rem" }}>
            {orders.map((order) => (
              <div
                key={order.id}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  padding: "1rem",
                  background: "linear-gradient(135deg, var(--surface) 0%, var(--surface-alt) 100%)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                  <div>
                    <h3 style={{ margin: "0 0 4px 0" }}>{order.movieTitle}</h3>
                    <p style={{ margin: 0, color: "var(--text-muted)" }}>{order.showtime}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ margin: 0, color: "var(--text-muted)" }}>Booked: {formatDateTime(order.createdAt)}</p>
                    <p style={{ margin: "2px 0 0 0", fontWeight: 700 }}>${order.total?.toFixed(2)}</p>
                  </div>
                </div>
                <p style={{ margin: "8px 0", color: "var(--text-muted)" }}>{order.location}</p>
                <p style={{ margin: "8px 0", color: "var(--text-muted)" }}>
                  Seats: {order.seats?.join(", ") || "—"}
                </p>
                <div style={{ display: "flex", gap: "1rem", color: "var(--success, #7dd87d)" }}>
                  {order.promoCode && <span>Promo: {order.promoCode}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
