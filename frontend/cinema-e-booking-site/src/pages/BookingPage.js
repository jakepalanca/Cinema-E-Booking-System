// src/BookingPage.js
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from './Navbar.jsx';


export default function BookingPage() {
  const { state } = useLocation();
  const movie = state?.movie;
  const show = state?.show;
  const title = movie?.title || state?.title || "Movie Title";
  const showtime = state?.showtime || "Showtime";

  // Debug logging
  useEffect(() => {
    console.log("BookingPage state:", { movie, show });
    console.log("Show showroom:", show?.showroom);
  }, []);

  const [ticketCategories, setTicketCategories] = useState([]);
  const [tickets, setTickets] = useState([{ category: "", seat: null }]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showroomSeats, setShowroomSeats] = useState({ rows: 8, cols: 10 }); // Default seat layout
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [showDetails, setShowDetails] = useState(null);
  const [showroomId, setShowroomId] = useState(null);

  // Fetch full show details with showroom info
  useEffect(() => {
    if (show?.id) {
      // First, try to get the show details
      fetch(`http://localhost:8080/shows/${show.id}`)
        .then(res => res.json())
        .then(data => {
          console.log("Full show details:", data);
          console.log("All properties:", Object.keys(data));
          setShowDetails(data);
        })
        .catch(err => console.error("Failed to fetch show details:", err));
      
      // Also fetch all showrooms to find which one has this show
      fetch(`http://localhost:8080/showrooms`)
        .then(res => res.json())
        .then(showrooms => {
          console.log("All showrooms:", showrooms);
          console.log("First showroom properties:", showrooms[0] ? Object.keys(showrooms[0]) : "none");
          console.log("First showroom shows:", showrooms[0]?.shows);
          
          // Find the showroom that contains this show
          const matchingShowroom = showrooms.find(room => {
            console.log(`Checking showroom ${room.id}, shows:`, room.shows);
            return room.shows?.some(s => s.id === show.id);
          });
          
          if (matchingShowroom) {
            console.log("Found matching showroom:", matchingShowroom);
            setShowroomId(matchingShowroom.id);
            setShowDetails(prev => ({
              ...prev,
              showroom: matchingShowroom
            }));
            setShowroomSeats({
              rows: matchingShowroom.roomHeight || 8,
              cols: matchingShowroom.roomWidth || 10
            });
          } else {
            console.error("No matching showroom found for show ID:", show.id);
            console.error("Try using showroom ID 1 as fallback");
            // Fallback: use showroom ID 1 (common default)
            setShowroomId(1);
          }
        })
        .catch(err => console.error("Failed to fetch showrooms:", err));
    }
  }, [show?.id]);

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
    
    // Fetch occupied seats - first try showroom seats, then fall back to tickets
    if (showroomId) {
      fetch(`http://localhost:8080/showrooms/${showroomId}`, {
        credentials: 'include'
      })
        .then(res => res.ok ? res.json() : null)
        .then(room => {
          if (room && room.seats) {
            const occupied = [];
            const seatMap = room.seats;
            for (let row = 0; row < seatMap.length; row++) {
              for (let col = 0; col < seatMap[row].length; col++) {
                if (seatMap[row][col] === true) {
                  occupied.push(`${row}-${col}`);
                }
              }
            }
            console.log("Occupied seats from showroom:", occupied);
            if (occupied.length > 0) {
              setOccupiedSeats(occupied);
            }
          }
        })
        .catch(err => console.warn("Failed to fetch showroom seats:", err));
    }
  }, [show, showroomId]);

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

  const handleSubmit = async (e) => {
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

    if (!show?.id) {
      alert("Show information is missing. Please try again.");
      return;
    }

    // Use the stored showroomId from state
    if (!showroomId) {
      alert("Showroom information is still loading or unavailable. Please wait and try again.");
      console.error("Missing showroom ID. State showroomId:", showroomId, "showDetails:", showDetails, "show:", show);
      return;
    }

    // Build ticket list for the API - send array directly
    const ticketList = selectedSeats.map((seatId) => {
      const [row, col] = seatId.split('-');
      return {
        seatRow: parseInt(row),
        seatCol: parseInt(col)
      };
    });

    try {
      console.log("Sending booking request:", {
        showroomId: showroomId,
        seats: ticketList
      });

      // Check authentication before booking
      const authCheck = await fetch('http://localhost:8080/auth/me', {
        method: 'GET',
        credentials: 'include',
      });
      console.log("Auth check status:", authCheck.status);
      if (!authCheck.ok) {
        alert("You are not logged in. Please log in and try again.");
        return;
      }

      const response = await fetch(`http://localhost:8080/bookseat/${showroomId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(ticketList)
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", [...response.headers.entries()]);
      
      if (!response.ok) {
        let errorText;
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorJson = await response.json();
            errorText = JSON.stringify(errorJson);
          } else {
            errorText = await response.text();
          }
          console.error("Error response:", errorText);
        } catch (e) {
          errorText = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorText || 'Failed to book seats');
      }

      const result = await response.json();
      console.log("Booking successful:", result);
      alert(`Booking successful! ${result.message || 'Your seats have been reserved.'}`);
      
      // Refresh occupied seats from the backend
      console.log("Fetching updated showroom data from:", `http://localhost:8080/showrooms/${showroomId}`);
      const roomResponse = await fetch(`http://localhost:8080/showrooms/${showroomId}`, {
        credentials: 'include'
      });
      console.log("Room response status:", roomResponse.status);
      if (roomResponse.ok) {
        const room = await roomResponse.json();
        console.log("Room data received:", room);
        console.log("Room seats:", room.seats);
        if (room && room.seats) {
          const occupied = [];
          const seatMap = room.seats;
          console.log("Processing seat map, dimensions:", seatMap.length, "x", seatMap[0]?.length);
          for (let row = 0; row < seatMap.length; row++) {
            for (let col = 0; col < seatMap[row].length; col++) {
              if (seatMap[row][col] === true) {
                occupied.push(`${row}-${col}`);
              }
            }
          }
          console.log("Occupied seats from showroom:", occupied);
          setOccupiedSeats(occupied);
        } else {
          console.warn("Room or seats is null/undefined");
        }
      } else {
        console.error("Failed to fetch room, status:", roomResponse.status);
      }
      
      // Clear the selected seats and reset the form
      setSelectedSeats([]);
      setTickets([{ category: "", seat: null }]);
      setFullName("");
      setEmail("");
      
    } catch (error) {
      console.error("Booking error:", error);
      alert(`Booking failed: ${error.message}`);
    }
  };

  const totalPrice = tickets.reduce((sum, ticket) => {
    const category = ticketCategories.find(c => c.id === parseInt(ticket.category));
    return sum + (category?.price || 0);
  }, 0);

  return (
    <>
      <Navbar />
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
    </>
  );
}
