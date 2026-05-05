import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate
} from "react-router-dom";
import { useDispatch } from "react-redux";
import "./App.css";
import Cookies from "js-cookie";

/* ================= COMMON COMPONENTS ================= */
import Header from "./components/common/Header";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";

/* ================= PUBLIC PAGES ================= */
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";

/* ================= AUTH PAGES ================= */
import LoginParticipant from "./pages/participant/LoginParticipant";
import LoginOrganizer from "./pages/organizer/LoginOrganizer";
import LoginAdmin from "./pages/admin/LoginAdmin";

import RegistrationParticipant from "./pages/participant/RegistrationParticipant";
import RegistrationOrganizer from "./pages/organizer/RegistrationOrganizer";

import VerifyParticipantOtp from "./pages/participant/VerifyParticipantOtp";
import VerifyOrganizerOTP from "./pages/organizer/VerifyOrganizerOTP";

/* ================= PARTICIPANT PAGES ================= */
import ParticipantHome from "./pages/participant/ParticipantHome";
import RegisterTournament from "./pages/participant/RegisterTournament";
import ParticipantViewRegistration from "./pages/participant/ParticipantViewRegistration";
import ParticipantEventDetails from "./pages/participant/ParticipantEventDetails";
import MyTickets from "./pages/participant/MyTickets";
import ParticipantProfile from "./pages/participant/ParticipantProfile";

/* ================= ORGANIZER PAGES ================= */
import OrganizerHome from "./pages/organizer/OrganizerHome";
import OrganizerCreateTournament from "./pages/organizer/OrganizerCreateTournament";
import TournamentList from "./pages/organizer/TournamentList";
import OrganizerProfile from "./pages/organizer/OrganizerProfile.js";
/* ================= ADMIN PAGES ================= */
import AdminHome from "./pages/admin/AdminHome";
import AdminOrganizerList from "./pages/admin/AdminOrganizerList";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProfile from "./pages/admin/AdminProfile.js";
import { setNavShow } from "./store/commonSlice.js";

/* ================= PROTECTED ROUTES ================= */

const AdminRoute = ({ children }) => {
  const token = Cookies.get("adminTokenData");
  return token ? children : <Navigate to="/adminLogin" />;
};

const ParticipantRoute = ({ children }) => {
  const token = Cookies.get("participantTokenData");
  return token ? children : <Navigate to="/participantLogin" />;
};

const OrganizerRoute = ({ children }) => {
  const token = Cookies.get("organizerTokenData");
  return token ? children : <Navigate to="/organizerLogin" />;
};

function Layout() {
  const location = useLocation();
  const dispatch = useDispatch();

  /* ================= HIDE HEADER/NAV ON OTP PAGES ================= */
  const hideLayout =
    location.pathname === "/verifyParticipantOtp" ||
    location.pathname === "/verifyOrganizerOTP";

  /* ================= AUTO RESTORE NAVBAR ================= */
  useEffect(() => {
    const participantToken = Cookies.get("participantTokenData");
    const organizerToken = Cookies.get("organizerTokenData");
    const adminToken = Cookies.get("adminTokenData");

    if (participantToken) {
      dispatch(setNavShow("participant"));
    } else if (organizerToken) {
      dispatch(setNavShow("organizer"));
    } else if (adminToken) {
      dispatch(setNavShow("admin"));
    } else {
      dispatch(setNavShow("home"));
    }
  }, [dispatch, location.pathname]);

  return (
    <div id="container">
      {!hideLayout && <Header />}
      {!hideLayout && <Navbar />}

      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* ================= AUTH ================= */}
        <Route path="/adminLogin" element={<LoginAdmin />} />
        <Route path="/participantLogin" element={<LoginParticipant />} />
        <Route path="/organizerLogin" element={<LoginOrganizer />} />

        <Route path="/participantRegistration" element={<RegistrationParticipant />} />
        <Route path="/organizerRegistration" element={<RegistrationOrganizer />} />

        <Route path="/verifyParticipantOtp" element={<VerifyParticipantOtp />} />
        <Route path="/verifyOrganizerOTP" element={<VerifyOrganizerOTP />} />

        {/* ================= PARTICIPANT ================= */}
        <Route
          path="/participantHome"
          element={<ParticipantRoute><ParticipantHome /></ParticipantRoute>}
        />

        <Route
          path="/participant/event/:id"
          element={<ParticipantRoute><ParticipantEventDetails /></ParticipantRoute>}
        />

        <Route
          path="/registerTournament"
          element={<ParticipantRoute><RegisterTournament /></ParticipantRoute>}
        />

        <Route
          path="/participantViewRegistration"
          element={<ParticipantRoute><ParticipantViewRegistration /></ParticipantRoute>}
        />

        <Route
          path="/myTickets"
          element={<ParticipantRoute><MyTickets /></ParticipantRoute>}
        />

        <Route
          path="/participantProfile"
          element={<ParticipantRoute><ParticipantProfile /></ParticipantRoute>}
        />
        {/* ================= ORGANIZER ================= */}
        <Route
          path="/organizerHome"
          element={<OrganizerRoute><OrganizerHome /></OrganizerRoute>}
        />

        <Route
          path="/createTournament"
          element={<OrganizerRoute><OrganizerCreateTournament /></OrganizerRoute>}
        />

        <Route
          path="/organizerTournamentList"
          element={<OrganizerRoute><TournamentList /></OrganizerRoute>}
        />

        <Route path="/organizerProfile" element={<OrganizerRoute><OrganizerProfile /></OrganizerRoute>} />

        {/* ================= ADMIN ================= */}
        <Route
          path="/adminHome"
          element={<AdminRoute><AdminHome /></AdminRoute>}
        />

        <Route
          path="/adminOrganizerList"
          element={<AdminRoute><AdminOrganizerList /></AdminRoute>}
        />

        <Route
          path="/adminDashboard"
          element={<AdminRoute><AdminDashboard /></AdminRoute>}
        />

        <Route
          path="/adminProfile"
          element={<AdminRoute><AdminProfile /></AdminRoute>}
        />

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* Footer only on home */}
      {!hideLayout && location.pathname === "/" && <Footer />}
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


