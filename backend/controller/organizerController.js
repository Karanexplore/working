import uuid4 from "uuid4";
import bcrypt from "bcrypt";
import Organizer from "../model/organizerSchema.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { generateOTP } from "../utility/otpGenerator.js";
import { sendOTPEmail } from "../utility/mailer.js";
import tournamentSchema from "../model/tournamentSchema.js";

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

    if (
      !organizerName ||
      !email ||
      !password ||
      !contact ||
      !gameCategory ||
      !description ||
      !address
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exists = await Organizer.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Email already registered" });
    }

    let organizerLogo = "";

    // ✅ Save full Cloudinary URL only
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

    const tournamentList = await tournamentSchema.find({
      organizerEmail: req.organizerPayload.email
    }).sort({ _id: -1 });

    return res.status(200).json({
      email: req.organizerPayload.email,
      tournamentList
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

    if (
      !tournamentName ||
      !gameTitle ||
      !gameCategory ||
      !eventType ||
      !description ||
      !venue ||
      !tournamentDate ||
      !reportingTime ||
      !maxParticipants ||
      !organizerContact
    ) {
      return res.status(400).json({ message: "All tournament fields are required" });
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

      // ✅ Important defaults
      registrationOpen: true,

      // 🔥 KEY FIX:
      // approved = visible
      // pending/rejected = hidden from participants
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

export const registerOrganizerController = addOrganizerController;



// import uuid4 from "uuid4";
// import bcrypt from "bcrypt";
// import Organizer from "../model/organizerSchema.js";
// import dotenv from "dotenv";
// import jwt from "jsonwebtoken";
// import { generateOTP } from "../utility/otpGenerator.js";
// import { sendOTPEmail } from "../utility/mailer.js";
// import tournamentSchema from "../model/tournamentSchema.js";

// dotenv.config();
// const ORGANIZER_SECRET_KEY = process.env.ORGANIZER_SECRET;

// /* ================= ORGANIZER REGISTRATION ================= */
// export const addOrganizerController = async (req, res) => {
//   try {
//     console.log("BODY:", req.body);
//     console.log("FILE:", req.file);

//     const {
//       organizerName,
//       email,
//       password,
//       contact,
//       gameCategory,
//       description,
//       address
//     } = req.body;

//     if (
//       !organizerName ||
//       !email ||
//       !password ||
//       !contact ||
//       !gameCategory ||
//       !description ||
//       !address
//     ) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const exists = await Organizer.findOne({ email });
//     if (exists) {
//       return res.status(409).json({ message: "Email already registered" });
//     }

//     let fileName = "";

//     if (req.file) {
//       fileName = req.file.path; // ✅ FIXED (Cloudinary safe)
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const otp = generateOTP();

//     await Organizer.create({
//       organizerId: uuid4(),
//       organizerName,
//       email,
//       password: hashedPassword,
//       contact,
//       gameCategory,
//       description,
//       address,
//       organizerLogo: fileName,
//       otp,
//       otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
//       emailVerified: false,
//       accountStatus: "pending" // ✅ FIXED (IMPORTANT)
//     });

//     await sendOTPEmail(email, otp);

//     return res.status(200).json({
//       message: "Organizer registered. OTP sent to your email."
//     });

//   } catch (error) {
//     console.error("🔥 ERROR:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// /* ================= ORGANIZER LOGIN ================= */
// export const loginOrganizerController = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ message: "Email & password required" });
//     }

//     const organizer = await Organizer.findOne({ email });

//     if (!organizer) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     const match = await bcrypt.compare(password, organizer.password);

//     if (!match) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     if (!organizer.emailVerified) {
//       return res.status(400).json({
//         message: "Please verify your email before login"
//       });
//     }

//     const token = jwt.sign(
//       { email: organizer.email, role: "organizer" },
//       ORGANIZER_SECRET_KEY,
//       { expiresIn: "7d" }
//     );

//     return res.status(200).json({
//       email: organizer.email,
//       organizerToken: token,
//       accountStatus: organizer.accountStatus // ✅ FIXED
//     });

//   } catch (error) {
//     console.error("Organizer Login Error:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// /* ================= OTP VERIFY ================= */
// export const verifyOrganizerOTPController = async (req, res) => {
//   try {
//     const { email, otp } = req.body;

//     const organizer = await Organizer.findOne({ email });

//     if (!organizer) {
//       return res.status(400).json({ message: "Organizer not found" });
//     }

//     if (organizer.emailVerified) {
//       return res.status(400).json({ message: "Email already verified" });
//     }

//     if (organizer.otp?.toString() !== otp.toString()) {
//       return res.status(400).json({ message: "Invalid OTP" });
//     }

//     if (!organizer.otpExpiry || organizer.otpExpiry < Date.now()) {
//       return res.status(400).json({ message: "OTP Expired" });
//     }

//     organizer.emailVerified = true;
//     organizer.otp = null;
//     organizer.otpExpiry = null;

//     await organizer.save();

//     return res.status(200).json({
//       message: "Email verified successfully"
//     });

//   } catch (error) {
//     console.log("Verify OTP Error:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// /* ================= VIEW TOURNAMENT LIST ================= */
// export const organizerTournamentListController = async (req, res) => {
//   try {
//     const tournamentList = await tournamentSchema.find({
//       organizerEmail: req.organizerPayload.email
//     });

//     return res.status(200).json({
//       email: req.organizerPayload.email,
//       tournamentList
//     });
//   } catch (error) {
//     console.log("Error in organizerTournamentListController:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// /* ================= CREATE TOURNAMENT ================= */
// export const organizerCreateTournamentController = async (req, res) => {
//   try {

//     if (!req.organizerPayload?.email) {
//       return res.status(401).json({ message: "Unauthorized organizer" });
//     }

//     const organizer = await Organizer.findOne({
//       email: req.organizerPayload.email
//     });

//     if (!organizer) {
//       return res.status(404).json({ message: "Organizer not found" });
//     }

//     // ✅ APPROVAL CHECK (FINAL FIX)
//     if (organizer.accountStatus !== "approved") {
//       return res.status(403).json({
//         message: "Your account is under review. Admin approval required."
//       });
//     }

//     if (!req.file) {
//       return res.status(400).json({ message: "Poster image required" });
//     }

//     const tournamentData = {
//       tournamentId: uuid4(),
//       organizerEmail: organizer.email,
//       tournamentName: req.body.tournamentName,
//       gameTitle: req.body.gameTitle,
//       gameCategory: req.body.gameCategory,
//       eventType: req.body.eventType,
//       description: req.body.description,
//       venue: req.body.venue,
//       tournamentDate: req.body.tournamentDate,
//       reportingTime: req.body.reportingTime,
//       maxParticipants: Number(req.body.maxParticipants),
//       organizerContact: req.body.organizerContact,
//       tournamentPoster: req.file.path
//     };

//     await tournamentSchema.create(tournamentData);

//     return res.status(200).json({
//       message: "Tournament created successfully"
//     });

//   } catch (error) {
//     console.log("Create Tournament Error:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// export const registerOrganizerController = addOrganizerController;

// import uuid4 from "uuid4";
// import bcrypt from "bcrypt";
// import Organizer from "../model/organizerSchema.js";
// import dotenv from "dotenv";
// import jwt from "jsonwebtoken";
// import { generateOTP } from "../utility/otpGenerator.js";
// import { sendOTPEmail } from "../utility/mailer.js";
// import tournamentSchema from "../model/tournamentSchema.js";

// dotenv.config();
// const ORGANIZER_SECRET_KEY = process.env.ORGANIZER_SECRET;

// /* ================= ORGANIZER REGISTRATION ================= */
// export const addOrganizerController = async (req, res) => {
//   try {

//     console.log("BODY:", req.body);
//     console.log("FILE:", req.file);

//     const {
//       organizerName,
//       email,
//       password,
//       contact,
//       gameCategory,
//       description,
//       address
//     } = req.body;

//     if (
//       !organizerName ||
//       !email ||
//       !password ||
//       !contact ||
//       !gameCategory ||
//       !description ||
//       !address
//     ) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const exists = await Organizer.findOne({ email });
//     if (exists) {
//       return res.status(409).json({ message: "Email already registered" });
//     }

//     let fileName = "";

//     if (req.file) {
//       fileName = req.file.filename;
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const otp = generateOTP();

//     await Organizer.create({
//       organizerId: uuid4(),
//       organizerName,
//       email,
//       password: hashedPassword,
//       contact,
//       gameCategory,
//       description,
//       address,
//       organizerLogo: fileName,
//       otp,
//       otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
//       emailVerified: false,
//       adminVerified: false
//     });

//     await sendOTPEmail(email, otp);

//     return res.status(200).json({
//       message: "Organizer registered. OTP sent to your email."
//     });

//   } catch (error) {
//     console.error("🔥 ERROR:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// /* ================= ORGANIZER LOGIN ================= */
// export const loginOrganizerController = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ message: "Email & password required" });
//     }

//     const organizer = await Organizer.findOne({ email });

//     if (!organizer) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     const match = await bcrypt.compare(password, organizer.password);

//     if (!match) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     if (!organizer.emailVerified) {
//       return res.status(400).json({
//         message: "Please verify your email before login"
//       });
//     }

//     // ✅ LOGIN ALLOWED EVEN IF NOT ADMIN VERIFIED
//     // Admin approval will be checked during event creation

//     const token = jwt.sign(
//       { email: organizer.email, role: "organizer" },
//       ORGANIZER_SECRET_KEY,
//       { expiresIn: "7d" }
//     );

//     return res.status(200).json({
//       email: organizer.email,
//       organizerToken: token,
//       adminVerified: organizer.adminVerified
//     });

//   } catch (error) {
//     console.error("Organizer Login Error:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// /* ================= OTP VERIFY CONTROLLER ================= */
// export const verifyOrganizerOTPController = async (req, res) => {
//   try {
//     const { email, otp } = req.body;

//     const organizer = await Organizer.findOne({ email });

//     if (!organizer) {
//       return res.status(400).json({ message: "Organizer not found" });
//     }

//     if (organizer.emailVerified) {
//       return res.status(400).json({ message: "Email already verified" });
//     }

//     if (organizer.otp?.toString() !== otp.toString()) {
//       return res.status(400).json({ message: "Invalid OTP" });
//     }

//     if (!organizer.otpExpiry || organizer.otpExpiry < Date.now()) {
//       return res.status(400).json({ message: "OTP Expired" });
//     }

//     organizer.emailVerified = true;
//     organizer.otp = null;
//     organizer.otpExpiry = null;

//     await organizer.save();

//     return res.status(200).json({
//       message: "Email verified successfully"
//     });

//   } catch (error) {
//     console.log("Verify OTP Error:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// /* ================= VIEW TOURNAMENT LIST ================= */
// export const organizerTournamentListController = async (req, res) => {
//   try {
//     const tournamentList = await tournamentSchema.find({
//       organizerEmail: req.organizerPayload.email
//     });

//     return res.status(200).json({
//       email: req.organizerPayload.email,
//       tournamentList
//     });
//   } catch (error) {
//     console.log("Error in organizerTournamentListController:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// /* ================= CREATE TOURNAMENT ================= */
// export const organizerCreateTournamentController = async (req, res) => {
//   try {

//     if (!req.organizerPayload?.email) {
//       return res.status(401).json({ message: "Unauthorized organizer" });
//     }

//     const organizer = await Organizer.findOne({
//       email: req.organizerPayload.email
//     });

//     if (!organizer) {
//       return res.status(404).json({ message: "Organizer not found" });
//     }

//     // ✅ ADMIN APPROVAL CHECK ONLY HERE
//     if (organizer.accountStatus !== "approved") {
//       return res.status(403).json({
//         message: "Your account is under review. Admin approval required."
//       });
//     }

//     if (!req.file) {
//       return res.status(400).json({ message: "Poster image required" });
//     }

//     const tournamentData = {
//       tournamentId: uuid4(),
//       organizerEmail: organizer.email,
//       tournamentName: req.body.tournamentName,
//       gameTitle: req.body.gameTitle,
//       gameCategory: req.body.gameCategory,
//       eventType: req.body.eventType,
//       description: req.body.description,
//       venue: req.body.venue,
//       tournamentDate: req.body.tournamentDate,
//       reportingTime: req.body.reportingTime,
//       maxParticipants: Number(req.body.maxParticipants),
//       organizerContact: req.body.organizerContact,
//       tournamentPoster: req.file.path
//     };

//     await tournamentSchema.create(tournamentData);

//     return res.status(200).json({
//       message: "Tournament created successfully"
//     });

//   } catch (error) {
//     console.log("Create Tournament Error:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// export const registerOrganizerController = addOrganizerController;
