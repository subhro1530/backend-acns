/**
 * ACNS Backend - Logger Utility
 * Provides structured logging with different levels
 */

const config = require("../config");

const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

const currentLevel = config.isProduction ? LOG_LEVELS.INFO : LOG_LEVELS.DEBUG;

const formatMessage = (level, message, meta = {}) => {
  const timestamp = new Date().toISOString();
  const metaString =
    Object.keys(meta).length > 0 ? ` | ${JSON.stringify(meta)}` : "";
  return `[${timestamp}] [${level}] ${message}${metaString}`;
};

const logger = {
  error: (message, meta = {}) => {
    if (LOG_LEVELS.ERROR <= currentLevel) {
      console.error(formatMessage("ERROR", message, meta));
    }
  },

  warn: (message, meta = {}) => {
    if (LOG_LEVELS.WARN <= currentLevel) {
      console.warn(formatMessage("WARN", message, meta));
    }
  },

  info: (message, meta = {}) => {
    if (LOG_LEVELS.INFO <= currentLevel) {
      console.info(formatMessage("INFO", message, meta));
    }
  },

  debug: (message, meta = {}) => {
    if (LOG_LEVELS.DEBUG <= currentLevel) {
      console.log(formatMessage("DEBUG", message, meta));
    }
  },

  // HTTP request logger
  http: (req, res, duration) => {
    const log = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip:
        req.ip ||
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress,
      userAgent: req.headers["user-agent"],
    };

    const level = res.statusCode >= 400 ? "error" : "info";
    logger[level](
      `HTTP ${req.method} ${req.originalUrl} - ${res.statusCode}`,
      log,
    );
  },

  // Database query logger
  query: (query, duration) => {
    logger.debug(`Database Query`, { query, duration: `${duration}ms` });
  },
};

module.exports = logger;
