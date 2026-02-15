/**
 * ACNS Backend - Job Routes
 * Job management and application routes
 */

const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");
const {
  authenticate,
  validateBody,
  validateParams,
  validateQuery,
  setUploadType,
  uploadResume,
  handleUploadError,
} = require("../middleware");
const {
  createJobSchema,
  updateJobSchema,
  jobApplicationSchema,
  idParamSchema,
  paginationSchema,
} = require("../utils/validators");

// Public routes
router.get("/active", validateQuery(paginationSchema), jobController.getActive);
router.get("/departments", jobController.getDepartments);
router.get("/locations", jobController.getLocations);
router.get("/slug/:slug", jobController.getBySlug);

// Public job application
router.post(
  "/apply",
  setUploadType("resumes"),
  uploadResume.single("resume"),
  handleUploadError,
  validateBody(jobApplicationSchema),
  jobController.apply,
);

// Protected routes (require authentication)
router.post(
  "/create",
  authenticate,
  validateBody(createJobSchema),
  jobController.create,
);
router.get(
  "/all",
  authenticate,
  validateQuery(paginationSchema),
  jobController.getAll,
);
router.get(
  "/applications",
  authenticate,
  validateQuery(paginationSchema),
  jobController.getApplications,
);
router.get(
  "/applications/statistics",
  authenticate,
  jobController.getApplicationStatistics,
);
router.get(
  "/applications/:id",
  authenticate,
  validateParams(idParamSchema),
  jobController.getApplicationById,
);
router.put(
  "/applications/:id/status",
  authenticate,
  validateParams(idParamSchema),
  jobController.updateApplicationStatus,
);
router.get(
  "/:id",
  authenticate,
  validateParams(idParamSchema),
  jobController.getById,
);
router.put(
  "/update/:id",
  authenticate,
  validateParams(idParamSchema),
  validateBody(updateJobSchema),
  jobController.update,
);
router.delete(
  "/delete/:id",
  authenticate,
  validateParams(idParamSchema),
  jobController.delete,
);
router.put(
  "/toggle-active/:id",
  authenticate,
  validateParams(idParamSchema),
  jobController.toggleActive,
);

module.exports = router;
