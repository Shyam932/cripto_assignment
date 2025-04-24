const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const cryptoRoutes = require('./routes/cryptoRoutes');

require("./config/passport");

dotenv.config();

const app = express();
app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true,
}));


// app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

connectDB();

app.use("/api/auth", authRoutes);
app.use('/api/crypto', cryptoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `Backend server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`
  );
});
