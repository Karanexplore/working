import mongoose from "mongoose";
import moment from "moment";

const participantSchema = new mongoose.Schema(
  {
    participantId: {
      type: String,
      required: true
    },

    username: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    contact: {
      type: String,
      required: true
    },

    status: {
      type: Boolean,
      default: true
    },

    emailVerified: {
      type: Boolean,
      default: false
    },

    otp: {
      type: String
    },

    otpExpiry: {
      type: Date
    },

    registeredDate: {
      type: String,
      default: () => moment().format("DD/MM/YYYY")
    },

    registeredTime: {
      type: String,
      default: () => moment().format("hh:mm:ss A")
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Participant", participantSchema);
