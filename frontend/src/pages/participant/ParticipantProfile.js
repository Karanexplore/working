import React, { useState, useEffect } from "react";
import axios from "axios";
import jscookie from "js-cookie";
import { requestedParticipantURL } from "../../utils";
import "./participantPages.css";

function ParticipantProfile() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ username: "", contact: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const token = jscookie.get("participantTokenData");

  /* ── Fetch profile on mount ── */
  const fetchProfile = async () => {
    try {
      const res = await axios.get(requestedParticipantURL + "/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data.participant);
      setFormData({
        username: res.data.participant.username,
        contact: res.data.participant.contact,
      });
    } catch (error) {
      console.error("Profile fetch error:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  /* ── Handle input change ── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ── Handle save ── */
  const handleSave = async () => {
    if (!formData.username.trim()) {
      setMessage("Username cannot be empty");
      return;
    }
    if (!/^[0-9]{10}$/.test(formData.contact)) {
      setMessage("Enter valid 10 digit contact number");
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage("");

      const res = await axios.put(
        requestedParticipantURL + "/profile",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(res.data.message);
      setProfile(res.data.participant);
      setIsEditing(false);
    } catch (error) {
      setMessage(error.response?.data?.message || "Update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!profile) {
    return (
      <div className="pp-loading">
        <div className="pp-spinner" />
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="pp-page">
      {/* ── HERO ── */}
      <section className="pp-hero">
        <div className="pp-hero-inner">
          <div className="pp-avatar">
            {profile.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="pp-hero-name">{profile.username}</h1>
            <p className="pp-hero-email">{profile.email}</p>
            <span
              className={`pp-badge ${
                profile.emailVerified ? "pp-badge-green" : "pp-badge-red"
              }`}
            >
              {profile.emailVerified ? "✅ Verified" : "❌ Not Verified"}
            </span>
          </div>
        </div>
      </section>

      {/* ── PROFILE CARD ── */}
      <div className="pp-container">
        <div className="pp-card">
          <div className="pp-card-header">
            <h2>My Profile</h2>
            {!isEditing && (
              <button className="pp-edit-btn" onClick={() => setIsEditing(true)}>
                ✏️ Edit Profile
              </button>
            )}
          </div>

          {message && (
            <div
              className={`pp-message ${
                message.includes("success") ? "pp-msg-success" : "pp-msg-error"
              }`}
            >
              {message}
            </div>
          )}

          <div className="pp-fields">
            {/* Username */}
            <div className="pp-field-group">
              <label>Username</label>
              {isEditing ? (
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="pp-input"
                  placeholder="Enter username"
                />
              ) : (
                <p className="pp-value">{profile.username}</p>
              )}
            </div>

            {/* Email — always readonly */}
            <div className="pp-field-group">
              <label>Email</label>
              <p className="pp-value pp-locked">
                🔒 {profile.email}
                <span className="pp-locked-hint">Cannot be changed</span>
              </p>
            </div>

            {/* Contact */}
            <div className="pp-field-group">
              <label>Contact</label>
              {isEditing ? (
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className="pp-input"
                  placeholder="10 digit number"
                  maxLength={10}
                />
              ) : (
                <p className="pp-value">{profile.contact}</p>
              )}
            </div>

            {/* Registered Date */}
            <div className="pp-field-group">
              <label>Registered On</label>
              <p className="pp-value">{profile.registeredDate}</p>
            </div>
          </div>

          {/* Edit mode buttons */}
          {isEditing && (
            <div className="pp-action-row">
              <button
                className="pp-cancel-btn"
                onClick={() => {
                  setIsEditing(false);
                  setMessage("");
                  setFormData({
                    username: profile.username,
                    contact: profile.contact,
                  });
                }}
              >
                Cancel
              </button>
              <button
                className="pp-save-btn"
                onClick={handleSave}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>

        {/* ── STATS CARD ── */}
        <div className="pp-stats-card">
          <h3>Account Info</h3>
          <div className="pp-stat-item">
            <span>📧 Email Status</span>
            <span>{profile.emailVerified ? "Verified" : "Pending"}</span>
          </div>
          <div className="pp-stat-item">
            <span>📅 Member Since</span>
            <span>{profile.registeredDate}</span>
          </div>
          <div className="pp-stat-item">
            <span>🕒 Joined At</span>
            <span>{profile.registeredTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ParticipantProfile;