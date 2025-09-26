// src/Pages/BookingPage.js
import { useParams, useLocation } from "react-router-dom";

export default function BookingPage() {
  const { movieId } = useParams();
  const { state } = useLocation();
  const title = state?.title || "Movie Title";
  const showtime = state?.showtime || "Showtime";

  return (
    <div style={{ padding: 20, maxWidth: 720, margin: "0 auto" }}>
      <h2>Booking Page (Prototype)</h2>

      <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, marginBottom: 12 }}>
        <p><strong>Movie:</strong> {title}</p>
        <p><strong>Showtime:</strong> {showtime}</p>
        <small style={{ color: "#666" }}>movieId: {movieId}</small>
      </div>

      <form onSubmit={(e)=>e.preventDefault()} style={{ display: "grid", gap: 10 }}>
        <label>Full Name <input type="text" placeholder="Jane Doe" required style={{ width: "100%" }} /></label>
        <label>Email <input type="email" placeholder="jane@example.com" required style={{ width: "100%" }} /></label>
        <label>Number of Tickets <input type="number" min="1" defaultValue={1} style={{ width: 120 }} /></label>
        <button type="submit">Continue (Prototype)</button>
      </form>

      <p style={{ color: "#777", marginTop: 8 }}>
        * UI-only for Sprint 1 — no seats/pricing/checkout yet.
      </p>
    </div>
  );
}
