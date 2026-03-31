import mongoose from "mongoose";
import moment from "moment";

const registrationSchema = new mongoose.Schema(
  {
    registrationId: {
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

    registeredAt: {
      type: String,
      default: () => moment().format("DD/MM/YYYY hh:mm A")
    }
  },
  { _id: false }
);

const tournamentSchema = new mongoose.Schema({
  tournamentId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  organizerEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },

  // ✅ Added for better display / admin panel support
  organizerName: {
    type: String,
    default: "",
    trim: true
  },

  tournamentName: {
    type: String,
    required: true,
    trim: true
  },

  organizerContact: {
    type: String,
    required: true,
    trim: true
  },

  venue: {
    type: String,
    required: true,
    trim: true
  },

  gameTitle: {
    type: String,
    required: true,
    trim: true
  },

  eventType: {
    type: String,
    enum: ["sports", "esports", "technical", "cultural", "workshop", "fest"],
    default: "sports",
    trim: true
  },

  description: {
    type: String,
    default: "",
    trim: true
  },

  maxParticipants: {
    type: Number,
    required: true,
    min: [1, "Max participants must be at least 1"]
  },

  tournamentDate: {
    type: String,
    required: true,
    trim: true
  },

  reportingTime: {
    type: String,
    required: true,
    trim: true
  },

  gameCategory: {
    type: String,
    required: true,
    trim: true
  },

  tournamentPoster: {
    type: String,
    required: true,
    trim: true
  },

  registrations: {
    type: [registrationSchema],
    default: []
  },

  registrationOpen: {
    type: Boolean,
    default: true
  },

  eventStatus: {
    type: String,
    enum: ["Upcoming", "Ongoing", "Completed"],
    default: "Upcoming"
  },

  assignedAdminId: {
    type: String,
    default: "",
    trim: true
  },

  // 🔥 IMPORTANT:
  // false = hidden from participants until admin/approval logic allows visibility
  status: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: String,
    default: () => moment().format("DD/MM/YYYY")
  }
});

/* ================= VIRTUAL FIELD ================= */
tournamentSchema.virtual("remainingSlots").get(function () {
  return Math.max(0, this.maxParticipants - this.registrations.length);
});

/* ================= INCLUDE VIRTUALS ================= */
tournamentSchema.set("toJSON", { virtuals: true });
tournamentSchema.set("toObject", { virtuals: true });

export default mongoose.model("Tournament", tournamentSchema, "tournaments");