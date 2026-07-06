import LogGameModel from '../models/logGameModel.js';
import UserModel from '../models/userModel.js';
import AnalyticsService from '../services/analyticsService.js';
import { sendSuccess, sendError } from '../utils/response.js';

class LogGameController {
  /**
   * Create a new game log and automatically run assessment analysis
   */
  static async createLog(req, res, next) {
    try {
      const { user_id, response_time, wrong_answer_count, hint_count } = req.body;

      // 1. Verify user exists
      const userExists = await UserModel.findById(user_id);
      if (!userExists) {
        return sendError(res, 'User tidak ditemukan. Harap daftarkan user terlebih dahulu.', 404);
      }

      // 2. Insert game log
      const log = await LogGameModel.create(
        user_id,
        response_time,
        wrong_answer_count,
        hint_count
      );

      // 3. Trigger Analytics assess engine to analyze game session and create recommendations
      const analysis = await AnalyticsService.analyzeSession(log);

      return sendSuccess(res, {
        log,
        analysis
      }, 201);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get all logs for a specific user
   */
  static async getLogsByUser(req, res, next) {
    try {
      const { user_id } = req.params;

      // Verify user exists
      const userExists = await UserModel.findById(user_id);
      if (!userExists) {
        return sendError(res, 'User tidak ditemukan', 404);
      }

      const logs = await LogGameModel.findByUserId(user_id);
      return sendSuccess(res, logs);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get a specific game log details
   */
  static async getLogById(req, res, next) {
    try {
      const { id } = req.params;
      const log = await LogGameModel.findById(id);
      if (!log) {
        return sendError(res, 'Log game tidak ditemukan', 404);
      }
      return sendSuccess(res, log);
    } catch (err) {
      next(err);
    }
  }
}

export default LogGameController;
