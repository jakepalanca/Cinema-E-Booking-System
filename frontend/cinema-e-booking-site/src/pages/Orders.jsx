import React, { useEffect, useState } from "react";
import Navbar from "./Navbar.jsx";
import "../css/Homepage.css";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Orders() {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:8080/my-bookings", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          // Transform backend data to match our display format
          const transformed = data.map((booking) => ({
            id: booking.id,
            movieTitle: booking.movieTitle || "Unknown Movie",
            showtime: formatShowtime(booking.showDate, booking.showTime),
            location: [booking.cinemaName, booking.theaterName, booking.showroomLabel]
              .filter(Boolean)
              .join(" • ") || "Cinema",
            seats: booking.seats || [],
            total: booking.totalPrice,
            promoCode: booking.promoCode,
            createdAt: booking.createdAt,
            ticketCount: booking.ticketCount,
          }));
          setOrders(transformed);
        } else if (response.status === 401) {
          setError("Please log in to view your orders");
        } else {
          setError("Failed to load orders");
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Failed to connect to server");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  const formatShowtime = (date, time) => {
    if (!date && !time) return "—";
    const parts = [];
    if (date) {
      const d = new Date(date);
      parts.push(d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }));
    }
    if (time) {
      // time comes as "HH:mm:ss" from backend
      const [hours, minutes] = time.split(":");
      const h = parseInt(hours);
      const ampm = h >= 12 ? "PM" : "AM";
      const hour12 = h % 12 || 12;
      parts.push(`${hour12}:${minutes} ${ampm}`);
    }
    return parts.join(" at ");
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

  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem", color: "var(--text-primary)" }}>
          <div style={{ 
            textAlign: "center", 
            padding: "3rem",
            background: "var(--surface)",
            borderRadius: "var(--radius)",
            border: "1px solid var(--border)"
          }}>
            <h2 style={{ marginBottom: "1rem" }}>My Orders</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", margin: 0 }}>
              Please log in to view your order history.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem", color: "var(--text-primary)" }}>
        <div className="welcome-blurb" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "0.5rem" }}>
          <div>
            <h2 style={{ marginBottom: "0.5rem" }}>My Orders</h2>
            <p style={{ color: "var(--text-muted)" }}>
              {user?.firstName ? `${user.firstName}'s booking history` : "Your booking history"}
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{ 
            textAlign: "center", 
            padding: "3rem",
            marginTop: "0.5rem",
            background: "var(--surface)",
            borderRadius: "var(--radius)",
            border: "1px solid var(--border)"
          }}>
            <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", margin: 0 }}>
              Loading your orders...
            </p>
          </div>
        ) : error ? (
          <div style={{ 
            textAlign: "center", 
            padding: "3rem",
            marginTop: "0.5rem",
            background: "var(--surface)",
            borderRadius: "var(--radius)",
            border: "1px solid var(--error, #dc3545)"
          }}>
            <p style={{ color: "var(--error, #dc3545)", fontSize: "1.1rem", margin: 0 }}>
              {error}
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ 
            textAlign: "center", 
            padding: "3rem",
            marginTop: "0.5rem",
            background: "var(--surface)",
            borderRadius: "var(--radius)",
            border: "1px solid var(--border)"
          }}>
            <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", margin: 0 }}>
              No orders yet. Complete a booking to see it here.
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
                    <p style={{ margin: "2px 0 0 0", fontWeight: 700 }}>
                      {order.total != null ? `$${order.total.toFixed(2)}` : "—"}
                    </p>
                  </div>
                </div>
                <p style={{ margin: "8px 0", color: "var(--text-muted)" }}>{order.location}</p>
                <p style={{ margin: "8px 0", color: "var(--text-muted)" }}>
                  Seats: {order.seats?.length > 0 ? order.seats.join(", ") : "—"}
                  {order.ticketCount > 0 && ` (${order.ticketCount} ticket${order.ticketCount > 1 ? 's' : ''})`}
                </p>
                {order.promoCode && (
                  <div style={{ display: "flex", gap: "1rem", color: "var(--success, #7dd87d)" }}>
                    <span>Promo: {order.promoCode}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
