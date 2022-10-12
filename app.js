const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
dotenv.config();

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));
app.use(cors());

// Routes
const userRoutes = require("./src/routes/users");
const authRoutes = require("./src/routes/auth");

// setup routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;
