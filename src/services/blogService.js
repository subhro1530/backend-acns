/**
 * ACNS Backend - Blog Service
 * Business logic for blog management
 */

const blogRepository = require("../repositories/blogRepository");
const { NotFoundError, ConflictError } = require("../utils/errors");
const {
  generateSlug,
  parsePagination,
  buildOrderBy,
  buildSearchFilter,
} = require("../utils/helpers");

class BlogService {
  /**
   * Create new blog post
   */
  async create(data) {
    // Generate slug if not provided
    if (!data.slug) {
      data.slug = generateSlug(data.title);
    }

    // Check if slug already exists
    const existingBlog = await blogRepository.findBySlug(data.slug);
    if (existingBlog) {
      // Append timestamp to make slug unique
      data.slug = `${data.slug}-${Date.now()}`;
    }

    // Set published date if publishing
    if (data.isPublished) {
      data.publishedAt = new Date();
    }

    return blogRepository.create(data);
  }

  /**
   * Get all blogs with pagination and filtering
   */
  async getAll(query) {
    const { page, limit, skip } = parsePagination(query);
    const orderBy = buildOrderBy(query.sortBy || "createdAt", query.sortOrder);

    let where = {};

    // Search filter
    if (query.search) {
      where = buildSearchFilter(query.search, ["title", "content", "excerpt"]);
    }

    // Category filter
    if (query.category) {
      where.category = query.category;
    }

    // Published filter
    if (query.isPublished !== undefined) {
      where.isPublished =
        query.isPublished === "true" || query.isPublished === true;
    }

    const { data, total } = await blogRepository.findAll({
      where,
      orderBy,
      skip,
      take: limit,
    });

    return {
      blogs: data,
      pagination: { page, limit, total },
    };
  }

  /**
   * Get published blogs (public)
   */
  async getPublished(query) {
    const { page, limit, skip } = parsePagination(query);
    const orderBy = buildOrderBy(
      query.sortBy || "publishedAt",
      query.sortOrder,
    );

    let where = { isPublished: true };

    if (query.search) {
      where = {
        ...where,
        ...buildSearchFilter(query.search, ["title", "content", "excerpt"]),
      };
    }

    if (query.category) {
      where.category = query.category;
    }

    const { data, total } = await blogRepository.findAll({
      where,
      orderBy,
      skip,
      take: limit,
    });

    return {
      blogs: data,
      pagination: { page, limit, total },
    };
  }

  /**
   * Get blog by ID
   */
  async getById(id) {
    const blog = await blogRepository.findById(id);

    if (!blog) {
      throw new NotFoundError("Blog not found");
    }

    return blog;
  }

  /**
   * Get blog by slug (public)
   */
  async getBySlug(slug, incrementView = true) {
    const blog = await blogRepository.findBySlug(slug);

    if (!blog) {
      throw new NotFoundError("Blog not found");
    }

    // Increment view count
    if (incrementView) {
      await blogRepository.incrementViewCount(blog.id);
    }

    return blog;
  }

  /**
   * Update blog
   */
  async update(id, data) {
    // Check if blog exists
    const existingBlog = await blogRepository.findById(id);
    if (!existingBlog) {
      throw new NotFoundError("Blog not found");
    }

    // If updating slug, check for conflicts
    if (data.slug && data.slug !== existingBlog.slug) {
      const slugExists = await blogRepository.findBySlug(data.slug);
      if (slugExists) {
        throw new ConflictError("A blog with this slug already exists");
      }
    }

    // Handle publish state change
    if (data.isPublished === true && !existingBlog.isPublished) {
      data.publishedAt = new Date();
    } else if (data.isPublished === false) {
      data.publishedAt = null;
    }

    return blogRepository.update(id, data);
  }

  /**
   * Delete blog
   */
  async delete(id) {
    const blog = await blogRepository.findById(id);

    if (!blog) {
      throw new NotFoundError("Blog not found");
    }

    await blogRepository.delete(id);
    return { message: "Blog deleted successfully" };
  }

  /**
   * Toggle publish status
   */
  async togglePublish(id) {
    const blog = await blogRepository.findById(id);

    if (!blog) {
      throw new NotFoundError("Blog not found");
    }

    return blogRepository.togglePublishStatus(id, !blog.isPublished);
  }

  /**
   * Get all categories
   */
  async getCategories() {
    return blogRepository.getCategories();
  }

  /**
   * Get all tags
   */
  async getTags() {
    return blogRepository.getTags();
  }
}

module.exports = new BlogService();
