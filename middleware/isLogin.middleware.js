const jwt = require("jsonwebtoken");
const isLoginMiddleware = (req, res, next) => {
  try {
    let token = req.headers?.authorization?.split(" ")[1] || req.cookies?.auth;

    const user = jwt.verify(token, process.env.JWT_SECRET);

    if (user?.isAuth) {
      // If user is logged in, return a 403 Forbidden response
      return res.redirect("/");
    }
    return next();
  } catch (error) {
    // Handle various error cases
    if (error.message === "jwt must be provided") {
      // If token is not provided, continue to the next middleware
      // res.clearCookie("auth");
      return next();
    }

    // Handle other error messages related to token validation

    if (error.message.includes("invalid token")) {
      // If token is invalid or malformed, return a 403 Forbidden response
      res.clearCookie("auth");
      // return res.redirect("/login");
      return next();
    }

    if (error.message.includes("invalid signature")) {
      // If token is invalid or malformed, return a 403 Forbidden response
      res.clearCookie("auth");
      // throw Error(403, "you don't have access to change it.", error.message);
      return next();
    }

    if (error.message.includes("Unexpected", "token", "end", "input")) {
      // If token is invalid or malformed, return a 403 Forbidden response
      // res.clearCookie("auth");
      return next();
      // throw Error(403, "you don't have access to change it.", error.message);
    }

    if (error.message.includes("jwt malformed")) {
      // If token is invalid or malformed, return a 403 Forbidden response
      // res.clearCookie("auth");
      return next();
      throw Error(403, "you don't have access to change it.", error.message);
    }

    if (error.message.includes("jwt expired")) {
      // If token is expired, continue to the next middleware
      res.clearCookie("auth");
      // return res.redirect("/login");
      return next();
    }

    // If none of the above conditions are met, pass the error to the error handling middleware
    return next(error);
  }
};

module.exports = isLoginMiddleware;
