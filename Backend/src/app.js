const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const sweetRoutes = require("./routes/sweetRoutes");

const app = express();

/* Middlewares */
app.use(cors());
app.use(express.json());

/* Routes */
app.use("/api/auth", authRoutes);
app.use("/api/sweets", sweetRoutes);

/* Default Route */
app.get("/", (req, res) => {
  res.send("Sweet Shop Management API is running");
});

module.exports = app;
