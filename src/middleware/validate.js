/**
 * ACNS Backend - Validation Middleware
 * Zod schema validation for request data
 */

const ApiResponse = require("../utils/apiResponse");

/**
 * Validate request body against Zod schema
 */
const validateBody = (schema) => {
  return (req, res, next) => {
    try {
      const result = schema.safeParse(req.body);

      if (!result.success) {
        const errors = result.error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        return ApiResponse.validationError(res, errors, "Validation failed");
      }

      // Replace body with parsed data (includes defaults)
      req.body = result.data;
      next();
    } catch (error) {
      return ApiResponse.serverError(res, "Validation error");
    }
  };
};

/**
 * Validate request query params against Zod schema
 */
const validateQuery = (schema) => {
  return (req, res, next) => {
    try {
      const result = schema.safeParse(req.query);

      if (!result.success) {
        const errors = result.error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        return ApiResponse.validationError(
          res,
          errors,
          "Invalid query parameters",
        );
      }

      // Replace query with parsed data (includes defaults)
      req.query = result.data;
      next();
    } catch (error) {
      return ApiResponse.serverError(res, "Validation error");
    }
  };
};

/**
 * Validate request params against Zod schema
 */
const validateParams = (schema) => {
  return (req, res, next) => {
    try {
      const result = schema.safeParse(req.params);

      if (!result.success) {
        const errors = result.error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        return ApiResponse.validationError(
          res,
          errors,
          "Invalid URL parameters",
        );
      }

      req.params = result.data;
      next();
    } catch (error) {
      return ApiResponse.serverError(res, "Validation error");
    }
  };
};

module.exports = {
  validateBody,
  validateQuery,
  validateParams,
};
