/**
 * ACNS Backend - Job Service
 * Business logic for job openings and applications
 */

const {
  jobRepository,
  jobApplicationRepository,
} = require("../repositories/jobRepository");
const {
  NotFoundError,
  ConflictError,
  BadRequestError,
} = require("../utils/errors");
const {
  generateSlug,
  parsePagination,
  buildOrderBy,
  buildSearchFilter,
} = require("../utils/helpers");
const emailService = require("../utils/emailService");

class JobService {
  /**
   * Create new job opening
   */
  async create(data) {
    // Generate slug if not provided
    if (!data.slug) {
      data.slug = generateSlug(data.title);
    }

    // Check if slug already exists
    const existingJob = await jobRepository.findBySlug(data.slug);
    if (existingJob) {
      data.slug = `${data.slug}-${Date.now()}`;
    }

    return jobRepository.create(data);
  }

  /**
   * Get all job openings with pagination and filtering
   */
  async getAll(query) {
    const { page, limit, skip } = parsePagination(query);
    const orderBy = buildOrderBy(query.sortBy || "createdAt", query.sortOrder);

    let where = {};

    // Search filter
    if (query.search) {
      where = buildSearchFilter(query.search, ["title", "description"]);
    }

    // Department filter
    if (query.department) {
      where.department = query.department;
    }

    // Type filter
    if (query.type) {
      where.type = query.type;
    }

    // Location filter
    if (query.location) {
      where.location = query.location;
    }

    // Active filter
    if (query.isActive !== undefined) {
      where.isActive = query.isActive === "true" || query.isActive === true;
    }

    const { data, total } = await jobRepository.findAll({
      where,
      orderBy,
      skip,
      take: limit,
    });

    return {
      jobs: data,
      pagination: { page, limit, total },
    };
  }

  /**
   * Get active job openings (public)
   */
  async getActive(query) {
    const { page, limit, skip } = parsePagination(query);

    let where = {
      isActive: true,
      OR: [{ deadline: null }, { deadline: { gte: new Date() } }],
    };

    if (query.search) {
      const searchFilter = buildSearchFilter(query.search, [
        "title",
        "description",
      ]);
      where = { AND: [where, searchFilter] };
    }

    if (query.department) {
      where.department = query.department;
    }

    if (query.type) {
      where.type = query.type;
    }

    if (query.location) {
      where.location = query.location;
    }

    const { data, total } = await jobRepository.findAll({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    return {
      jobs: data,
      pagination: { page, limit, total },
    };
  }

  /**
   * Get job by ID
   */
  async getById(id, includeApplicationsCount = false) {
    const job = includeApplicationsCount
      ? await jobRepository.findByIdWithApplicationsCount(id)
      : await jobRepository.findById(id);

    if (!job) {
      throw new NotFoundError("Job not found");
    }

    return job;
  }

  /**
   * Get job by slug (public)
   */
  async getBySlug(slug) {
    const job = await jobRepository.findBySlug(slug);

    if (!job) {
      throw new NotFoundError("Job not found");
    }

    return job;
  }

  /**
   * Update job
   */
  async update(id, data) {
    const existingJob = await jobRepository.findById(id);

    if (!existingJob) {
      throw new NotFoundError("Job not found");
    }

    // If updating slug, check for conflicts
    if (data.slug && data.slug !== existingJob.slug) {
      const slugExists = await jobRepository.findBySlug(data.slug);
      if (slugExists) {
        throw new ConflictError("A job with this slug already exists");
      }
    }

    return jobRepository.update(id, data);
  }

  /**
   * Delete job
   */
  async delete(id) {
    const job = await jobRepository.findById(id);

    if (!job) {
      throw new NotFoundError("Job not found");
    }

    await jobRepository.delete(id);
    return { message: "Job deleted successfully" };
  }

  /**
   * Toggle active status
   */
  async toggleActive(id) {
    const job = await jobRepository.findById(id);

    if (!job) {
      throw new NotFoundError("Job not found");
    }

    return jobRepository.toggleActive(id, !job.isActive);
  }

  /**
   * Get all departments
   */
  async getDepartments() {
    return jobRepository.getDepartments();
  }

  /**
   * Get all locations
   */
  async getLocations() {
    return jobRepository.getLocations();
  }

  /**
   * Submit job application
   */
  async apply(data) {
    // Check if job exists and is active
    const job = await jobRepository.findById(data.jobId);

    if (!job) {
      throw new NotFoundError("Job not found");
    }

    if (!job.isActive) {
      throw new BadRequestError(
        "This position is no longer accepting applications",
      );
    }

    if (job.deadline && new Date(job.deadline) < new Date()) {
      throw new BadRequestError("The application deadline has passed");
    }

    // Check if already applied
    const hasApplied = await jobApplicationRepository.hasApplied(
      data.jobId,
      data.email,
    );
    if (hasApplied) {
      throw new ConflictError("You have already applied for this position");
    }

    // Create application
    const application = await jobApplicationRepository.createApplication(data);

    // Send email notification (async, don't wait)
    emailService
      .sendJobApplicationNotification(application, job)
      .catch((err) => {
        console.error("Failed to send application notification:", err);
      });

    return application;
  }

  /**
   * Get all applications with pagination and filtering
   */
  async getApplications(query) {
    const { page, limit, skip } = parsePagination(query);
    const orderBy = buildOrderBy(query.sortBy || "createdAt", query.sortOrder);

    let where = {};

    if (query.jobId) {
      where.jobId = query.jobId;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.search) {
      where = {
        ...where,
        OR: [
          { firstName: { contains: query.search, mode: "insensitive" } },
          { lastName: { contains: query.search, mode: "insensitive" } },
          { email: { contains: query.search, mode: "insensitive" } },
        ],
      };
    }

    const { data, total } = await jobApplicationRepository.findAll({
      where,
      orderBy,
      skip,
      take: limit,
      include: { job: true },
    });

    return {
      applications: data,
      pagination: { page, limit, total },
    };
  }

  /**
   * Get application by ID
   */
  async getApplicationById(id) {
    const application = await jobApplicationRepository.findById(id, {
      include: { job: true },
    });

    if (!application) {
      throw new NotFoundError("Application not found");
    }

    return application;
  }

  /**
   * Update application status
   */
  async updateApplicationStatus(id, status, notes = null) {
    const application = await jobApplicationRepository.findById(id);

    if (!application) {
      throw new NotFoundError("Application not found");
    }

    return jobApplicationRepository.updateStatus(id, status, notes);
  }

  /**
   * Get application statistics
   */
  async getApplicationStatistics() {
    return jobApplicationRepository.getStatistics();
  }
}

module.exports = new JobService();
