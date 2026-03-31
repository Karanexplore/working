import React, { useState } from "react";
import participantLoginImg from "../images/participantLogin.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { participantLoginThunk } from "../store/participantSlice.js";

function LoginParticipant() {
  const participantObj = useSelector((state) => state.participant);
  const [participantData, setParticipantData] = useState({
    email: "",
    password: ""
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getData = (event) => {
    const { name, value } = event.target;
    setParticipantData({
      ...participantData,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // ✅ Basic validation
    if (!participantData.email || !participantData.password) {
      alert("Please enter email and password");
      return;
    }

    // ✅ Wait for login to complete
    const resultAction = await dispatch(participantLoginThunk(participantData));

    // ✅ Login success
    if (participantLoginThunk.fulfilled.match(resultAction)) {
      navigate("/participantHome");
      setParticipantData({
        email: "",
        password: ""
      });
    }

    // ❌ Login failed
    else if (participantLoginThunk.rejected.match(resultAction)) {
      console.log("Login failed:", resultAction.payload);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-image">
        <img src={participantLoginImg} alt="Participant Login" />
      </div>

      <div className="auth-form">
        <h2>Participant Login</h2>
        <br />

        {participantObj.message && (
          <p
            style={{
              color: participantObj.status === 200 ? "green" : "red",
              fontWeight: "bold"
            }}
          >
            {participantObj.message}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter Email"
            name="email"
            value={participantData.email}
            onChange={getData}
          />
          <br />

          <input
            type="password"
            placeholder="Enter Password"
            name="password"
            value={participantData.password}
            onChange={getData}
          />
          <br />
          <br />

          <input type="submit" value="Login" />
          <br />
          <input
            type="button"
            value="Reset"
            onClick={() =>
              setParticipantData({
                email: "",
                password: ""
              })
            }
          />
        </form>

        <br />
        <Link to="/participantRegistration" id="registrationLink">
          Yet Not Registered? Register Here
        </Link>
      </div>
    </div>
  );
}

export default LoginParticipant;