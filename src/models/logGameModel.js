import { query } from '../config/db.js';

class LogGameModel {
  /**
   * Create a new game log
   * @param {string} user_id 
   * @param {number} response_time 
   * @param {number} wrong_answer_count 
   * @param {number} hint_count 
   * @returns {Promise<object>} LogGame object
   */
  static async create(user_id, response_time, wrong_answer_count, hint_count) {
    const sql = `
      INSERT INTO log_game (user_id, response_time, wrong_answer_count, hint_count)
      VALUES ($1, $2, $3, $4)
      RETURNING log_id, user_id, response_time, wrong_answer_count, hint_count, play_time;
    `;
    const res = await query(sql, [user_id, response_time, wrong_answer_count, hint_count]);
    return res.rows[0];
  }

  /**
   * Find game log by ID
   * @param {string} log_id 
   * @returns {Promise<object|null>} LogGame object or null
   */
  static async findById(log_id) {
    const sql = `
      SELECT log_id, user_id, response_time, wrong_answer_count, hint_count, play_time
      FROM log_game
      WHERE log_id = $1;
    `;
    const res = await query(sql, [log_id]);
    return res.rows[0] || null;
  }

  /**
   * Find all game logs for a user
   * @param {string} user_id 
   * @returns {Promise<Array>} List of game logs
   */
  static async findByUserId(user_id) {
    const sql = `
      SELECT log_id, user_id, response_time, wrong_answer_count, hint_count, play_time
      FROM log_game
      WHERE user_id = $1
      ORDER BY play_time DESC;
    `;
    const res = await query(sql, [user_id]);
    return res.rows;
  }

  /**
   * Delete a game log
   * @param {string} log_id 
   * @returns {Promise<boolean>} True if deleted
   */
  static async delete(log_id) {
    const sql = `
      DELETE FROM log_game
      WHERE log_id = $1;
    `;
    const res = await query(sql, [log_id]);
    return (res.rowCount || 0) > 0;
  }
}

export default LogGameModel;
