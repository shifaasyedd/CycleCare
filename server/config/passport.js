const crypto = require('crypto');           // ✅ ADD THIS LINE
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://cyclecare-j2yz.onrender.com/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const userEmail = profile.emails[0].value;

        // 1. Look for the user by email
        let user = await User.findOne({ email: userEmail });

        if (user) {
          // If user exists but doesn't have a googleId, link it now
          if (!user.googleId) {
            user.googleId = profile.id;
            user.isVerified = true;
            await user.save();
            console.log(`🔗 Linked Google account to existing email: ${userEmail}`);
          }
          return done(null, user);
        }

        // 2. No user exists – create a new one
        console.log(`✨ Creating new user via Google: ${userEmail}`);
        user = await User.create({
          name: profile.displayName,
          email: userEmail,
          googleId: profile.id,
          isVerified: true,
          password: crypto.randomBytes(20).toString('hex'),
        });

        return done(null, user);
      } catch (err) {
        console.error("❌ Passport Google Strategy Error:", err);
        return done(err, null);
      }
    }
  )
);

module.exports = passport;