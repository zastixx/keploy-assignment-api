const pool = require("./db");

const seedDatabase = async () => {
  try {
    // First create tables if they don't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vendors (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        contact_email VARCHAR(255),
        phone_number VARCHAR(50),
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        user_id INTEGER,
        org_id INTEGER
      )
    `);

    // Seed some sample vendors
    const sampleVendors = [
      {
        name: "ABC Supplies",
        category: "Office Supplies",
        contact_email: "info@abcsupplies.com",
        phone_number: "123-456-7890",
        address: "123 Main St, City, Country",
      },
      {
        name: "XYZ Technologies",
        category: "IT Services",
        contact_email: "contact@xyztech.com",
        phone_number: "987-654-3210",
        address: "456 Tech Ave, City, Country",
      },
      {
        name: "Global Logistics",
        category: "Shipping",
        contact_email: "support@globallogistics.com",
        phone_number: "555-789-1234",
        address: "789 Shipping Lane, Port City, Country",
      },
    ];

    // Insert sample vendors
    for (const vendor of sampleVendors) {
      await pool.query(
        `
        INSERT INTO vendors (name, category, contact_email, phone_number, address)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT DO NOTHING
      `,
        [
          vendor.name,
          vendor.category,
          vendor.contact_email,
          vendor.phone_number,
          vendor.address,
        ]
      );
    }

    console.log("Sample data inserted successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

seedDatabase();
