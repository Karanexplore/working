import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import jscookie from "js-cookie";
import { requestedOrganizerURL } from "../utils.js";

const initialState = {
  loggedInEmail: "",
  organizerObj: {},
  organizerArray: [],
  tournamentArray: [],
  status: "",
  message: ""
};

/* ================= ORGANIZER REGISTRATION ================= */
export const organizerRegistrationThunk = createAsyncThunk(
  "organizer/register",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        requestedOrganizerURL + "/register",
        formData
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Registration Failed"
      );
    }
  }
);

/* ================= ORGANIZER LOGIN ================= */
export const organizerLoginThunk = createAsyncThunk(
  "organizer/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        requestedOrganizerURL + "/login",
        data
      );

      jscookie.set("organizerTokenData", res.data.organizerToken);
      jscookie.set("organizerEmail", res.data.email);

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Login Failed"
      );
    }
  }
);

/* ================= TOURNAMENT LIST ================= */
export const organizerTournamentListThunk = createAsyncThunk(
  "organizer/tournamentList",
  async (_, { rejectWithValue }) => {
    try {
      const token = jscookie.get("organizerTokenData");

      const result = await axios.get(
        requestedOrganizerURL + "/tournaments",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      return result.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch tournaments");
    }
  }
);

/* ================= CREATE TOURNAMENT ================= */
export const organizerCreateTournamentThunk = createAsyncThunk(
  "organizer/createTournament",
  async (tournamentData, { rejectWithValue }) => {
    try {
      const token = jscookie.get("organizerTokenData");

      const result = await axios.post(
        requestedOrganizerURL + "/createTournament",
        tournamentData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      return result.data;
    } catch (error) {
      return rejectWithValue("Tournament creation failed");
    }
  }
);

/* ================= VERIFY OTP ================= */
export const verifyOrganizerOTPThunk = createAsyncThunk(
  "organizer/verifyOTP",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        requestedOrganizerURL + "/verify-otp",
        data
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "OTP Verification Failed"
      );
    }
  }
);

/* ================= ADMIN FEATURES ================= */

// GET ALL ORGANIZERS
export const getAllOrganizersThunk = createAsyncThunk(
  "organizer/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(requestedOrganizerURL + "/all");
      return res.data;
    } catch (err) {
      return rejectWithValue("Failed to fetch organizers");
    }
  }
);

// APPROVE ORGANIZER
export const approveOrganizerThunk = createAsyncThunk(
  "organizer/approve",
  async (email, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        requestedOrganizerURL + `/approve/${email}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue("Approval failed");
    }
  }
);

// REJECT ORGANIZER
export const rejectOrganizerThunk = createAsyncThunk(
  "organizer/reject",
  async (email, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        requestedOrganizerURL + `/reject/${email}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue("Rejection failed");
    }
  }
);

const organizerSlice = createSlice({
  name: "organizerSlice",
  initialState,
  reducers: {
    resetMessage: (state) => {
      state.message = "";
    }
  },
  extraReducers: (builder) => {

    /* ===== REGISTRATION ===== */
    builder
      .addCase(organizerRegistrationThunk.fulfilled, (state, action) => {
        state.status = 200;
        state.message = action.payload?.message;
      })
      .addCase(organizerRegistrationThunk.rejected, (state, action) => {
        state.status = 400;
        state.message = action.payload;
      });

    /* ===== VERIFY OTP ===== */
    builder
      .addCase(verifyOrganizerOTPThunk.fulfilled, (state, action) => {
        state.status = 200;
        state.message = action.payload.message;
      })
      .addCase(verifyOrganizerOTPThunk.rejected, (state, action) => {
        state.status = 400;
        state.message = action.payload;
      });

    /* ===== LOGIN ===== */
    builder
      .addCase(organizerLoginThunk.fulfilled, (state, action) => {
        state.status = 200;
        state.loggedInEmail = action.payload.email;
        state.message = "Login Successful";
      })
      .addCase(organizerLoginThunk.rejected, (state, action) => {
        state.status = 400;
        state.message = action.payload;
      });

    /* ===== TOURNAMENT LIST ===== */
    builder
      .addCase(organizerTournamentListThunk.fulfilled, (state, action) => {
        state.status = 200;
        state.tournamentArray = action.payload.tournamentList;
      })
      .addCase(organizerTournamentListThunk.rejected, (state, action) => {
        state.status = 400;
        state.message = action.payload;
      });

    /* ===== CREATE TOURNAMENT ===== */
    builder
      .addCase(organizerCreateTournamentThunk.fulfilled, (state, action) => {
        state.status = 200;
        state.message = action.payload?.message;
      })
      .addCase(organizerCreateTournamentThunk.rejected, (state, action) => {
        state.status = 400;
        state.message = action.payload;
      });

    /* ===== ADMIN ACTIONS ===== */
    builder
      .addCase(getAllOrganizersThunk.fulfilled, (state, action) => {
        state.organizerArray = action.payload.organizers;
      })
      .addCase(approveOrganizerThunk.fulfilled, (state, action) => {
        state.message = action.payload.message;
      })
      .addCase(rejectOrganizerThunk.fulfilled, (state, action) => {
        state.message = action.payload.message;
      });
  }
});

export const { resetMessage } = organizerSlice.actions;
export default organizerSlice.reducer;