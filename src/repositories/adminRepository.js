/**
 * ACNS Backend - Admin Repository
 * Database operations for AdminUser model
 */

const BaseRepository = require("./baseRepository");
const prisma = require("../config/database");

class AdminRepository extends BaseRepository {
  constructor() {
    super("adminUser");
  }

  /**
   * Find admin by email
   */
  async findByEmail(email) {
    return this.model.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  /**
   * Create admin with lowercase email
   */
  async createAdmin(data) {
    return this.model.create({
      data: {
        ...data,
        email: data.email.toLowerCase(),
      },
    });
  }

  /**
   * Update last login timestamp
   */
  async updateLastLogin(id) {
    return this.model.update({
      where: { id },
      data: { lastLogin: new Date() },
    });
  }

  /**
   * Change password
   */
  async changePassword(id, hashedPassword) {
    return this.model.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  /**
   * Get admin profile (excluding password)
   */
  async getProfile(id) {
    return this.model.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}

module.exports = new AdminRepository();
