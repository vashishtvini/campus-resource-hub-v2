require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("./passport");
const { connectDB } = require("./db");
const { authRoutes } = require("./routes/authRoutes");
const { resourceRoutes } = require("./routes/resourceRoutes");

const app = express();

// CORS — allow frontend origin (must be before all routes)
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Authorization", "Content-Type", "Accept"],
};
app.use(cors(corsOptions));
// Handle preflight for all routes (required for cross-origin file uploads)
app.options("*", cors(corsOptions));

// Body parser
app.use(express.json({ limit: "1mb" }));

// Session (short-lived, only needed during OAuth redirect flow)
app.use(session({
  secret: process.env.SESSION_SECRET || "campus-hub-session-secret",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 10 * 60 * 1000 }, // 10 minutes
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Files are stored in Supabase Storage — no local static serving needed

// Connect to MongoDB
connectDB().catch(console.error);

// Health routes
app.get("/", (req, res) => res.json({ status: "Campus Resource Hub v2 API 🚀" }));
app.get("/health", (req, res) => res.json({ ok: true }));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/resources", resourceRoutes);

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

module.exports = { app };
