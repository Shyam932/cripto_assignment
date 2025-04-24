const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { signupUser, loginUser, getUserById } = require("../controllers/authController");
const authenticate = require("../middleware/authenticate.js");

const router = express.Router();

// Signup Route
router.post("/signup", signupUser);

// Login Route
router.post("/login", loginUser);

router.get("/profile/:userId", getUserById);

// Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), (req, res) => {
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.redirect(`http://localhost:5173/oauth-success?token=${token}`);
});

// Facebook OAuth
router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));
router.get("/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/login" }), (req, res) => {
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.redirect(`http://localhost:5173/oauth-success?token=${token}`);
});

// LinkedIn OAuth
router.get("/linkedin", passport.authenticate("linkedin"));
router.get("/linkedin/callback", passport.authenticate("linkedin", { failureRedirect: "/login" }), (req, res) => {
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.redirect(`http://localhost:5173/oauth-success?token=${token}`);
});

// Twitter OAuth
router.get("/twitter", passport.authenticate("twitter"));
router.get("/twitter/callback", passport.authenticate("twitter", { failureRedirect: "/login" }), (req, res) => {
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.redirect(`http://localhost:5173/oauth-success?token=${token}`);
});

module.exports = router;
