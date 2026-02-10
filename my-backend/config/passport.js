const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

console.log("Check ID:", process.env.GOOGLE_CLIENT_ID);
console.log("Check Secret:", process.env.GOOGLE_CLIENT_SECRET ? "Set" : "Not set");
console.log("Check Callback URL:", process.env.GOOGLE_CALLBACK_URL);

// Configure passport
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log("Google profile received:", profile.displayName, profile.emails && profile.emails[0].value);
    
    // Check if user already exists
    let user = await User.findOne({ googleId: profile.id });

    if (user) {
      console.log("Existing user found:", user.email);
      // User already exists, return user
      return done(null, user);
    } else {
      console.log("Creating new user with Google profile");
      // Create new user
      user = new User({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        avatar: profile.photos[0].value,
        isOAuth: true // Mark as OAuth user
      });

      await user.save();
      console.log("New user created:", user.email);
      return done(null, user);
    }
  } catch (err) {
    console.error("Error in Google Strategy:", err);
    return done(err, null);
  }
}));

// Serialize user for session
passport.serializeUser((user, done) => {
  console.log("Serializing user:", user.id);
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    console.log("Deserializing user with id:", id);
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    console.error("Error deserializing user:", err);
    done(err, null);
  }
});

module.exports = { passport };