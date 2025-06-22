// In-memory database for demonstration purposes
const inMemoryDb = {
  vendors: [
    {
      id: 1,
      name: "ABC Supplies",
      category: "Office Supplies",
      contact_email: "info@abcsupplies.com",
      phone_number: "123-456-7890",
      address: "123 Main St, City, Country",
      created_at: "2025-06-21T12:00:00Z",
    },
    {
      id: 2,
      name: "XYZ Technologies",
      category: "IT Services",
      contact_email: "contact@xyztech.com",
      phone_number: "987-654-3210",
      address: "456 Tech Ave, City, Country",
      created_at: "2025-06-21T12:30:00Z",
    },
    {
      id: 3,
      name: "Global Logistics",
      category: "Shipping",
      contact_email: "support@globallogistics.com",
      phone_number: "555-789-1234",
      address: "789 Shipping Lane, Port City, Country",
      created_at: "2025-06-21T13:00:00Z",
    },
    {
      id: 4,
      name: "Quick Print Solutions",
      category: "Office Supplies",
      contact_email: "orders@quickprint.com",
      phone_number: "444-333-2222",
      address: "101 Print Blvd, Downtown, Country",
      created_at: "2025-06-21T14:10:00Z",
    },
  ],

  // Helper methods for the in-memory database
  getNextId() {
    const maxId =
      this.vendors.length > 0 ? Math.max(...this.vendors.map((v) => v.id)) : 0;
    return maxId + 1;
  },

  getAllVendors() {
    return [...this.vendors];
  },

  getVendorById(id) {
    return this.vendors.find((v) => v.id === Number(id)) || null;
  },

  addVendor(vendorData) {
    const newVendor = {
      id: this.getNextId(),
      ...vendorData,
      created_at: new Date().toISOString(),
    };
    this.vendors.push(newVendor);
    return newVendor;
  },

  updateVendor(id, vendorData) {
    const index = this.vendors.findIndex((v) => v.id === Number(id));
    if (index === -1) return null;

    const updatedVendor = {
      ...this.vendors[index],
      ...vendorData,
      id: Number(id), // Ensure id remains the same
    };

    this.vendors[index] = updatedVendor;
    return updatedVendor;
  },

  deleteVendor(id) {
    const index = this.vendors.findIndex((v) => v.id === Number(id));
    if (index === -1) return null;

    const deletedVendor = this.vendors[index];
    this.vendors.splice(index, 1);
    return deletedVendor;
  },
};

module.exports = inMemoryDb;
