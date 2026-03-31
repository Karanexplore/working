import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
import { setNavShow } from "../store/commonSlice.js";
import { organizerTournamentListThunk } from "../store/organizerSlice.js";

function TournamentList() {

  const organizerObj = useSelector(state => state.organizer);
  // const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setNavShow("organizer"));
    dispatch(organizerTournamentListThunk());
  }, [dispatch]);

  return (
    <div style={{ padding: "20px" }}>

      <h2>PulseArena - Organizer Dashboard</h2>
      <h4>Welcome {organizerObj.loggedInEmail}</h4>

      {organizerObj.tournamentArray.length > 0 ? (

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
              <th>Registrations</th>
              <th>Status</th>
              <th>Poster</th>
              <th>Created</th>
            </tr>
          </thead>

          <tbody>
            {organizerObj.tournamentArray.map((obj, index) => {

              const registeredCount = obj.registrations?.length || 0;
              const remainingSlots = obj.maxParticipants - registeredCount;

              return (
                <tr key={obj.tournamentId}>

                  <td>{index + 1}</td>

                  <td>
                    <strong>{obj.tournamentName}</strong>
                    <br />
                    <small>{obj.description || "No description"}</small>
                  </td>

                  {/* Event Type Badge */}
                  <td>
                    <span style={{
                      padding: "4px 8px",
                      borderRadius: "5px",
                      backgroundColor: "#6a0dad",
                      color: "white",
                      fontSize: "12px"
                    }}>
                      {obj.eventType || "sports"}
                    </span>
                  </td>

                  <td>{obj.gameCategory}</td>
                  <td>{obj.venue}</td>
                  <td>{obj.tournamentDate}</td>
                  <td>{obj.reportingTime}</td>

                  <td>
                    {registeredCount} / {obj.maxParticipants}
                    <br />
                    <small>{remainingSlots} slots left</small>
                  </td>

                  <td>
                    {obj.registrationOpen ? (
                      <span style={{ color: "green", fontWeight: "bold" }}>
                        Open
                      </span>
                    ) : (
                      <span style={{ color: "red", fontWeight: "bold" }}>
                        Closed
                      </span>
                    )}
                  </td>

                  <td>
                    <img
                      src={obj.tournamentPoster}
                      alt="poster"
                      width="60"
                      height="60"
                      style={{ borderRadius: "6px" }}
                    />
                  </td>

                  <td>{obj.createdAt}</td>

                </tr>
              );
            })}
          </tbody>
        </table>

      ) : (
        <h3>No events created yet</h3>
      )}

    </div>
  );
}

export default TournamentList;