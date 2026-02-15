/**
 * ACNS Backend - Product Controller
 * HTTP handlers for product endpoints
 */

const productService = require("../services/productService");
const ApiResponse = require("../utils/apiResponse");

class ProductController {
  /**
   * POST /api/products/create
   * Create new product
   */
  async create(req, res, next) {
    try {
      const product = await productService.create(req.body);
      return ApiResponse.created(res, product, "Product created successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/products/all
   * Get all products (admin)
   */
  async getAll(req, res, next) {
    try {
      const result = await productService.getAll(req.query);
      return ApiResponse.paginated(
        res,
        result.products,
        result.pagination,
        "Products retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/products/active
   * Get active products (public)
   */
  async getActive(req, res, next) {
    try {
      const result = await productService.getActive(req.query);
      return ApiResponse.paginated(
        res,
        result.products,
        result.pagination,
        "Products retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/products/:id
   * Get product by ID
   */
  async getById(req, res, next) {
    try {
      const product = await productService.getById(req.params.id);
      return ApiResponse.success(
        res,
        product,
        "Product retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/products/slug/:slug
   * Get product by slug (public)
   */
  async getBySlug(req, res, next) {
    try {
      const product = await productService.getBySlug(req.params.slug);
      return ApiResponse.success(
        res,
        product,
        "Product retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/products/update/:id
   * Update product
   */
  async update(req, res, next) {
    try {
      const product = await productService.update(req.params.id, req.body);
      return ApiResponse.success(res, product, "Product updated successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/products/delete/:id
   * Delete product
   */
  async delete(req, res, next) {
    try {
      const result = await productService.delete(req.params.id);
      return ApiResponse.success(res, null, result.message);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/products/status/:id
   * Update product status
   */
  async updateStatus(req, res, next) {
    try {
      const { status } = req.body;
      const product = await productService.updateStatus(req.params.id, status);
      return ApiResponse.success(res, product, "Product status updated");
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/products/toggle-active/:id
   * Toggle active status
   */
  async toggleActive(req, res, next) {
    try {
      const product = await productService.toggleActive(req.params.id);
      return ApiResponse.success(res, product, "Product active status updated");
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/products/categories
   * Get all categories
   */
  async getCategories(req, res, next) {
    try {
      const categories = await productService.getCategories();
      return ApiResponse.success(
        res,
        categories,
        "Categories retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();
