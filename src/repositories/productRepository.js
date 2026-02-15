/**
 * ACNS Backend - Product Repository
 * Database operations for Product model
 */

const BaseRepository = require("./baseRepository");

class ProductRepository extends BaseRepository {
  constructor() {
    super("product");
  }

  /**
   * Find product by slug
   */
  async findBySlug(slug) {
    return this.model.findUnique({
      where: { slug },
    });
  }

  /**
   * Get active products
   */
  async getActive(options = {}) {
    return this.findAll({
      ...options,
      where: {
        ...options.where,
        isActive: true,
        status: "ACTIVE",
      },
      orderBy: options.orderBy || { sortOrder: "asc" },
    });
  }

  /**
   * Get products by category
   */
  async findByCategory(category, options = {}) {
    return this.findAll({
      ...options,
      where: {
        ...options.where,
        category,
      },
    });
  }

  /**
   * Get products by status
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
   * Update product status
   */
  async updateStatus(id, status) {
    return this.model.update({
      where: { id },
      data: { status },
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
   * Get all unique categories
   */
  async getCategories() {
    const products = await this.model.findMany({
      where: { category: { not: null } },
      select: { category: true },
      distinct: ["category"],
    });
    return products.map((p) => p.category);
  }

  /**
   * Search products
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

module.exports = new ProductRepository();
