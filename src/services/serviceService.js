/**
 * ACNS Backend - Service Service
 * Business logic for services management
 */

const serviceRepository = require("../repositories/serviceRepository");
const { NotFoundError, ConflictError } = require("../utils/errors");
const {
  generateSlug,
  parsePagination,
  buildOrderBy,
  buildSearchFilter,
} = require("../utils/helpers");

class ServiceService {
  /**
   * Create new service
   */
  async create(data) {
    // Generate slug if not provided
    if (!data.slug) {
      data.slug = generateSlug(data.name);
    }

    // Check if slug already exists
    const existingService = await serviceRepository.findBySlug(data.slug);
    if (existingService) {
      data.slug = `${data.slug}-${Date.now()}`;
    }

    return serviceRepository.create(data);
  }

  /**
   * Get all services with pagination and filtering
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

    // Active filter
    if (query.isActive !== undefined) {
      where.isActive = query.isActive === "true" || query.isActive === true;
    }

    const { data, total } = await serviceRepository.findAll({
      where,
      orderBy,
      skip,
      take: limit,
    });

    return {
      services: data,
      pagination: { page, limit, total },
    };
  }

  /**
   * Get active services (public)
   */
  async getActive(query) {
    const { page, limit, skip } = parsePagination(query);

    let where = { isActive: true };

    if (query.search) {
      where = {
        ...where,
        ...buildSearchFilter(query.search, ["name", "description"]),
      };
    }

    const { data, total } = await serviceRepository.findAll({
      where,
      orderBy: { sortOrder: "asc" },
      skip,
      take: limit,
    });

    return {
      services: data,
      pagination: { page, limit, total },
    };
  }

  /**
   * Get service by ID
   */
  async getById(id) {
    const service = await serviceRepository.findById(id);

    if (!service) {
      throw new NotFoundError("Service not found");
    }

    return service;
  }

  /**
   * Get service by slug (public)
   */
  async getBySlug(slug) {
    const service = await serviceRepository.findBySlug(slug);

    if (!service) {
      throw new NotFoundError("Service not found");
    }

    return service;
  }

  /**
   * Update service
   */
  async update(id, data) {
    const existingService = await serviceRepository.findById(id);

    if (!existingService) {
      throw new NotFoundError("Service not found");
    }

    // If updating slug, check for conflicts
    if (data.slug && data.slug !== existingService.slug) {
      const slugExists = await serviceRepository.findBySlug(data.slug);
      if (slugExists) {
        throw new ConflictError("A service with this slug already exists");
      }
    }

    return serviceRepository.update(id, data);
  }

  /**
   * Delete service
   */
  async delete(id) {
    const service = await serviceRepository.findById(id);

    if (!service) {
      throw new NotFoundError("Service not found");
    }

    await serviceRepository.delete(id);
    return { message: "Service deleted successfully" };
  }

  /**
   * Toggle active status
   */
  async toggleActive(id) {
    const service = await serviceRepository.findById(id);

    if (!service) {
      throw new NotFoundError("Service not found");
    }

    return serviceRepository.toggleActive(id, !service.isActive);
  }

  /**
   * Reorder services
   */
  async reorder(orderedIds) {
    return serviceRepository.reorder(orderedIds);
  }
}

module.exports = new ServiceService();
