import UserModel from '../models/userModel.js';
import { sendSuccess, sendError } from '../utils/response.js';

class UserController {
  /**
   * Create a new user
   */
  static async createUser(req, res, next) {
    try {
      const { name } = req.body;
      const user = await UserModel.create(name || null);
      return sendSuccess(res, user, 201);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get user profile by ID
   */
  static async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await UserModel.findById(id);
      if (!user) {
        return sendError(res, 'User tidak ditemukan', 404);
      }
      return sendSuccess(res, user);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Update user name
   */
  static async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      
      const userExists = await UserModel.findById(id);
      if (!userExists) {
        return sendError(res, 'User tidak ditemukan', 404);
      }

      const updatedUser = await UserModel.update(id, name || null);
      return sendSuccess(res, updatedUser);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get all users list
   */
  static async getAllUsers(req, res, next) {
    try {
      const users = await UserModel.findAll();
      return sendSuccess(res, users);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Delete user
   */
  static async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await UserModel.delete(id);
      if (!deleted) {
        return sendError(res, 'User tidak ditemukan', 404);
      }
      return sendSuccess(res, { message: 'User berhasil dihapus' });
    } catch (err) {
      next(err);
    }
  }
}

export default UserController;
