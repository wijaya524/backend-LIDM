/**
 * Send a success response
 * @param {object} res - Express response object
 * @param {any} data - Data to send in response
 * @param {number} statusCode - HTTP status code (default 200)
 */
export const sendSuccess = (res, data, statusCode = 200) => {
  return res.status(statusCode).json({
    status: 'success',
    data,
  });
};

/**
 * Send an error response
 * @param {object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default 500)
 */
export const sendError = (res, message, statusCode = 500) => {
  return res.status(statusCode).json({
    status: 'error',
    message,
  });
};
