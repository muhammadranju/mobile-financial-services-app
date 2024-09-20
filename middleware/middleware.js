const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const compression = require("compression");

// CORS options to allow requests from frontend running on port 5500
const corsOptions = {
  // origin: process.env.BASE_URL || "http://localhost:5500", // For local dev
  origin: "*", // For local dev
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true, // Correct spelling here
  allowedHeaders: ["Content-Type", "Authorization"],
};

const middleware = [
  express.urlencoded({ extended: false }),
  express.json(),
  morgan("dev"),
  cookieParser({
    httpOnly: false,
  }),
  cors(corsOptions),
  compression({
    level: 6,
    threshold: 100 * 1000,
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) {
        return false;
      }
      return compression.filter(req, res);
    },
  }),
];

module.exports = middleware;
