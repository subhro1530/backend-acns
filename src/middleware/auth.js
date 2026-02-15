/**
 * ACNS Backend - Authentication Middleware
 * JWT token verification and role-based access control
 */

const jwt = require("jsonwebtoken");
const config = require("../config");
const prisma = require("../config/database");
const ApiResponse = require("../utils/apiResponse");
const logger = require("../utils/logger");

/**
 * Verify JWT token and attach user to request
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return ApiResponse.unauthorized(res, "Access token is required");
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwt.secret);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return ApiResponse.unauthorized(res, "Token has expired");
      }
      return ApiResponse.unauthorized(res, "Invalid token");
    }

    // Check if user exists and is active
    const user = await prisma.adminUser.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
      },
    });

    if (!user) {
      return ApiResponse.unauthorized(res, "User not found");
    }

    if (!user.isActive) {
      return ApiResponse.forbidden(res, "Account has been deactivated");
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    logger.error("Authentication error", { error: error.message });
    return ApiResponse.serverError(res, "Authentication failed");
  }
};

/**
 * Role-based access control middleware
 * @param  {...string} allowedRoles - Roles allowed to access the route
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return ApiResponse.unauthorized(res, "Authentication required");
    }

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn("Access denied - insufficient permissions", {
        userId: req.user.id,
        userRole: req.user.role,
        requiredRoles: allowedRoles,
      });
      return ApiResponse.forbidden(
        res,
        "You do not have permission to perform this action",
      );
    }

    next();
  };
};

/**
 * Optional authentication - doesn't fail if no token
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      const user = await prisma.adminUser.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
        },
      });

      if (user && user.isActive) {
        req.user = user;
      }
    } catch (error) {
      // Ignore token errors for optional auth
    }

    next();
  } catch (error) {
    next();
  }
};

module.exports = {
  authenticate,
  authorize,
  optionalAuth,
};
