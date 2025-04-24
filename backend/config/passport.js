const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const TwitterStrategy = require("passport-twitter").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/User");
require("dotenv").config();

// Local Strategy
passport.use(
  new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) return done(null, false, { message: "User not found" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return done(null, false, { message: "Incorrect password" });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ oauthId: profile.id, provider: "google" });
        if (existingUser) return done(null, existingUser);

        const newUser = await User.create({
          name: profile.displayName,
          email: profile.emails?.[0]?.value,
          oauthId: profile.id,
          provider: "google",
          
        });

        return done(null, newUser);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// // Facebook Strategy
// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: process.env.FACEBOOK_CLIENT_ID,
//       clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
//       callbackURL: "/api/auth/facebook/callback",
//       profileFields: ["id", "displayName", "photos", "email"],
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const existingUser = await User.findOne({ oauthId: profile.id, provider: "facebook" });
//         if (existingUser) return done(null, existingUser);

//         const newUser = await User.create({
//           name: profile.displayName,
//           email: profile.emails?.[0]?.value || "",
//           oauthId: profile.id,
//           provider: "facebook",
//           profilePicture: profile.photos?.[0]?.value || "",
//         });

//         return done(null, newUser);
//       } catch (err) {
//         return done(err);
//       }
//     }
//   )
// );

// // LinkedIn Strategy
// passport.use(
//   new LinkedInStrategy(
//     {
//       clientID: process.env.LINKEDIN_CLIENT_ID,
//       clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
//       callbackURL: "/api/auth/linkedin/callback",
//       scope: ["r_emailaddress", "r_liteprofile"],
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const existingUser = await User.findOne({ oauthId: profile.id, provider: "linkedin" });
//         if (existingUser) return done(null, existingUser);

//         const newUser = await User.create({
//           name: profile.displayName,
//           email: profile.emails?.[0]?.value || "",
//           oauthId: profile.id,
//           provider: "linkedin",
//           profilePicture: profile.photos?.[0]?.value || "",
//         });

//         return done(null, newUser);
//       } catch (err) {
//         return done(err);
//       }
//     }
//   )
// );

// // Twitter Strategy
// passport.use(
//   new TwitterStrategy(
//     {
//       consumerKey: process.env.TWITTER_CONSUMER_KEY,
//       consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
//       callbackURL: "/api/auth/twitter/callback",
//       includeEmail: true,
//     },
//     async (token, tokenSecret, profile, done) => {
//       try {
//         const existingUser = await User.findOne({ oauthId: profile.id, provider: "twitter" });
//         if (existingUser) return done(null, existingUser);

//         const newUser = await User.create({
//           name: profile.displayName,
//           email: profile.emails?.[0]?.value || "",
//           oauthId: profile.id,
//           provider: "twitter",
//           profilePicture: profile.photos?.[0]?.value || "",
//         });

//         return done(null, newUser);
//       } catch (err) {
//         return done(err);
//       }
//     }
//   )
// );

// Session handling
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
