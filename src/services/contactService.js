/**
 * ACNS Backend - Contact Service
 * Business logic for contact request management
 */

const contactRepository = require("../repositories/contactRepository");
const { NotFoundError } = require("../utils/errors");
const {
  parsePagination,
  buildOrderBy,
  buildSearchFilter,
} = require("../utils/helpers");
const emailService = require("../utils/emailService");

class ContactService {
  /**
   * Submit contact request
   */
  async submit(data) {
    const contact = await contactRepository.create(data);

    // Send email notification (async, don't wait)
    emailService.sendContactNotification(contact).catch((err) => {
      console.error("Failed to send contact notification:", err);
    });

    return contact;
  }

  /**
   * Get all contact requests with pagination and filtering
   */
  async getAll(query) {
    const { page, limit, skip } = parsePagination(query);
    const orderBy = buildOrderBy(query.sortBy || "createdAt", query.sortOrder);

    let where = {};

    // Search filter
    if (query.search) {
      where = buildSearchFilter(query.search, [
        "name",
        "email",
        "subject",
        "message",
      ]);
    }

    // Status filter
    if (query.status) {
      where.status = query.status;
    }

    const { data, total } = await contactRepository.findAll({
      where,
      orderBy,
      skip,
      take: limit,
    });

    return {
      contacts: data,
      pagination: { page, limit, total },
    };
  }

  /**
   * Get contact by ID
   */
  async getById(id) {
    const contact = await contactRepository.findById(id);

    if (!contact) {
      throw new NotFoundError("Contact request not found");
    }

    // Mark as read if new
    if (contact.status === "NEW") {
      await contactRepository.markAsRead(id);
    }

    return contact;
  }

  /**
   * Delete contact request
   */
  async delete(id) {
    const contact = await contactRepository.findById(id);

    if (!contact) {
      throw new NotFoundError("Contact request not found");
    }

    await contactRepository.delete(id);
    return { message: "Contact request deleted successfully" };
  }

  /**
   * Update contact status
   */
  async updateStatus(id, status) {
    const contact = await contactRepository.findById(id);

    if (!contact) {
      throw new NotFoundError("Contact request not found");
    }

    return contactRepository.updateStatus(id, status);
  }

  /**
   * Mark as replied
   */
  async markAsReplied(id) {
    return this.updateStatus(id, "REPLIED");
  }

  /**
   * Archive contact
   */
  async archive(id) {
    return this.updateStatus(id, "ARCHIVED");
  }

  /**
   * Add notes
   */
  async addNotes(id, notes) {
    const contact = await contactRepository.findById(id);

    if (!contact) {
      throw new NotFoundError("Contact request not found");
    }

    return contactRepository.addNotes(id, notes);
  }

  /**
   * Get unread count
   */
  async getUnreadCount() {
    return contactRepository.getUnreadCount();
  }

  /**
   * Get contact statistics
   */
  async getStatistics() {
    return contactRepository.getStatistics();
  }

  /**
   * Get recent contacts
   */
  async getRecent(limit = 10) {
    return contactRepository.getRecent(limit);
  }
}

module.exports = new ContactService();
