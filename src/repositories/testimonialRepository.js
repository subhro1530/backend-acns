/**
 * ACNS Backend - Testimonial Repository
 * Database operations for Testimonial model
 */

const BaseRepository = require("./baseRepository");

class TestimonialRepository extends BaseRepository {
  constructor() {
    super("testimonial");
  }

  /**
   * Get active testimonials
   */
  async getActive(options = {}) {
    return this.findAll({
      ...options,
      where: {
        ...options.where,
        isActive: true,
      },
      orderBy: options.orderBy || { sortOrder: "asc" },
    });
  }

  /**
   * Toggle active status
   */
  async toggleActive(id, isActive) {
    return this.model.update({
      where: { id },
      data: { isActive },
    });
  }

  /**
   * Update sort order
   */
  async updateSortOrder(id, sortOrder) {
    return this.model.update({
      where: { id },
      data: { sortOrder },
    });
  }

  /**
   * Reorder testimonials
   */
  async reorder(orderedIds) {
    const updates = orderedIds.map((id, index) =>
      this.model.update({
        where: { id },
        data: { sortOrder: index },
      }),
    );
    return Promise.all(updates);
  }

  /**
   * Get testimonials by rating
   */
  async findByRating(rating, options = {}) {
    return this.findAll({
      ...options,
      where: {
        ...options.where,
        rating: { gte: rating },
      },
    });
  }

  /**
   * Get average rating
   */
  async getAverageRating() {
    const result = await this.model.aggregate({
      where: { isActive: true },
      _avg: { rating: true },
    });
    return result._avg.rating || 0;
  }
}

module.exports = new TestimonialRepository();
