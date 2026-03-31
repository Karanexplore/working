import bcrypt from "bcrypt";
import Admin from "../model/adminSchema.js";
import Organizer from "../model/organizerSchema.js";
import Tournament from "../model/tournamentSchema.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET;

/* ================= ADMIN LOGIN ================= */
export const loginAdminController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email or password missing"
      });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const match = await bcrypt.compare(password, admin.password);

    if (!match) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    if (!ADMIN_SECRET_KEY) {
      console.error("❌ ADMIN_SECRET missing in .env");
      return res.status(500).json({
        message: "Server configuration error"
      });
    }

    const token = jwt.sign(
      { email, role: "ADMIN" },
      ADMIN_SECRET_KEY,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Login successful",
      email,
      adminToken: token
    });

  } catch (error) {
    console.log("Admin Login Error:", error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

/* ================= GET ALL ORGANIZERS ================= */
export const adminViewOrganizerListController = async (req, res) => {
  try {
    const organizers = await Organizer.find()
      .select("-password -otp -otpExpiry")
      .sort({ _id: -1 })
      .lean();

    return res.status(200).json({
      organizers
    });

  } catch (error) {
    console.log("Error fetching organizers:", error);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

/* ================= GET ALL TOURNAMENTS ================= */
export const adminTournamentListController = async (req, res) => {
  try {
    const tournaments = await Tournament.find()
      .sort({ _id: -1 })
      .lean();

    return res.status(200).json({
      tournaments
    });

  } catch (error) {
    console.log("Error fetching tournaments:", error);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

/* ================= APPROVE ORGANIZER ================= */
export const approveOrganizerController = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        message: "Organizer email is required"
      });
    }

    const organizer = await Organizer.findOneAndUpdate(
      { email },
      { accountStatus: "approved" },
      { new: true }
    );

    if (!organizer) {
      return res.status(404).json({
        message: "Organizer not found"
      });
    }

    // ✅ IMPORTANT:
    // Make all tournaments of this organizer visible to participants
    await Tournament.updateMany(
      { organizerEmail: email },
      { status: true }
    );

    return res.status(200).json({
      message: "Organizer approved successfully"
    });

  } catch (error) {
    console.log("Approve Organizer Error:", error);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

/* ================= REJECT ORGANIZER ================= */
export const rejectOrganizerController = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        message: "Organizer email is required"
      });
    }

    const organizer = await Organizer.findOneAndUpdate(
      { email },
      { accountStatus: "rejected" },
      { new: true }
    );

    if (!organizer) {
      return res.status(404).json({
        message: "Organizer not found"
      });
    }

    // ✅ IMPORTANT:
    // Hide all tournaments of this organizer from participants
    await Tournament.updateMany(
      { organizerEmail: email },
      { status: false }
    );

    return res.status(200).json({
      message: "Organizer rejected successfully"
    });

  } catch (error) {
    console.log("Reject Organizer Error:", error);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

/* ================= SUSPEND ORGANIZER ================= */
export const suspendOrganizerController = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        message: "Organizer email is required"
      });
    }

    const organizer = await Organizer.findOneAndUpdate(
      { email },
      { accountStatus: "suspended" },
      { new: true }
    );

    if (!organizer) {
      return res.status(404).json({
        message: "Organizer not found"
      });
    }

    // ✅ IMPORTANT:
    // Hide all tournaments of suspended organizer
    await Tournament.updateMany(
      { organizerEmail: email },
      { status: false }
    );

    return res.status(200).json({
      message: "Organizer suspended successfully"
    });

  } catch (error) {
    console.log("Suspend Organizer Error:", error);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};