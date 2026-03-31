import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  participantTournamentListThunk,
  participantRegisterTournamentThunk,
  participantMyRegistrationsThunk
} from "../store/participantSlice";
import { setNavShow } from "../store/commonSlice";

function RegisterTournament() {
  const dispatch = useDispatch();
  const participantObj = useSelector((state) => state.participant);

  useEffect(() => {
    dispatch(setNavShow("participant"));
    dispatch(participantTournamentListThunk());
    dispatch(participantMyRegistrationsThunk());
  }, [dispatch]);

  const handleRegister = async (tournamentId) => {
    await dispatch(participantRegisterTournamentThunk(String(tournamentId)));
    dispatch(participantTournamentListThunk());
    dispatch(participantMyRegistrationsThunk());
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>PulseArena - Available Events</h2>

      {participantObj.message && (
        <p style={{ color: participantObj.status === 200 ? "green" : "red" }}>
          {participantObj.message}
        </p>
      )}

      {participantObj.tournamentArray.length > 0 ? (
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
              <th>Register</th>
            </tr>
          </thead>

          <tbody>
            {participantObj.tournamentArray.map((t, index) => {
              const alreadyRegistered = t.registrations?.some(
                (r) => r.participantEmail === participantObj.loggedInEmail
              );

              const remainingSlots =
                t.maxParticipants - (t.registrations?.length || 0);

              return (
                <tr key={t.tournamentId}>
                  <td>{index + 1}</td>

                  <td>
                    <strong>{t.tournamentName}</strong>
                    <br />
                    <small>{t.description || "No description available"}</small>
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
                      {t.eventType || "sports"}
                    </span>
                  </td>

                  <td>{t.gameCategory}</td>
                  <td>{t.venue}</td>
                  <td>{t.tournamentDate}</td>
                  <td>{t.reportingTime}</td>

                  <td>
                    {remainingSlots} / {t.maxParticipants}
                  </td>

                  <td>
                    <button
                      disabled={!t.registrationOpen || alreadyRegistered}
                      onClick={() => handleRegister(t.tournamentId)}
                      style={{
                        backgroundColor: alreadyRegistered
                          ? "crimson"
                          : t.registrationOpen
                          ? "green"
                          : "gray",
                        color: "white",
                        padding: "6px 12px",
                        border: "none",
                        borderRadius: "6px",
                        cursor:
                          !t.registrationOpen || alreadyRegistered
                            ? "not-allowed"
                            : "pointer"
                      }}
                    >
                      {!t.registrationOpen
                        ? "Full"
                        : alreadyRegistered
                        ? "Registered"
                        : "Register"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <h3>No events available</h3>
      )}
    </div>
  );
}

export default RegisterTournament;