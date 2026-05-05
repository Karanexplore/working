import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import jscookie from "js-cookie";

const BASE_URL = process.env.REACT_APP_REQUESTED_TICKET_URL;

/* ================= COMMON HEADERS ================= */
const getHeaders = () => {
  const token = jscookie.get("participantTokenData");
  return {
    Authorization: `Bearer ${token}`,
    "Cache-Control": "no-cache, no-store, must-revalidate"
  };
};

/* ================= GET TICKET PRICE ================= */
export const getTicketPriceThunk = createAsyncThunk(
  "ticket/getPrice",
  async (tournamentId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/price/${tournamentId}`, {
        headers: getHeaders()
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch ticket price"
      );
    }
  }
);

/* ================= BOOK TICKET ================= */
export const bookTicketThunk = createAsyncThunk(
  "ticket/book",
  async ({ tournamentId, seatCount }, { rejectWithValue, dispatch }) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/book`,
        { tournamentId, seatCount },
        { headers: getHeaders() }
      );
      // Refresh my tickets after booking
      dispatch(getMyTicketsThunk());
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Ticket booking failed"
      );
    }
  }
);

/* ================= GET MY TICKETS ================= */
export const getMyTicketsThunk = createAsyncThunk(
  "ticket/myTickets",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/myTickets?t=${Date.now()}`, {
        headers: getHeaders()
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch tickets"
      );
    }
  }
);

/* ================= CANCEL TICKET ================= */
export const cancelTicketThunk = createAsyncThunk(
  "ticket/cancel",
  async (ticketId, { rejectWithValue, dispatch }) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/cancel/${ticketId}`,
        {},
        { headers: getHeaders() }
      );
      // Refresh list after cancel
      dispatch(getMyTicketsThunk());
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Cancellation failed"
      );
    }
  }
);

/* ================= SLICE ================= */
const initialState = {
  ticketArray: [],
  priceInfo: null,
  status: "",
  message: "",
  loading: false,
  bookingSuccess: false
};

const ticketSlice = createSlice({
  name: "ticket",
  initialState,
  reducers: {
    resetTicketMessage: (state) => {
      state.message = "";
      state.status = "";
    },
    resetBookingSuccess: (state) => {
      state.bookingSuccess = false;
    },
    clearPriceInfo: (state) => {
      state.priceInfo = null;
    }
  },
  extraReducers: (builder) => {
    builder

      /* ===== GET PRICE ===== */
      .addCase(getTicketPriceThunk.pending, (state) => {
        state.loading = true;
        state.priceInfo = null;
      })
      .addCase(getTicketPriceThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.priceInfo = action.payload;
      })
      .addCase(getTicketPriceThunk.rejected, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })

      /* ===== BOOK ===== */
      .addCase(bookTicketThunk.pending, (state) => {
        state.loading = true;
        state.bookingSuccess = false;
        state.message = "";
      })
      .addCase(bookTicketThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 200;
        state.message = action.payload.message || "Tickets booked successfully!";
        state.bookingSuccess = true;
      })
      .addCase(bookTicketThunk.rejected, (state, action) => {
        state.loading = false;
        state.status = 400;
        state.message = action.payload;
        state.bookingSuccess = false;
      })

      /* ===== MY TICKETS ===== */
      .addCase(getMyTicketsThunk.fulfilled, (state, action) => {
        state.ticketArray = action.payload.tickets || [];
      })
      .addCase(getMyTicketsThunk.rejected, (state, action) => {
        state.message = action.payload;
        state.ticketArray = [];
      })

      /* ===== CANCEL ===== */
      .addCase(cancelTicketThunk.fulfilled, (state, action) => {
        state.status = 200;
        state.message = action.payload.message || "Ticket cancelled";
      })
      .addCase(cancelTicketThunk.rejected, (state, action) => {
        state.status = 400;
        state.message = action.payload;
      });
  }
});

export const {
  resetTicketMessage,
  resetBookingSuccess,
  clearPriceInfo
} = ticketSlice.actions;

export default ticketSlice.reducer;