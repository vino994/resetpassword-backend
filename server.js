import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

/* ✅ CORS – Express v5 SAFE */
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://reset-frontend-mm6kcykwe-vinothkumar-sanjeevis-projects.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

/* 🔥 IMPORTANT: this handles OPTIONS automatically */
app.use(express.json());

/* Health check */
app.get("/api/health", (req, res) => {
  res.status(200).send("OK");
});

/* MongoDB */
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("MongoDB Error:", err.message));

/* Routes */
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Password Reset API Running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
