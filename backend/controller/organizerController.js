import uuid4 from "uuid4";
import bcrypt from "bcrypt";
import Organizer from "../model/organizerSchema.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import moment from "moment";
import { generateOTP } from "../utility/otpGenerator.js";
import { sendOTPEmail } from "../utility/mailer.js";
import tournamentSchema from "../model/tournamentSchema.js";
import Participant from "../model/participantSchema.js";

dotenv.config();
const ORGANIZER_SECRET_KEY = process.env.ORGANIZER_SECRET;

/* ================= ORGANIZER REGISTRATION ================= */
export const addOrganizerController = async (req, res) => {
  try {
    const {
      organizerName,
      email,
      password,
      contact,
      gameCategory,
      description,
      address
    } = req.body;

    if (!organizerName || !email || !password || !contact || !gameCategory || !description || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exists = await Organizer.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Email already registered" });
    }

    let organizerLogo = "";
    if (req.file?.path) {
      organizerLogo = req.file.path;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    await Organizer.create({
      organizerId: uuid4(),
      organizerName,
      email,
      password: hashedPassword,
      contact,
      gameCategory,
      description,
      address,
      organizerLogo,
      otp,
      otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
      emailVerified: false,
      accountStatus: "pending"
    });

    await sendOTPEmail(email, otp);

    return res.status(200).json({
      message: "Organizer registered. OTP sent to your email."
    });

  } catch (error) {
    console.error("Organizer Register Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/* ================= ORGANIZER LOGIN ================= */
export const loginOrganizerController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email & password required" });
    }

    const organizer = await Organizer.findOne({ email });

    if (!organizer) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, organizer.password);

    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!organizer.emailVerified) {
      return res.status(400).json({
        message: "Please verify your email before login"
      });
    }

    const token = jwt.sign(
      { email: organizer.email, role: "organizer" },
      ORGANIZER_SECRET_KEY,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      email: organizer.email,
      organizerToken: token,
      accountStatus: organizer.accountStatus,
      message:
        organizer.accountStatus === "approved"
          ? "Login successful"
          : "Login successful. Your account is under review."
    });

  } catch (error) {
    console.error("Organizer Login Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/* ================= OTP VERIFY ================= */
export const verifyOrganizerOTPController = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const organizer = await Organizer.findOne({ email });

    if (!organizer) {
      return res.status(400).json({ message: "Organizer not found" });
    }

    if (organizer.emailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    if (!organizer.otp || organizer.otp.toString() !== otp.toString()) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (!organizer.otpExpiry || organizer.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP Expired" });
    }

    organizer.emailVerified = true;
    organizer.otp = null;
    organizer.otpExpiry = null;

    await organizer.save();

    return res.status(200).json({
      message: "Email verified successfully"
    });

  } catch (error) {
    console.log("Verify OTP Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/* ================= VIEW TOURNAMENT LIST ================= */
export const organizerTournamentListController = async (req, res) => {
  try {
    if (!req.organizerPayload?.email) {
      return res.status(401).json({ message: "Unauthorized organizer" });
    }

    const tournaments = await tournamentSchema.find({
      organizerEmail: req.organizerPayload.email
    }).sort({ _id: -1 });

    const updated = tournaments.map((t) => {
      const eventDate = moment(t.tournamentDate, "YYYY-MM-DD").toDate();

      if (new Date() > eventDate) {
        t.eventStatus = "Completed";
        t.registrationOpen = false;
      }

      return t;
    });

    return res.status(200).json({
      email: req.organizerPayload.email,
      tournamentList: updated
    });

  } catch (error) {
    console.log("Error in organizerTournamentListController:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/* ================= CREATE TOURNAMENT ================= */
export const organizerCreateTournamentController = async (req, res) => {
  try {
    if (!req.organizerPayload?.email) {
      return res.status(401).json({ message: "Unauthorized organizer" });
    }

    const organizer = await Organizer.findOne({
      email: req.organizerPayload.email
    });

    if (!organizer) {
      return res.status(404).json({ message: "Organizer not found" });
    }

    if (!req.file?.path) {
      return res.status(400).json({ message: "Poster image required" });
    }

    const {
      tournamentName,
      gameTitle,
      gameCategory,
      eventType,
      description,
      venue,
      tournamentDate,
      reportingTime,
      maxParticipants,
      organizerContact
    } = req.body;

    if (!tournamentName || !gameTitle || !gameCategory || !eventType || !description || !venue || !tournamentDate || !reportingTime || !maxParticipants || !organizerContact) {
      return res.status(400).json({ message: "All tournament fields are required" });
    }

    /* 🔥 2-DAY VALIDATION */
    const eventDate = moment(tournamentDate, "YYYY-MM-DD").toDate();
    const today = new Date();

    const diffDays = (eventDate - today) / (1000 * 60 * 60 * 24);

    if (diffDays < 2) {
      return res.status(400).json({
        message: "Event must be at least 2 days in the future"
      });
    }

    const isApproved = organizer.accountStatus === "approved";

    const tournamentData = {
      tournamentId: uuid4(),
      organizerEmail: organizer.email,
      organizerName: organizer.organizerName,
      tournamentName,
      gameTitle,
      gameCategory,
      eventType,
      description,
      venue,
      tournamentDate,
      reportingTime,
      maxParticipants: Number(maxParticipants),
      organizerContact,
      tournamentPoster: req.file.path,
      registrationOpen: true,
      status: isApproved,
      registrations: []
    };

    await tournamentSchema.create(tournamentData);

    return res.status(200).json({
      message: isApproved
        ? "Tournament created successfully"
        : "Tournament created. Waiting for admin approval."
    });

  } catch (error) {
    console.log("Create Tournament Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/* ================= GET PARTICIPANTS ================= */
export const getTournamentParticipantsController = async (req, res) => {
  try {
    const { tournamentId } = req.params;

    const tournament = await tournamentSchema.findOne({ tournamentId });

    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    const eventDate = moment(tournament.tournamentDate, "YYYY-MM-DD").toDate();

    if (new Date() > eventDate) {
      return res.status(200).json({
        message: "Event completed",
        total: 0,
        participants: []
      });
    }

    const participants = tournament.registrations || [];

    // 🔥 FINAL FIX (using Participant model)
    const formattedParticipants = await Promise.all(
      participants.map(async (p) => {
        const user = await Participant.findOne({ email: p.participantEmail });

        return {
          name: user?.username || "N/A",
          email: p.participantEmail
        };
      })
    );

    return res.status(200).json({
      total: formattedParticipants.length,
      participants: formattedParticipants
    });

  } catch (error) {
    console.log("Participants Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const registerOrganizerController = addOrganizerController;



/* ================= GET ORGANIZER PROFILE ================= */
export const getOrganizerProfileController = async (req, res) => {
  try {
    if (!req.organizerPayload?.email) {
      return res.status(401).json({ message: "Unauthorized organizer" });
    }

    const organizer = await Organizer.findOne(
      { email: req.organizerPayload.email },
      { password: 0, otp: 0, otpExpiry: 0 } // sensitive fields hide karo
    );

    if (!organizer) {
      return res.status(404).json({ message: "Organizer not found" });
    }

    return res.status(200).json({ organizer });

  } catch (error) {
    console.error("Get Profile Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/* ================= UPDATE ORGANIZER PROFILE ================= */
export const updateOrganizerProfileController = async (req, res) => {
  try {
    if (!req.organizerPayload?.email) {
      return res.status(401).json({ message: "Unauthorized organizer" });
    }

    const { organizerName, contact, gameCategory, description, address } = req.body;

    const updateData = {};

    if (organizerName) updateData.organizerName = organizerName;
    if (contact) {
      if (!/^[0-9]{10}$/.test(contact)) {
        return res.status(400).json({ message: "Enter valid 10 digit contact number" });
      }
      updateData.contact = contact;
    }
    if (gameCategory) updateData.gameCategory = gameCategory;
    if (description) updateData.description = description;
    if (address) updateData.address = address;
    if (req.file?.path) updateData.organizerLogo = req.file.path;

    const updated = await Organizer.findOneAndUpdate(
      { email: req.organizerPayload.email },
      { $set: updateData },
      { new: true, select: "-password -otp -otpExpiry" }
    );

    if (!updated) {
      return res.status(404).json({ message: "Organizer not found" });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      organizer: updated
    });

  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};





