import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { upload } from "../config/cloudinary.js";

import {
  addOrganizerController,
  loginOrganizerController,
  organizerTournamentListController,
  organizerCreateTournamentController,
  verifyOrganizerOTPController,
  getOrganizerProfileController,        // 🔥 ADD
  updateOrganizerProfileController 
} from "../controller/organizerController.js";

dotenv.config();

const organizerRouter = express.Router();
const ORGANIZER_SECRET_KEY = process.env.ORGANIZER_SECRET;

/* ================= JWT AUTH ================= */
const authenticateOrganizerJWT = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];

    if (!token || token === "undefined" || token === "null") {
      return res.status(401).json({ message: "Organizer token missing" });
    }

    jwt.verify(token, ORGANIZER_SECRET_KEY, (err, payload) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired organizer token" });
      }

      req.organizerPayload = payload;
      next();
    });
  } catch (error) {
    console.error("Organizer JWT Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ================= ROUTES ================= */

// Register
organizerRouter.post(
  "/register",
  upload.single("organizerLogo"),
  addOrganizerController
);

// Login
organizerRouter.post("/login", loginOrganizerController);

// OTP Verify
organizerRouter.post("/verify-otp", verifyOrganizerOTPController);

// View Organizer Tournaments
organizerRouter.get(
  "/tournaments",
  authenticateOrganizerJWT,
  organizerTournamentListController
);

// Create Tournament
organizerRouter.post(
  "/createTournament",
  authenticateOrganizerJWT,
  upload.single("tournamentPoster"),
  organizerCreateTournamentController
);

organizerRouter.get(
  "/profile",
  authenticateOrganizerJWT,
  getOrganizerProfileController
);

organizerRouter.put(
  "/profile",
  authenticateOrganizerJWT,
  upload.single("organizerLogo"),
  updateOrganizerProfileController
);

export default organizerRouter;