import { query } from '../config/db.js';

class AnalyticsModel {
  /**
   * Create a new analytical result
   * @param {string} log_id 
   * @param {string} pattern_found 
   * @param {string} recommendation 
   * @returns {Promise<object>} Analytical result object
   */
  static async create(log_id, pattern_found, recommendation) {
    const sql = `
      INSERT INTO analytical_results (log_id, pattern_found, recommendation)
      VALUES ($1, $2, $3)
      RETURNING analytic_id, log_id, pattern_found, recommendation, analyzed_at;
    `;
    const res = await query(sql, [log_id, pattern_found, recommendation]);
    return res.rows[0];
  }

  /**
   * Find analytical result by ID
   * @param {string} analytic_id 
   * @returns {Promise<object|null>} Analysis object or null
   */
  static async findById(analytic_id) {
    const sql = `
      SELECT analytic_id, log_id, pattern_found, recommendation, analyzed_at
      FROM analytical_results
      WHERE analytic_id = $1;
    `;
    const res = await query(sql, [analytic_id]);
    return res.rows[0] || null;
  }

  /**
   * Find analytical result by Log ID
   * @param {string} log_id 
   * @returns {Promise<object|null>} Analysis object or null
   */
  static async findByLogId(log_id) {
    const sql = `
      SELECT analytic_id, log_id, pattern_found, recommendation, analyzed_at
      FROM analytical_results
      WHERE log_id = $1;
    `;
    const res = await query(sql, [log_id]);
    return res.rows[0] || null;
  }

  /**
   * Find all analytical results for a user (joins with log_game to filter by user_id)
   * @param {string} user_id 
   * @returns {Promise<Array>} List of analysis results with corresponding game details
   */
  static async findByUserId(user_id) {
    const sql = `
      SELECT 
        ar.analytic_id, 
        ar.log_id, 
        ar.pattern_found, 
        ar.recommendation, 
        ar.analyzed_at,
        lg.response_time,
        lg.wrong_answer_count,
        lg.hint_count,
        lg.play_time
      FROM analytical_results ar
      JOIN log_game lg ON ar.log_id = lg.log_id
      WHERE lg.user_id = $1
      ORDER BY ar.analyzed_at DESC;
    `;
    const res = await query(sql, [user_id]);
    return res.rows;
  }
}

export default AnalyticsModel;
