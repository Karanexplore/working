import React, { useState, useEffect } from "react";
import axios from "axios";
import jscookie from "js-cookie";
import { requestedOrganizerURL } from "../../utils";
import "./organizerPages.css";

function OrganizerCreateTournament() {
  const [formData, setFormData] = useState({
    tournamentName: "",
    gameTitle: "",
    gameCategory: "",
    eventType: "sports",
    description: "",
    venue: "",
    tournamentDate: "",
    reportingTime: "",
    maxParticipants: "",
    organizerContact: "",
    tournamentPoster: null,
  });

  const [posterPreview, setPosterPreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🔥 Reusable fetch function
  const fetchOrganizerContact = async () => {
    try {
      const token = jscookie.get("organizerTokenData");
      const res = await axios.get(requestedOrganizerURL + "/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFormData((prev) => ({
        ...prev,
        organizerContact: res.data.organizer.contact,
      }));
    } catch (error) {
      console.error("Profile fetch error:", error);
    }
  };

  // On page load — auto fill contact
  useEffect(() => {
    fetchOrganizerContact();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];

      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));

      if (file) {
        setPosterPreview(URL.createObjectURL(file));
      } else {
        setPosterPreview("");
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValidText = (text) => /^[a-zA-Z0-9\s,.-]+$/.test(text);

    if (!isValidText(formData.tournamentName)) {
      alert("Invalid tournament name");
      return;
    }

    if (!isValidText(formData.venue)) {
      alert("Invalid venue");
      return;
    }

    if (!formData.gameTitle) {
      alert("Please select a game");
      return;
    }

    if (!formData.gameCategory) {
      alert("Please select category");
      return;
    }

    if (formData.description.length < 10) {
      alert("Description must be at least 10 characters");
      return;
    }

    if (Number(formData.maxParticipants) <= 0) {
      alert("Participants must be greater than 0");
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.organizerContact)) {
      alert("Enter valid 10 digit contact number");
      return;
    }

    if (!formData.tournamentPoster) {
      alert("Please upload event poster");
      return;
    }

    try {
      setIsSubmitting(true);

      const token = jscookie.get("organizerTokenData");
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      data.set("maxParticipants", Number(formData.maxParticipants));

      const res = await axios.post(
        requestedOrganizerURL + "/createTournament",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(res.data.message);

      // Reset form
      setFormData({
        tournamentName: "",
        gameTitle: "",
        gameCategory: "",
        eventType: "sports",
        description: "",
        venue: "",
        tournamentDate: "",
        reportingTime: "",
        maxParticipants: "",
        organizerContact: "",
        tournamentPoster: null,
      });

      setPosterPreview("");

      // 🔥 Re-fill contact after reset
      fetchOrganizerContact();

    } catch (error) {
      console.log("Create Tournament Error:", error.response?.data || error);
      alert("Error creating event");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="organizer-form-page">
      {/* HERO */}
      <section className="organizer-form-hero">
        <div>
          <p className="organizer-hero-badge">Create Tournament</p>
          <h1>Create a premium event experience</h1>
          <p>
            Fill in the details below to publish a clean, professional-looking
            tournament for participants.
          </p>
        </div>
      </section>

      {/* MAIN LAYOUT */}
      <div className="organizer-create-layout">
        {/* LEFT SIDE - FORM */}
        <div className="organizer-create-form-shell">
          <div className="organizer-form-intro-card">
            <h2>Event Details</h2>
            <p>Enter the core information about your tournament</p>
          </div>

          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="organizer-premium-form"
          >
            <div className="organizer-field-group">
              <label>Event Name</label>
              <input
                type="text"
                name="tournamentName"
                placeholder="Ex: Inter College BGMI Championship"
                value={formData.tournamentName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="organizer-field-group">
              <label>Event Title</label>
              <input
                type="text"
                name="gameTitle"
                placeholder="Type to search game or sport..."
                value={formData.gameTitle}
                onChange={handleChange}
                list="gameTitle-options"
                required
                autoComplete="off"
              />
              <datalist id="gameTitle-options">
                <option value="BGMI" />
                <option value="Valorant" />
                <option value="CSGO" />
                <option value="Free Fire" />
                <option value="COD Mobile" />
                <option value="Clash Royale" />
                <option value="Clash of Clans" />
                <option value="PUBG PC" />
                <option value="Fortnite" />
                <option value="League of Legends" />
                <option value="Dota 2" />
                <option value="Rocket League" />
                <option value="FIFA" />
                <option value="Chess Online" />
                <option value="Pokemon Unite" />
                <option value="Minecraft" />
                <option value="Cricket" />
                <option value="Football" />
                <option value="Basketball" />
                <option value="Volleyball" />
                <option value="Handball" />
                <option value="Baseball" />
                <option value="Rugby" />
                <option value="Hockey" />
                <option value="Badminton" />
                <option value="Table Tennis" />
                <option value="Tennis" />
                <option value="Squash" />
                <option value="Karate" />
                <option value="Taekwondo" />
                <option value="Boxing" />
                <option value="Judo" />
                <option value="Wrestling" />
                <option value="MMA" />
                <option value="Kung Fu" />
                <option value="Kickboxing" />
                <option value="Swimming" />
                <option value="Athletics" />
                <option value="Cycling" />
                <option value="Archery" />
                <option value="Shooting" />
                <option value="Gymnastics" />
                <option value="Weight Lifting" />
                <option value="Hackathon" />
                <option value="Coding Contest" />
                <option value="Web Development" />
                <option value="App Development" />
                <option value="AI Challenge" />
                <option value="Cybersecurity CTF" />
                <option value="Data Science" />
                <option value="Robotics" />
                <option value="IoT Challenge" />
                <option value="UI/UX Design" />
                <option value="Open Source Sprint" />
                <option value="Chess" />
                <option value="Carrom" />
                <option value="Quiz Competition" />
                <option value="Debate" />
                <option value="Photography" />
                <option value="Dance" />
                <option value="Singing" />
                <option value="Drama" />
              </datalist>
            </div>

            <div className="organizer-field-group">
              <label>Event Type</label>
              <select
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                required
              >
                <option value="sports">Sports</option>
                <option value="esports">eSports</option>
                <option value="technical">Technical</option>
                <option value="cultural">Cultural</option>
                <option value="workshop">Workshop</option>
                <option value="fest">College Fest</option>
              </select>
            </div>

            <div className="organizer-field-group">
              <label>Category</label>
              <input
                type="text"
                name="gameCategory"
                placeholder="Type to search category..."
                value={formData.gameCategory}
                onChange={handleChange}
                list="gameCategory-options"
                required
                autoComplete="off"
              />
              <datalist id="gameCategory-options">
                <option value="Outdoor" />
                <option value="Indoor" />
                <option value="Combat Sports" />
                <option value="Racket Sports" />
                <option value="Aquatics" />
                <option value="Athletics" />
                <option value="Team Sports" />
                <option value="Individual Sports" />
                <option value="Martial Arts" />
                <option value="Board Games" />
                <option value="Adventure Sports" />
                <option value="Shooting Sports" />
                <option value="Gymnastics" />
                <option value="Esports" />
                <option value="Battle Royale" />
                <option value="MOBA" />
                <option value="FPS" />
                <option value="Strategy" />
                <option value="Sports Gaming" />
                <option value="Mobile Gaming" />
                <option value="PC Gaming" />
                <option value="Console Gaming" />
                <option value="Hackathon" />
                <option value="Coding" />
                <option value="Web Development" />
                <option value="App Development" />
                <option value="AI & ML" />
                <option value="Cybersecurity" />
                <option value="Data Science" />
                <option value="Robotics" />
                <option value="IoT" />
                <option value="Open Source" />
                <option value="UI/UX" />
                <option value="Cloud Computing" />
                <option value="Blockchain" />
                <option value="Dance" />
                <option value="Singing" />
                <option value="Drama" />
                <option value="Photography" />
                <option value="Art & Craft" />
                <option value="Fashion Show" />
                <option value="Poetry" />
                <option value="Stand Up Comedy" />
                <option value="Short Film" />
                <option value="Street Art" />
                <option value="Quiz" />
                <option value="Debate" />
                <option value="Essay Writing" />
                <option value="Science Exhibition" />
                <option value="Math Olympiad" />
                <option value="GK Contest" />
                <option value="Spell Bee" />
                <option value="Elocution" />
                <option value="College Fest" />
                <option value="Cultural Festival" />
                <option value="Tech Fest" />
                <option value="Sports Fest" />
                <option value="Annual Day" />
                <option value="Farewell Event" />
                <option value="Fresher Party" />
                <option value="Inter College" />
                <option value="Intra College" />
                <option value="National Level" />
                <option value="State Level" />
                <option value="District Level" />
                <option value="Workshop" />
                <option value="Seminar" />
                <option value="Webinar" />
                <option value="Bootcamp" />
                <option value="Treasure Hunt" />
                <option value="Food Contest" />
                <option value="Gaming Cafe" />
              </datalist>
            </div>

            <div className="organizer-field-group full-width">
              <label>Event Description</label>
              <textarea
                name="description"
                required
                placeholder="Describe your event..."
                value={formData.description}
                onChange={handleChange}
                rows="5"
              />
            </div>

            <div className="organizer-field-group">
              <label>Venue</label>
              <input
                type="text"
                name="venue"
                placeholder="Ex: IPS Academy, Indore"
                value={formData.venue}
                onChange={handleChange}
                required
              />
            </div>

            <div className="organizer-field-group">
              <label>Event Date</label>
              <input
                type="date"
                name="tournamentDate"
                value={formData.tournamentDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="organizer-field-group">
              <label>Reporting Time</label>
              <input
                type="time"
                name="reportingTime"
                value={formData.reportingTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="organizer-field-group">
              <label>Max Participants</label>
              <input
                type="number"
                name="maxParticipants"
                placeholder="Ex: 100"
                value={formData.maxParticipants}
                onChange={handleChange}
                required
              />
            </div>

            <div className="organizer-field-group">
              <label>Organizer Contact</label>
              <input
                type="text"
                name="organizerContact"
                value={formData.organizerContact}
                readOnly
                style={{
                  backgroundColor: "#f0f0f0",
                  cursor: "not-allowed",
                  color: "#555",
                }}
              />
              <small style={{ color: "#888" }}>
                Auto-filled from your registered profile
              </small>
            </div>

            <div className="organizer-field-group full-width">
              <label>Event Poster</label>
              <input
                type="file"
                name="tournamentPoster"
                accept="image/*"
                onChange={handleChange}
                required
              />
              <small className="upload-helper">
                Upload a clean poster/banner for your event
              </small>
            </div>

            <div className="organizer-submit-wrap full-width">
              <button
                type="submit"
                className="organizer-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Event..." : "Create Event"}
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT SIDE - LIVE PREVIEW */}
        <div className="organizer-preview-shell">
          <div className="organizer-preview-card">
            <div className="organizer-preview-image-wrap">
              <span className="organizer-preview-badge">Live Preview</span>

              {posterPreview ? (
                <img src={posterPreview} alt="Poster Preview" />
              ) : (
                <div className="organizer-preview-placeholder">
                  <span>Poster Preview</span>
                </div>
              )}
            </div>

            <div className="organizer-preview-content">
              <p className="organizer-preview-kicker">Poster Preview</p>

              <h2 className="organizer-preview-title">
                {formData.tournamentName || "Your Event Name"}
              </h2>

              <p className="organizer-preview-desc">
                {formData.gameTitle || "Your event title will appear here"}
              </p>

              <div className="organizer-preview-tags">
                <span>{formData.eventType || "sports"}</span>
                <span>{formData.gameCategory || "category"}</span>
              </div>

              <div className="organizer-preview-meta">
                <div className="organizer-preview-meta-item">
                  <span>📍 {formData.venue || "Venue not added yet"}</span>
                </div>

                <div className="organizer-preview-meta-item">
                  <span>📅 {formData.tournamentDate || "Date not selected"}</span>
                </div>

                <div className="organizer-preview-meta-item">
                  <span>🕒 {formData.reportingTime || "Time not selected"}</span>
                </div>

                <div className="organizer-preview-meta-item">
                  <span>👥 {formData.maxParticipants || "0"} Participants</span>
                </div>
              </div>
            </div>
          </div>

          <div className="organizer-preview-mini">
            <h3>Make it look premium</h3>
            <p>
              Add a strong poster, a crisp title, and a clean description to
              boost registrations and build participant trust.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrganizerCreateTournament;

