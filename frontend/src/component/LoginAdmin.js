import React, { useState } from "react";
import adminLoginImg from "../images/adminLogin.jpg";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { adminLoginThunk } from "../store/adminSlice.js";

function LoginAdmin() {
  const [adminData, setAdminData] = useState({
    email: "",
    password: ""
  });

  const adminObj = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getData = (event) => {
    const { name, value } = event.target;
    setAdminData({
      ...adminData,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!adminData.email || !adminData.password) {
      alert("Please enter email and password");
      return;
    }

    const result = await dispatch(adminLoginThunk(adminData));

    if (adminLoginThunk.fulfilled.match(result)) {
      navigate("/adminDashboard");
    } else {
      alert(result.payload || "Login Failed");
    }
  };

  const handleReset = () => {
    setAdminData({
      email: "",
      password: ""
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-image">
        <img src={adminLoginImg} alt="Admin Login" />
      </div>

      <div className="auth-form">
        <h2>Admin Login</h2>
        <br />

        {adminObj.message && (
          <p
            style={{
              color: adminObj.status === 200 ? "green" : "red",
              fontWeight: "bold"
            }}
          >
            {adminObj.message}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter Email"
            name="email"
            value={adminData.email}
            onChange={getData}
            required
          />
          <br />

          <input
            type="password"
            placeholder="Enter Password"
            name="password"
            value={adminData.password}
            onChange={getData}
            required
          />
          <br />
          <br />

          <input type="submit" value="Login" />
          <br />
          <input type="button" value="Reset" onClick={handleReset} />
        </form>
      </div>
    </div>
  );
}

export default LoginAdmin;