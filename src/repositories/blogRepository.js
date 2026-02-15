/**
 * ACNS Backend - Blog Repository
 * Database operations for Blog model
 */

const BaseRepository = require("./baseRepository");

class BlogRepository extends BaseRepository {
  constructor() {
    super("blog");
  }

  /**
   * Find blog by slug
   */
  async findBySlug(slug) {
    return this.model.findUnique({
      where: { slug },
    });
  }

  /**
   * Increment view count
   */
  async incrementViewCount(id) {
    return this.model.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });
  }

  /**
   * Get published blogs
   */
  async getPublished(options = {}) {
    return this.findAll({
      ...options,
      where: {
        ...options.where,
        isPublished: true,
      },
    });
  }

  /**
   * Toggle publish status
   */
  async togglePublishStatus(id, isPublished) {
    return this.model.update({
      where: { id },
      data: {
        isPublished,
        publishedAt: isPublished ? new Date() : null,
      },
    });
  }

  /**
   * Get blogs by category
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
   * Search blogs
   */
  async search(query, options = {}) {
    return this.findAll({
      ...options,
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
          { excerpt: { contains: query, mode: "insensitive" } },
        ],
      },
    });
  }

  /**
   * Get all unique categories
   */
  async getCategories() {
    const blogs = await this.model.findMany({
      where: { category: { not: null } },
      select: { category: true },
      distinct: ["category"],
    });
    return blogs.map((b) => b.category);
  }

  /**
   * Get all unique tags
   */
  async getTags() {
    const blogs = await this.model.findMany({
      where: { tags: { isEmpty: false } },
      select: { tags: true },
    });
    const allTags = blogs.flatMap((b) => b.tags);
    return [...new Set(allTags)];
  }
}

module.exports = new BlogRepository();
