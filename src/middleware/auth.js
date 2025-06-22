const jwt = require("jsonwebtoken");
require("dotenv").config();

// Middleware for verifying JWT tokens
const auth = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN format

    if (!token) {
      // For now, if no token is provided, allow the request to proceed
      // This makes authentication optional for initial setup
      // In a real SaaS app, you would require authentication
      req.user = null;
      return next();

      // Uncomment the following code when you want to enforce authentication
      /*
      return res.status(401).json({
        success: false,
        message: 'No authentication token, access denied'
      });
      */
    }

    // Verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Attach user info to request object
      req.user = decoded.user;
      next();
    } catch (err) {
      // If token is invalid, allow request to proceed, but without user info
      // Again, this is for initial development - in production, you'd reject invalid tokens
      req.user = null;
      next();

      // Uncomment when you want to enforce valid authentication
      /*
      return res.status(401).json({
        success: false,
        message: 'Invalid token, access denied'
      });
      */
    }
  } catch (err) {
    console.error("Error in auth middleware:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = auth;
