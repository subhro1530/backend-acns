/**
 * ACNS Backend - Service Routes
 * Service management routes
 */

const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");
const {
  authenticate,
  validateBody,
  validateParams,
  validateQuery,
} = require("../middleware");
const {
  createServiceSchema,
  updateServiceSchema,
  idParamSchema,
  paginationSchema,
} = require("../utils/validators");

// Public routes
router.get(
  "/active",
  validateQuery(paginationSchema),
  serviceController.getActive,
);
router.get("/slug/:slug", serviceController.getBySlug);

// Protected routes (require authentication)
router.post(
  "/create",
  authenticate,
  validateBody(createServiceSchema),
  serviceController.create,
);
router.get(
  "/all",
  authenticate,
  validateQuery(paginationSchema),
  serviceController.getAll,
);
router.get(
  "/:id",
  authenticate,
  validateParams(idParamSchema),
  serviceController.getById,
);
router.put(
  "/update/:id",
  authenticate,
  validateParams(idParamSchema),
  validateBody(updateServiceSchema),
  serviceController.update,
);
router.delete(
  "/delete/:id",
  authenticate,
  validateParams(idParamSchema),
  serviceController.delete,
);
router.put(
  "/toggle-active/:id",
  authenticate,
  validateParams(idParamSchema),
  serviceController.toggleActive,
);
router.put("/reorder", authenticate, serviceController.reorder);

module.exports = router;
