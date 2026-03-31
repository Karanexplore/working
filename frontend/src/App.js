import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import './App.css';
import Cookies from "js-cookie"; // ✅ ADD THIS

import Header from './component/Header.js';
import Navbar from './component/Navbar.js';
import Home from './component/Home.js';

import LoginParticipant from './component/LoginParticipant.js';
import LoginOrganizer from './component/LoginOrganizer.js';
import LoginAdmin from './component/LoginAdmin.js';

import RegistrationParticipant from './component/RegistrationParticipant.js';
import RegistrationOrganizer from './component/RegistrationOrganizer.js';

import ParticipantHome from './component/ParticipantHome.js';
import RegisterTournament from './component/RegisterTournament.js';
import ParticipantViewRegistration from './component/ParticipantViewRegistration.js';

import OrganizerHome from './component/OrganizerHome.js';
import OrganizerCreateTournament from './component/OrganizerCreateTournament.js';
import TournamentList from './component/TournamentList.js';

import AdminHome from './component/AdminHome.js';
import AdminOrganizerList from './component/AdminOrganizerList.js';
import AdminDashboard from "./component/AdminDashboard";

import VerifyParticipantOtp from './component/VerifyParticipantOtp.js';
import VerifyOrganizerOTP from './component/VerifyOrganizerOTP.js';

/* ================= PROTECTED ROUTE ================= */
const AdminRoute = ({ children }) => {
  const token = Cookies.get("adminTokenData"); // ✅ FIXED

  return token ? children : <Navigate to="/adminLogin" />;
};

function Layout() {
  const location = useLocation();

  const hideLayout =
    location.pathname === "/verifyParticipantOtp" ||
    location.pathname === "/verifyOrganizerOTP";

  return (
    <div id="container">
      {!hideLayout && <Header />}
      {!hideLayout && <Navbar />}

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/adminLogin" element={<LoginAdmin />} />
        <Route path="/participantLogin" element={<LoginParticipant />} />
        <Route path="/organizerLogin" element={<LoginOrganizer />} />

        <Route path="/participantRegistration" element={<RegistrationParticipant />} />
        <Route path="/organizerRegistration" element={<RegistrationOrganizer />} />

        <Route path="/verifyParticipantOtp" element={<VerifyParticipantOtp />} />
        <Route path="/verifyOrganizerOTP" element={<VerifyOrganizerOTP />} />

        <Route path="/participantHome" element={<ParticipantHome />} />
        <Route path="/registerTournament" element={<RegisterTournament />} />
        <Route path="/participantViewRegistration" element={<ParticipantViewRegistration />} />

        <Route path="/organizerHome" element={<OrganizerHome />} />
        <Route path="/createTournament" element={<OrganizerCreateTournament />} />
        <Route path="/organizerTournamentList" element={<TournamentList />} />

        {/* 🔒 ADMIN PROTECTED */}
        <Route path="/adminHome" element={
          <AdminRoute>
            <AdminHome />
          </AdminRoute>
        } />

        <Route path="/adminOrganizerList" element={
          <AdminRoute>
            <AdminOrganizerList />
          </AdminRoute>
        } />

        <Route path="/adminDashboard" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />

      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;