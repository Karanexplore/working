import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import {
  bookTicketController,
  getMyTicketsController,
  getTicketPriceController,
  cancelTicketController
} from "../controller/ticketController.js";

dotenv.config();

const ticketRouter = express.Router();
const PARTICIPANT_SECRET_KEY = process.env.PARTICIPANT_SECRET;

/* ================= PARTICIPANT JWT MIDDLEWARE ================= */
const authenticateParticipantJWT = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];

    if (!token || token === "undefined" || token === "null") {
      return res.status(401).json({ message: "Invalid token provided" });
    }

    if (!PARTICIPANT_SECRET_KEY) {
      return res.status(500).json({ message: "Server configuration error" });
    }

    jwt.verify(token, PARTICIPANT_SECRET_KEY, (err, payload) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }
      req.participantPayload = payload;
      next();
    });

  } catch (err) {
    console.error("Ticket JWT Error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ================= ROUTES ================= */

// Book tickets (POST)
ticketRouter.post(
  "/book",
  authenticateParticipantJWT,
  bookTicketController
);

// Get my tickets (GET)
ticketRouter.get(
  "/myTickets",
  authenticateParticipantJWT,
  getMyTicketsController
);

// Get ticket price for a tournament (GET) - protected
ticketRouter.get(
  "/price/:tournamentId",
  authenticateParticipantJWT,
  getTicketPriceController
);

// Cancel a ticket (PUT)
ticketRouter.put(
  "/cancel/:ticketId",
  authenticateParticipantJWT,
  cancelTicketController
);

export default ticketRouter;