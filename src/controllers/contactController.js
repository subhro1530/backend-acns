/**
 * ACNS Backend - Contact Controller
 * HTTP handlers for contact endpoints
 */

const contactService = require("../services/contactService");
const ApiResponse = require("../utils/apiResponse");

class ContactController {
  /**
   * POST /api/contact/submit
   * Submit contact request (public)
   */
  async submit(req, res, next) {
    try {
      const contact = await contactService.submit(req.body);
      return ApiResponse.created(
        res,
        contact,
        "Thank you for your message. We will get back to you soon.",
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/contact/all
   * Get all contact requests (admin)
   */
  async getAll(req, res, next) {
    try {
      const result = await contactService.getAll(req.query);
      return ApiResponse.paginated(
        res,
        result.contacts,
        result.pagination,
        "Contact requests retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/contact/:id
   * Get contact by ID (admin)
   */
  async getById(req, res, next) {
    try {
      const contact = await contactService.getById(req.params.id);
      return ApiResponse.success(
        res,
        contact,
        "Contact request retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/contact/:id
   * Delete contact request (admin)
   */
  async delete(req, res, next) {
    try {
      const result = await contactService.delete(req.params.id);
      return ApiResponse.success(res, null, result.message);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/contact/:id/status
   * Update contact status (admin)
   */
  async updateStatus(req, res, next) {
    try {
      const { status } = req.body;
      const contact = await contactService.updateStatus(req.params.id, status);
      return ApiResponse.success(res, contact, "Contact status updated");
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/contact/:id/notes
   * Add notes to contact (admin)
   */
  async addNotes(req, res, next) {
    try {
      const { notes } = req.body;
      const contact = await contactService.addNotes(req.params.id, notes);
      return ApiResponse.success(res, contact, "Notes added successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/contact/unread-count
   * Get unread count (admin)
   */
  async getUnreadCount(req, res, next) {
    try {
      const count = await contactService.getUnreadCount();
      return ApiResponse.success(
        res,
        { count },
        "Unread count retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/contact/statistics
   * Get contact statistics (admin)
   */
  async getStatistics(req, res, next) {
    try {
      const stats = await contactService.getStatistics();
      return ApiResponse.success(
        res,
        stats,
        "Statistics retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/contact/recent
   * Get recent contacts (admin)
   */
  async getRecent(req, res, next) {
    try {
      const limit = parseInt(req.query.limit, 10) || 10;
      const contacts = await contactService.getRecent(limit);
      return ApiResponse.success(
        res,
        contacts,
        "Recent contacts retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ContactController();
