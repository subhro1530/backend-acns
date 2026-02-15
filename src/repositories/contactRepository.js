/**
 * ACNS Backend - Contact Repository
 * Database operations for ContactRequest model
 */

const BaseRepository = require("./baseRepository");
const prisma = require("../config/database");

class ContactRepository extends BaseRepository {
  constructor() {
    super("contactRequest");
  }

  /**
   * Get contacts by status
   */
  async findByStatus(status, options = {}) {
    return this.findAll({
      ...options,
      where: {
        ...options.where,
        status,
      },
    });
  }

  /**
   * Update contact status
   */
  async updateStatus(id, status) {
    const updateData = { status };

    if (status === "REPLIED") {
      updateData.repliedAt = new Date();
    }

    return this.model.update({
      where: { id },
      data: updateData,
    });
  }

  /**
   * Mark as read
   */
  async markAsRead(id) {
    return this.updateStatus(id, "READ");
  }

  /**
   * Archive contact
   */
  async archive(id) {
    return this.updateStatus(id, "ARCHIVED");
  }

  /**
   * Add notes to contact
   */
  async addNotes(id, notes) {
    return this.model.update({
      where: { id },
      data: { notes },
    });
  }

  /**
   * Get unread count
   */
  async getUnreadCount() {
    return this.model.count({
      where: { status: "NEW" },
    });
  }

  /**
   * Get contact statistics
   */
  async getStatistics() {
    const stats = await prisma.$queryRaw`
      SELECT status, COUNT(*)::int as count
      FROM contact_requests
      GROUP BY status
    `;
    return stats;
  }

  /**
   * Search contacts
   */
  async search(query, options = {}) {
    return this.findAll({
      ...options,
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
          { subject: { contains: query, mode: "insensitive" } },
          { message: { contains: query, mode: "insensitive" } },
        ],
      },
    });
  }

  /**
   * Get recent contacts
   */
  async getRecent(limit = 10) {
    return this.model.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }
}

module.exports = new ContactRepository();
