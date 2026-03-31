import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import participantImg from "../images/participantLogin.jpg";
import { setNavShow } from "../store/commonSlice";

function ParticipantRegisterTournament() {
  const participantObj = useSelector((state) => state.participant);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setNavShow("participant"));
  }, [dispatch]);

  useEffect(() => {
    if (!participantObj.loggedInEmail) {
      navigate("/participantLogin");
    }
  }, [participantObj.loggedInEmail, navigate]);

  return (
    <div
      style={{
        display: "flex",
        gap: "40px",
        padding: "40px",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap"
      }}
    >
      {/* LEFT */}
      <div
        style={{
          flex: 1,
          minWidth: "300px",
          textAlign: "center"
        }}
      >
        <h2>Welcome {participantObj.loggedInEmail}</h2>
        <img
          src={participantImg}
          alt="Participant"
          style={{
            width: "100%",
            maxWidth: "400px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
          }}
        />
      </div>

      {/* RIGHT */}
      <div
        style={{
          flex: 1,
          minWidth: "300px",
          backgroundColor: "#f8f9fa",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Tournament Registration Info</h2>

        <p style={{ fontSize: "16px", lineHeight: "1.7" }}>
          Participants cannot create tournaments directly.
          <br />
          <br />
          Only <strong>Organizers</strong> can create tournaments.
          <br />
          <br />
          To join a tournament:
        </p>

        <ul style={{ lineHeight: "2", marginTop: "10px" }}>
          <li>Go to <strong>Explore Events</strong></li>
          <li>View available tournaments</li>
          <li>Click on <strong>Register</strong></li>
          <li>Your event will appear in <strong>My Registrations</strong></li>
        </ul>

        <button
          onClick={() => navigate("/registerTournament")}
          style={{
            marginTop: "20px",
            backgroundColor: "#0b1b44",
            color: "white",
            border: "none",
            padding: "12px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          Go to Explore Events
        </button>
      </div>
    </div>
  );
}

export default ParticipantRegisterTournament;