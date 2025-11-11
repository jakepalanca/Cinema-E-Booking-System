// src/Pages/BookingPage.js
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";


export default function BookingPage() {
  const { state } = useLocation();
  const movie = state?.movie;
  const show = state?.show;
  const title = movie?.title || state?.title || "Movie Title";
  const showtime = state?.showtime || "Showtime";

  const [ticketCategories, setTicketCategories] = useState([]);
  const [tickets, setTickets] = useState([{ category: "", seat: null }]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showroomSeats, setShowroomSeats] = useState({ rows: 8, cols: 10 }); // Default seat layout
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  // Fetch ticket categories
  useEffect(() => {
    fetch("http://localhost:8080/ticket-categories")
      .then(res => res.json())
      .then(data => setTicketCategories(data))
      .catch(err => console.error("Failed to fetch ticket categories:", err));
  }, []);

  // Fetch showroom info and occupied seats for this show
  useEffect(() => {
    if (show?.showroom) {
      setShowroomSeats({
        rows: show.showroom.roomHeight || 8,
        cols: show.showroom.roomWidth || 10
      });
    }
    
    // Fetch occupied seats for this show
    if (show?.id) {
      fetch(`http://localhost:8080/tickets`)
        .then(res => res.json())
        .then(data => {
          const occupied = data
            .filter(ticket => ticket.show?.id === show.id)
            .map(ticket => `${ticket.seatRow}-${ticket.seatCol}`);
          setOccupiedSeats(occupied);
        })
        .catch(err => console.error("Failed to fetch occupied seats:", err));
    }
  }, [show]);

  const addTicket = () => {
    setTickets([...tickets, { category: "", seat: null }]);
  };

  const removeTicket = (index) => {
    const newTickets = tickets.filter((_, i) => i !== index);
    setTickets(newTickets.length > 0 ? newTickets : [{ category: "", seat: null }]);
  };

  const updateTicketCategory = (index, categoryId) => {
    const newTickets = [...tickets];
    newTickets[index].category = categoryId;
    setTickets(newTickets);
  };

  const toggleSeat = (row, col) => {
    const seatId = `${row}-${col}`;
    
    if (occupiedSeats.includes(seatId)) {
      return; // Can't select occupied seats
    }

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      if (selectedSeats.length < tickets.length) {
        setSelectedSeats([...selectedSeats, seatId]);
      } else {
        alert(`You can only select ${tickets.length} seat(s). Add more tickets or deselect a seat first.`);
      }
    }
  };

  const getSeatStatus = (row, col) => {
    const seatId = `${row}-${col}`;
    if (occupiedSeats.includes(seatId)) return "occupied";
    if (selectedSeats.includes(seatId)) return "selected";
    return "available";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (selectedSeats.length !== tickets.length) {
      alert(`Please select ${tickets.length} seat(s)`);
      return;
    }

    const incompleteTickets = tickets.filter(t => !t.category);
    if (incompleteTickets.length > 0) {
      alert("Please select age category for all tickets");
      return;
    }

    // Build booking data
    const bookingData = {
      fullName,
      email,
      movie: title,
      showtime,
      tickets: tickets.map((ticket, index) => ({
        category: ticketCategories.find(c => c.id === parseInt(ticket.category)),
        seat: selectedSeats[index]
      }))
    };

    console.log("Booking data:", bookingData);
    alert("Booking submitted! (Check console for details)");
  };

  const totalPrice = tickets.reduce((sum, ticket) => {
    const category = ticketCategories.find(c => c.id === parseInt(ticket.category));
    return sum + (category?.price || 0);
  }, 0);

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto", color: "white" }}>
      <h2>Booking Page</h2>

      <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, marginBottom: 20 }}>
        <p><strong>Movie:</strong> {title}</p>
        <p><strong>Showtime:</strong> {showtime}</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 20 }}>
        {/* Customer Info */}
        <div style={{ border: "1px solid #555", borderRadius: 8, padding: 16 }}>
          <h3 style={{ marginTop: 0 }}>Customer Information</h3>
          <div style={{ display: "grid", gap: 10 }}>
            <label>
              Full Name
              <input
                type="text"
                placeholder="Jane Doe"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{ width: "100%", padding: 8, marginTop: 4 }}
              />
            </label>
            <label>
              Email
              <input
                type="email"
                placeholder="jane@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: "100%", padding: 8, marginTop: 4 }}
              />
            </label>
          </div>
        </div>

        {/* Ticket Selection */}
        <div style={{ border: "1px solid #555", borderRadius: 8, padding: 16 }}>
          <h3 style={{ marginTop: 0 }}>Tickets</h3>
          {tickets.map((ticket, index) => (
            <div key={index} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
              <span style={{ minWidth: 80 }}>Ticket {index + 1}:</span>
              <select
                value={ticket.category}
                onChange={(e) => updateTicketCategory(index, e.target.value)}
                required
                style={{ flex: 1, padding: 8 }}
              >
                <option value="">Select Age Category</option>
                {ticketCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} - ${cat.price.toFixed(2)}
                  </option>
                ))}
              </select>
              {tickets.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTicket(index)}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer"
                  }}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addTicket}
            style={{
              padding: "8px 16px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              marginTop: 10
            }}
          >
            + Add Ticket
          </button>
          {totalPrice > 0 && (
            <p style={{ marginTop: 10, fontSize: 18, fontWeight: "bold" }}>
              Total: ${totalPrice.toFixed(2)}
            </p>
          )}
        </div>

        {/* Seat Selection */}
        <div style={{ border: "1px solid #555", borderRadius: 8, padding: 16 }}>
          <h3 style={{ marginTop: 0 }}>Select {tickets.length} Seat(s)</h3>
          <div style={{ marginBottom: 15, display: "flex", gap: 20, fontSize: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 20, height: 20, backgroundColor: "#28a745", border: "1px solid #ddd" }}></div>
              <span>Available</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 20, height: 20, backgroundColor: "#ffc107", border: "1px solid #ddd" }}></div>
              <span>Selected</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 20, height: 20, backgroundColor: "#666", border: "1px solid #ddd" }}></div>
              <span>Occupied</span>
            </div>
          </div>
          
          <div style={{ textAlign: "center", marginBottom: 10, padding: 10, backgroundColor: "#333", borderRadius: 4 }}>
            SCREEN
          </div>

          <div style={{ display: "grid", gap: 5, justifyContent: "center" }}>
            {Array.from({ length: showroomSeats.rows }, (_, row) => (
              <div key={row} style={{ display: "flex", gap: 5 }}>
                <span style={{ width: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {String.fromCharCode(65 + row)}
                </span>
                {Array.from({ length: showroomSeats.cols }, (_, col) => {
                  const status = getSeatStatus(row, col);
                  return (
                    <button
                      key={`${row}-${col}`}
                      type="button"
                      onClick={() => toggleSeat(row, col)}
                      disabled={status === "occupied"}
                      style={{
                        width: 35,
                        height: 35,
                        backgroundColor:
                          status === "occupied" ? "#666" :
                          status === "selected" ? "#ffc107" :
                          "#28a745",
                        border: "1px solid #ddd",
                        borderRadius: 4,
                        cursor: status === "occupied" ? "not-allowed" : "pointer",
                        color: "white",
                        fontSize: 12
                      }}
                    >
                      {col + 1}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
          <p style={{ marginTop: 10, fontSize: 14 }}>
            Selected seats: {selectedSeats.length > 0 ? selectedSeats.map(s => {
              const [row, col] = s.split('-');
              return `${String.fromCharCode(65 + parseInt(row))}${parseInt(col) + 1}`;
            }).join(', ') : 'None'}
          </p>
        </div>

        <button
          type="submit"
          style={{
            padding: "12px 24px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 16,
            fontWeight: "bold"
          }}
        >
          Continue to Payment
        </button>
      </form>
    </div>
  );
}
