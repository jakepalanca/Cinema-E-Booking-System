// src/BookingPage.js
import React, { useState, useEffect } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import Navbar from './Navbar.jsx';
import PaymentCardForm from "../components/PaymentCardForm.jsx";
import { getCardDisplay } from "../utils/cardDisplay.js";
import api from "../services/api.js";
import { useAuth } from "../contexts/AuthContext.jsx";
import "../css/RegistrationPage.css";


export default function BookingPage() {
  const { movieId } = useParams();
  const { state } = useLocation();
  const { user } = useAuth();
  
  const [movie, setMovie] = useState(state?.movie || null);
  const [show, setShow] = useState(state?.show || null);
  const [loading, setLoading] = useState(!state?.movie || !state?.show);
  const [missingShow, setMissingShow] = useState(false);
  const [ticketCategories, setTicketCategories] = useState([]);
  const [tickets, setTickets] = useState([{ category: "", seat: null }]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showroomSeats, setShowroomSeats] = useState({ rows: 8, cols: 10 });
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [showDetails, setShowDetails] = useState(null);
  const [showroomId, setShowroomId] = useState(null);
  const [promotions, setPromotions] = useState([]);
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoMessage, setPromoMessage] = useState("");
  const [checkoutStep, setCheckoutStep] = useState("seats");
  const [pendingBookingRequest, setPendingBookingRequest] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(null);
  const [paymentMessage, setPaymentMessage] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [confirmationDetails, setConfirmationDetails] = useState(null);

  const title = movie?.title || state?.title || "Movie Title";
  const showtime = state?.showtime || "Showtime";

  // If no movie/show in state, try to fetch movie and prompt for showtime selection
  useEffect(() => {
    if (state?.movie && state?.show) {
      setMovie(state.movie);
      setShow(state.show);
      setLoading(false);
      return;
    }

    // Try to fetch the movie at least
    const fetchMovie = async () => {
      try {
        const response = await fetch("http://localhost:8080/return-all");
        if (!response.ok) throw new Error("Failed to fetch movies");
        const data = await response.json();
        
        const found = (data.content || []).find(m => 
          m.title.replace(/\s+/g, "-").toLowerCase() === movieId
        );
        
        if (found) {
          setMovie(found);
          // If we found the movie but don't have show data, prompt user
          if (!state?.show) {
            setMissingShow(true);
          }
        }
      } catch (err) {
        console.error("Failed to fetch movie:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [movieId, state?.movie, state?.show]);

  // Debug logging
  useEffect(() => {
    console.log("BookingPage state:", { movie, show });
    console.log("Show showroom:", show?.showroom);
  }, [movie, show]);

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

  // Fetch active promotions
  useEffect(() => {
    fetch("http://localhost:8080/promotions")
      .then(res => res.json())
      .then(data => {
        const now = new Date();
        const active = data.filter(promo => {
          if (!promo.startDate || !promo.endDate) return true;
          const start = new Date(promo.startDate);
          const end = new Date(promo.endDate);
          return now >= start && now <= end;
        });
        setPromotions(active);
      })
      .catch(err => console.error("Failed to fetch promotions:", err));
  }, []);

  // Hydrate saved payment methods for the signed-in user
  useEffect(() => {
    if (!user?.email) return;

    const loadPaymentMethods = async () => {
      try {
        const response = await api.get(`/customers/by-email?email=${encodeURIComponent(user.email)}`);
        if (!response.ok) return;

        const data = await response.json();
        const cards = (data.paymentMethods || []).map((card, index) => ({
          ...card,
          id: card.id ?? card.paymentMethodId ?? `saved-${index}`
        }));

        setPaymentMethods(cards);
        if (cards.length > 0) {
          setSelectedPaymentMethodId(prev => prev || cards[0].id);
        }
      } catch (err) {
        console.warn("Failed to load saved payment methods:", err);
      }
    };

    loadPaymentMethods();
  }, [user?.email]);

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

  // Show error if we're missing the show selection - AFTER all hooks
  if (!loading && (missingShow || !show)) {
    return (
      <>
        <Navbar />
        <div style={{ 
          padding: 40, 
          maxWidth: 600, 
          margin: "0 auto", 
          textAlign: "center", 
          color: "white" 
        }}>
          <h2>Showtime Not Selected</h2>
          <p style={{ color: "#ccc", marginBottom: 24 }}>
            Please select a specific showtime to book tickets.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            {movie ? (
              <Link 
                to={`/details/${movie.title.replace(/\s+/g, "-").toLowerCase()}`}
                state={{ movie }}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: 6,
                  fontWeight: 600
                }}
              >
                View {movie.title} Showtimes
              </Link>
            ) : null}
            <Link 
              to="/showtimes"
              style={{
                padding: "12px 24px",
                backgroundColor: "#333",
                color: "white",
                textDecoration: "none",
                borderRadius: 6,
                fontWeight: 600,
                border: "1px solid #555"
              }}
            >
              Browse All Showtimes
            </Link>
          </div>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ padding: 20, textAlign: "center", color: "white" }}>Loading...</div>
      </>
    );
  }

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

  const totalPrice = tickets.reduce((sum, ticket) => {
    const category = ticketCategories.find(c => c.id === parseInt(ticket.category));
    return sum + (category?.price || 0);
  }, 0);
  const discountRate = appliedPromo?.discountPercentage || 0;
  const discountedTotal = Math.max(totalPrice * (1 - discountRate), 0);

  const applyPromoCode = () => {
    const trimmed = promoCodeInput.trim();
    if (!trimmed) {
      setPromoMessage("Enter a promo code to apply.");
      setAppliedPromo(null);
      return;
    }

    const match = promotions.find(
      (promo) => promo.code?.toUpperCase() === trimmed.toUpperCase()
    );

    if (!match) {
      setPromoMessage("Promo code not valid or expired.");
      setAppliedPromo(null);
      return;
    }

    setAppliedPromo(match);
    setPromoMessage(`Promo ${match.code} applied. ${Math.round(match.discountPercentage * 100)}% off will be applied to your total.`);
  };

  const formatSeatLabel = (seatId) => {
    const [row, col] = seatId.split("-");
    return `${String.fromCharCode(65 + parseInt(row, 10))}${parseInt(col, 10) + 1}`;
  };

  const persistOrderLocally = (orderSummary) => {
    try {
      const existing = JSON.parse(localStorage.getItem("orders") || "[]");
      const updated = [orderSummary, ...existing].slice(0, 25);
      localStorage.setItem("orders", JSON.stringify(updated));
    } catch (err) {
      console.warn("Failed to persist order locally:", err);
    }
  };

  const buildBookingRequest = () => {
    if (selectedSeats.length !== tickets.length) {
      alert(`Please select ${tickets.length} seat(s)`);
      return null;
    }

    const incompleteTickets = tickets.filter(t => !t.category);
    if (incompleteTickets.length > 0) {
      alert("Please select age category for all tickets");
      return null;
    }

    if (!show?.id) {
      alert("Show information is missing. Please try again.");
      return null;
    }

    if (!showroomId) {
      alert("Showroom information is still loading or unavailable. Please wait and try again.");
      console.error("Missing showroom ID. State showroomId:", showroomId, "showDetails:", showDetails, "show:", show);
      return null;
    }

    const ticketList = selectedSeats.map((seatId, index) => {
      const [row, col] = seatId.split('-');
      const ticketData = tickets[index];
      return {
        seatRow: parseInt(row),
        seatCol: parseInt(col),
        categoryId: ticketData?.category ? parseInt(ticketData.category) : null
      };
    });

    return {
      showId: show?.id || null,
      seats: ticketList,
      totalPrice: Number(discountedTotal.toFixed(2)),
      promoCode: appliedPromo?.code || null,
      movieTitle: title,
      showtime: showtime
    };
  };

  const handleContinueToPayment = (e) => {
    e.preventDefault();
    const bookingRequest = buildBookingRequest();
    if (!bookingRequest) return;

    setPendingBookingRequest(bookingRequest);
    setCheckoutStep("payment");
    setConfirmationDetails(null);
    setPaymentMessage(paymentMethods.length ? "Select a saved card or add a new one for this order." : "Add a payment method to continue.");

    if (paymentMethods.length > 0 && !selectedPaymentMethodId) {
      setSelectedPaymentMethodId(paymentMethods[0].id);
    }
  };

  const handleAddPaymentMethod = (card) => {
    const displayCard = {
      ...card,
      id: card.id || `local-${Date.now()}`,
      cardNumberLast4: card.cardNumberLast4 || String(card.cardNumber || "").slice(-4),
    };

    setPaymentMethods(prev => [...prev, displayCard]);
    setSelectedPaymentMethodId(displayCard.id);
    setPaymentMessage("Card added for this order (mock payment only).");
  };

  const handleRemovePaymentMethod = async (cardId) => {
    const card = paymentMethods.find(c => c.id === cardId);
    const isLocal = typeof cardId === "string" && cardId.startsWith("local-");

    if (!card) return;

    // If the card exists in backend, call delete endpoint (same as Edit Profile)
    if (!isLocal && cardId) {
      try {
        const res = await api.delete(`/payment-methods/${cardId}`);
        if (!res.ok) {
          throw new Error("Failed to remove card from your profile");
        }
      } catch (err) {
        setPaymentMessage("Could not remove card from profile. Try again.");
        return;
      }
    }

    const updatedCards = paymentMethods.filter(c => c.id !== cardId);
    setPaymentMethods(updatedCards);
    if (selectedPaymentMethodId === cardId) {
      setSelectedPaymentMethodId(updatedCards[0]?.id || null);
    }
    setPaymentMessage(isLocal ? "Payment method removed for this checkout." : "Card removed from your profile.");
  };

  const handlePay = async (e) => {
    if (e) e.preventDefault();

    const bookingRequest = pendingBookingRequest || buildBookingRequest();
    if (!bookingRequest) {
      setCheckoutStep("seats");
      return;
    }

    if (!selectedPaymentMethodId) {
      setPaymentMessage("Select or add a payment method first.");
      return;
    }

    const chosenCard = paymentMethods.find(card => card.id === selectedPaymentMethodId);
    if (!chosenCard) {
      setPaymentMessage("Selected payment method is no longer available. Please select again.");
      return;
    }

    setIsPaying(true);
    setPaymentMessage("");

    try {
      // Check authentication before booking
      const authCheck = await fetch('http://localhost:8080/auth/me', {
        method: 'GET',
        credentials: 'include',
      });
      console.log("Auth check status:", authCheck.status);
      if (!authCheck.ok) {
        alert("You are not logged in. Please log in and try again.");
        setIsPaying(false);
        return;
      }

      const response = await fetch(`http://localhost:8080/bookseat/${showroomId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(bookingRequest)
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
        } catch (err) {
          errorText = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorText || 'Failed to book seats');
      }

      const result = await response.json();
      console.log("Booking successful:", result);
      alert(`Booking successful! ${result.message || 'Your seats have been reserved.'}`);

      const locationText = [showDetails?.cinemaName || show?.cinemaName, showDetails?.theaterName || show?.theaterName, showDetails?.showroomLabel || show?.showroomLabel]
        .filter(Boolean)
        .join(" • ");
      const formattedSeats = selectedSeats.map(formatSeatLabel);
      const paymentLabel = getCardDisplay(chosenCard).label;

      persistOrderLocally({
        id: Date.now(),
        movieTitle: title,
        showtime: showtime,
        location: locationText || "Cinema",
        seats: formattedSeats,
        total: bookingRequest.totalPrice,
        promoCode: bookingRequest.promoCode || null,
        paymentMethod: paymentLabel,
        createdAt: new Date().toISOString(),
      });
      
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
      setPendingBookingRequest(null);

      setConfirmationDetails({
        bookingId: result.bookingId || result.id || null,
        message: result.message || "Payment successful",
        total: bookingRequest.totalPrice,
        seats: formattedSeats,
        paymentMethod: paymentLabel,
        promoCode: bookingRequest.promoCode,
      });
      setCheckoutStep("confirmation");
      
    } catch (error) {
      console.error("Booking error:", error);
      alert(`Booking failed: ${error.message}`);
      setPaymentMessage("Payment failed. Please try again.");
    } finally {
      setIsPaying(false);
    }
  };

  const seatLabels = selectedSeats.map(formatSeatLabel);
  const displayedTotal = pendingBookingRequest?.totalPrice ?? Number(discountedTotal.toFixed(2));
  const stepSequence = ["seats", "payment", "confirmation"];
  const currentStepIndex = stepSequence.indexOf(checkoutStep);
  const selectedPaymentCard = paymentMethods.find(card => card.id === selectedPaymentMethodId);
  const selectedPaymentLabel = selectedPaymentCard ? getCardDisplay(selectedPaymentCard).label : "";

  return (
    <>
      <Navbar />
      <div style={{ padding: 20, maxWidth: 900, margin: "0 auto", color: "white", position: "relative", zIndex: 0, pointerEvents: "auto" }}>
        <h2>Booking Page</h2>

        <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, marginBottom: 20 }}>
          <p><strong>Movie:</strong> {title}</p>
          <p><strong>Showtime:</strong> {showtime}</p>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          {[
            { key: "seats", label: "1. Seats" },
            { key: "payment", label: "2. Payment" },
            { key: "confirmation", label: "3. Confirm" },
          ].map((step) => {
            const stepIndex = stepSequence.indexOf(step.key);
            const isActive = currentStepIndex === stepIndex;
            const isComplete = stepIndex < currentStepIndex;
            return (
              <div
                key={step.key}
                style={{
                  flex: 1,
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: "1px solid #555",
                  background: isActive ? "#dc3545" : isComplete ? "#28a745" : "#222",
                  color: isActive || isComplete ? "white" : "#ccc",
                  textAlign: "center",
                  fontWeight: 700,
                  fontSize: 14,
                  letterSpacing: 0.5
                }}
              >
                {step.label}
              </div>
            );
          })}
        </div>

        {checkoutStep === "confirmation" ? (
          <div style={{ border: "1px solid #555", borderRadius: 8, padding: 20, background: "#141414" }}>
            <h3 style={{ marginTop: 0 }}>Payment Confirmed</h3>
            <p style={{ color: "#7dd87d", marginTop: 4 }}>
              {confirmationDetails?.message || "Your order was placed successfully."}
            </p>
            <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
              <div><strong>Booking ID:</strong> {confirmationDetails?.bookingId || "Pending"}</div>
              <div><strong>Seats:</strong> {confirmationDetails?.seats?.join(", ") || seatLabels.join(", ") || "—"}</div>
              <div><strong>Total Paid:</strong> ${(confirmationDetails?.total ?? displayedTotal).toFixed(2)}</div>
              <div><strong>Payment Method:</strong> {confirmationDetails?.paymentMethod || selectedPaymentLabel || "Card on file"}</div>
              {confirmationDetails?.promoCode && <div><strong>Promo:</strong> {confirmationDetails.promoCode}</div>}
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
              <Link
                to="/orders"
                style={{
                  padding: "10px 16px",
                  backgroundColor: "#333",
                  color: "white",
                  borderRadius: 6,
                  textDecoration: "none",
                  border: "1px solid #555",
                  fontWeight: 600
                }}
              >
                View My Bookings
              </Link>
              <button
                type="button"
                onClick={() => { setCheckoutStep("seats"); setConfirmationDetails(null); }}
                style={{
                  padding: "10px 16px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontWeight: 700
                }}
              >
                Book Another Show
              </button>
            </div>
          </div>
        ) : checkoutStep === "payment" ? (
          <div style={{ display: "grid", gap: 16 }}>
            <div style={{ display: "grid", gap: 16, gridTemplateColumns: "2fr 1fr", alignItems: "start" }}>
              <div style={{ border: "1px solid #555", borderRadius: 8, padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <h3 style={{ margin: 0 }}>Payment</h3>
                  <button
                    type="button"
                    onClick={() => { setCheckoutStep("seats"); setPaymentMessage(""); }}
                    style={{
                      padding: "8px 12px",
                      backgroundColor: "#333",
                      color: "white",
                      border: "1px solid #666",
                      borderRadius: 6,
                      cursor: "pointer",
                      fontWeight: 600
                    }}
                  >
                    Edit seats
                  </button>
                </div>

                {paymentMethods.length > 0 ? (
                  <div style={{ display: "grid", gap: 10, marginBottom: 14 }}>
                    {paymentMethods.map((card, idx) => {
                      const label = getCardDisplay(card).label;
                      const expirationDisplay = card.expirationDate ? card.expirationDate.slice(0, 7) : "—";
                      const isSelected = selectedPaymentMethodId === card.id;
                      const radioId = `payment-${card.id || idx}`;
                      return (
                        <div
                          key={card.id || idx}
                          style={{
                            display: "flex",
                            gap: 10,
                            alignItems: "center",
                            padding: 12,
                            borderRadius: 8,
                            border: isSelected ? "2px solid #dc3545" : "1px solid #444",
                            background: "#111",
                          }}
                        >
                          <label
                            htmlFor={radioId}
                            style={{ display: "flex", gap: 10, alignItems: "center", flex: 1, cursor: "pointer" }}
                          >
                            <input
                              id={radioId}
                              type="radio"
                              name="paymentMethod"
                              checked={isSelected}
                              onChange={() => setSelectedPaymentMethodId(card.id)}
                              style={{ accentColor: "#dc3545" }}
                            />
                            <div>
                              <div style={{ fontWeight: 700 }}>{label}</div>
                              <div style={{ fontSize: 12, color: "#bbb" }}>Exp {expirationDisplay}</div>
                            </div>
                          </label>
                          <button
                            type="button"
                            onClick={() => handleRemovePaymentMethod(card.id)}
                            style={{
                              padding: "6px 10px",
                              backgroundColor: "transparent",
                              color: "#f5f5f5",
                              border: "1px solid #555",
                              borderRadius: 6,
                              cursor: "pointer",
                              fontSize: 12,
                              fontWeight: 600
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p style={{ color: "#ccc", marginBottom: 12 }}>
                    No payment methods yet. Add one below to continue.
                  </p>
                )}

                <div style={{ borderTop: "1px solid #444", paddingTop: 12, marginTop: 12 }}>
                  <h4 style={{ margin: "0 0 8px 0" }}>Add a new card</h4>
                  <PaymentCardForm
                    onAddCard={handleAddPaymentMethod}
                    currentCardCount={paymentMethods.length}
                  />
                  {paymentMessage && (
                    <p style={{ marginTop: 8, color: "#7dd87d" }}>{paymentMessage}</p>
                  )}
                </div>
              </div>

              <div style={{ border: "1px solid #555", borderRadius: 8, padding: 16, background: "#111" }}>
                <h3 style={{ marginTop: 0 }}>Order Summary</h3>
                <div style={{ display: "grid", gap: 8, fontSize: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Movie</span>
                    <strong>{title}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Showtime</span>
                    <strong>{showtime}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Seats</span>
                    <strong>{seatLabels.length > 0 ? seatLabels.join(", ") : "Not set"}</strong>
                  </div>
                  {appliedPromo && (
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#7dd87d" }}>
                      <span>Promo ({appliedPromo.code})</span>
                      <strong>-{Math.round(appliedPromo.discountPercentage * 100)}%</strong>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Payment</span>
                    <strong>{selectedPaymentLabel || "Select a card"}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, marginTop: 4 }}>
                    <span>Total</span>
                    <strong>${displayedTotal.toFixed(2)}</strong>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={() => setCheckoutStep("seats")}
                    style={{
                      padding: "10px 14px",
                      backgroundColor: "#333",
                      color: "white",
                      border: "1px solid #666",
                      borderRadius: 6,
                      cursor: "pointer",
                      fontWeight: 600
                    }}
                  >
                    Back to seats
                  </button>
                  <button
                    type="button"
                    onClick={handlePay}
                    disabled={isPaying || !selectedPaymentMethodId}
                    style={{
                      padding: "10px 14px",
                      backgroundColor: isPaying ? "#888" : "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: 6,
                      cursor: isPaying || !selectedPaymentMethodId ? "not-allowed" : "pointer",
                      fontWeight: 700
                    }}
                  >
                    {isPaying ? "Processing..." : `Pay $${displayedTotal.toFixed(2)}`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleContinueToPayment} style={{ display: "grid", gap: 20 }}>
            {/* Customer Info */}
            <div style={{ border: "1px solid #555", borderRadius: 8, padding: 16 }}>
              <h3 style={{ marginTop: 0 }}>Booking For</h3>
              <p style={{ margin: "0 0 6px 0" }}>
                <strong>Name:</strong> {user?.firstName || "Signed-in user"}
              </p>
              <p style={{ margin: 0 }}>
                <strong>Email:</strong> {user?.email || "On file with your account"}
              </p>
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
                <div style={{ marginTop: 12, display: "grid", gap: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Subtotal</span>
                    <strong>${totalPrice.toFixed(2)}</strong>
                  </div>
                  {appliedPromo && (
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#7dd87d" }}>
                      <span>Promo ({appliedPromo.code})</span>
                      <strong>-{Math.round(appliedPromo.discountPercentage * 100)}%</strong>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18 }}>
                    <span>Total</span>
                    <strong>${discountedTotal.toFixed(2)}</strong>
                  </div>
                </div>
              )}
            </div>

            {/* Promotions */}
            <div style={{ border: "1px solid #555", borderRadius: 8, padding: 16 }}>
              <h3 style={{ marginTop: 0 }}>Promotions</h3>
              <p style={{ marginTop: 0, color: "#ccc", fontSize: 14 }}>
                Apply a promo code before you place the order.
              </p>
              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <input
                  type="text"
                  value={promoCodeInput}
                  placeholder="Enter promo code"
                  onChange={(e) => setPromoCodeInput(e.target.value)}
                  style={{ flex: 1, minWidth: 220, padding: 8, borderRadius: 6, border: "1px solid #666" }}
                />
                <button
                  type="button"
                  onClick={applyPromoCode}
                  style={{
                    padding: "10px 16px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontWeight: 600
                  }}
                >
                  Apply
                </button>
            {appliedPromo && (
              <button
                type="button"
                onClick={() => { setAppliedPromo(null); setPromoMessage("Promo removed."); }}
                style={{
                  padding: "10px 12px",
                  backgroundColor: "#444",
                  color: "white",
                      border: "1px solid #666",
                      borderRadius: 6,
                      cursor: "pointer",
                      fontWeight: 600
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
              {promoMessage && (
                <p style={{ marginTop: 8, color: "#7dd87d" }}>{promoMessage}</p>
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
                  return `${String.fromCharCode(65 + parseInt(row, 10))}${parseInt(col, 10) + 1}`;
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
        )}
      </div>
    </>
  );
}
