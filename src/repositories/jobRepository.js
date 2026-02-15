/**
 * ACNS Backend - Job Repository
 * Database operations for JobOpening and JobApplication models
 */

const BaseRepository = require("./baseRepository");
const prisma = require("../config/database");

class JobRepository extends BaseRepository {
  constructor() {
    super("jobOpening");
  }

  /**
   * Find job by slug
   */
  async findBySlug(slug) {
    return this.model.findUnique({
      where: { slug },
    });
  }

  /**
   * Get active job openings
   */
  async getActive(options = {}) {
    return this.findAll({
      ...options,
      where: {
        ...options.where,
        isActive: true,
        OR: [{ deadline: null }, { deadline: { gte: new Date() } }],
      },
    });
  }

  /**
   * Get jobs by department
   */
  async findByDepartment(department, options = {}) {
    return this.findAll({
      ...options,
      where: {
        ...options.where,
        department,
      },
    });
  }

  /**
   * Get jobs by type
   */
  async findByType(type, options = {}) {
    return this.findAll({
      ...options,
      where: {
        ...options.where,
        type,
      },
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
   * Get all unique departments
   */
  async getDepartments() {
    const jobs = await this.model.findMany({
      where: { department: { not: null } },
      select: { department: true },
      distinct: ["department"],
    });
    return jobs.map((j) => j.department);
  }

  /**
   * Get all unique locations
   */
  async getLocations() {
    const jobs = await this.model.findMany({
      where: { location: { not: null } },
      select: { location: true },
      distinct: ["location"],
    });
    return jobs.map((j) => j.location);
  }

  /**
   * Get job with applications count
   */
  async findByIdWithApplicationsCount(id) {
    return this.model.findUnique({
      where: { id },
      include: {
        _count: {
          select: { applications: true },
        },
      },
    });
  }
}

class JobApplicationRepository extends BaseRepository {
  constructor() {
    super("jobApplication");
  }

  /**
   * Get applications for a job
   */
  async findByJobId(jobId, options = {}) {
    return this.findAll({
      ...options,
      where: {
        ...options.where,
        jobId,
      },
      include: { job: true },
    });
  }

  /**
   * Get applications by status
   */
  async findByStatus(status, options = {}) {
    return this.findAll({
      ...options,
      where: {
        ...options.where,
        status,
      },
      include: { job: true },
    });
  }

  /**
   * Update application status
   */
  async updateStatus(id, status, notes = null) {
    return this.model.update({
      where: { id },
      data: {
        status,
        ...(notes && { notes }),
      },
    });
  }

  /**
   * Check if applicant already applied
   */
  async hasApplied(jobId, email) {
    const count = await this.model.count({
      where: {
        jobId,
        email: email.toLowerCase(),
      },
    });
    return count > 0;
  }

  /**
   * Create application
   */
  async createApplication(data) {
    return this.model.create({
      data: {
        ...data,
        email: data.email.toLowerCase(),
      },
      include: { job: true },
    });
  }

  /**
   * Get application statistics
   */
  async getStatistics() {
    const stats = await prisma.$queryRaw`
      SELECT status, COUNT(*)::int as count
      FROM job_applications
      GROUP BY status
    `;
    return stats;
  }
}

module.exports = {
  jobRepository: new JobRepository(),
  jobApplicationRepository: new JobApplicationRepository(),
};
