const express = require("express");
const passport = require("../passport");
const { googleCallback, getMe, logout } = require("../controllers/authController");
const { requireAuth } = require("../middleware/requireAuth");

const router = express.Router();

// Initiate Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google OAuth callback → issues JWT, redirects to frontend
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL || "http://localhost:5173"}/?error=auth_failed`,
    session: true,
  }),
  googleCallback
);

// Get current user (JWT protected)
router.get("/me", requireAuth, getMe);

// Logout (client just deletes token)
router.post("/logout", logout);

module.exports = { authRoutes: router };
