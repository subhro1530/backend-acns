/**
 * ACNS Backend - Testimonial Service
 * Business logic for testimonial management
 */

const testimonialRepository = require("../repositories/testimonialRepository");
const { NotFoundError } = require("../utils/errors");
const { parsePagination, buildOrderBy } = require("../utils/helpers");

class TestimonialService {
  /**
   * Create new testimonial
   */
  async create(data) {
    return testimonialRepository.create(data);
  }

  /**
   * Get all testimonials with pagination and filtering
   */
  async getAll(query) {
    const { page, limit, skip } = parsePagination(query);
    const orderBy = buildOrderBy(
      query.sortBy || "sortOrder",
      query.sortOrder || "asc",
    );

    let where = {};

    // Active filter
    if (query.isActive !== undefined) {
      where.isActive = query.isActive === "true" || query.isActive === true;
    }

    // Rating filter
    if (query.minRating) {
      where.rating = { gte: parseInt(query.minRating, 10) };
    }

    const { data, total } = await testimonialRepository.findAll({
      where,
      orderBy,
      skip,
      take: limit,
    });

    return {
      testimonials: data,
      pagination: { page, limit, total },
    };
  }

  /**
   * Get active testimonials (public)
   */
  async getActive(query) {
    const { page, limit, skip } = parsePagination(query);

    const { data, total } = await testimonialRepository.findAll({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      skip,
      take: limit,
    });

    return {
      testimonials: data,
      pagination: { page, limit, total },
    };
  }

  /**
   * Get testimonial by ID
   */
  async getById(id) {
    const testimonial = await testimonialRepository.findById(id);

    if (!testimonial) {
      throw new NotFoundError("Testimonial not found");
    }

    return testimonial;
  }

  /**
   * Update testimonial
   */
  async update(id, data) {
    const testimonial = await testimonialRepository.findById(id);

    if (!testimonial) {
      throw new NotFoundError("Testimonial not found");
    }

    return testimonialRepository.update(id, data);
  }

  /**
   * Delete testimonial
   */
  async delete(id) {
    const testimonial = await testimonialRepository.findById(id);

    if (!testimonial) {
      throw new NotFoundError("Testimonial not found");
    }

    await testimonialRepository.delete(id);
    return { message: "Testimonial deleted successfully" };
  }

  /**
   * Toggle active status
   */
  async toggleActive(id) {
    const testimonial = await testimonialRepository.findById(id);

    if (!testimonial) {
      throw new NotFoundError("Testimonial not found");
    }

    return testimonialRepository.toggleActive(id, !testimonial.isActive);
  }

  /**
   * Reorder testimonials
   */
  async reorder(orderedIds) {
    return testimonialRepository.reorder(orderedIds);
  }

  /**
   * Get average rating
   */
  async getAverageRating() {
    return testimonialRepository.getAverageRating();
  }
}

module.exports = new TestimonialService();
