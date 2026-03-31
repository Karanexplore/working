import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { requestedAdminURL } from "../utils.js";
import jscookie from "js-cookie";
import axios from "axios";

const initialState = {
  loggedInEmail: jscookie.get("adminEmail") || "",
  organizerArray: [],
  tournamentArray: [],
  status: "",
  message: ""
};

/* ================= COMMON HEADER ================= */
const getAdminHeaders = () => {
  const token = jscookie.get("adminTokenData");

  if (!token) {
    throw new Error("Admin token missing");
  }

  return {
    Authorization: `Bearer ${token}`,
    "Cache-Control": "no-cache"
  };
};

/* ================= ADMIN LOGIN ================= */
export const adminLoginThunk = createAsyncThunk(
  "admin/login",
  async (adminObj, { rejectWithValue }) => {
    try {
      const result = await axios.post(
        requestedAdminURL + "/login",
        adminObj
      );

      const token = result.data.adminToken;
      const email = result.data.email;

      if (!token) {
        return rejectWithValue("Token not received");
      }

      // साफ previous roles
      jscookie.remove("participantTokenData");
      jscookie.remove("organizerTokenData");

      jscookie.set("adminTokenData", token, { expires: 1 });
      jscookie.set("adminEmail", email, { expires: 1 });

      return result.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login Failed"
      );
    }
  }
);

/* ================= GET ORGANIZERS ================= */
export const adminViewOrganizerListThunk = createAsyncThunk(
  "admin/getOrganizers",
  async (_, { rejectWithValue }) => {
    try {
      const result = await axios.get(
        requestedAdminURL + "/organizers",
        {
          headers: getAdminHeaders()
        }
      );

      return result.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch organizers"
      );
    }
  }
);

/* ================= GET ALL TOURNAMENTS ================= */
export const adminTournamentListThunk = createAsyncThunk(
  "admin/getTournaments",
  async (_, { rejectWithValue }) => {
    try {
      const result = await axios.get(
        requestedAdminURL + "/tournaments",
        {
          headers: getAdminHeaders()
        }
      );

      return result.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch tournaments"
      );
    }
  }
);

/* ================= APPROVE ORGANIZER ================= */
export const adminVerifyOrganizerThunk = createAsyncThunk(
  "admin/approveOrganizer",
  async (email, { rejectWithValue }) => {
    try {
      const result = await axios.put(
        requestedAdminURL + `/organizer/approve/${email}`, // ✅ FIXED ROUTE
        {},
        {
          headers: getAdminHeaders()
        }
      );

      return result.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Approval failed"
      );
    }
  }
);

/* ================= SLICE ================= */
const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    logoutAdmin: (state) => {
      state.loggedInEmail = "";
      state.organizerArray = [];
      state.tournamentArray = [];
      state.status = "";
      state.message = "";

      jscookie.remove("adminTokenData");
      jscookie.remove("adminEmail");
    }
  },
  extraReducers: (builder) => {

    builder

      /* LOGIN */
      .addCase(adminLoginThunk.fulfilled, (state, action) => {
        state.loggedInEmail = action.payload.email;
        state.status = 200;
        state.message = "Login Successful";
      })
      .addCase(adminLoginThunk.rejected, (state, action) => {
        state.status = 400;
        state.message = action.payload;
      })

      /* ORGANIZERS */
      .addCase(adminViewOrganizerListThunk.fulfilled, (state, action) => {
        state.organizerArray = action.payload.organizers || [];
      })
      .addCase(adminViewOrganizerListThunk.rejected, (state, action) => {
        state.status = 401;
        state.message = action.payload;
        state.organizerArray = [];
      })

      /* TOURNAMENTS */
      .addCase(adminTournamentListThunk.fulfilled, (state, action) => {
        state.tournamentArray = action.payload.tournaments || [];
      })
      .addCase(adminTournamentListThunk.rejected, (state, action) => {
        state.status = 401;
        state.message = action.payload;
        state.tournamentArray = [];
      })

      /* APPROVE */
      .addCase(adminVerifyOrganizerThunk.fulfilled, (state, action) => {
        state.status = 200;
        state.message = action.payload.message;
      })
      .addCase(adminVerifyOrganizerThunk.rejected, (state, action) => {
        state.status = 400;
        state.message = action.payload;
      });
  }
});

export const { logoutAdmin } = adminSlice.actions;
export default adminSlice.reducer;