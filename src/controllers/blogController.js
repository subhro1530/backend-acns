/**
 * ACNS Backend - Blog Controller
 * HTTP handlers for blog endpoints
 */

const blogService = require("../services/blogService");
const ApiResponse = require("../utils/apiResponse");

class BlogController {
  /**
   * POST /api/blog/create
   * Create new blog post
   */
  async create(req, res, next) {
    try {
      const blog = await blogService.create(req.body);
      return ApiResponse.created(res, blog, "Blog created successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/blog/all
   * Get all blogs (admin)
   */
  async getAll(req, res, next) {
    try {
      const result = await blogService.getAll(req.query);
      return ApiResponse.paginated(
        res,
        result.blogs,
        result.pagination,
        "Blogs retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/blog/published
   * Get published blogs (public)
   */
  async getPublished(req, res, next) {
    try {
      const result = await blogService.getPublished(req.query);
      return ApiResponse.paginated(
        res,
        result.blogs,
        result.pagination,
        "Blogs retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/blog/:id
   * Get blog by ID
   */
  async getById(req, res, next) {
    try {
      const blog = await blogService.getById(req.params.id);
      return ApiResponse.success(res, blog, "Blog retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/blog/slug/:slug
   * Get blog by slug (public)
   */
  async getBySlug(req, res, next) {
    try {
      const blog = await blogService.getBySlug(req.params.slug);
      return ApiResponse.success(res, blog, "Blog retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/blog/update/:id
   * Update blog
   */
  async update(req, res, next) {
    try {
      const blog = await blogService.update(req.params.id, req.body);
      return ApiResponse.success(res, blog, "Blog updated successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/blog/delete/:id
   * Delete blog
   */
  async delete(req, res, next) {
    try {
      const result = await blogService.delete(req.params.id);
      return ApiResponse.success(res, null, result.message);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/blog/toggle-publish/:id
   * Toggle publish status
   */
  async togglePublish(req, res, next) {
    try {
      const blog = await blogService.togglePublish(req.params.id);
      return ApiResponse.success(res, blog, "Blog publish status updated");
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/blog/categories
   * Get all categories
   */
  async getCategories(req, res, next) {
    try {
      const categories = await blogService.getCategories();
      return ApiResponse.success(
        res,
        categories,
        "Categories retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/blog/tags
   * Get all tags
   */
  async getTags(req, res, next) {
    try {
      const tags = await blogService.getTags();
      return ApiResponse.success(res, tags, "Tags retrieved successfully");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BlogController();
