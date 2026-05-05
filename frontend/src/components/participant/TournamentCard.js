import React from "react";
import { useNavigate } from "react-router-dom";
import { getEventImage } from "../../utils/eventImages"; // ✅ updated import
import "./participantComponents.css";

function TournamentCard({ item }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/participant/event/${item?.tournamentId}`, {
      state: { tournamentData: item },
    });
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "Date Not Available";
    const date = new Date(dateValue);
    return isNaN(date) ? dateValue : date.toDateString();
  };

  // ✅ Fully dynamic — works for ALL events automatically
  const cardImage = getEventImage(item?.gameTitle, item?.tournamentName);

  return (
    <div className="tournament-card premium-card" onClick={handleCardClick}>
      <div className="tournament-card-image-wrapper">
        <img
          src={cardImage}
          alt={item?.tournamentName || "Tournament"}
          className="tournament-card-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/images/defaultEvent.png"; // ✅ auto fallback if image missing
          }}
        />

        <div className="card-overlay-gradient"></div>
        <span className="status-badge">Open</span>
        <div className="image-bottom-label">
          {item?.gameTitle || item?.category || "Tournament"}
        </div>
      </div>

      <div className="tournament-card-body">
        <h3 className="tournament-title">
          {item?.tournamentName || "Untitled Tournament"}
        </h3>
        <p className="tournament-meta">📅 {formatDate(item?.tournamentDate)}</p>
        <p className="tournament-meta">📍 {item?.venue || "Venue Not Available"}</p>
        <p className="slots-text">👥 Slots: {item?.maxParticipants || "N/A"}</p>
        <button
          className="view-details-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
        >
          Explore Event
        </button>
      </div>
    </div>
  );
}

export default TournamentCard;
