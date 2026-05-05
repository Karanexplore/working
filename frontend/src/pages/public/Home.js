import React, { useEffect } from "react";
import banner from "../../images/banner.jpg";
import { useDispatch } from "react-redux";
import { resetMessage } from "../../store/participantSlice.js";
import { Link } from "react-router-dom";
import "./publicPages.css";

function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetMessage(""));
  }, [dispatch]);

  const featuredEvents = [
    {
      title: "Cricket Championship 2026",
      type: "Sports",
      date: "12 Apr 2026",
      venue: "College Main Ground",
      tag: "Trending",
      image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "BGMI Campus Clash",
      type: "eSports",
      date: "18 Apr 2026",
      venue: "E-Sports Arena",
      tag: "Popular",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Hackathon Sprint",
      type: "Technical",
      date: "25 Apr 2026",
      venue: "Innovation Lab",
      tag: "Featured",
      image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Cultural Night Fest",
      type: "Cultural",
      date: "30 Apr 2026",
      venue: "Open Air Theatre",
      tag: "Live",
      image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  const sportsEvents = [
    { title: "Football League",   image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80" },
    { title: "Volleyball Cup",    image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=1200&q=80" },
    { title: "Badminton Open",    image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80" },
    { title: "Athletics Meet",    image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=80" },
  ];

  const esportsEvents = [
    { title: "Valorant Arena",    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80" },
    { title: "Free Fire Faceoff", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80" },
    { title: "COD Warfare",       image: "https://images.unsplash.com/photo-1603481546238-487240415921?auto=format&fit=crop&w=1200&q=80" },
    { title: "BGMI Knockout",     image: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&w=1200&q=80" },
  ];

  const culturalEvents = [
    { title: "Dance Battle",  image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80" },
    { title: "Singing Idol",  image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80" },
    { title: "Drama League",  image: "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1200&q=80" },
    { title: "Fashion Walk",  image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80" },
  ];

  const technicalEvents = [
    { title: "Coding Contest",    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80" },
    { title: "Hackathon",         image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80" },
    { title: "Robotics Battle",   image: "https://images.unsplash.com/photo-1561144257-e32e8efc6c4f?auto=format&fit=crop&w=1200&q=80" },
    { title: "Tech Quiz",         image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80" },
  ];

  const categories = [
    { title: "Sports",     desc: "Cricket, Football, Volleyball & more" },
    { title: "eSports",    desc: "BGMI, Valorant, Free Fire, COD" },
    { title: "Cultural",   desc: "Dance, Singing, Drama, Fashion" },
    { title: "Technical",  desc: "Hackathons, Coding, Robotics" },
    { title: "Workshops",  desc: "Hands-on sessions and training" },
    { title: "Festivals",  desc: "Large-scale social and cultural experiences" },
  ];

  return (
    <div className="pulse-home-page">

      {/* ===== HERO ===== */}
      <section className="pulse-hero">
        <img src={banner} className="pulse-hero-banner" alt="PulseArena Banner" />
        <div className="pulse-hero-overlay">
          <div className="pulse-hero-content">
            <h1>Discover Events That Match Your Energy</h1>
            <p>Sports • eSports • Cultural • Technical Events — all in one premium experience built for communities.</p>
            <div className="pulse-hero-actions">
              <Link to="/participantLogin" className="pulse-primary-btn">Explore Events</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="pulse-section">
        <div className="pulse-section-header">
          <div>
            <span className="pulse-mini-tag">Quick Access</span>
            <h2>Explore by Category</h2>
          </div>
        </div>
        <div className="pulse-category-grid">
          {categories.map((item, i) => (
            <Link to="/participantLogin" key={i} className="pulse-category-card" style={{ textDecoration: "none" }}>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== FEATURED EVENTS ===== */}
      <section className="pulse-section">
        <div className="pulse-section-header">
          <div>
            <span className="pulse-mini-tag">Featured</span>
            <h2>Trending Events This Week</h2>
          </div>
          <Link to="/participantLogin" className="pulse-link-btn">View All</Link>
        </div>

        <div className="pulse-card-row">
          {featuredEvents.map((event, i) => (
            <Link to="/participantLogin" key={i} className="pulse-event-card" style={{ textDecoration: "none" }}>
              <div className="pulse-card-image-wrap">
                <img src={event.image} alt={event.title} className="pulse-card-image" />
                <span className="pulse-card-tag">{event.tag}</span>
              </div>
              <div className="pulse-card-body">
                <h3>{event.title}</h3>
                <p className="pulse-card-type">{event.type}</p>
                <p>{event.date}</p>
                <p>{event.venue}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== SPORTS ===== */}
      <section className="pulse-section">
        <div className="pulse-section-header">
          <div>
            <span className="pulse-mini-tag">Top Picks</span>
            <h2>Top Games & Sports Events</h2>
          </div>
          <Link to="/participantLogin" className="pulse-link-btn">See More</Link>
        </div>
        <div className="pulse-card-row">
          {sportsEvents.map((event, i) => (
            <Link to="/participantLogin" key={i} className="pulse-event-card" style={{ textDecoration: "none" }}>
              <div className="pulse-card-image-wrap">
                <img src={event.image} alt={event.title} className="pulse-card-image" />
              </div>
              <div className="pulse-card-body">
                <h3>{event.title}</h3>
                <p>Sports Event</p>
                <p>Campus Level Competition</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== ESPORTS ===== */}
      <section className="pulse-section">
        <div className="pulse-section-header">
          <div>
            <span className="pulse-mini-tag">Competitive Arena</span>
            <h2>eSports Battles</h2>
          </div>
          <Link to="/participantLogin" className="pulse-link-btn">See More</Link>
        </div>
        <div className="pulse-card-row">
          {esportsEvents.map((event, i) => (
            <Link to="/participantLogin" key={i} className="pulse-event-card" style={{ textDecoration: "none" }}>
              <div className="pulse-card-image-wrap">
                <img src={event.image} alt={event.title} className="pulse-card-image" />
              </div>
              <div className="pulse-card-body">
                <h3>{event.title}</h3>
                <p>eSports Tournament</p>
                <p>Fast-paced campus competition</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== CULTURAL ===== */}
      <section className="pulse-section">
        <div className="pulse-section-header">
          <div>
            <span className="pulse-mini-tag">Creative Pulse</span>
            <h2>Cultural Events</h2>
          </div>
          <Link to="/participantLogin" className="pulse-link-btn">See More</Link>
        </div>
        <div className="pulse-card-row">
          {culturalEvents.map((event, i) => (
            <Link to="/participantLogin" key={i} className="pulse-event-card" style={{ textDecoration: "none" }}>
              <div className="pulse-card-image-wrap">
                <img src={event.image} alt={event.title} className="pulse-card-image" />
              </div>
              <div className="pulse-card-body">
                <h3>{event.title}</h3>
                <p>Cultural Event</p>
                <p>Showcase your creativity and talent</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== TECHNICAL ===== */}
      <section className="pulse-section">
        <div className="pulse-section-header">
          <div>
            <span className="pulse-mini-tag">Innovation Zone</span>
            <h2>Technical Events</h2>
          </div>
          <Link to="/participantLogin" className="pulse-link-btn">See More</Link>
        </div>
        <div className="pulse-card-row">
          {technicalEvents.map((event, i) => (
            <Link to="/participantLogin" key={i} className="pulse-event-card" style={{ textDecoration: "none" }}>
              <div className="pulse-card-image-wrap">
                <img src={event.image} alt={event.title} className="pulse-card-image" />
              </div>
              <div className="pulse-card-body">
                <h3>{event.title}</h3>
                <p>Technical Event</p>
                <p>Build, solve, compete and innovate</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section id="about" className="pulse-home-about">
        <div className="pulse-home-info-header">
          <span className="pulse-mini-tag">About PulseArena</span>
          <h2>One Platform. Multiple Event Experiences.</h2>
          <p>PulseArena helps users discover exciting experiences across sports, eSports, cultural, technical, and social events — all in one place.</p>
        </div>
        <div className="pulse-home-info-grid">
          <div className="pulse-home-info-card">
            <h3>What We Do</h3>
            <p>We bring together different kinds of events into one unified platform, making it easier for participants to discover, explore, and engage with opportunities happening around them.</p>
          </div>
          <div className="pulse-home-info-card">
            <h3>Why PulseArena</h3>
            <ul className="pulse-home-list">
              <li>✔ Multi-category event discovery</li>
              <li>✔ Easy and smooth user experience</li>
              <li>✔ Clean and modern interface</li>
              <li>✔ Built for communities and organizers</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section id="contact" className="pulse-home-contact">
        <div className="pulse-home-contact-box">
          <div className="pulse-home-contact-left">
            <span className="pulse-mini-tag light-tag">Contact PulseArena</span>
            <h2>Let's Connect & Explore Together</h2>
            <p>Have questions, suggestions, or want to participate in upcoming events? We're here to help you get started.</p>
          </div>
          <div className="pulse-home-contact-right">
            <div className="pulse-contact-mini-card">
              <p><strong>Email:</strong> support@pulsearena.com</p>
              <p><strong>Phone:</strong> +91 7804885007</p>
              <p><strong>Location:</strong> Indore, Madhya Pradesh, India</p>
              <div className="pulse-hero-actions home-contact-actions">
                <Link to="/participantRegistration" className="pulse-primary-btn">Join as Participant</Link>
                <Link to="/participantLogin" className="pulse-secondary-btn white-btn">Explore Events</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;

