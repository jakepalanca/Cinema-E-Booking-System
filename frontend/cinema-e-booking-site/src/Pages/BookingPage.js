// src/Pages/BookingPage.js
import { useLocation } from "react-router-dom";

export default function BookingPage() {
  const { state } = useLocation();
  const movie = state?.movie;
  const title = movie?.title || state?.title || "Movie Title";
  const showtime = state?.showtime || "Showtime";

  return (
    <div style={{ padding: 20, maxWidth: 720, margin: "0 auto", color: "white" }}>
      <h2>Booking Page</h2>

      <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, marginBottom: 12 }}>
        <p><strong>Movie:</strong> {title}</p>
        <p><strong>Showtime:</strong> {showtime}</p>
      </div>

      <form onSubmit={(e)=>e.preventDefault()} style={{ display: "grid", gap: 10 }}>
        <label>Full Name <input type="text" placeholder="Jane Doe" required style={{ width: "100%" }} /></label>
        <label>Email <input type="email" placeholder="jane@example.com" required style={{ width: "100%" }} /></label>
        <label>Number of Tickets <input type="number" min="1" defaultValue={1} style={{ width: 120 }} /></label>
        <button type="submit">Continue</button>
      </form>
    </div>
  );
}
