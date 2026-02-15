/**
 * ACNS Backend - Blog Routes
 * Blog management routes
 */

const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const {
  authenticate,
  validateBody,
  validateParams,
  validateQuery,
} = require("../middleware");
const {
  createBlogSchema,
  updateBlogSchema,
  idParamSchema,
  paginationSchema,
} = require("../utils/validators");

// Public routes
router.get(
  "/published",
  validateQuery(paginationSchema),
  blogController.getPublished,
);
router.get("/categories", blogController.getCategories);
router.get("/tags", blogController.getTags);
router.get("/slug/:slug", blogController.getBySlug);

// Protected routes (require authentication)
router.post(
  "/create",
  authenticate,
  validateBody(createBlogSchema),
  blogController.create,
);
router.get(
  "/all",
  authenticate,
  validateQuery(paginationSchema),
  blogController.getAll,
);
router.get(
  "/:id",
  authenticate,
  validateParams(idParamSchema),
  blogController.getById,
);
router.put(
  "/update/:id",
  authenticate,
  validateParams(idParamSchema),
  validateBody(updateBlogSchema),
  blogController.update,
);
router.delete(
  "/delete/:id",
  authenticate,
  validateParams(idParamSchema),
  blogController.delete,
);
router.put(
  "/toggle-publish/:id",
  authenticate,
  validateParams(idParamSchema),
  blogController.togglePublish,
);

module.exports = router;
