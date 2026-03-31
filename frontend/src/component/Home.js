import React, { useEffect } from "react";
import banner from "../images/banner.jpg";
import { useDispatch } from "react-redux";
import { resetMessage } from "../store/participantSlice.js";
import { Link } from "react-router-dom";

function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetMessage(""));
  }, [dispatch]);

  return (
    <div>

      {/* ===== HERO SECTION ===== */}
      <section className="hero-section">
        <img src={banner} className="hero-banner" alt="PulseArena Banner" />

        <div className="hero-overlay">
          <h1>PulseArena</h1>
          <p>
            Sports • eSports • Cultural • Technical Events — All in One Platform
          </p>
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section id="about" className="about-section">
        <div className="container-inner">
          <h2>About PulseArena</h2>
          <p>
            PulseArena is a unified event management platform designed for
            colleges and institutions. Organizers can create sports tournaments,
            eSports battles, cultural festivals, hackathons, and technical events.
            Participants can easily explore, register, and track their events
            in one seamless ecosystem.
          </p>
        </div>
      </section>

      {/* ===== EVENT CATEGORIES SECTION ===== */}
      <section className="games-section">
        <h2>Explore Event Categories</h2>

        <div className="games-grid">

          <div className="game-card">
            <h3>Sports</h3>
            <p>Cricket, Football, Volleyball, Athletics & more.</p>
          </div>

          <div className="game-card">
            <h3>eSports</h3>
            <p>BGMI, Valorant, Free Fire, Call of Duty tournaments.</p>
          </div>

          <div className="game-card">
            <h3>Cultural Events</h3>
            <p>Dance, Singing, Drama, Fashion Shows, Talent Hunts.</p>
          </div>

          <div className="game-card">
            <h3>Technical Events</h3>
            <p>Hackathons, Coding Competitions, Robotics & Workshops.</p>
          </div>

        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="about-section">
        <div className="container-inner">
          <h2>Why Choose PulseArena?</h2>
          <ul style={{ textAlign: "left" }}>
            <li>✔ Multi-domain event management</li>
            <li>✔ Secure role-based authentication</li>
            <li>✔ Real-time slot management</li>
            <li>✔ Admin analytics dashboard</li>
            <li>✔ Scalable MERN architecture</li>
          </ul>
        </div>
      </section>

      {/* ===== CALL TO ACTION ===== */}
      <section id="contact" className="contact-section">
        <h2>Ready to Join the Pulse?</h2>
        <p>
          Register today and become part of the most dynamic event platform.
        </p>

        <Link to="/participantRegistration" className="cta-button">
          Get Started
        </Link>
      </section>

    </div>
  );
}

export default Home;