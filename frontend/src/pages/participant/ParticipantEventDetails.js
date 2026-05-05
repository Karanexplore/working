import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { participantRegisterTournamentThunk, resetMessage } from "../../store/participantSlice.js";
import BookTicketModal from "./BookTicketModal.js";
import "./participantPages.css";

function ParticipantEventDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const participantObj = useSelector((state) => state.participant);
  const { id } = useParams();

  const [showTicketModal, setShowTicketModal] = useState(false);

  // Clear any stale message (e.g. "Login successful") when this page loads
  useEffect(() => {
    dispatch(resetMessage());
  }, [dispatch]);

  const tournamentData = location.state?.tournamentData;

  const formatDate = (dateValue) => {
    if (!dateValue) return "Date Not Available";
    const date = new Date(dateValue);
    return isNaN(date) ? dateValue : date.toDateString();
  };

  const getImage = () => {
    return (
      tournamentData?.tournamentPoster ||
      tournamentData?.image ||
      tournamentData?.poster ||
      tournamentData?.banner ||
      tournamentData?.eventImage ||
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&q=80&auto=format&fit=crop"
    );
  };

  const handleRegister = () => {
    if (id) {
      dispatch(participantRegisterTournamentThunk(id));
    }
  };

  if (!tournamentData) {
    return (
      <div className="event-details-page">
        <div className="event-details-container">
          <h2>Tournament details not available</h2>
          <p>Please go back and open the tournament again from Participant Home.</p>
          <button className="register-btn" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="event-details-page">
      <div className="event-hero">
        <img src={getImage()} alt="tournament" className="event-hero-image" />

        <div className="event-hero-content">
          <h1>{tournamentData?.tournamentName}</h1>
          <p className="event-type">{tournamentData?.gameTitle || "Tournament"}</p>

          <div className="event-quick-info">
            <span>📅 &nbsp;{formatDate(tournamentData?.tournamentDate)}</span>
            <span>📍 &nbsp;{tournamentData?.venue || "Venue Not Available"}</span>
            <span>👥 &nbsp;Slots: {tournamentData?.maxParticipants || "Not Mentioned"}</span>
          </div>

          <div className="event-action-row">
            <button className="register-btn" onClick={handleRegister}>
              Register Now
            </button>

            <button
              className="book-ticket-btn"
              onClick={() => setShowTicketModal(true)}
            >
              🎟️ Book Tickets
            </button>
          </div>

          {participantObj?.message && (
            <p style={{
              marginTop: "14px",
              color: participantObj.status === 200 ? "#86efac" : "#fca5a5",
              fontWeight: 600
            }}>
              {participantObj.message}
            </p>
          )}
        </div>
      </div>

      <div className="event-details-container">
        <div className="details-card">
          <h2>About This Tournament</h2>
          <p>
            {tournamentData?.description ||
              "This tournament has been created by the organizer. Participants can review the details and register directly from this page."}
          </p>
        </div>

        <div className="details-grid">
          <div className="details-card">
            <h3>Tournament Information</h3>
            <p><strong>Tournament Name:</strong> {tournamentData?.tournamentName}</p>
            <p><strong>Game:</strong> {tournamentData?.gameTitle || "Not Mentioned"}</p>
            <p><strong>Venue:</strong> {tournamentData?.venue || "Not Mentioned"}</p>
            <p><strong>Date:</strong> {formatDate(tournamentData?.tournamentDate)}</p>
          </div>

          <div className="details-card">
            <h3>Participation Details</h3>
            <p><strong>Max Participants:</strong> {tournamentData?.maxParticipants || "Not Mentioned"}</p>
            <p><strong>Status:</strong> Open</p>
            <p><strong>Registration:</strong> Available</p>
            <p><strong>Eligibility:</strong> As per organizer rules</p>
          </div>
        </div>

        <div className="details-card">
          <h2>Audience Info</h2>
          <p>
            Can't compete but want to watch the action live? Book audience
            tickets using the <strong>Book Tickets</strong> button above. Arrive
            early to get the best seats. Tickets are non-transferable and valid
            only for the event date.
          </p>
        </div>

        <div className="details-card">
          <h2>Rules & Guidelines</h2>
          <p>
            {tournamentData?.rules ||
              "Follow fair play, maintain sportsmanship, and arrive at the venue on time. Additional rules may be shared by the organizer before the event."}
          </p>
        </div>
      </div>

      {showTicketModal && (
        <BookTicketModal
          tournamentId={tournamentData?.tournamentId || id}
          tournamentName={tournamentData?.tournamentName}
          onClose={() => setShowTicketModal(false)}
        />
      )}
    </div>
  );
}

export default ParticipantEventDetails;


