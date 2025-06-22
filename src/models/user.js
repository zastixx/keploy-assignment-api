const pool = require("../config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

class User {
  // This is a basic implementation for future use

  // Create a user
  static async create(userData) {
    try {
      const { email, password, name, role, org_id } = userData;

      // In a real application, you would hash the password before storing
      const query = `
        INSERT INTO users 
        (email, password, name, role, org_id) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING id, email, name, role, org_id, created_at
      `;

      const params = [email, password, name, role || "user", org_id || null];

      const { rows } = await pool.query(query, params);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get user by email
  static async getByEmail(email) {
    try {
      const query = "SELECT * FROM users WHERE email = $1";
      const { rows } = await pool.query(query, [email]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get user by ID
  static async getById(id) {
    try {
      const query = "SELECT * FROM users WHERE id = $1";
      const { rows } = await pool.query(query, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Generate JWT Token
  static generateToken(user) {
    // Create payload with user info
    // Exclude sensitive info like password
    const payload = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        org_id: user.org_id,
      },
    };

    // Sign token with JWT secret
    return jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // Token expires in 1 day
    );
  }
}

module.exports = User;
