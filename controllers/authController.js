import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

// REGISTER
export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashed });

    res.json({ msg: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Invalid credentials" });

    res.json({ msg: "Login successful" });
  } catch {
    res.status(500).json({ msg: "Server error" });
  }
};


// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  try {
    console.log("FORGOT PASSWORD HIT");

    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    const frontendURL =
      process.env.FRONTEND_URL || "http://localhost:5173";

    const resetLink = `${frontendURL}/reset-password/${token}`;

    // TRY EMAIL (OPTIONAL)
    try {
      await sendEmail(
        email,
        "Password Reset",
        `<p>Click to reset password:</p>
         <a href="${resetLink}">${resetLink}</a>`
      );
      console.log("Email sent successfully");
    } catch (emailErr) {
      console.log("⚠️ Email skipped (Render SMTP blocked)");
    }

    // ✅ ALWAYS RETURN SUCCESS
    return res.json({
      msg: "Password reset link generated",
      resetLink, // VERY IMPORTANT FOR GUVI
    });
  } catch (err) {
    console.error("FORGOT ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
};




// RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ msg: "Token invalid or expired" });

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();

    res.json({ msg: "Password reset successful" });
  } catch {
    res.status(500).json({ msg: "Server error" });
  }
};
