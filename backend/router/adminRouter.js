import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import {
  loginAdminController,
  adminViewOrganizerListController,
  approveOrganizerController,
  rejectOrganizerController,
  suspendOrganizerController,
  adminTournamentListController
} from "../controller/adminController.js";

dotenv.config();

const adminRouter = express.Router();
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET;

/* ================= JWT AUTH ================= */
const authenticateAdminJWT = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authorization header missing"
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token || token === "undefined" || token === "null") {
      return res.status(401).json({
        message: "Invalid token provided"
      });
    }

    if (!ADMIN_SECRET_KEY) {
      return res.status(500).json({
        message: "ADMIN_SECRET missing in .env"
      });
    }

    jwt.verify(token, ADMIN_SECRET_KEY, (err, payload) => {
      if (err) {
        return res.status(403).json({
          message: "Invalid or expired admin token"
        });
      }

      req.adminPayload = payload;
      next();
    });
  } catch (error) {
    console.error("Admin JWT Error:", error.message);
    return res.status(500).json({
      message: "Server error"
    });
  }
};

/* ================= ROUTES ================= */

// Login
adminRouter.post("/login", loginAdminController);

// View all organizers
adminRouter.get(
  "/organizers",
  authenticateAdminJWT,
  adminViewOrganizerListController
);

// View all tournaments for dashboard
adminRouter.get(
  "/tournaments",
  authenticateAdminJWT,
  adminTournamentListController
);

// Approve by email
adminRouter.put(
  "/organizer/approve/:email",
  authenticateAdminJWT,
  approveOrganizerController
);

// Reject by email
adminRouter.put(
  "/organizer/reject/:email",
  authenticateAdminJWT,
  rejectOrganizerController
);

// Suspend by email
adminRouter.put(
  "/organizer/suspend/:email",
  authenticateAdminJWT,
  suspendOrganizerController
);

export default adminRouter;