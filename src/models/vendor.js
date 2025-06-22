// For demo purposes, we're using an in-memory database
// instead of connecting to PostgreSQL
const inMemoryDb = require("../config/inMemoryDb");

class Vendor {
  // Get all vendors
  // If userId/orgId provided, filter by those for multi-tenancy
  static async getAll(userId = null, orgId = null) {
    try {
      // Get all vendors from in-memory database
      let vendors = inMemoryDb.getAllVendors();

      // Filter by userId/orgId if provided (for multi-tenancy)
      if (userId || orgId) {
        vendors = vendors.filter((vendor) => {
          let match = true;
          if (userId) match = match && vendor.user_id === userId;
          if (orgId) match = match && vendor.org_id === orgId;
          return match;
        });
      }

      // Sort by created_at in descending order
      vendors.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      return vendors;
    } catch (error) {
      throw error;
    }
  }
  // Get a vendor by ID
  // Include userId/orgId check for multi-tenancy
  static async getById(id, userId = null, orgId = null) {
    try {
      // Get vendor from in-memory database
      const vendor = inMemoryDb.getVendorById(id);

      // Return null if vendor doesn't exist
      if (!vendor) return null;

      // Check multi-tenancy permissions if applicable
      if (userId && vendor.user_id !== userId) return null;
      if (orgId && vendor.org_id !== orgId) return null;

      return vendor;
    } catch (error) {
      throw error;
    }
  }

  // Create a new vendor
  static async create(vendorData) {
    try {
      // Add vendor to in-memory database
      const newVendor = inMemoryDb.addVendor({
        name: vendorData.name,
        category: vendorData.category,
        contact_email: vendorData.contact_email,
        phone_number: vendorData.phone_number,
        address: vendorData.address,
        user_id: vendorData.user_id || null,
        org_id: vendorData.org_id || null,
      });

      return newVendor;
    } catch (error) {
      throw error;
    }
  }

  // Update a vendor
  static async update(id, vendorData, userId = null, orgId = null) {
    try {
      // Check if vendor exists and check permissions
      const existingVendor = await this.getById(id, userId, orgId);
      if (!existingVendor) return null;

      // Update vendor in in-memory database
      const updatedVendor = inMemoryDb.updateVendor(id, {
        name: vendorData.name,
        category: vendorData.category,
        contact_email: vendorData.contact_email,
        phone_number: vendorData.phone_number,
        address: vendorData.address,
      });

      return updatedVendor;
    } catch (error) {
      throw error;
    }
  }

  // Delete a vendor
  static async delete(id, userId = null, orgId = null) {
    try {
      // Check if vendor exists and check permissions
      const existingVendor = await this.getById(id, userId, orgId);
      if (!existingVendor) return null;

      // Delete vendor from in-memory database
      const deletedVendor = inMemoryDb.deleteVendor(id);

      return deletedVendor;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Vendor;
