const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const authMiddleware = async (req, res, next) => {
  try {
    let token = req.headers?.authorization?.split(" ")[1] || req.cookies?.auth;
    // Check if token is provided
    if (!token) {
      // If token is not provided, throw an unauthorized error
      // throw Error(401, "Unauthorized invalid access");
      return res.redirect("/login");
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // check user is valid or invalid
    if (!decodedToken) {
      // throw Error(401, "Unauthorized invalid access");
      return res.redirect("/login");
    }

    const user = await User.findOne({ _id: decodedToken.userId });

    if (!user) {
      // If user is not found, throw an unauthorized error
      throw Error(401, "Unauthorized invalid access");
      // return res.redirect("/login");
    }
    req.user = {
      userId: user.id,
      isAuth: true,
    };
    return next();
  } catch (error) {
    console.log(error);
    return res.redirect("/login");
    // throw Error(401, "Unauthorized invalid access");
  }
};

module.exports = authMiddleware;
