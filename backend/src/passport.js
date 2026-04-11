const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { User } = require("./models/User");

// Only register strategy if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:4001/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Find or create user by Google ID
          let user = await User.findOne({ googleId: profile.id });

          if (!user) {
            user = await User.create({
              googleId: profile.id,
              email: profile.emails?.[0]?.value || "",
              name: profile.displayName,
              avatar: profile.photos?.[0]?.value || "",
            });
            console.log(`✅ New user created: ${user.email}`);
          } else {
            // Sync avatar in case it changed
            const newAvatar = profile.photos?.[0]?.value || "";
            if (newAvatar && user.avatar !== newAvatar) {
              user.avatar = newAvatar;
              await user.save();
            }
          }

          return done(null, user);
        } catch (err) {
          console.error("Passport error:", err);
          return done(err, null);
        }
      }
    )
  );
} else {
  console.warn("⚠️  GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET not set — Google login disabled");
}

passport.serializeUser((user, done) => done(null, user._id.toString()));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
