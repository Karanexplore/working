import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setNavShow } from "../store/commonSlice";
import {
  adminTournamentListThunk,
  adminViewOrganizerListThunk,
  adminVerifyOrganizerThunk
} from "../store/adminSlice";

function AdminDashboard() {

  const dispatch = useDispatch();
  const adminObj = useSelector(state => state.admin);

  useEffect(() => {
    dispatch(setNavShow("admin"));
    dispatch(adminTournamentListThunk());   // ✅ FIXED
    dispatch(adminViewOrganizerListThunk()); // ✅ FIXED
  }, [dispatch]);

  const totalEvents = adminObj.tournamentArray?.length || 0;

  const totalRegistrations = adminObj.tournamentArray?.reduce(
    (total, event) => total + (event.registrations?.length || 0),
    0
  ) || 0;

  const openEvents = adminObj.tournamentArray?.filter(
    event => event.registrationOpen
  ).length || 0;

  const closedEvents = totalEvents - openEvents;

  const handleApprove = (email) => {
    dispatch(adminVerifyOrganizerThunk(email)).then(() => {
      dispatch(adminViewOrganizerListThunk());
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>PulseArena - Admin Dashboard</h2>

      {/* ANALYTICS */}
      <div style={{ display: "flex", gap: "20px" }}>
        <div style={cardStyle}><h3>Total Events</h3><p>{totalEvents}</p></div>
        <div style={cardStyle}><h3>Total Registrations</h3><p>{totalRegistrations}</p></div>
        <div style={cardStyle}><h3>Open Events</h3><p>{openEvents}</p></div>
        <div style={cardStyle}><h3>Closed Events</h3><p>{closedEvents}</p></div>
      </div>

      {/* EVENTS */}
      <h3>All Events</h3>
      <table border={1} width="100%">
        <tbody>
          {adminObj.tournamentArray?.map((e, i) => (
            <tr key={i}>
              <td>{e.tournamentName}</td>
              <td>{e.venue}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ORGANIZERS */}
      <h3>Organizer Approvals</h3>
      {adminObj.organizerArray?.map((org, i) => (
        <div key={i}>
          {org.email}
          {org.accountStatus === "pending" && (
            <button onClick={() => handleApprove(org.email)}>
              Approve
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

const cardStyle = {
  padding: "15px",
  background: "#eee"
};

export default AdminDashboard;

// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { setNavShow } from "../store/commonSlice";
// import {
//   organizerTournamentListThunk,
//   getAllOrganizersThunk,
//   approveOrganizerThunk,
//   rejectOrganizerThunk
// } from "../store/organizerSlice";

// function AdminDashboard() {

//   const dispatch = useDispatch();
//   const organizerObj = useSelector(state => state.organizer);

//   useEffect(() => {
//     dispatch(setNavShow("admin"));
//     dispatch(organizerTournamentListThunk());
//     dispatch(getAllOrganizersThunk());
//   }, [dispatch]);

//   /* ================= ANALYTICS ================= */

//   const totalEvents = organizerObj.tournamentArray?.length || 0;

//   const totalRegistrations = organizerObj.tournamentArray?.reduce(
//     (total, event) => total + (event.registrations?.length || 0),
//     0
//   ) || 0;

//   const openEvents = organizerObj.tournamentArray?.filter(
//     event => event.registrationOpen
//   ).length || 0;

//   const closedEvents = totalEvents - openEvents;

//   /* ================= HANDLERS ================= */

//   const handleApprove = (email) => {
//     dispatch(approveOrganizerThunk(email)).then(() => {
//       dispatch(getAllOrganizersThunk());
//     });
//   };

//   const handleReject = (email) => {
//     dispatch(rejectOrganizerThunk(email)).then(() => {
//       dispatch(getAllOrganizersThunk());
//     });
//   };

//   return (
//     <div style={{ padding: "20px" }}>

//       <h2>PulseArena - Admin Dashboard</h2>

//       {/* ===== ANALYTICS ===== */}
//       <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>

//         <div style={cardStyle}>
//           <h3>Total Events</h3>
//           <p>{totalEvents}</p>
//         </div>

//         <div style={cardStyle}>
//           <h3>Total Registrations</h3>
//           <p>{totalRegistrations}</p>
//         </div>

//         <div style={cardStyle}>
//           <h3>Open Events</h3>
//           <p style={{ color: "green" }}>{openEvents}</p>
//         </div>

//         <div style={cardStyle}>
//           <h3>Closed Events</h3>
//           <p style={{ color: "red" }}>{closedEvents}</p>
//         </div>

//       </div>

//       {/* ===== EVENT TABLE ===== */}
//       <h3>All Events</h3>

//       <table border={1} cellPadding={6} width="100%">
//         <thead style={{ backgroundColor: "#111", color: "white" }}>
//           <tr>
//             <th>S.No</th>
//             <th>Event</th>
//             <th>Venue</th>
//             <th>Registrations</th>
//             <th>Status</th>
//           </tr>
//         </thead>

//         <tbody>
//           {organizerObj.tournamentArray?.map((event, index) => (
//             <tr key={event.tournamentId}>
//               <td>{index + 1}</td>
//               <td>{event.tournamentName}</td>
//               <td>{event.venue}</td>
//               <td>
//                 {event.registrations?.length || 0} / {event.maxParticipants}
//               </td>
//               <td>
//                 {event.registrationOpen ? (
//                   <span style={{ color: "green" }}>Open</span>
//                 ) : (
//                   <span style={{ color: "red" }}>Closed</span>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* ===== APPROVAL SECTION ===== */}
//       <h3 style={{ marginTop: "40px" }}>Organizer Approvals</h3>

//       <table border={1} cellPadding={6} width="100%">
//         <thead style={{ backgroundColor: "#333", color: "white" }}>
//           <tr>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Category</th>
//             <th>Status</th>
//             <th>Action</th>
//           </tr>
//         </thead>

//         <tbody>
//           {organizerObj.organizerArray?.map((org, index) => (
//             <tr key={index}>
//               <td>{org.organizerName}</td>
//               <td>{org.email}</td>
//               <td>{org.gameCategory}</td>

//               {/* ✅ FIXED STATUS */}
//               <td>
//                 {org.accountStatus === "approved" && (
//                   <span style={{ color: "green" }}>Approved</span>
//                 )}
//                 {org.accountStatus === "pending" && (
//                   <span style={{ color: "orange" }}>Pending</span>
//                 )}
//                 {org.accountStatus === "rejected" && (
//                   <span style={{ color: "red" }}>Rejected</span>
//                 )}
//               </td>

//               <td>
//                 {org.accountStatus === "pending" ? (
//                   <>
//                     <button
//                       onClick={() => handleApprove(org.email)}
//                       style={{
//                         marginRight: "10px",
//                         backgroundColor: "green",
//                         color: "white"
//                       }}
//                     >
//                       Approve
//                     </button>

//                     <button
//                       onClick={() => handleReject(org.email)}
//                       style={{
//                         backgroundColor: "red",
//                         color: "white"
//                       }}
//                     >
//                       Reject
//                     </button>
//                   </>
//                 ) : (
//                   <span style={{ color: "gray" }}>No Action</span>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//     </div>
//   );
// }

// const cardStyle = {
//   flex: 1,
//   backgroundColor: "#f2f2f2",
//   padding: "15px",
//   borderRadius: "8px",
//   textAlign: "center",
//   boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
// };

// export default AdminDashboard;