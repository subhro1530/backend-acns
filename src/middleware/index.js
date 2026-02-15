/**
 * ACNS Backend - Middleware Index
 * Central export point for all middleware
 */

const { authenticate, authorize, optionalAuth } = require("./auth");
const { validateBody, validateQuery, validateParams } = require("./validate");
const { notFoundHandler, errorHandler } = require("./errorHandler");
const requestLogger = require("./requestLogger");
const upload = require("./upload");

module.exports = {
  // Authentication
  authenticate,
  authorize,
  optionalAuth,

  // Validation
  validateBody,
  validateQuery,
  validateParams,

  // Error handling
  notFoundHandler,
  errorHandler,

  // Logging
  requestLogger,

  // Upload
  ...upload,
};
