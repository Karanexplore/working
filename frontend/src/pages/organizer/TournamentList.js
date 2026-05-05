import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setNavShow } from "../../store/commonSlice.js";
import { organizerTournamentListThunk } from "../../store/organizerSlice.js";
import axios from "axios";
import jscookie from "js-cookie";
import "./organizerPages.css";
import UserListModal from "../../components/common/modal/UserListModal";

function TournamentList() {
  const organizerObj = useSelector((state) => state.organizer);
  const dispatch = useDispatch();

  // ✅ FIX: state inside component
  const [showUsers, setShowUsers] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    dispatch(setNavShow("organizer"));
    dispatch(organizerTournamentListThunk());
  }, [dispatch]);

  const tournamentArray = organizerObj.tournamentArray || [];

  /* ================= VIEW PARTICIPANTS ================= */
  const viewParticipants = async (tournamentId) => {
    try {
      const token = jscookie.get("organizerTokenData");

      const res = await axios.get(
        `http://localhost:5000/tournament/participants/${tournamentId}?organizerTokenData=${token}`
      );

      console.log(res.data);

      // ✅ FIX: alert hata diya → modal use kiya
      setSelectedUsers(res.data.participants || []);
      setShowUsers(true);

    } catch (error) {
      console.log("Error fetching participants", error);
    }
  };

  const dashboardStats = useMemo(() => {
    const totalEvents = tournamentArray.length;

    const openEvents = tournamentArray.filter(
      (obj) => obj.registrationOpen
    ).length;

    const totalRegistrations = tournamentArray.reduce(
      (sum, obj) => sum + (obj.registrations?.length || 0),
      0
    );

    const totalCapacity = tournamentArray.reduce(
      (sum, obj) => sum + (Number(obj.maxParticipants) || 0),
      0
    );

    return {
      totalEvents,
      openEvents,
      totalRegistrations,
      totalCapacity,
    };
  }, [tournamentArray]);

  return (
    <div className="organizer-events-page">
      {/* ===== HERO ===== */}
      <section className="organizer-events-hero">
        <div className="organizer-events-hero-left">
          <p className="organizer-hero-badge">My Events</p>
          <h1>PulseArena Organizer Dashboard</h1>
          <p>
            Welcome <strong>{organizerObj.loggedInEmail}</strong>. Manage your
            tournaments, monitor registrations, and keep every event looking
            premium.
          </p>
        </div>

        <div className="organizer-events-hero-card">
          <span className="hero-card-mini">Organizer Space</span>
          <h3>Control your events like a pro</h3>
          <p>
            Track registrations, view status, and maintain a polished event
            experience for your participants.
          </p>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="organizer-events-stats">
        <div className="organizer-event-stat-card">
          <p>Total Events</p>
          <h2>{dashboardStats.totalEvents}</h2>
          <span>All tournaments created</span>
        </div>

        <div className="organizer-event-stat-card">
          <p>Open Registrations</p>
          <h2>{dashboardStats.openEvents}</h2>
          <span>Currently accepting participants</span>
        </div>

        <div className="organizer-event-stat-card">
          <p>Total Signups</p>
          <h2>{dashboardStats.totalRegistrations}</h2>
          <span>Across all tournaments</span>
        </div>

        <div className="organizer-event-stat-card">
          <p>Total Capacity</p>
          <h2>{dashboardStats.totalCapacity}</h2>
          <span>Maximum participant slots</span>
        </div>
      </section>

      {/* ===== TABLE ===== */}
      {tournamentArray.length > 0 ? (
        <div className="organizer-table-shell premium-shell">
          <div className="organizer-table-topbar">
            <div>
              <h2>Created Events</h2>
              <p>Track registrations, posters, status, and event details</p>
            </div>

            <div className="table-count-pill">
              {tournamentArray.length} Event
              {tournamentArray.length > 1 ? "s" : ""}
            </div>
          </div>

          <div className="organizer-table-wrapper">
            <table className="organizer-premium-table">
              <thead>
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
                  <th>Users</th>
                </tr>
              </thead>

              <tbody>
                {tournamentArray.map((obj, index) => {
                  const registeredCount = obj.registrations?.length || 0;
                  const maxParticipants = Number(obj.maxParticipants) || 0;
                  const remainingSlots = maxParticipants - registeredCount;

                  return (
                    <tr key={obj.tournamentId || index}>
                      <td>
                        <span className="serial-pill">{index + 1}</span>
                      </td>

                      <td>
                        <div className="event-cell">
                          <h4>{obj.tournamentName}</h4>
                          <p>{obj.description || "No description available"}</p>
                        </div>
                      </td>

                      <td>
                        <span className="event-type-badge">
                          {obj.eventType || "sports"}
                        </span>
                      </td>

                      <td>{obj.gameCategory || "-"}</td>
                      <td>{obj.venue || "-"}</td>
                      <td>{obj.tournamentDate || "-"}</td>
                      <td>{obj.reportingTime || "-"}</td>

                      <td>
                        <div className="registration-cell">
                          <strong>
                            {registeredCount} / {maxParticipants}
                          </strong>
                          <span>
                            {remainingSlots >= 0 ? remainingSlots : 0} slots left
                          </span>
                        </div>
                      </td>

                      <td>
                        <span
                          className={
                            obj.registrationOpen
                              ? "status-pill open"
                              : "status-pill closed"
                          }
                        >
                          {obj.registrationOpen ? "Open" : "Closed"}
                        </span>
                      </td>

                      <td>
                        <div className="poster-cell">
                          <img
                            src={obj.tournamentPoster}
                            alt="poster"
                          />
                        </div>
                      </td>

                      <td>{obj.createdAt || "-"}</td>

                      <td>
                        <button
                          style={{
                            padding: "6px 12px",
                            background: "#111827",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer"
                          }}
                          onClick={() =>
                            viewParticipants(obj.tournamentId)
                          }
                        >
                          View Users
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="organizer-empty-state premium-empty">
          <div className="empty-state-icon">🏆</div>
          <h3>No events created yet</h3>
        </div>
      )}

      {/* ✅ MODAL */}
      {showUsers && (
        <UserListModal
          users={selectedUsers}
          onClose={() => setShowUsers(false)}
        />
      )}
    </div>
  );
}

export default TournamentList;

