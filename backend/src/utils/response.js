// src/utils/response.js
/**
 * Standard API response format helper.
 */
module.exports = {
  success: (res, data = null, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({ success: true, data, message });
  },
  error: (res, errorMessage = 'Error', statusCode = 500, error = null) => {
    const payload = { success: false, message: errorMessage };
    if (error) payload.error = error;
    return res.status(statusCode).json(payload);
  },
};
