import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  bookTicketThunk,
  getTicketPriceThunk,
  resetTicketMessage,
  resetBookingSuccess,
  clearPriceInfo
} from "../../store/ticketSlice";

function BookTicketModal({ tournamentId, tournamentName, onClose }) {
  const dispatch = useDispatch();
  const ticketObj = useSelector((state) => state.ticket);

  const [seatCount, setSeatCount] = useState(1);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    dispatch(getTicketPriceThunk(tournamentId));

    return () => {
      dispatch(clearPriceInfo());
      dispatch(resetTicketMessage());
      dispatch(resetBookingSuccess());
    };
  }, [dispatch, tournamentId]);

  useEffect(() => {
    if (ticketObj.bookingSuccess) {
      setConfirmed(true);
    }
  }, [ticketObj.bookingSuccess]);

  const pricePerSeat = ticketObj.priceInfo?.pricePerSeat || 0;
  const totalPrice = pricePerSeat * seatCount;

  const handleBook = () => {
    dispatch(resetTicketMessage());
    dispatch(bookTicketThunk({ tournamentId, seatCount }));
  };

  const handleClose = () => {
    dispatch(resetTicketMessage());
    dispatch(resetBookingSuccess());
    dispatch(clearPriceInfo());
    onClose();
  };

  return (
    <div className="ticket-modal-overlay" onClick={handleClose}>
      <div
        className="ticket-modal-box"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="ticket-modal-header">
          <div>
            <span className="ticket-modal-badge">🎟️ Audience Ticket</span>
            <h2 className="ticket-modal-title">Book Tickets</h2>
            <p className="ticket-modal-subtitle">{tournamentName}</p>
          </div>
          <button className="ticket-modal-close" onClick={handleClose}>
            ✕
          </button>
        </div>

        {/* Confirmed State */}
        {confirmed ? (
          <div className="ticket-confirmed">
            <div className="ticket-confirmed-icon">🎉</div>
            <h3>Booking Confirmed!</h3>
            <p>
              You have successfully booked <strong>{seatCount}</strong> seat
              {seatCount > 1 ? "s" : ""} for{" "}
              <strong>{tournamentName}</strong>.
            </p>
            <p className="ticket-confirmed-price">
              Total Paid: <strong>₹{totalPrice}</strong>
            </p>
            <p className="ticket-confirmed-note">
              View your tickets under <strong>My Tickets</strong> in the navbar.
            </p>
            <button className="ticket-close-btn" onClick={handleClose}>
              Done
            </button>
          </div>
        ) : (
          <>
            {/* Venue / Date Info */}
            {ticketObj.priceInfo && (
              <div className="ticket-event-info">
                <div className="ticket-info-item">
                  <span className="ticket-info-icon">📍</span>
                  <span>{ticketObj.priceInfo.venue || "Venue TBA"}</span>
                </div>
                <div className="ticket-info-item">
                  <span className="ticket-info-icon">📅</span>
                  <span>
                    {ticketObj.priceInfo.eventDate
                      ? new Date(ticketObj.priceInfo.eventDate).toDateString()
                      : "Date TBA"}
                  </span>
                </div>
                <div className="ticket-info-item">
                  <span className="ticket-info-icon">🏷️</span>
                  <span>
                    {ticketObj.priceInfo.eventType?.charAt(0).toUpperCase() +
                      ticketObj.priceInfo.eventType?.slice(1)}{" "}
                    Event
                  </span>
                </div>
              </div>
            )}

            {/* Seat Selector */}
            <div className="ticket-seat-section">
              <h4>Select Number of Seats</h4>
              <p className="ticket-seat-note">Maximum 10 seats per booking</p>

              <div className="ticket-seat-controls">
                <button
                  className="seat-btn"
                  onClick={() => setSeatCount((p) => Math.max(1, p - 1))}
                  disabled={seatCount <= 1}
                >
                  −
                </button>
                <span className="seat-count">{seatCount}</span>
                <button
                  className="seat-btn"
                  onClick={() => setSeatCount((p) => Math.min(10, p + 1))}
                  disabled={seatCount >= 10}
                >
                  +
                </button>
              </div>

              <div className="ticket-quick-seats">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <button
                    key={n}
                    className={`quick-seat-btn ${seatCount === n ? "active" : ""}`}
                    onClick={() => setSeatCount(n)}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="ticket-price-breakdown">
              <div className="price-row">
                <span>Price per seat</span>
                <span>₹{pricePerSeat}</span>
              </div>
              <div className="price-row">
                <span>Seats</span>
                <span>× {seatCount}</span>
              </div>
              <div className="price-row total-row">
                <span>Total Amount</span>
                <span className="total-price">₹{totalPrice}</span>
              </div>
            </div>

            {/* Error Message */}
            {ticketObj.message && !ticketObj.bookingSuccess && (
              <p className="ticket-error-msg">{ticketObj.message}</p>
            )}

            {/* Actions */}
            <div className="ticket-modal-actions">
              <button
                className="ticket-cancel-btn"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                className="ticket-book-btn"
                onClick={handleBook}
                disabled={ticketObj.loading || !pricePerSeat}
              >
                {ticketObj.loading
                  ? "Booking..."
                  : `Confirm & Pay ₹${totalPrice}`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default BookTicketModal;