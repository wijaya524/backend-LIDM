import { sendError } from '../utils/response.js';

/**
 * Express global error handling middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Unhandled Server Error:', err);

  // Check if error is database constraint (e.g. invalid UUID format)
  if (err.code === '22P02') {
    return sendError(res, 'Format ID tidak valid (Format UUID salah)', 400);
  }

  if (err.code === '23503') {
    return sendError(res, 'ID Referensi tidak ditemukan (Foreign Key constraint violation)', 400);
  }

  const message = process.env.NODE_ENV === 'development' ? err.message : 'Terjadi kesalahan pada internal server';
  return sendError(res, message, 500);
};

export default errorHandler;
