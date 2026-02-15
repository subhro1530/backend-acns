/**
 * ACNS Backend - Service Repository
 * Database operations for Service model
 */

const BaseRepository = require("./baseRepository");

class ServiceRepository extends BaseRepository {
  constructor() {
    super("service");
  }

  /**
   * Find service by slug
   */
  async findBySlug(slug) {
    return this.model.findUnique({
      where: { slug },
    });
  }

  /**
   * Get active services
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
   * Reorder services
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
   * Search services
   */
  async search(query, options = {}) {
    return this.findAll({
      ...options,
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { shortDesc: { contains: query, mode: "insensitive" } },
        ],
      },
    });
  }
}

module.exports = new ServiceRepository();
