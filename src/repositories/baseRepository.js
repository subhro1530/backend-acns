/**
 * ACNS Backend - Base Repository
 * Provides common database operations for all repositories
 */

const prisma = require("../config/database");

class BaseRepository {
  constructor(modelName) {
    this.model = prisma[modelName];
    this.modelName = modelName;
  }

  /**
   * Find all records with pagination and filtering
   */
  async findAll(options = {}) {
    const {
      where = {},
      orderBy = { createdAt: "desc" },
      skip = 0,
      take = 10,
      include,
      select,
    } = options;

    const [data, total] = await Promise.all([
      this.model.findMany({
        where,
        orderBy,
        skip,
        take,
        ...(include && { include }),
        ...(select && { select }),
      }),
      this.model.count({ where }),
    ]);

    return { data, total };
  }

  /**
   * Find record by ID
   */
  async findById(id, options = {}) {
    const { include, select } = options;

    return this.model.findUnique({
      where: { id },
      ...(include && { include }),
      ...(select && { select }),
    });
  }

  /**
   * Find single record by condition
   */
  async findOne(where, options = {}) {
    const { include, select } = options;

    return this.model.findFirst({
      where,
      ...(include && { include }),
      ...(select && { select }),
    });
  }

  /**
   * Create new record
   */
  async create(data, options = {}) {
    const { include, select } = options;

    return this.model.create({
      data,
      ...(include && { include }),
      ...(select && { select }),
    });
  }

  /**
   * Update record by ID
   */
  async update(id, data, options = {}) {
    const { include, select } = options;

    return this.model.update({
      where: { id },
      data,
      ...(include && { include }),
      ...(select && { select }),
    });
  }

  /**
   * Delete record by ID
   */
  async delete(id) {
    return this.model.delete({
      where: { id },
    });
  }

  /**
   * Delete many records
   */
  async deleteMany(where) {
    return this.model.deleteMany({ where });
  }

  /**
   * Count records
   */
  async count(where = {}) {
    return this.model.count({ where });
  }

  /**
   * Check if record exists
   */
  async exists(where) {
    const count = await this.model.count({ where });
    return count > 0;
  }

  /**
   * Upsert record
   */
  async upsert(where, create, update) {
    return this.model.upsert({
      where,
      create,
      update,
    });
  }
}

module.exports = BaseRepository;
