import React, { useState } from "react";
import organizerImg from "../images/organizerLogin.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { organizerRegistrationThunk } from "../store/organizerSlice.js";

function RegistrationOrganizer() {
  const [organizerData, setOrganizerData] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getData = (e) => {
    let { name, value, type, files } = e.target;

    if (type === "file") {
      value = files[0];
    }

    setOrganizerData({
      ...organizerData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();

  Object.keys(organizerData).forEach((key) => {
    if (organizerData[key]) {
      formData.append(key, organizerData[key]);
    }
  });

  try {
    const resultAction = await dispatch(
      organizerRegistrationThunk(formData)
    );

    if (organizerRegistrationThunk.fulfilled.match(resultAction)) {
      alert(resultAction.payload.message);

      // ✅ Pass email to OTP page
      navigate("/verifyOrganizerOTP", {
        state: { email: organizerData.email }
      });

    } else {
      alert(resultAction.payload);
    }

  } catch (error) {
    console.error("Registration Error:", error);
    alert("Something went wrong");
  }

  e.target.reset();
};

  return (
    <div className="auth-container">
      <div className="auth-image">
        <img src={organizerImg} alt="Organizer Registration" />
      </div>

      <div className="auth-form">
        <h2>Organizer Registration</h2>

        <form onSubmit={handleSubmit} encType="multipart/form-data">

          <input
            type="text"
            name="organizerName"
            placeholder="Enter Organizer Name"
            onChange={getData}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            onChange={getData}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            onChange={getData}
            required
          />

          <input
            type="text"
            name="contact"
            placeholder="Enter Mobile Number"
            onChange={getData}
            required
          />

          <select name="gameCategory" onChange={getData} required>
            <option value="">Select Game Category</option>
            <option>Cricket</option>
            <option>Football</option>
            <option>BGMI</option>
            <option>Valorant</option>
            <option>CSGO</option>
          </select>

          <textarea
            name="description"
            placeholder="Enter Description"
            onChange={getData}
            required
          />

          <input
            type="text"
            name="address"
            placeholder="Enter Address"
            onChange={getData}
            required
          />

          <input
            type="file"
            name="organizerLogo"
            onChange={getData}
            required
          />

          <div className="form-buttons">
            <input type="submit" value="Register" />
            <input type="reset" value="Reset" />
          </div>

        </form>

        <Link to="/organizerLogin" id="registrationLink">
          Already Registered? Login Here
        </Link>
      </div>
    </div>
  );
}

export default RegistrationOrganizer;