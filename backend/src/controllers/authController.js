const jwt = require("jsonwebtoken");

function signToken(user) {
  return jwt.sign(
    { email: user.email, name: user.name, avatar: user.avatar },
    process.env.JWT_SECRET,
    { subject: user._id.toString(), expiresIn: "7d" }
  );
}

/**
 * Called after Passport successfully authenticates via Google.
 * Issues a JWT and redirects to the frontend callback URL.
 */
async function googleCallback(req, res) {
  try {
    const token = signToken(req.user);
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(
      `${frontendUrl}/auth/callback?token=${encodeURIComponent(token)}`
    );
  } catch (err) {
    console.error("googleCallback error:", err);
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(`${frontendUrl}/?error=auth_failed`);
  }
}

/** Returns current user info (from JWT via requireAuth middleware). */
async function getMe(req, res) {
  return res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      avatar: req.user.avatar,
    },
  });
}

/** Logout is handled client-side (just delete token). */
async function logout(req, res) {
  return res.json({ ok: true });
}

module.exports = { googleCallback, getMe, logout };
