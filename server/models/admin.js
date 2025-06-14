const db = require('../config/database');

class Admin {
  static async findByEmail(email) {
    try {
      const [rows] = await db.query('SELECT * FROM users WHERE email = ? AND role = "admin"', [email]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async createToken(adminId) {
    // Generate a simple token (in production, use JWT)
    const token = Buffer.from(`${adminId}-${Date.now()}`).toString('base64');
    return token;
  }
}

module.exports = Admin; 