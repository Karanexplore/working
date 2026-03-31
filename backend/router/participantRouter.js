import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import {
  addParticipantController,
  loginParticipantController,
  registerTournamentController,
  participantRegistrationListController,
  participantTournamentListController,
  verifyParticipantOTPController
} from "../controller/participantController.js";

dotenv.config();

const participantRouter = express.Router();

/* ================= SECRET KEY ================= */
const PARTICIPANT_SECRET_KEY = process.env.PARTICIPANT_SECRET;

/* ================= JWT AUTH MIDDLEWARE ================= */
const authenticateParticipantJWT = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ✅ Header check
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authorization token missing"
      });
    }

    const token = authHeader.split(" ")[1];

    // ✅ Token empty check
    if (!token || token === "undefined" || token === "null") {
      return res.status(401).json({
        message: "Invalid token provided"
      });
    }

    // ✅ Secret missing check
    if (!PARTICIPANT_SECRET_KEY) {
      console.error("❌ PARTICIPANT_SECRET not found in .env");
      return res.status(500).json({
        message: "Server configuration error"
      });
    }

    jwt.verify(token, PARTICIPANT_SECRET_KEY, (err, payload) => {
      if (err) {
        console.error("❌ JWT Verify Error:", err.message);
        return res.status(403).json({
          message: "Invalid or expired token"
        });
      }

      req.participantPayload = payload;
      next();
    });
  } catch (err) {
    console.error("🔥 JWT Middleware Error:", err.message);
    return res.status(500).json({
      message: "Server error"
    });
  }
};

/* ================= PARTICIPANT ROUTES ================= */

// ✅ Registration
participantRouter.post("/addParticipant", addParticipantController);

// ✅ Login
participantRouter.post("/loginParticipant", loginParticipantController);

// ✅ OTP Verify
participantRouter.post("/verify-otp", verifyParticipantOTPController);

// ✅ Register Tournament (Protected)
participantRouter.post(
  "/registerTournament",
  authenticateParticipantJWT,
  registerTournamentController
);

// ✅ Get All Available Tournaments
participantRouter.get(
  "/availableTournaments",
  authenticateParticipantJWT,
  participantTournamentListController
);

// ✅ Get My Registered Tournaments
participantRouter.get(
  "/myTournaments",
  authenticateParticipantJWT,
  participantRegistrationListController
);

export default participantRouter;