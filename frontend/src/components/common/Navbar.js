import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import jscookie from "js-cookie";
import { setNavShow } from "../../store/commonSlice";
import "./common.css";

function Navbar() {
  const navObj = useSelector((state) => state.common);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = (type) => {
    jscookie.remove(`${type}TokenData`);
    jscookie.remove(`${type}Email`);
    dispatch(setNavShow("home"));
    navigate("/");
    setMenuOpen(false);
  };

  const getNavClass = (path) => {
    return location.pathname === path ? "nav-item active-nav" : "nav-item";
  };

  const closeMenu = () => setMenuOpen(false);

  const renderLinks = () => {
    switch (navObj.navShow) {
      case "participant":
        return (
          <>
            <Link to="/participantHome" className={getNavClass("/participantHome")} onClick={closeMenu}>Home</Link>
            <Link to="/registerTournament" className={getNavClass("/registerTournament")} onClick={closeMenu}>Explore Events</Link>
            <Link to="/participantViewRegistration" className={getNavClass("/participantViewRegistration")} onClick={closeMenu}>My Registrations</Link>
            <Link to="/myTickets" className={getNavClass("/myTickets")} onClick={closeMenu}>My Tickets</Link>
            <Link to="/participantProfile" className={getNavClass("/participantProfile")} onClick={closeMenu}>My Profile</Link>
            <span className="nav-item logout" onClick={() => logout("participant")}>Logout</span>
          </>
        );
      case "organizer":
        return (
          <>
            <Link to="/organizerHome" className={getNavClass("/organizerHome")} onClick={closeMenu}>Home</Link>
            <Link to="/createTournament" className={getNavClass("/createTournament")} onClick={closeMenu}>Create Event</Link>
            <Link to="/organizerTournamentList" className={getNavClass("/organizerTournamentList")} onClick={closeMenu}>My Events</Link>
            <Link to="/organizerProfile" className={getNavClass("/organizerProfile")} onClick={closeMenu}>My Profile</Link>
            <span className="nav-item logout" onClick={() => logout("organizer")}>Logout</span>
          </>
        );
      case "admin":
        return (
          <>
            <Link to="/adminDashboard" className={getNavClass("/adminDashboard")} onClick={closeMenu}>Dashboard</Link>
            <Link to="/adminOrganizerList" className={getNavClass("/adminOrganizerList")} onClick={closeMenu}>Organizers</Link>
            <Link to="/adminProfile" className={getNavClass("/adminProfile")} onClick={closeMenu}>My Profile</Link>
            <span className="nav-item logout" onClick={() => logout("admin")}>Logout</span>
          </>
        );
      default:
        return (
          <>
            <Link to="/" className={getNavClass("/")} onClick={closeMenu}>Home</Link>
            <Link to="/participantLogin" className={getNavClass("/participantLogin")} onClick={closeMenu}>Participant</Link>
            <Link to="/organizerLogin" className={getNavClass("/organizerLogin")} onClick={closeMenu}>Organizer</Link>
            <Link to="/about" className={getNavClass("/about")} onClick={closeMenu}>About</Link>
            <Link to="/contact" className={getNavClass("/contact")} onClick={closeMenu}>Contact</Link>
          </>
        );
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={closeMenu}>PulseArena</Link>

        <button
          className={`hamburger ${menuOpen ? "hamburger-open" : ""}`}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`nav-links ${menuOpen ? "nav-links-open" : ""}`}>
          {renderLinks()}
        </div>
      </div>

      {menuOpen && (
        <div className="nav-overlay" onClick={closeMenu} />
      )}
    </nav>
  );
}

export default Navbar;

