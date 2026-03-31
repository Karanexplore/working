import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import jscookie from "js-cookie";
import { setNavShow } from "../store/commonSlice";

function Navbar() {
  const navObj = useSelector((state) => state.common);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = (type) => {
    jscookie.remove(`${type}TokenData`);
    jscookie.set(`${type}Email`, null);
    dispatch(setNavShow("home"));
    navigate("/");
  };

  const renderLinks = () => {
    switch (navObj.navShow) {

      /* ================= PARTICIPANT ================= */
      case "participant":
        return (
          <>
            <Link to="/" className="nav-item">Home</Link>
            <Link to="/registerTournament" className="nav-item">Explore Events</Link>
            <Link to="/participantViewRegistration" className="nav-item">My Registrations</Link>
            <span className="nav-item logout" onClick={() => logout("participant")}>
              Logout
            </span>
          </>
        );

      /* ================= ORGANIZER ================= */
      case "organizer":
        return (
          <>
            <Link to="/" className="nav-item">Home</Link>
            <Link to="/createTournament" className="nav-item">
              Create Event
            </Link>
            <Link to="/organizerTournamentList" className="nav-item">
              My Events
            </Link>
            <span
              className="nav-item logout"
              onClick={() => logout("organizer")}
            >
              Logout
            </span>
          </>
        );

      /* ================= ADMIN ================= */
      case "admin":
        return (
          <>
            <Link to="/adminDashboard" className="nav-item">
              Dashboard
            </Link>
            <Link to="/adminOrganizerList" className="nav-item">
              Organizers
            </Link>
            <span className="nav-item logout" onClick={() => logout("admin")}>
              Logout
            </span>
          </>
        );

      /* ================= DEFAULT (NOT LOGGED IN) ================= */
      default:
        return (
          <>
            <Link to="/" className="nav-item">Home</Link>
            <Link to="/participantLogin" className="nav-item">Participant</Link>
            <Link to="/organizerLogin" className="nav-item">Organizer</Link>
            <a href="/#about" className="nav-item">About</a>
            <a href="/#contact" className="nav-item">Contact</a>
          </>
        );
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">

        {/* 🔥 Updated Branding */}
        <div className="nav-logo">
          PulseArena
        </div>

        <div className="nav-links">
          {renderLinks()}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;