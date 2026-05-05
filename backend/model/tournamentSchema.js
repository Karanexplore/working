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

  organizerName: {
    type: String,
    default: "",
    trim: true
  },

  tournamentName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
    match: [/^[a-zA-Z0-9\s]+$/, "Invalid tournament name"]
  },

  organizerContact: {
    type: String,
    required: true,
    match: [/^[0-9]{10}$/, "Enter valid 10 digit number"]
  },

  venue: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    match: [/^[a-zA-Z0-9\s,.-]+$/, "Invalid venue"]
  },

  // 🔥 FIXED: enum hata diya — koi bhi game/sport allow hoga
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
    required: true,
    minlength: 10,
    maxlength: 300,
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
    match: [/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"]
  },

  reportingTime: {
    type: String,
    required: true,
    trim: true
  },

  // 🔥 FIXED: enum hata diya — koi bhi category allow hogi
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

/* ================= AUTO STATUS UPDATE ================= */
tournamentSchema.methods.updateEventStatus = function () {
  const today = new Date();
  const eventDate = moment(this.tournamentDate, "YYYY-MM-DD").toDate();

  if (today > eventDate) {
    this.eventStatus = "Completed";
    this.registrationOpen = false;
  }
};