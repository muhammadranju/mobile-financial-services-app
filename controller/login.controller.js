const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const loginController = {};

// Login Get
loginController.loginGet = async (req, res, next) => {
  try {
    res.render("login", { title: "Login - Payooo" });
  } catch (error) {
    next(error);
  }
};
// Login Post
loginController.loginPost = async (req, res, next) => {
  try {
    const { mobileNumber, pinNumber } = req.body;

    // Validate mobile number length and format
    const formattedMobileNumber = mobileNumber
      .toString()
      .replace(/[^0-9]/g, ""); // Remove non-numeric characters

    if (formattedMobileNumber.length !== 11) {
      return res.status(400).json({
        status: "failed",
        message: "Mobile number must be exactly 11 digits.",
      });
    }

    // Validate pin number length
    if (pinNumber.toString().length !== 4) {
      return res.status(400).json({
        status: "failed",
        message: "Pin number must be exactly 4 digits.",
      });
    }

    // Find user by mobile number (assuming first digit is trimmed for some reason)
    const findUser = await User.findOne({
      mobileNumber: formattedMobileNumber.slice(1),
    });

    if (!findUser) {
      return res.status(400).json({
        status: "failed",
        message: "Incorrect Phone or Pin Number",
      });
    }

    // Check if the pin number matches the stored hashed pin
    const isPasswordCorrect = await bcrypt.compare(
      pinNumber,
      findUser.pinNumber
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        status: "failed",
        message: "Incorrect Phone or Pin Number",
      });
    }

    // Create JWT payload and sign the token
    const payload = {
      isAuth: true,
      userId: findUser._id,
    };

    findUser.isActive = true;
    await findUser.save();

    // Create JWT and set it as a cookie
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "90d", // Token expiration
    });

    // Set the JWT token as a cookie (httpOnly, secure)
    res.cookie("auth", token, {
      httpOnly: true, // Prevents JavaScript access to the cookie
      // secure: process.env.NODE_ENV === "production", // Ensures cookie is only sent over HTTPS in production
      sameSite: "Lax", // Helps mitigate CSRF attacks
      maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days in milliseconds
    });

    // Respond with success
    return res.status(200).json({
      status: "success",
      message: "Successfully Logged In",
    });
  } catch (error) {
    next(error);
  }
};
// Register Get
loginController.registerGet = async (req, res, next) => {
  try {
    res.render("register", { title: "Register - Payooo" });
  } catch (error) {
    next(error);
  }
};

// Register Post
loginController.registerPost = async (req, res, next) => {
  try {
    const { mobileNumber, pinNumber } = req.body;

    const findUser = await User.findOne({ mobileNumber });

    if (findUser) {
      res
        .status(400)
        .json({ status: "failed", message: "Number is already registered" });
      return;
    }

    if (mobileNumber.toString().length > 11) {
      res
        .status(400)
        .json({ status: "failed", message: "Number is muse be less than 11" });
      return;
    }
    if (pinNumber.toString().length > 4) {
      res.status(400).json({
        status: "failed",
        messageForPin: "Pin Number is muse be less than 4",
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPinNumber = await bcrypt.hash(pinNumber.toString(), salt);

    const newUser = new User({
      mobileNumber,
      pinNumber: hashedPinNumber,
    });

    await newUser.save();
    res
      .status(201)
      .json({ status: "success", message: "Successfully created" });
  } catch (error) {
    next(error);
  }
};

// Logout
loginController.logout = async (req, res, next) => {
  try {
    let token = req.headers?.authorization?.split(" ")[1] || req.cookies?.auth;

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ _id: decodedToken.userId });
    user.isActive = false;
    await user.save();

    res.clearCookie("auth");
    res.redirect("/");
  } catch (error) {
    next(error);
  }
};

module.exports = loginController;
