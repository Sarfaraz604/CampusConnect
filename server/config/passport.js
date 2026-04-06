// server/config/passport.js
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/users');
const bcrypt = require('bcrypt');
const {
  isInstitutionalEmail,
  normalizeEmail,
  normalizeText,
} = require('../utils/signupUtils');

module.exports = function(passport) {
  // Local Strategy
  passport.use(new LocalStrategy({ 
    usernameField: 'email' 
  }, async (email, password, done) => {
    try {
      const normalizedEmail = normalizeEmail(email);
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) return done(null, false, { message: 'User not found' });
      
      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return done(null, false, { message: 'Incorrect password' });
      
      return done(null, user);
    } catch (err) {
      console.error('Authentication error:', err);
      return done(err);
    }
  }));

  // Google Strategy
 // In the Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
async function(accessToken, refreshToken, profile, done) {
  try {
    const email = normalizeEmail(profile.emails?.[0]?.value);
    const avatar = normalizeText(profile.photos?.[0]?.value);
    const displayName = normalizeText(profile.displayName) || email.split('@')[0];

    if (!isInstitutionalEmail(email)) {
      return done(null, false, { 
        message: 'Please use your IIIT Agartala email (@iiitagartala.ac.in) to sign in.' 
      });
    }

    let user = await User.findOne({ email: email });
    
    if (!user) {
      return done(null, false, { 
        pendingSignup: {
          provider: 'google',
          googleId: profile.id,
          name: displayName,
          email,
          avatar: avatar || null,
        }
      });
    }

    const googleUpdates = { googleId: profile.id };
    if (avatar) {
      googleUpdates.avatar = avatar;
    }
    await User.updateOne({ _id: user._id }, { $set: googleUpdates });
    user.googleId = profile.id;
    if (avatar) {
      user.avatar = avatar;
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}
));

  // Serialize user for the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  // Deserialize user from the session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      console.error('Deserialization error:', err);
      done(err, null);
    }
  });
};
