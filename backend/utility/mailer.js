import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendOTPEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,  // ✅ FIX
      },
    });

    const info = await transporter.sendMail({
      from: `"Pulse Area" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Email Verification OTP",
      html: `
        <h2>Email Verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
      `,
    });

    console.log("Email sent:", info.response);

  } catch (error) {
    console.log("Email Sending Error:", error);
    throw error;
  }
};