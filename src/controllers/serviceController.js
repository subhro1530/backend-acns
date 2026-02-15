/**
 * ACNS Backend - Service Controller
 * HTTP handlers for service endpoints
 */

const serviceService = require("../services/serviceService");
const ApiResponse = require("../utils/apiResponse");

class ServiceController {
  /**
   * POST /api/services/create
   * Create new service
   */
  async create(req, res, next) {
    try {
      const service = await serviceService.create(req.body);
      return ApiResponse.created(res, service, "Service created successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/services/all
   * Get all services (admin)
   */
  async getAll(req, res, next) {
    try {
      const result = await serviceService.getAll(req.query);
      return ApiResponse.paginated(
        res,
        result.services,
        result.pagination,
        "Services retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/services/active
   * Get active services (public)
   */
  async getActive(req, res, next) {
    try {
      const result = await serviceService.getActive(req.query);
      return ApiResponse.paginated(
        res,
        result.services,
        result.pagination,
        "Services retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/services/:id
   * Get service by ID
   */
  async getById(req, res, next) {
    try {
      const service = await serviceService.getById(req.params.id);
      return ApiResponse.success(
        res,
        service,
        "Service retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/services/slug/:slug
   * Get service by slug (public)
   */
  async getBySlug(req, res, next) {
    try {
      const service = await serviceService.getBySlug(req.params.slug);
      return ApiResponse.success(
        res,
        service,
        "Service retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/services/update/:id
   * Update service
   */
  async update(req, res, next) {
    try {
      const service = await serviceService.update(req.params.id, req.body);
      return ApiResponse.success(res, service, "Service updated successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/services/delete/:id
   * Delete service
   */
  async delete(req, res, next) {
    try {
      const result = await serviceService.delete(req.params.id);
      return ApiResponse.success(res, null, result.message);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/services/toggle-active/:id
   * Toggle active status
   */
  async toggleActive(req, res, next) {
    try {
      const service = await serviceService.toggleActive(req.params.id);
      return ApiResponse.success(res, service, "Service active status updated");
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/services/reorder
   * Reorder services
   */
  async reorder(req, res, next) {
    try {
      const { orderedIds } = req.body;
      await serviceService.reorder(orderedIds);
      return ApiResponse.success(res, null, "Services reordered successfully");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ServiceController();
