import { sendError } from '../utils/response.js';

// Simple regex to check for UUID format
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Validate user creation / update payload
 */
export const validateUser = (req, res, next) => {
  const { name } = req.body;

  if (name !== undefined && name !== null) {
    if (typeof name !== 'string') {
      return sendError(res, 'Nama harus berupa text', 400);
    }
    if (name.trim().length === 0) {
      return sendError(res, 'Nama tidak boleh kosong', 400);
    }
  }

  next();
};

/**
 * Validate game log insertion payload
 */
export const validateLog = (req, res, next) => {
  const { user_id, response_time, wrong_answer_count, hint_count } = req.body;

  if (!user_id || !uuidRegex.test(user_id)) {
    return sendError(res, 'Format user_id tidak valid atau kosong (harus berupa UUID)', 400);
  }

  if (response_time === undefined || typeof response_time !== 'number' || response_time < 0) {
    return sendError(res, 'response_time harus berupa angka bilangan bulat non-negatif', 400);
  }

  if (wrong_answer_count === undefined || typeof wrong_answer_count !== 'number' || wrong_answer_count < 0) {
    return sendError(res, 'wrong_answer_count harus berupa angka bilangan bulat non-negatif', 400);
  }

  if (hint_count === undefined || typeof hint_count !== 'number' || hint_count < 0) {
    return sendError(res, 'hint_count harus berupa angka bilangan bulat non-negatif', 400);
  }

  next();
};
