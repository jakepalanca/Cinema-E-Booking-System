import React, { useEffect, useState } from "react";
import Navbar from "./Navbar.jsx";
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
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "2rem", color: "white" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div>
            <h2 style={{ margin: 0 }}>My Orders</h2>
            <p style={{ margin: "4px 0", color: "#ccc" }}>
              {user?.firstName ? `${user.firstName}'s tickets` : "Your saved ticket summaries"}
            </p>
          </div>
          {orders.length > 0 && (
            <button
              onClick={clearOrders}
              style={{
                background: "#2d2d2d",
                color: "white",
                border: "1px solid #555",
                borderRadius: 6,
                padding: "10px 14px",
                cursor: "pointer",
              }}
            >
              Clear saved orders
            </button>
          )}
        </div>

        {orders.length === 0 ? (
          <div style={{ padding: "1.5rem", border: "1px solid #444", borderRadius: 10, background: "#1f1f1f" }}>
            <p style={{ margin: 0, color: "#ccc" }}>
              No orders saved yet. Complete a booking to see it here.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "1rem" }}>
            {orders.map((order) => (
              <div
                key={order.id}
                style={{
                  border: "1px solid #444",
                  borderRadius: 10,
                  padding: "1rem",
                  background: "linear-gradient(135deg, #1f1f1f, #252525)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                  <div>
                    <h3 style={{ margin: "0 0 4px 0" }}>{order.movieTitle}</h3>
                    <p style={{ margin: 0, color: "#ccc" }}>{order.showtime}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ margin: 0, color: "#ccc" }}>Booked: {formatDateTime(order.createdAt)}</p>
                    <p style={{ margin: "2px 0 0 0", fontWeight: 700 }}>${order.total?.toFixed(2)}</p>
                  </div>
                </div>
                <p style={{ margin: "8px 0", color: "#ccc" }}>{order.location}</p>
                <p style={{ margin: "8px 0", color: "#ccc" }}>
                  Seats: {order.seats?.join(", ") || "—"}
                </p>
                <div style={{ display: "flex", gap: "1rem", color: "#7dd87d" }}>
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
