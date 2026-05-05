import React, { useState, useEffect } from "react";
import axios from "axios";
import jscookie from "js-cookie";
import { requestedOrganizerURL } from "../../utils";
import "./organizerPages.css";

function OrganizerProfile() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    organizerName: "",
    contact: "",
    gameCategory: "",
    description: "",
    address: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const token = jscookie.get("organizerTokenData");

  const fetchProfile = async () => {
    try {
      const res = await axios.get(requestedOrganizerURL + "/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data.organizer);
      setFormData({
        organizerName: res.data.organizer.organizerName,
        contact: res.data.organizer.contact,
        gameCategory: res.data.organizer.gameCategory,
        description: res.data.organizer.description,
        address: res.data.organizer.address,
      });
    } catch (error) {
      console.error("Profile fetch error:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.organizerName.trim()) {
      setMessage({ text: "Name cannot be empty", type: "error" });
      return;
    }
    if (!/^[0-9]{10}$/.test(formData.contact)) {
      setMessage({ text: "Enter valid 10 digit contact number", type: "error" });
      return;
    }
    if (formData.description.trim().length < 10) {
      setMessage({ text: "Description must be at least 10 characters", type: "error" });
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage({ text: "", type: "" });

      const res = await axios.put(
        requestedOrganizerURL + "/profile",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage({ text: res.data.message, type: "success" });
      setProfile(res.data.organizer);
      setIsEditing(false);
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Update failed",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setMessage({ text: "", type: "" });
    setFormData({
      organizerName: profile.organizerName,
      contact: profile.contact,
      gameCategory: profile.gameCategory,
      description: profile.description,
      address: profile.address,
    });
  };

  if (!profile) {
    return (
      <div className="op-loading">
        <div className="op-spinner" />
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="organizer-form-page">
      {/* HERO */}
      <section className="op-hero">
        <div className="op-hero-inner">
          <div className="op-avatar">
            {profile.organizerName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="op-hero-name">{profile.organizerName}</h1>
            <p className="op-hero-email">{profile.email}</p>
            <div className="op-hero-badges">
              <span className={`op-badge ${profile.emailVerified ? "op-badge-green" : "op-badge-red"}`}>
                {profile.emailVerified ? "✅ Verified" : "❌ Not Verified"}
              </span>
              <span className={`op-badge ${
                profile.accountStatus === "approved"
                  ? "op-badge-green"
                  : profile.accountStatus === "pending"
                  ? "op-badge-yellow"
                  : "op-badge-red"
              }`}>
                {profile.accountStatus === "approved"
                  ? "✅ Approved"
                  : profile.accountStatus === "pending"
                  ? "⏳ Pending Approval"
                  : "❌ " + profile.accountStatus}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN LAYOUT */}
      <div className="op-container">
        {/* LEFT — PROFILE FORM */}
        <div className="organizer-create-form-shell">
          <div className="organizer-form-intro-card" style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2>My Profile</h2>
                <p>View and manage your organizer details</p>
              </div>
              {!isEditing && (
                <button className="op-edit-btn" onClick={() => setIsEditing(true)}>
                  ✏️ Edit Profile
                </button>
              )}
            </div>
          </div>

          {message.text && (
            <div className={`op-message ${message.type === "success" ? "op-msg-success" : "op-msg-error"}`}>
              {message.text}
            </div>
          )}

          <div className="organizer-premium-form">
            {/* Organizer Name */}
            <div className="organizer-field-group">
              <label>Organizer Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="organizerName"
                  value={formData.organizerName}
                  onChange={handleChange}
                  placeholder="Enter your name"
                />
              ) : (
                <div className="op-value-box">{profile.organizerName}</div>
              )}
            </div>

            {/* Email — locked */}
            <div className="organizer-field-group">
              <label>Email</label>
              <div className="op-value-box op-locked">
                🔒 {profile.email}
                <span className="op-locked-hint">Cannot be changed</span>
              </div>
            </div>

            {/* Contact */}
            <div className="organizer-field-group">
              <label>Contact</label>
              {isEditing ? (
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="10 digit number"
                  maxLength={10}
                />
              ) : (
                <div className="op-value-box">{profile.contact}</div>
              )}
            </div>

            {/* Game Category */}
            <div className="organizer-field-group">
              <label>Game / Sport Category</label>
              {isEditing ? (
                <input
                  type="text"
                  name="gameCategory"
                  value={formData.gameCategory}
                  onChange={handleChange}
                  placeholder="e.g. Cricket, Esports"
                />
              ) : (
                <div className="op-value-box">{profile.gameCategory}</div>
              )}
            </div>

            {/* Address */}
            <div className="organizer-field-group">
              <label>Address</label>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Your organization address"
                />
              ) : (
                <div className="op-value-box">{profile.address}</div>
              )}
            </div>

            {/* Registered On */}
            <div className="organizer-field-group">
              <label>Registered On</label>
              <div className="op-value-box">{profile.registeredDate}</div>
            </div>

            {/* Description — full width */}
            <div className="organizer-field-group full-width">
              <label>Description</label>
              {isEditing ? (
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell participants about your organization..."
                  rows="4"
                />
              ) : (
                <div className="op-value-box op-desc">{profile.description}</div>
              )}
            </div>

            {/* Buttons */}
            {isEditing && (
              <div className="organizer-submit-wrap full-width" style={{ display: "flex", gap: "14px" }}>
                <button
                  onClick={handleCancel}
                  style={{
                    flex: 1,
                    height: "58px",
                    border: "1.5px solid #e5e7eb",
                    borderRadius: "18px",
                    background: "white",
                    color: "#6b7280",
                    fontSize: "16px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  className="organizer-submit-btn"
                  onClick={handleSave}
                  disabled={isSubmitting}
                  style={{ flex: 2 }}
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — ACCOUNT INFO */}
        <div className="organizer-preview-shell">
          <div className="organizer-preview-card">
            {profile.organizerLogo ? (
              <div className="organizer-preview-image-wrap">
                <img src={profile.organizerLogo} alt="Organizer Logo" />
              </div>
            ) : (
              <div className="organizer-preview-image-wrap">
                <div className="organizer-preview-placeholder">
                  <span>No Logo Uploaded</span>
                </div>
              </div>
            )}

            <div className="organizer-preview-content">
              <p className="organizer-preview-kicker">Account Info</p>
              <h2 className="organizer-preview-title">{profile.organizerName}</h2>

              <div className="organizer-preview-meta">
                <div className="organizer-preview-meta-item">
                  <span>📧 Email Status: {profile.emailVerified ? "Verified" : "Pending"}</span>
                </div>
                <div className="organizer-preview-meta-item">
                  <span>🏅 Account: {profile.accountStatus}</span>
                </div>
                <div className="organizer-preview-meta-item">
                  <span>📅 Member Since: {profile.registeredDate}</span>
                </div>
                <div className="organizer-preview-meta-item">
                  <span>🕒 Joined At: {profile.registeredTime}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="organizer-preview-mini">
            <h3>Keep it updated</h3>
            <p>
              A complete profile helps participants and admins trust your events.
              Keep your contact, category, and description current.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrganizerProfile;