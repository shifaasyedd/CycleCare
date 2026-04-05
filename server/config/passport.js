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

        // 1. Look for the user by email (the most reliable way)
        let user = await User.findOne({ email: userEmail });

        if (user) {
          // ✅ PREVENT CRASH: If user exists but doesn't have a googleId, link it now
          if (!user.googleId) {
            user.googleId = profile.id;
            user.isVerified = true; // They logged in via Google, so email is verified
            await user.save();
            console.log(`🔗 Linked Google account to existing email: ${userEmail}`);
          }
          return done(null, user);
        }

        // 2. If NO user exists at all, create a new one
        console.log(`✨ Creating new user via Google: ${userEmail}`);
        user = await User.create({
          name: profile.displayName,
          email: userEmail,
          googleId: profile.id,
          isVerified: true,
          // We set a random password so the 'required' check passes but no one can guess it
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