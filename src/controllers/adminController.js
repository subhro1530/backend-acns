/**
 * ACNS Backend - Admin Controller
 * HTTP handlers for admin authentication endpoints
 */

const adminService = require("../services/adminService");
const ApiResponse = require("../utils/apiResponse");
const logger = require("../utils/logger");

class AdminController {
  /**
   * POST /api/admin/login
   * Admin login
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await adminService.login(email, password);

      logger.info("Admin login successful", { email });
      return ApiResponse.success(res, result, "Login successful");
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/profile
   * Get current admin profile
   */
  async getProfile(req, res, next) {
    try {
      const profile = await adminService.getProfile(req.user.id);
      return ApiResponse.success(
        res,
        profile,
        "Profile retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/admin/change-password
   * Change admin password
   */
  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      const result = await adminService.changePassword(
        req.user.id,
        currentPassword,
        newPassword,
      );

      logger.info("Admin password changed", { adminId: req.user.id });
      return ApiResponse.success(res, null, result.message);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdminController();
