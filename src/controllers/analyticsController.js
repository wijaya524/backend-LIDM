import AnalyticsModel from '../models/analyticsModel.js';
import UserModel from '../models/userModel.js';
import LogGameModel from '../models/logGameModel.js';
import { sendSuccess, sendError } from '../utils/response.js';

class AnalyticsController {
  /**
   * Get all analytical results and recommendations for a user
   */
  static async getAnalyticsByUser(req, res, next) {
    try {
      const { user_id } = req.params;

      // Verify user exists
      const userExists = await UserModel.findById(user_id);
      if (!userExists) {
        return sendError(res, 'User tidak ditemukan', 404);
      }

      const analytics = await AnalyticsModel.findByUserId(user_id);
      return sendSuccess(res, analytics);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get analysis details for a specific game log
   */
  static async getAnalysisByLog(req, res, next) {
    try {
      const { log_id } = req.params;

      // Verify log exists
      const logExists = await LogGameModel.findById(log_id);
      if (!logExists) {
        return sendError(res, 'Log game tidak ditemukan', 404);
      }

      const analysis = await AnalyticsModel.findByLogId(log_id);
      if (!analysis) {
        return sendError(res, 'Hasil analisis tidak ditemukan untuk log game ini', 404);
      }

      return sendSuccess(res, analysis);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get analysis details by ID
   */
  static async getAnalysisById(req, res, next) {
    try {
      const { id } = req.params;
      const analysis = await AnalyticsModel.findById(id);
      if (!analysis) {
        return sendError(res, 'Hasil analisis tidak ditemukan', 404);
      }
      return sendSuccess(res, analysis);
    } catch (err) {
      next(err);
    }
  }
}

export default AnalyticsController;
