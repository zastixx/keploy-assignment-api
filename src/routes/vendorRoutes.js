const express = require("express");
const router = express.Router();
const vendorController = require("../controllers/vendorController");
const auth = require("../middleware/auth");

// Apply auth middleware to all routes (optional but included)
// Middleware is currently configured to allow requests without auth token
router.use(auth);

// Route: GET /api/vendors
// Description: Get all vendors
router.get("/", vendorController.getAllVendors);

// Route: GET /api/vendors/:id
// Description: Get a single vendor by ID
router.get("/:id", vendorController.getVendorById);

// Route: POST /api/vendors
// Description: Create a new vendor
router.post("/", vendorController.createVendor);

// Route: PUT /api/vendors/:id
// Description: Update a vendor
router.put("/:id", vendorController.updateVendor);

// Route: DELETE /api/vendors/:id
// Description: Delete a vendor
router.delete("/:id", vendorController.deleteVendor);

module.exports = router;
