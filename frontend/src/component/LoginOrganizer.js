import React, { useEffect, useState } from 'react';
import organizerLoginImg from '../images/organizerLogin.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { resetMessage } from '../store/organizerSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import { organizerLoginThunk } from '../store/organizerSlice.js';

function LoginOrganizer() {

    const organizerObj = useSelector(state => state.organizer);
    const [organizerData, setOrganizerData] = useState({});
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(resetMessage(''));
    }, [dispatch]);

    let message;
    const urlSearch = new URLSearchParams(window.location.search);
    if (urlSearch.size === 1)
        message = urlSearch.get("message");

    const getData = (event) => {
        const { name, value } = event.target;
        setOrganizerData({
            ...organizerData,
            [name]: value
        });
    };

     const handleSubmit = async (event) => {
  event.preventDefault();

  const result = await dispatch(organizerLoginThunk(organizerData));

  if (organizerLoginThunk.fulfilled.match(result)) {
    navigate('/organizerHome');
  } else {
    alert(result.payload);
  }

  event.target.reset();
};

    return (
      <div className="auth-container">

    <div className="auth-image">
      <img src={organizerLoginImg} alt="Organizer Login" />
    </div>

    <div className="auth-form">
      <h2>Organizer Login</h2>
      <br />
      {message}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter Email"
          name="email"
          onChange={getData}
        /><br />

        <input
          type="password"
          placeholder="Enter Password"
          name="password"
          onChange={getData}
        /><br /><br />

        <input type="submit" value="Login" /><br />
        <input type="reset" value="Reset" />
      </form>

      <br />
      <Link to="/organizerRegistration" id="registrationLink">
        Yet Not Registered? Register Here
      </Link>
    </div>

  </div>
);
 
}

export default LoginOrganizer;
