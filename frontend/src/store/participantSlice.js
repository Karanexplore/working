import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import jscookie from "js-cookie";
import { requestedParticipantURL } from "../utils.js";

const initialState = {
  loggedInEmail: jscookie.get("participantEmail") || "",
  tournamentArray: [],              // Explore Events
  registeredTournamentArray: [],    // My Registrations
  status: "",
  message: ""
};

/* ================= COMMON NO-CACHE HEADERS ================= */
const getNoCacheHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
  "Cache-Control": "no-cache, no-store, must-revalidate",
  Pragma: "no-cache",
  Expires: "0"
});

/* ================= PARTICIPANT REGISTRATION ================= */
export const participantRegistrationThunk = createAsyncThunk(
  "participant/register",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        requestedParticipantURL + "/addParticipant",
        data
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Registration failed"
      );
    }
  }
);

/* ================= PARTICIPANT LOGIN ================= */
export const participantLoginThunk = createAsyncThunk(
  "participant/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        requestedParticipantURL + "/loginParticipant",
        data
      );

      // ✅ safe token extraction
      const token =
        res.data.participantToken ||
        res.data.token ||
        res.data.jwtToken ||
        "";

      const email =
        res.data.email ||
        res.data.participantEmail ||
        data.email ||
        "";

      if (!token) {
        return rejectWithValue("Token not received from server");
      }

      // ✅ clean old role cookies
      jscookie.remove("organizerEmail");
      jscookie.remove("organizerTokenData");
      jscookie.remove("adminEmail");
      jscookie.remove("adminTokenData");

      jscookie.set("participantTokenData", token, { expires: 1 });
      jscookie.set("participantEmail", email, { expires: 1 });

      return {
        ...res.data,
        email,
        participantToken: token
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Login failed"
      );
    }
  }
);

/* ================= ALL AVAILABLE TOURNAMENTS ================= */
export const participantTournamentListThunk = createAsyncThunk(
  "participant/list",
  async (_, { rejectWithValue }) => {
    try {
      const token = jscookie.get("participantTokenData");

      if (!token) {
        return rejectWithValue("Participant token missing. Please login again.");
      }

      const res = await axios.get(
        requestedParticipantURL + `/availableTournaments?t=${Date.now()}`,
        {
          headers: getNoCacheHeaders(token)
        }
      );

      return res.data; // expected: { tournaments: [] }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch tournaments"
      );
    }
  }
);

/* ================= MY REGISTERED TOURNAMENTS ================= */
export const participantMyRegistrationsThunk = createAsyncThunk(
  "participant/myRegistrations",
  async (_, { rejectWithValue }) => {
    try {
      const token = jscookie.get("participantTokenData");

      if (!token) {
        return rejectWithValue("Participant token missing. Please login again.");
      }

      const res = await axios.get(
        requestedParticipantURL + `/myTournaments?t=${Date.now()}`,
        {
          headers: getNoCacheHeaders(token)
        }
      );

      return res.data; // expected: { tournaments: [] }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch registrations"
      );
    }
  }
);

/* ================= REGISTER TOURNAMENT ================= */
export const participantRegisterTournamentThunk = createAsyncThunk(
  "participant/registerTournament",
  async (tournamentId, { rejectWithValue, dispatch }) => {
    try {
      const token = jscookie.get("participantTokenData");

      if (!token) {
        return rejectWithValue("Participant token missing. Please login again.");
      }

      const res = await axios.post(
        requestedParticipantURL + "/registerTournament",
        { tournamentId: String(tournamentId) },
        {
          headers: getNoCacheHeaders(token)
        }
      );

      // ✅ after register, refresh both lists
      dispatch(participantTournamentListThunk());
      dispatch(participantMyRegistrationsThunk());

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Registration failed"
      );
    }
  }
);

/* ================= VERIFY OTP ================= */
export const verifyParticipantOtpThunk = createAsyncThunk(
  "participant/verifyOtp",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        requestedParticipantURL + "/verify-otp",
        data
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "OTP verification failed"
      );
    }
  }
);

const participantSlice = createSlice({
  name: "participant",
  initialState,
  reducers: {
    resetMessage: (state) => {
      state.message = "";
    },
    logoutParticipant: (state) => {
      state.loggedInEmail = "";
      state.tournamentArray = [];
      state.registeredTournamentArray = [];
      state.status = "";
      state.message = "";

      jscookie.remove("participantTokenData");
      jscookie.remove("participantEmail");
    }
  },
  extraReducers: (builder) => {
    builder

      /* ===== REGISTER ===== */
      .addCase(participantRegistrationThunk.fulfilled, (state, action) => {
        state.status = 200;
        state.message = action.payload.message || "Registration successful";
      })
      .addCase(participantRegistrationThunk.rejected, (state, action) => {
        state.status = 400;
        state.message = action.payload;
      })

      /* ===== LOGIN ===== */
      .addCase(participantLoginThunk.fulfilled, (state, action) => {
        state.loggedInEmail = action.payload.email || "";
        state.status = 200;
        state.message = action.payload.message || "Login Successful";
      })
      .addCase(participantLoginThunk.rejected, (state, action) => {
        state.status = 400;
        state.message = action.payload;
      })

      /* ===== AVAILABLE TOURNAMENT LIST ===== */
      .addCase(participantTournamentListThunk.fulfilled, (state, action) => {
        state.status = 200;
        state.tournamentArray = action.payload.tournaments || [];
      })
      .addCase(participantTournamentListThunk.rejected, (state, action) => {
        state.status = 403;
        state.message = action.payload;
        state.tournamentArray = [];
      })

      /* ===== MY REGISTERED TOURNAMENT LIST ===== */
      .addCase(participantMyRegistrationsThunk.fulfilled, (state, action) => {
        state.status = 200;
        state.registeredTournamentArray = action.payload.tournaments || [];
      })
      .addCase(participantMyRegistrationsThunk.rejected, (state, action) => {
        state.status = 403;
        state.message = action.payload;
        state.registeredTournamentArray = [];
      })

      /* ===== REGISTER TOURNAMENT ===== */
      .addCase(participantRegisterTournamentThunk.fulfilled, (state, action) => {
        state.status = 200;
        state.message =
          action.payload.message || "Tournament registered successfully";
      })
      .addCase(participantRegisterTournamentThunk.rejected, (state, action) => {
        state.status = 400;
        state.message = action.payload;
      })

      /* ===== VERIFY OTP ===== */
      .addCase(verifyParticipantOtpThunk.fulfilled, (state, action) => {
        state.status = 200;
        state.message = action.payload.message || "OTP verified successfully";
      })
      .addCase(verifyParticipantOtpThunk.rejected, (state, action) => {
        state.status = 400;
        state.message = action.payload;
      });
  }
});

export const { resetMessage, logoutParticipant } = participantSlice.actions;
export default participantSlice.reducer;