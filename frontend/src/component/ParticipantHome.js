import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import jscookie from "js-cookie";
import { setNavShow } from "../store/commonSlice.js";
import {
  participantTournamentListThunk,
  participantRegisterTournamentThunk
} from "../store/participantSlice.js";

function ParticipantHome() {
  const participantObj = useSelector((state) => state.participant);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /* ================= AUTH CHECK ================= */
  useEffect(() => {
    const token = jscookie.get("participantTokenData");

    if (!token) {
      navigate("/participantLogin");
    }
  }, [navigate]);

  /* ================= HANDLE 403 / INVALID LOGIN ================= */
  useEffect(() => {
    if (
      participantObj.status === 403 &&
      participantObj.message?.toLowerCase().includes("token")
    ) {
      navigate("/participantLogin");
    }
  }, [participantObj.status, participantObj.message, navigate]);

  /* ================= NAV ================= */
  useEffect(() => {
    dispatch(setNavShow("participant"));
  }, [dispatch]);

  /* ================= FETCH TOURNAMENTS ================= */
  useEffect(() => {
    dispatch(participantTournamentListThunk());
  }, [dispatch]);

  /* ================= REGISTER HANDLER ================= */
  const handleRegister = (id) => {
    dispatch(participantRegisterTournamentThunk(id));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Welcome {participantObj.loggedInEmail || "Participant"}</h2>
      <p>{participantObj.message}</p>

      <h3>Available Tournaments</h3>

      <table border={1} cellPadding={6} width="100%">
        <thead style={{ backgroundColor: "#111", color: "white" }}>
          <tr>
            <th>S.No</th>
            <th>Tournament</th>
            <th>Game</th>
            <th>Venue</th>
            <th>Date</th>
            <th>Slots</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {participantObj.tournamentArray?.length > 0 ? (
            participantObj.tournamentArray.map((t, index) => (
              <tr key={t.tournamentId || index}>
                <td>{index + 1}</td>
                <td>{t.tournamentName}</td>
                <td>{t.gameTitle}</td>
                <td>{t.venue}</td>
                <td>{t.tournamentDate}</td>
                <td>{t.maxParticipants}</td>

                <td>
                  <button
                    onClick={() => handleRegister(t.tournamentId)}
                    style={{
                      backgroundColor: "green",
                      color: "white",
                      padding: "6px 12px",
                      border: "none",
                      cursor: "pointer"
                    }}
                  >
                    Register
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                No tournaments available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ParticipantHome;

// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { setNavShow } from "../store/commonSlice.js";
// import {
//   participantTournamentListThunk,
//   participantRegisterTournamentThunk
// } from "../store/participantSlice.js";

// function ParticipantHome() {

//   const participantObj = useSelector(state => state.participant);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   /* ================= AUTH CHECK ================= */
//   useEffect(() => {
//     if (participantObj.status === 500 || participantObj.status === undefined) {
//       navigate("/participantLogin");
//     }
//   }, [participantObj.status, navigate]);

//   /* ================= NAV ================= */
//   useEffect(() => {
//     dispatch(setNavShow("participant"));
//   }, [dispatch]);

//   /* ================= FETCH TOURNAMENTS ================= */
//   useEffect(() => {
//     dispatch(participantTournamentListThunk()); // ✅ FIXED
//   }, [dispatch]);

//   /* ================= REGISTER HANDLER ================= */
//   const handleRegister = (id) => {
//     dispatch(participantRegisterTournamentThunk(id));
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Welcome {participantObj.loggedInEmail}</h2>
//       <p>{participantObj.message}</p>

//       <h3>Available Tournaments</h3>

//       <table border={1} cellPadding={6} width="100%">
//         <thead style={{ backgroundColor: "#111", color: "white" }}>
//           <tr>
//             <th>S.No</th>
//             <th>Tournament</th>
//             <th>Game</th>
//             <th>Venue</th>
//             <th>Date</th>
//             <th>Slots</th>
//             <th>Action</th>
//           </tr>
//         </thead>

//         <tbody>
//           {participantObj.tournamentArray?.length > 0 ? (
//             participantObj.tournamentArray.map((t, index) => (
//               <tr key={t.tournamentId}>
//                 <td>{index + 1}</td>
//                 <td>{t.tournamentName}</td>
//                 <td>{t.gameTitle}</td>
//                 <td>{t.venue}</td>
//                 <td>{t.tournamentDate}</td>
//                 <td>{t.maxParticipants}</td>

//                 <td>
//                   <button
//                     onClick={() => handleRegister(t.tournamentId)}
//                     style={{
//                       backgroundColor: "green",
//                       color: "white"
//                     }}
//                   >
//                     Register
//                   </button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="7" style={{ textAlign: "center" }}>
//                 No tournaments available
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default ParticipantHome;