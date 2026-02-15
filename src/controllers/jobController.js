/**
 * ACNS Backend - Job Controller
 * HTTP handlers for job and application endpoints
 */

const jobService = require("../services/jobService");
const ApiResponse = require("../utils/apiResponse");

class JobController {
  /**
   * POST /api/jobs/create
   * Create new job opening
   */
  async create(req, res, next) {
    try {
      const job = await jobService.create(req.body);
      return ApiResponse.created(res, job, "Job created successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/jobs/all
   * Get all job openings (admin)
   */
  async getAll(req, res, next) {
    try {
      const result = await jobService.getAll(req.query);
      return ApiResponse.paginated(
        res,
        result.jobs,
        result.pagination,
        "Jobs retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/jobs/active
   * Get active job openings (public)
   */
  async getActive(req, res, next) {
    try {
      const result = await jobService.getActive(req.query);
      return ApiResponse.paginated(
        res,
        result.jobs,
        result.pagination,
        "Jobs retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/jobs/:id
   * Get job by ID
   */
  async getById(req, res, next) {
    try {
      const job = await jobService.getById(req.params.id, true);
      return ApiResponse.success(res, job, "Job retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/jobs/slug/:slug
   * Get job by slug (public)
   */
  async getBySlug(req, res, next) {
    try {
      const job = await jobService.getBySlug(req.params.slug);
      return ApiResponse.success(res, job, "Job retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/jobs/update/:id
   * Update job
   */
  async update(req, res, next) {
    try {
      const job = await jobService.update(req.params.id, req.body);
      return ApiResponse.success(res, job, "Job updated successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/jobs/delete/:id
   * Delete job
   */
  async delete(req, res, next) {
    try {
      const result = await jobService.delete(req.params.id);
      return ApiResponse.success(res, null, result.message);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/jobs/toggle-active/:id
   * Toggle active status
   */
  async toggleActive(req, res, next) {
    try {
      const job = await jobService.toggleActive(req.params.id);
      return ApiResponse.success(res, job, "Job active status updated");
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/jobs/departments
   * Get all departments
   */
  async getDepartments(req, res, next) {
    try {
      const departments = await jobService.getDepartments();
      return ApiResponse.success(
        res,
        departments,
        "Departments retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/jobs/locations
   * Get all locations
   */
  async getLocations(req, res, next) {
    try {
      const locations = await jobService.getLocations();
      return ApiResponse.success(
        res,
        locations,
        "Locations retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/jobs/apply
   * Submit job application (public)
   */
  async apply(req, res, next) {
    try {
      // Add resume URL if file was uploaded
      if (req.file) {
        req.body.resumeUrl = `/uploads/resumes/${req.file.filename}`;
      }

      const application = await jobService.apply(req.body);
      return ApiResponse.created(
        res,
        application,
        "Application submitted successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/jobs/applications
   * Get all applications (admin)
   */
  async getApplications(req, res, next) {
    try {
      const result = await jobService.getApplications(req.query);
      return ApiResponse.paginated(
        res,
        result.applications,
        result.pagination,
        "Applications retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/jobs/applications/:id
   * Get application by ID (admin)
   */
  async getApplicationById(req, res, next) {
    try {
      const application = await jobService.getApplicationById(req.params.id);
      return ApiResponse.success(
        res,
        application,
        "Application retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/jobs/applications/:id/status
   * Update application status (admin)
   */
  async updateApplicationStatus(req, res, next) {
    try {
      const { status, notes } = req.body;
      const application = await jobService.updateApplicationStatus(
        req.params.id,
        status,
        notes,
      );
      return ApiResponse.success(
        res,
        application,
        "Application status updated",
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/jobs/applications/statistics
   * Get application statistics (admin)
   */
  async getApplicationStatistics(req, res, next) {
    try {
      const stats = await jobService.getApplicationStatistics();
      return ApiResponse.success(
        res,
        stats,
        "Statistics retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new JobController();
