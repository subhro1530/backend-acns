/**
 * ACNS Backend - Testimonial Routes
 * Testimonial management routes
 */

const express = require("express");
const router = express.Router();
const testimonialController = require("../controllers/testimonialController");
const {
  authenticate,
  validateBody,
  validateParams,
  validateQuery,
} = require("../middleware");
const {
  createTestimonialSchema,
  updateTestimonialSchema,
  idParamSchema,
  paginationSchema,
} = require("../utils/validators");

// Public routes
router.get(
  "/active",
  validateQuery(paginationSchema),
  testimonialController.getActive,
);
router.get("/average-rating", testimonialController.getAverageRating);

// Protected routes (require authentication)
router.post(
  "/create",
  authenticate,
  validateBody(createTestimonialSchema),
  testimonialController.create,
);
router.get(
  "/all",
  authenticate,
  validateQuery(paginationSchema),
  testimonialController.getAll,
);
router.get(
  "/:id",
  authenticate,
  validateParams(idParamSchema),
  testimonialController.getById,
);
router.put(
  "/update/:id",
  authenticate,
  validateParams(idParamSchema),
  validateBody(updateTestimonialSchema),
  testimonialController.update,
);
router.delete(
  "/delete/:id",
  authenticate,
  validateParams(idParamSchema),
  testimonialController.delete,
);
router.put(
  "/toggle-active/:id",
  authenticate,
  validateParams(idParamSchema),
  testimonialController.toggleActive,
);
router.put("/reorder", authenticate, testimonialController.reorder);

module.exports = router;
