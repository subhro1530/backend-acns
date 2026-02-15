/**
 * ACNS Backend - Error Handler Middleware
 * Centralized error handling for the application
 */

const config = require("../config");
const logger = require("../utils/logger");
const { AppError } = require("../utils/errors");

/**
 * Handle 404 Not Found errors
 */
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Global error handler
 */
const errorHandler = (err, req, res, next) => {
  // Log error
  logger.error("Error occurred", {
    message: err.message,
    stack: config.isProduction ? undefined : err.stack,
    path: req.path,
    method: req.method,
    userId: req.user?.id,
  });

  // Handle Prisma errors
  if (err.code) {
    switch (err.code) {
      case "P2002":
        // Unique constraint violation
        const field = err.meta?.target?.[0] || "field";
        return res.status(409).json({
          success: false,
          message: `A record with this ${field} already exists`,
          timestamp: new Date().toISOString(),
        });

      case "P2025":
        // Record not found
        return res.status(404).json({
          success: false,
          message: "Record not found",
          timestamp: new Date().toISOString(),
        });

      case "P2003":
        // Foreign key constraint violation
        return res.status(400).json({
          success: false,
          message: "Invalid reference. Related record not found.",
          timestamp: new Date().toISOString(),
        });
    }
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
      timestamp: new Date().toISOString(),
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expired",
      timestamp: new Date().toISOString(),
    });
  }

  // Handle Multer errors
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      message: "File too large",
      timestamp: new Date().toISOString(),
    });
  }

  if (err.code === "LIMIT_FILE_COUNT") {
    return res.status(400).json({
      success: false,
      message: "Too many files",
      timestamp: new Date().toISOString(),
    });
  }

  // Handle custom AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
      timestamp: new Date().toISOString(),
    });
  }

  // Handle validation errors
  if (err.name === "ValidationError") {
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: err.errors,
      timestamp: new Date().toISOString(),
    });
  }

  // Default server error
  const statusCode = err.statusCode || 500;
  const message = config.isProduction
    ? "An unexpected error occurred"
    : err.message || "Internal server error";

  res.status(statusCode).json({
    success: false,
    message,
    ...(config.isProduction ? {} : { stack: err.stack }),
    timestamp: new Date().toISOString(),
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
