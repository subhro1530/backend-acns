/**
 * ACNS Backend - Product Service
 * Business logic for product management
 */

const productRepository = require("../repositories/productRepository");
const { NotFoundError, ConflictError } = require("../utils/errors");
const {
  generateSlug,
  parsePagination,
  buildOrderBy,
  buildSearchFilter,
} = require("../utils/helpers");

class ProductService {
  /**
   * Create new product
   */
  async create(data) {
    // Generate slug if not provided
    if (!data.slug) {
      data.slug = generateSlug(data.name);
    }

    // Check if slug already exists
    const existingProduct = await productRepository.findBySlug(data.slug);
    if (existingProduct) {
      data.slug = `${data.slug}-${Date.now()}`;
    }

    return productRepository.create(data);
  }

  /**
   * Get all products with pagination and filtering
   */
  async getAll(query) {
    const { page, limit, skip } = parsePagination(query);
    const orderBy = buildOrderBy(
      query.sortBy || "sortOrder",
      query.sortOrder || "asc",
    );

    let where = {};

    // Search filter
    if (query.search) {
      where = buildSearchFilter(query.search, [
        "name",
        "description",
        "shortDesc",
      ]);
    }

    // Category filter
    if (query.category) {
      where.category = query.category;
    }

    // Status filter
    if (query.status) {
      where.status = query.status;
    }

    // Active filter
    if (query.isActive !== undefined) {
      where.isActive = query.isActive === "true" || query.isActive === true;
    }

    const { data, total } = await productRepository.findAll({
      where,
      orderBy,
      skip,
      take: limit,
    });

    return {
      products: data,
      pagination: { page, limit, total },
    };
  }

  /**
   * Get active products (public)
   */
  async getActive(query) {
    const { page, limit, skip } = parsePagination(query);

    let where = { isActive: true, status: "ACTIVE" };

    if (query.search) {
      where = {
        ...where,
        ...buildSearchFilter(query.search, ["name", "description"]),
      };
    }

    if (query.category) {
      where.category = query.category;
    }

    const { data, total } = await productRepository.findAll({
      where,
      orderBy: { sortOrder: "asc" },
      skip,
      take: limit,
    });

    return {
      products: data,
      pagination: { page, limit, total },
    };
  }

  /**
   * Get product by ID
   */
  async getById(id) {
    const product = await productRepository.findById(id);

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    return product;
  }

  /**
   * Get product by slug (public)
   */
  async getBySlug(slug) {
    const product = await productRepository.findBySlug(slug);

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    return product;
  }

  /**
   * Update product
   */
  async update(id, data) {
    const existingProduct = await productRepository.findById(id);

    if (!existingProduct) {
      throw new NotFoundError("Product not found");
    }

    // If updating slug, check for conflicts
    if (data.slug && data.slug !== existingProduct.slug) {
      const slugExists = await productRepository.findBySlug(data.slug);
      if (slugExists) {
        throw new ConflictError("A product with this slug already exists");
      }
    }

    return productRepository.update(id, data);
  }

  /**
   * Delete product
   */
  async delete(id) {
    const product = await productRepository.findById(id);

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    await productRepository.delete(id);
    return { message: "Product deleted successfully" };
  }

  /**
   * Update product status
   */
  async updateStatus(id, status) {
    const product = await productRepository.findById(id);

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    return productRepository.updateStatus(id, status);
  }

  /**
   * Toggle active status
   */
  async toggleActive(id) {
    const product = await productRepository.findById(id);

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    return productRepository.toggleActive(id, !product.isActive);
  }

  /**
   * Get all categories
   */
  async getCategories() {
    return productRepository.getCategories();
  }
}

module.exports = new ProductService();
