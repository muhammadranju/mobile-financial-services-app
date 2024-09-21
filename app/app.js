const express = require("express");
const ejs = require("ejs");
const middleware = require("../middleware/middleware");
const router = require("../routes");
const path = require("path");
const app = express();

// Correct configuration for the view engine
// app.engine("ejs", ejs.renderFile);
// app.set("view engine", "ejs"); // Corrected: Pass 'ejs' as a string

// app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

app.use([middleware, router]);

module.exports = app;
