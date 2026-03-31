import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setNavShow } from "../store/commonSlice.js";
import { participantMyRegistrationsThunk } from "../store/participantSlice.js";

function ParticipantViewRegistration() {
  const participantObj = useSelector((state) => state.participant);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* ================= AUTH CHECK ================= */
  useEffect(() => {
    if (!participantObj.loggedInEmail) {
      navigate("/participantLogin");
    }
  }, [participantObj.loggedInEmail, navigate]);

  /* ================= NAVBAR + API ================= */
  useEffect(() => {
    if (participantObj.loggedInEmail) {
      dispatch(setNavShow("participant"));
      dispatch(participantMyRegistrationsThunk());
    }
  }, [dispatch, participantObj.loggedInEmail]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>PulseArena - My Registered Events</h2>
      <h4>Welcome {participantObj.loggedInEmail}</h4>

      <p style={{ color: participantObj.status === 200 ? "green" : "red" }}>
        {participantObj.message}
      </p>

      {participantObj.registeredTournamentArray?.length > 0 ? (
        <table border={1} cellPadding={6} cellSpacing={0} width="100%">
          <thead style={{ backgroundColor: "#111", color: "white" }}>
            <tr>
              <th>S.No</th>
              <th>Event</th>
              <th>Type</th>
              <th>Category</th>
              <th>Venue</th>
              <th>Date</th>
              <th>Time</th>
              <th>Slots</th>
              <th>Poster</th>
              <th>Organizer</th>
            </tr>
          </thead>

          <tbody>
            {participantObj.registeredTournamentArray.map((obj, index) => {
              const registeredCount = obj.registrations?.length || 0;

              return (
                <tr key={obj.tournamentId}>
                  <td>{index + 1}</td>

                  <td>
                    <strong>{obj.tournamentName}</strong>
                    <br />
                    <small>{obj.description || "No description provided"}</small>
                  </td>

                  <td>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "5px",
                        backgroundColor: "#6a0dad",
                        color: "white",
                        fontSize: "12px"
                      }}
                    >
                      {obj.eventType || "sports"}
                    </span>
                  </td>

                  <td>{obj.gameCategory}</td>
                  <td>{obj.venue}</td>
                  <td>{obj.tournamentDate}</td>
                  <td>{obj.reportingTime}</td>

                  <td>
                    {registeredCount} / {obj.maxParticipants}
                  </td>

                  <td>
                    <img
                      src={obj.tournamentPoster}
                      width="70"
                      height="70"
                      alt="event"
                      style={{ borderRadius: "6px", objectFit: "cover" }}
                    />
                  </td>

                  <td>
                    <strong>{obj.organizerEmail}</strong>
                    <br />
                    <small>{obj.organizerContact}</small>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <h3>No registered events yet</h3>
      )}
    </div>
  );
}

export default ParticipantViewRegistration;