import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { verifyOrganizerOTPThunk } from "../store/organizerSlice";
import { useNavigate, useLocation } from "react-router-dom";

function VerifyOrganizerOTP() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: location.state?.email || "",
    otp: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(verifyOrganizerOTPThunk(formData));

    if (verifyOrganizerOTPThunk.fulfilled.match(result)) {
      alert("Email verified successfully!");
      navigate("/organizerLogin");
    } else {
      alert(result.payload);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Verify Organizer OTP</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            onChange={handleChange}
            required
          />

          <input type="submit" value="Verify OTP" />
        </form>
      </div>
    </div>
  );
}

export default VerifyOrganizerOTP;