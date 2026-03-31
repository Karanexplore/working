import React, { useState } from "react";
import axios from "axios";
import jscookie from "js-cookie";
import { requestedOrganizerURL } from "../utils";

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
    tournamentPoster: null   // 🔥 FILE
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFormData({
        ...formData,
        [name]: files[0]
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
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
            "Content-Type": "multipart/form-data"
          }
        }
      );

      alert(res.data.message);

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
        tournamentPoster: null
      });

    } catch (error) {
      console.log("Create Tournament Error:", error.response?.data || error);
      alert("Error creating event");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Event - PulseArena</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data">

        <input type="text" name="tournamentName" placeholder="Event Name"
          value={formData.tournamentName} onChange={handleChange} required /><br /><br />

        <input type="text" name="gameTitle"
          placeholder="Event Title"
          value={formData.gameTitle}
          onChange={handleChange}
          required /><br /><br />

        <select name="eventType"
          value={formData.eventType}
          onChange={handleChange}
          required>
          <option value="sports">Sports</option>
          <option value="esports">eSports</option>
          <option value="technical">Technical</option>
          <option value="cultural">Cultural</option>
          <option value="workshop">Workshop</option>
          <option value="fest">College Fest</option>
        </select><br /><br />

        <input type="text" name="gameCategory"
          placeholder="Category"
          value={formData.gameCategory}
          onChange={handleChange}
          required /><br /><br />

        <textarea name="description"
          placeholder="Event Description"
          value={formData.description}
          onChange={handleChange}
          rows="4" /><br /><br />

        <input type="text" name="venue"
          placeholder="Venue"
          value={formData.venue}
          onChange={handleChange}
          required /><br /><br />

        <input type="date" name="tournamentDate"
          value={formData.tournamentDate}
          onChange={handleChange}
          required /><br /><br />

        <input type="time" name="reportingTime"
          value={formData.reportingTime}
          onChange={handleChange}
          required /><br /><br />

        <input type="number" name="maxParticipants"
          placeholder="Max Participants"
          value={formData.maxParticipants}
          onChange={handleChange}
          required /><br /><br />

        <input type="text" name="organizerContact"
          placeholder="Organizer Contact"
          value={formData.organizerContact}
          onChange={handleChange}
          required /><br /><br />

        {/* 🔥 FILE INPUT */}
        <input
          type="file"
          name="tournamentPoster"
          accept="image/*"
          onChange={handleChange}
          required
        /><br /><br />

        <button
          type="submit"
          style={{
            backgroundColor: "#6a0dad",
            color: "white",
            padding: "8px 15px",
            border: "none",
            cursor: "pointer"
          }}
        >
          Create Event
        </button>

      </form>
    </div>
  );
}

export default OrganizerCreateTournament;