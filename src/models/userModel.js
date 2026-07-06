import { query } from '../config/db.js';

class UserModel {
  /**
   * Create a new user
   * @param {string|null} name 
   * @returns {Promise<object>} User object
   */
  static async create(name = null) {
    const sql = `
      INSERT INTO "user" (name)
      VALUES ($1)
      RETURNING id, name, created_at;
    `;
    const res = await query(sql, [name]);
    return res.rows[0];
  }

  /**
   * Find user by ID
   * @param {string} id 
   * @returns {Promise<object|null>} User object or null
   */
  static async findById(id) {
    const sql = `
      SELECT id, name, created_at
      FROM "user"
      WHERE id = $1;
    `;
    const res = await query(sql, [id]);
    return res.rows[0] || null;
  }

  /**
   * Update user name
   * @param {string} id 
   * @param {string|null} name 
   * @returns {Promise<object|null>} Updated User object or null
   */
  static async update(id, name) {
    const sql = `
      UPDATE "user"
      SET name = $2
      WHERE id = $1
      RETURNING id, name, created_at;
    `;
    const res = await query(sql, [id, name]);
    return res.rows[0] || null;
  }

  /**
   * Retrieve all users
   * @returns {Promise<Array>} List of users
   */
  static async findAll() {
    const sql = `
      SELECT id, name, created_at
      FROM "user"
      ORDER BY created_at DESC;
    `;
    const res = await query(sql);
    return res.rows;
  }

  /**
   * Delete user by ID
   * @param {string} id 
   * @returns {Promise<boolean>} True if deleted, false if not found
   */
  static async delete(id) {
    const sql = `
      DELETE FROM "user"
      WHERE id = $1;
    `;
    const res = await query(sql, [id]);
    return (res.rowCount || 0) > 0;
  }
}

export default UserModel;
