import Participant from "../model/participantSchema.js";
import Tournament from "../model/tournamentSchema.js";

import uuid4 from "uuid4";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import { generateOTP } from "../utility/otpGenerator.js";
import { sendOTPEmail } from "../utility/mailer.js";

dotenv.config();

const PARTICIPANT_SECRET_KEY = process.env.PARTICIPANT_SECRET;

/* ================= PARTICIPANT REGISTRATION ================= */
export const addParticipantController = async (req, res) => {
  try {
    const { username, email, password, contact } = req.body;

    if (!username || !email || !password || !contact) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const exists = await Participant.findOne({ email });

    if (exists) {
      return res.status(409).json({
        message: "Email already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    await Participant.create({
      participantId: uuid4(),
      username,
      email,
      password: hashedPassword,
      contact,
      otp,
      otpExpiry: Date.now() + 10 * 60 * 1000,
      emailVerified: false
    });

    try {
      await sendOTPEmail(email, otp);
    } catch (error) {
      await Participant.deleteOne({ email });

      return res.status(500).json({
        message: "Failed to send OTP email. Try again."
      });
    }

    return res.status(200).json({
      message: "Participant registered. OTP sent to your email."
    });
  } catch (error) {
    console.error("❌ Participant Register Error:", error.message);

    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

/* ================= PARTICIPANT LOGIN ================= */
export const loginParticipantController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email or password missing"
      });
    }

    const participantObj = await Participant.findOne({ email });

    if (!participantObj) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(password, participantObj.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    if (!participantObj.emailVerified) {
      return res.status(400).json({
        message: "Please verify your email before login"
      });
    }

    // ✅ VERY IMPORTANT
    if (!PARTICIPANT_SECRET_KEY) {
      console.error("❌ PARTICIPANT_SECRET missing in .env");

      return res.status(500).json({
        message: "Server configuration error"
      });
    }

    const token = jwt.sign(
      {
        email: participantObj.email,
        role: "participant",
        participantId: participantObj.participantId
      },
      PARTICIPANT_SECRET_KEY,
      { expiresIn: "365d" }
    );

    return res.status(200).json({
      message: "Login successful",
      email: participantObj.email,
      participantToken: token
    });
  } catch (error) {
    console.error("❌ Error in loginParticipantController:", error.message);

    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

/* ================= VERIFY PARTICIPANT OTP ================= */
export const verifyParticipantOTPController = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required"
      });
    }

    const participant = await Participant.findOne({ email });

    if (!participant) {
      return res.status(400).json({
        message: "Participant not found"
      });
    }

    if (participant.emailVerified) {
      return res.status(400).json({
        message: "Email already verified"
      });
    }

    if (!participant.otp || participant.otp.toString() !== otp.toString()) {
      return res.status(400).json({
        message: "Invalid OTP"
      });
    }

    if (!participant.otpExpiry || participant.otpExpiry < Date.now()) {
      return res.status(400).json({
        message: "OTP Expired"
      });
    }

    participant.emailVerified = true;
    participant.otp = undefined;
    participant.otpExpiry = undefined;

    await participant.save();

    return res.status(200).json({
      message: "Email verified successfully"
    });
  } catch (error) {
    console.error("❌ Verify Participant OTP Error:", error.message);

    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

/* ================= REGISTER FOR TOURNAMENT ================= */
export const registerTournamentController = async (req, res) => {
  try {
    const { tournamentId } = req.body;
    const participantEmail = req.participantPayload?.email;

    if (!participantEmail) {
      return res.status(401).json({
        message: "Unauthorized participant"
      });
    }

    if (!tournamentId) {
      return res.status(400).json({
        message: "Tournament ID missing"
      });
    }

    const tournament = await Tournament.findOne({ tournamentId });

    if (!tournament) {
      return res.status(404).json({
        message: "Tournament not found"
      });
    }

    if (!tournament.registrationOpen) {
      return res.status(400).json({
        message: "Registration closed"
      });
    }

    const alreadyRegistered = tournament.registrations?.some(
      (r) => r.participantEmail === participantEmail
    );

    if (alreadyRegistered) {
      return res.status(400).json({
        message: "Already registered"
      });
    }

    if (tournament.registrations.length >= tournament.maxParticipants) {
      tournament.registrationOpen = false;
      await tournament.save();

      return res.status(400).json({
        message: "Slots full"
      });
    }

    tournament.registrations.push({
      registrationId: uuid4(),
      participantEmail
    });

    if (tournament.registrations.length >= tournament.maxParticipants) {
      tournament.registrationOpen = false;
    }

    await tournament.save();

    return res.status(200).json({
      message: "Tournament registered successfully",
      tournamentId
    });
  } catch (error) {
    console.error("❌ Error in registerTournamentController:", error.message);

    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

/* ================= PARTICIPANT MY REGISTERED TOURNAMENTS ================= */
export const participantRegistrationListController = async (req, res) => {
  try {
    const email = req.participantPayload?.email;

    if (!email) {
      return res.status(401).json({
        message: "Unauthorized participant"
      });
    }

    const tournaments = await Tournament.find({
      "registrations.participantEmail": email,
      status: true
    })
      .sort({ _id: -1 })
      .lean();

    return res.status(200).json({
      tournaments
    });
  } catch (error) {
    console.error(
      "❌ Error in participantRegistrationListController:",
      error.message
    );

    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

/* ================= AVAILABLE TOURNAMENT LIST ================= */
export const participantTournamentListController = async (req, res) => {
  try {
    const participantEmail = req.participantPayload?.email;

    if (!participantEmail) {
      return res.status(401).json({
        message: "Unauthorized participant"
      });
    }

    const tournaments = await Tournament.find({
      registrationOpen: true,
      status: true
    })
      .sort({ _id: -1 })
      .lean();

    return res.status(200).json({
      tournaments
    });
  } catch (error) {
    console.error(
      "❌ Error in participantTournamentListController:",
      error.message
    );

    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};



/* ================= GET PARTICIPANT PROFILE ================= */
export const getParticipantProfileController = async (req, res) => {
  try {
    const email = req.participantPayload?.email;

    if (!email) {
      return res.status(401).json({ message: "Unauthorized participant" });
    }

    const participant = await Participant.findOne(
      { email },
      { password: 0, otp: 0, otpExpiry: 0 }
    );

    if (!participant) {
      return res.status(404).json({ message: "Participant not found" });
    }

    return res.status(200).json({ participant });

  } catch (error) {
    console.error("❌ Get Profile Error:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/* ================= UPDATE PARTICIPANT PROFILE ================= */
export const updateParticipantProfileController = async (req, res) => {
  try {
    const email = req.participantPayload?.email;

    if (!email) {
      return res.status(401).json({ message: "Unauthorized participant" });
    }

    const { username, contact } = req.body;

    const updateData = {};

    if (username) {
      if (username.trim().length < 2) {
        return res.status(400).json({ message: "Username too short" });
      }
      updateData.username = username.trim();
    }

    if (contact) {
      if (!/^[0-9]{10}$/.test(contact)) {
        return res.status(400).json({ message: "Enter valid 10 digit contact number" });
      }
      updateData.contact = contact;
    }

    const updated = await Participant.findOneAndUpdate(
      { email },
      { $set: updateData },
      { new: true, select: "-password -otp -otpExpiry" }
    );

    if (!updated) {
      return res.status(404).json({ message: "Participant not found" });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      participant: updated
    });

  } catch (error) {
    console.error("❌ Update Profile Error:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};