/**
 * ACNS Backend - Testimonial Controller
 * HTTP handlers for testimonial endpoints
 */

const testimonialService = require("../services/testimonialService");
const ApiResponse = require("../utils/apiResponse");

class TestimonialController {
  /**
   * POST /api/testimonials/create
   * Create new testimonial
   */
  async create(req, res, next) {
    try {
      const testimonial = await testimonialService.create(req.body);
      return ApiResponse.created(
        res,
        testimonial,
        "Testimonial created successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/testimonials/all
   * Get all testimonials (admin)
   */
  async getAll(req, res, next) {
    try {
      const result = await testimonialService.getAll(req.query);
      return ApiResponse.paginated(
        res,
        result.testimonials,
        result.pagination,
        "Testimonials retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/testimonials/active
   * Get active testimonials (public)
   */
  async getActive(req, res, next) {
    try {
      const result = await testimonialService.getActive(req.query);
      return ApiResponse.paginated(
        res,
        result.testimonials,
        result.pagination,
        "Testimonials retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/testimonials/:id
   * Get testimonial by ID
   */
  async getById(req, res, next) {
    try {
      const testimonial = await testimonialService.getById(req.params.id);
      return ApiResponse.success(
        res,
        testimonial,
        "Testimonial retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/testimonials/update/:id
   * Update testimonial
   */
  async update(req, res, next) {
    try {
      const testimonial = await testimonialService.update(
        req.params.id,
        req.body,
      );
      return ApiResponse.success(
        res,
        testimonial,
        "Testimonial updated successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/testimonials/delete/:id
   * Delete testimonial
   */
  async delete(req, res, next) {
    try {
      const result = await testimonialService.delete(req.params.id);
      return ApiResponse.success(res, null, result.message);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/testimonials/toggle-active/:id
   * Toggle active status
   */
  async toggleActive(req, res, next) {
    try {
      const testimonial = await testimonialService.toggleActive(req.params.id);
      return ApiResponse.success(
        res,
        testimonial,
        "Testimonial active status updated",
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/testimonials/reorder
   * Reorder testimonials
   */
  async reorder(req, res, next) {
    try {
      const { orderedIds } = req.body;
      await testimonialService.reorder(orderedIds);
      return ApiResponse.success(
        res,
        null,
        "Testimonials reordered successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/testimonials/average-rating
   * Get average rating
   */
  async getAverageRating(req, res, next) {
    try {
      const averageRating = await testimonialService.getAverageRating();
      return ApiResponse.success(
        res,
        { averageRating },
        "Average rating retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TestimonialController();
