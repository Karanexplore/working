import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setNavShow } from "../../store/commonSlice";
import {
  getMyTicketsThunk,
  cancelTicketThunk,
  resetTicketMessage
} from "../../store/ticketSlice";
import "./participantPages.css";

function MyTickets() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ticketObj = useSelector((state) => state.ticket);

  const [cancellingId, setCancellingId] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    dispatch(setNavShow("participant"));
    dispatch(getMyTicketsThunk());
  }, [dispatch]);

  useEffect(() => {
    if (ticketObj.message) {
      setToast(ticketObj.message);
      const t = setTimeout(() => {
        setToast("");
        dispatch(resetTicketMessage());
      }, 3500);
      return () => clearTimeout(t);
    }
  }, [ticketObj.message, dispatch]);

  const handleCancel = async (ticketId) => {
    setCancellingId(ticketId);
    await dispatch(cancelTicketThunk(ticketId));
    setCancellingId(null);
  };

  const confirmedTickets = ticketObj.ticketArray.filter(
    (t) => t.status === "confirmed"
  );
  const cancelledTickets = ticketObj.ticketArray.filter(
    (t) => t.status === "cancelled"
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return isNaN(d) ? dateStr : d.toDateString();
  };

  return (
    <div className="my-tickets-page">
      {/* Toast */}
      {toast && <div className="ticket-toast">{toast}</div>}

      {/* Hero */}
      <div className="my-tickets-hero">
        <div>
          <span className="tickets-badge">🎟️ My Tickets</span>
          <h1 className="tickets-hero-title">Your Event Tickets</h1>
          <p className="tickets-hero-sub">
            Manage your audience tickets. You can cancel up to 24 hours before
            the event.
          </p>
        </div>
        <button
          className="explore-events-link"
          onClick={() => navigate("/registerTournament")}
        >
          Explore Events →
        </button>
      </div>

      <div className="my-tickets-body">
        {/* Active Tickets */}
        <section>
          <h2 className="tickets-section-title">
            Active Tickets{" "}
            <span className="tickets-count-badge">{confirmedTickets.length}</span>
          </h2>

          {confirmedTickets.length === 0 ? (
            <div className="tickets-empty">
              <div className="tickets-empty-icon">🎟️</div>
              <h3>No active tickets</h3>
              <p>Book tickets for an event to watch as an audience member.</p>
              <button
                className="explore-btn"
                onClick={() => navigate("/registerTournament")}
              >
                Explore Events
              </button>
            </div>
          ) : (
            <div className="tickets-grid">
              {confirmedTickets.map((ticket) => (
                <div key={ticket.ticketId} className="ticket-card confirmed-card">
                  <div className="ticket-card-top">
                    <div className="ticket-card-left">
                      <span className="ticket-tag confirmed-tag">✅ Confirmed</span>
                      <h3 className="ticket-event-name">{ticket.tournamentName}</h3>
                      <div className="ticket-card-details">
                        <p>📍 {ticket.venue || "Venue TBA"}</p>
                        <p>📅 {formatDate(ticket.eventDate)}</p>
                        <p>🕐 Booked on: {ticket.bookedAt}</p>
                      </div>
                    </div>

                    <div className="ticket-card-right">
                      <div className="seat-badge">
                        <span className="seat-number">{ticket.seatCount}</span>
                        <span className="seat-label">
                          {ticket.seatCount === 1 ? "Seat" : "Seats"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="ticket-card-footer">
                    <div className="ticket-price-info">
                      <span>₹{ticket.pricePerSeat} × {ticket.seatCount}</span>
                      <strong className="ticket-total">
                        Total: ₹{ticket.totalPrice}
                      </strong>
                    </div>
                    <button
                      className="ticket-cancel-action"
                      onClick={() => handleCancel(ticket.ticketId)}
                      disabled={cancellingId === ticket.ticketId}
                    >
                      {cancellingId === ticket.ticketId
                        ? "Cancelling..."
                        : "Cancel Ticket"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Cancelled Tickets */}
        {cancelledTickets.length > 0 && (
          <section className="cancelled-section">
            <h2 className="tickets-section-title">
              Cancelled Tickets{" "}
              <span className="tickets-count-badge cancelled-count">
                {cancelledTickets.length}
              </span>
            </h2>
            <div className="tickets-grid">
              {cancelledTickets.map((ticket) => (
                <div key={ticket.ticketId} className="ticket-card cancelled-card">
                  <div className="ticket-card-top">
                    <div className="ticket-card-left">
                      <span className="ticket-tag cancelled-tag">❌ Cancelled</span>
                      <h3 className="ticket-event-name">{ticket.tournamentName}</h3>
                      <div className="ticket-card-details">
                        <p>📍 {ticket.venue || "Venue TBA"}</p>
                        <p>📅 {formatDate(ticket.eventDate)}</p>
                        <p>🕐 Booked on: {ticket.bookedAt}</p>
                      </div>
                    </div>
                    <div className="ticket-card-right">
                      <div className="seat-badge cancelled-seat-badge">
                        <span className="seat-number">{ticket.seatCount}</span>
                        <span className="seat-label">
                          {ticket.seatCount === 1 ? "Seat" : "Seats"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="ticket-card-footer">
                    <div className="ticket-price-info">
                      <span>₹{ticket.pricePerSeat} × {ticket.seatCount}</span>
                      <strong className="ticket-total">₹{ticket.totalPrice}</strong>
                    </div>
                    <span className="cancelled-label">Cancelled</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default MyTickets;