import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

/* ✅ CORS – EXPRESS v5 SAFE (FIXED) */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://reset-frontend-2492.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

/* ✅ JSON */
app.use(express.json());

/* ✅ Health check */
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

/* ✅ Routes */
app.use("/api/auth", authRoutes);

/* ✅ Root */
app.get("/", (req, res) => {
  res.send("Password Reset API Running 🚀");
});

/* ✅ Mongo */
mongoose
  .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err.message));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
