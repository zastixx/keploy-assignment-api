const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Log that we're using in-memory DB for demonstration
console.log("Using in-memory database for demonstration purposes");

// Import routes
const vendorRoutes = require("./routes/vendorRoutes");

// Initialize express app
const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"], // Allow React app to connect
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Origin",
      "X-Requested-With",
      "Accept",
    ],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api/vendors", vendorRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Vendor Management API",
    version: "1.0.0",
    documentation: "/api/docs", // For future API documentation
  });
});

// Set port from environment variables or default to 3000
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; // For testing purposes
