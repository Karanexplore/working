import React, { useState, useEffect } from "react";
import axios from "axios";
import jscookie from "js-cookie";
import { requestedAdminURL } from "../../utils";
import "./adminPages.css";

function AdminProfile() {
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });

  const token = jscookie.get("adminTokenData");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(requestedAdminURL + "/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data.admin);
      } catch (error) {
        console.error("Admin profile fetch error:", error);
        setMessage({ text: "Failed to load profile", type: "error" });
      }
    };

    fetchProfile();
  }, []);

  if (!profile && !message.text) {
    return (
      <div className="admin-loader-box" style={{ marginTop: "80px" }}>
        Loading profile...
      </div>
    );
  }

  return (
    <div className="admin-page">
      {/* HERO */}
      <div className="ap-hero">
        <div className="ap-avatar">
          {profile?.email?.charAt(0).toUpperCase() || "A"}
        </div>
        <div>
          <p className="admin-badge">Admin Account</p>
          <h1 className="admin-main-title">
            {profile?.email || "Admin"}
          </h1>
          <span className="ap-role-badge">🛡️ {profile?.role || "ADMIN"}</span>
        </div>
      </div>

      {message.text && (
        <div className={`admin-alert ${message.type === "success" ? "admin-alert-success" : "admin-alert-error"}`}>
          {message.text}
        </div>
      )}

      {/* GRID */}
      <div className="admin-grid-two" style={{ marginTop: "28px" }}>
        {/* LEFT — Profile Details */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Profile Details</h3>
            <span className="admin-chip">Read Only</span>
          </div>

          <div className="ap-fields">
            <div className="ap-field">
              <label>Email Address</label>
              <div className="ap-value ap-locked">
                🔒 {profile?.email}
                <span className="ap-locked-hint">Cannot be changed</span>
              </div>
            </div>

            <div className="ap-field">
              <label>Role</label>
              <div className="ap-value">
                🛡️ {profile?.role || "ADMIN"}
              </div>
            </div>

            <div className="ap-field">
              <label>Account Created</label>
              <div className="ap-value">
                📅 {profile?.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                  : "N/A"}
              </div>
            </div>

            <div className="ap-field">
              <label>Last Updated</label>
              <div className="ap-value">
                🕒 {profile?.updatedAt
                  ? new Date(profile.updatedAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                  : "N/A"}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — Info card */}
        <div className="admin-home-card" style={{ height: "fit-content" }}>
          <h3>Admin Privileges</h3>
          <p>
            As a PulseArena Admin, you have full access to manage organizers,
            approve tournaments, oversee registrations, and maintain platform
            integrity. Your credentials are system-managed and cannot be
            self-edited for security reasons.
          </p>

          <div className="ap-privilege-list">
            <div className="ap-privilege-item">✅ Approve / Reject Organizers</div>
            <div className="ap-privilege-item">✅ Manage All Tournaments</div>
            <div className="ap-privilege-item">✅ View All Registrations</div>
            <div className="ap-privilege-item">✅ Platform-wide Access</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;