/**
 * ACNS Backend - Admin Service
 * Business logic for admin authentication and management
 */

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config");
const adminRepository = require("../repositories/adminRepository");
const {
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
} = require("../utils/errors");

class AdminService {
  /**
   * Admin login
   */
  async login(email, password) {
    // Find admin by email
    const admin = await adminRepository.findByEmail(email);

    if (!admin) {
      throw new UnauthorizedError("Invalid email or password");
    }

    if (!admin.isActive) {
      throw new UnauthorizedError("Account has been deactivated");
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    // Update last login
    await adminRepository.updateLastLogin(admin.id);

    // Generate JWT token
    const token = this.generateToken(admin);

    // Return user data without password
    const { password: _, ...adminData } = admin;

    return {
      admin: adminData,
      token,
    };
  }

  /**
   * Get admin profile
   */
  async getProfile(adminId) {
    const admin = await adminRepository.getProfile(adminId);

    if (!admin) {
      throw new NotFoundError("Admin not found");
    }

    return admin;
  }

  /**
   * Change password
   */
  async changePassword(adminId, currentPassword, newPassword) {
    // Get admin with password
    const admin = await adminRepository.findById(adminId);

    if (!admin) {
      throw new NotFoundError("Admin not found");
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      admin.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestError("Current password is incorrect");
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await adminRepository.changePassword(adminId, hashedPassword);

    return { message: "Password changed successfully" };
  }

  /**
   * Create new admin (for seeding or super admin)
   */
  async createAdmin(data) {
    // Check if email already exists
    const existingAdmin = await adminRepository.findByEmail(data.email);

    if (existingAdmin) {
      throw new BadRequestError("An admin with this email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Create admin
    const admin = await adminRepository.createAdmin({
      ...data,
      password: hashedPassword,
    });

    // Return without password
    const { password: _, ...adminData } = admin;
    return adminData;
  }

  /**
   * Generate JWT token
   */
  generateToken(admin) {
    return jwt.sign(
      {
        userId: admin.id,
        email: admin.email,
        role: admin.role,
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn },
    );
  }

  /**
   * Verify JWT token
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, config.jwt.secret);
    } catch (error) {
      throw new UnauthorizedError("Invalid or expired token");
    }
  }
}

module.exports = new AdminService();
