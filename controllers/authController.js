import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

// ================= REGISTER =================
export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashed });

    res.json({ msg: "User registered successfully" });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    res.json({ msg: "Login successful" });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ================= FORGOT PASSWORD =================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpire = Date.now() + 30 * 60 * 1000;
    await user.save();

    const frontendURL = process.env.FRONTEND_URL;
    const resetLink = `${frontendURL}/reset-password/${token}`;

await sendEmail(
  email,
  "Reset Your Password",
  `
  <div style="font-family: Arial, sans-serif; line-height:1.6;">
    <h2>Password Reset</h2>
    <p>You requested to reset your password.</p>

    <p>
      <a href="${resetLink}" target="_blank">
        👉 Click here to reset your password
      </a>
    </p>

    <p>If the link does not open, copy and paste this URL into your browser:</p>

    <p style="word-break: break-all;">
      ${resetLink}
    </p>

    <p>This link expires in 30 minutes.</p>
  </div>
  `
);



    res.json({ msg: "Password reset link sent to your email" });
  } catch (err) {
    console.error("FORGOT ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
};


// ================= RESET PASSWORD =================
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ msg: "Token invalid or expired" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();

    res.json({ msg: "Password reset successful" });
  } catch (err) {
    console.error("RESET ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
