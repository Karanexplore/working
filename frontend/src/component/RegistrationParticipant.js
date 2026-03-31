import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import participantImg from '../images/participantLogin.jpg';
import { Link, useNavigate } from 'react-router-dom';
import {
  participantRegistrationThunk,
  resetMessage
} from '../store/participantSlice.js';

function RegistrationParticipant() {

  const [participantData, setParticipantData] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(resetMessage(''));
  }, [dispatch]);

  const getData = (event) => {
    const { name, value } = event.target;
    setParticipantData({
      ...participantData,
      [name]: value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

   dispatch(participantRegistrationThunk(participantData))
  .unwrap()
  .then(() => {
    navigate("/verifyParticipantOtp", {
      state: { email: participantData.email }
    });
  })
  .catch((err) => {
  alert(err?.message || err);
  });

    event.target.reset();
  };

  return (
    <div className="auth-container">

      <div className="auth-image">
        <img src={participantImg} alt="Participant Registration" />
      </div>

      <div className="auth-form">
        <h2>Participant Registration</h2>
        <br />

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Enter Username"
            name="username"
            onChange={getData}
            required
          /><br />

          <input
            type="email"
            placeholder="Enter Email"
            name="email"       
            onChange={getData}
            required
          /><br />

          <input
            type="password"
            placeholder="Enter Password"
            name="password"
            onChange={getData}
            required
          /><br />

          <input
            type="text"
            placeholder="Enter 10-Digit Mobile Number"
            name="contact"
            onChange={getData}
            required
          /><br /><br />

          <input type="submit" value="Register" />
          <br />
          <input type="reset" value="Reset" />

        </form>

        <br />
        <Link to="/participantLogin" id="registrationLink">
          Already Registered? Login Here
        </Link>
      </div>

    </div>
  );
}

export default RegistrationParticipant;
