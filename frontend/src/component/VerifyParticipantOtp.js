import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyParticipantOtpThunk } from "../store/participantSlice";

function VerifyParticipantOtp() {
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      alert("Invalid access. Please register first.");
      navigate("/participantRegistration");
    }
  }, [email, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(verifyParticipantOtpThunk({ email, otp }))
      .unwrap()
      .then(() => {
        alert("Email verified successfully!");
        navigate("/participantLogin");
      })
       .catch((err) => {
       alert(err?.message || err);
       });
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Verify OTP</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <br /><br />
        <button type="submit">Verify</button>
      </form>
    </div>
  );
}

export default VerifyParticipantOtp;