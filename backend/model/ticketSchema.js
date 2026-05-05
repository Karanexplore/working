import mongoose from "mongoose";
import moment from "moment";

const ticketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    tournamentId: {
      type: String,
      required: true,
      trim: true
    },

    tournamentName: {
      type: String,
      required: true,
      trim: true
    },

    participantEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },

    seatCount: {
      type: Number,
      required: true,
      min: [1, "Must book at least 1 seat"],
      max: [10, "Cannot book more than 10 seats at once"]
    },

    pricePerSeat: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"]
    },

    totalPrice: {
      type: Number,
      required: true
    },

    venue: {
      type: String,
      default: "",
      trim: true
    },

    eventDate: {
      type: String,
      default: ""
    },

    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed"
    },

    bookedAt: {
      type: String,
      default: () => moment().format("DD/MM/YYYY hh:mm A")
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Ticket", ticketSchema, "tickets");