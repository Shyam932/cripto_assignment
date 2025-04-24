const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

// Signup
const signupUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ msg: "User already exists" });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash,  provider: "User", });

    res.status(201).json({ msg: "User created successfully", user });
  } catch (err) {
    res.status(400).json({ msg: "Error creating user", error: err.message });
  }
};

// Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: "Login error", error: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ msg: "Failed to load profile", error: err.message });
  }
};


// Social OAuth strategies
const googleAuth = passport.authenticate("google", { scope: ["profile", "email"] });

const googleCallback = [
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => res.json({ user: req.user }),
];

const linkedinAuth = passport.authenticate("linkedin");

const linkedinCallback = [
  passport.authenticate("linkedin", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => res.json({ user: req.user }),
];

const twitterAuth = passport.authenticate("twitter");

const twitterCallback = [
  passport.authenticate("twitter", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => res.json({ user: req.user }),
];

const facebookAuth = passport.authenticate("facebook", { scope: ["email"] });

const facebookCallback = [
  passport.authenticate("facebook", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => res.json({ user: req.user }),
];

// Export all handlers
module.exports = {
  signupUser,
  loginUser,
  googleAuth,
  googleCallback,
  linkedinAuth,
  linkedinCallback,
  twitterAuth,
  twitterCallback,
  facebookAuth,
  facebookCallback,
  getUserById,
};
