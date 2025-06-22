const Vendor = require("../models/vendor");

// Controller methods for handling vendor-related operations
class VendorController {
  // Get all vendors
  async getAllVendors(req, res) {
    try {
      // For multi-tenancy support, extract user_id and org_id from JWT token
      const userId = req.user?.id;
      const orgId = req.user?.org_id;

      const vendors = await Vendor.getAll(userId, orgId);
      return res.status(200).json({
        success: true,
        count: vendors.length,
        data: vendors,
      });
    } catch (error) {
      console.error("Error fetching vendors:", error);
      return res.status(500).json({
        success: false,
        message: "Server error while fetching vendors",
      });
    }
  }

  // Get a single vendor by ID
  async getVendorById(req, res) {
    try {
      const id = parseInt(req.params.id);

      // For multi-tenancy support
      const userId = req.user?.id;
      const orgId = req.user?.org_id;

      const vendor = await Vendor.getById(id, userId, orgId);

      if (!vendor) {
        return res.status(404).json({
          success: false,
          message: "Vendor not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: vendor,
      });
    } catch (error) {
      console.error("Error fetching vendor by ID:", error);
      return res.status(500).json({
        success: false,
        message: "Server error while fetching vendor",
      });
    }
  }

  // Create a new vendor
  async createVendor(req, res) {
    try {
      const { name, category, contact_email, phone_number, address } = req.body;

      // Validate required fields
      if (!name || !category) {
        return res.status(400).json({
          success: false,
          message: "Please provide name and category for the vendor",
        });
      }

      // For multi-tenancy support
      const vendorData = {
        ...req.body,
        user_id: req.user?.id, // From JWT token
        org_id: req.user?.org_id, // From JWT token
      };

      const newVendor = await Vendor.create(vendorData);

      return res.status(201).json({
        success: true,
        data: newVendor,
      });
    } catch (error) {
      console.error("Error creating vendor:", error);
      return res.status(500).json({
        success: false,
        message: "Server error while creating vendor",
      });
    }
  }

  // Update a vendor
  async updateVendor(req, res) {
    try {
      const id = parseInt(req.params.id);

      // For multi-tenancy support
      const userId = req.user?.id;
      const orgId = req.user?.org_id;

      // Check if vendor exists and belongs to this user/org
      const existingVendor = await Vendor.getById(id, userId, orgId);

      if (!existingVendor) {
        return res.status(404).json({
          success: false,
          message:
            "Vendor not found or you do not have permission to update it",
        });
      }

      // Update the vendor
      const updatedVendor = await Vendor.update(id, req.body, userId, orgId);

      return res.status(200).json({
        success: true,
        data: updatedVendor,
      });
    } catch (error) {
      console.error("Error updating vendor:", error);
      return res.status(500).json({
        success: false,
        message: "Server error while updating vendor",
      });
    }
  }

  // Delete a vendor
  async deleteVendor(req, res) {
    try {
      const id = parseInt(req.params.id);

      // For multi-tenancy support
      const userId = req.user?.id;
      const orgId = req.user?.org_id;

      // Check if vendor exists and belongs to this user/org
      const existingVendor = await Vendor.getById(id, userId, orgId);

      if (!existingVendor) {
        return res.status(404).json({
          success: false,
          message:
            "Vendor not found or you do not have permission to delete it",
        });
      }

      // Delete the vendor
      await Vendor.delete(id, userId, orgId);

      return res.status(200).json({
        success: true,
        message: "Vendor deleted successfully",
        data: {},
      });
    } catch (error) {
      console.error("Error deleting vendor:", error);
      return res.status(500).json({
        success: false,
        message: "Server error while deleting vendor",
      });
    }
  }
}

module.exports = new VendorController();
