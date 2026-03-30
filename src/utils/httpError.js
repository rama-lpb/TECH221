// src/utils/httpError.js
class HttpError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = 'HttpError';
  }
}

module.exports = HttpError;
