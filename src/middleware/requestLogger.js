/**
 * ACNS Backend - Request Logger Middleware
 * Logs all incoming HTTP requests
 */

const logger = require("../utils/logger");

/**
 * HTTP request logger middleware
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Store original end function
  const originalEnd = res.end;

  // Override end function to log after response
  res.end = function (chunk, encoding) {
    // Call original end
    res.end = originalEnd;
    res.end(chunk, encoding);

    // Calculate duration
    const duration = Date.now() - start;

    // Log the request
    logger.http(req, res, duration);
  };

  next();
};

module.exports = requestLogger;
