/**
 * ACNS Backend - Product Routes
 * Product management routes
 */

const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const {
  authenticate,
  validateBody,
  validateParams,
  validateQuery,
} = require("../middleware");
const {
  createProductSchema,
  updateProductSchema,
  idParamSchema,
  paginationSchema,
} = require("../utils/validators");

// Public routes
router.get(
  "/active",
  validateQuery(paginationSchema),
  productController.getActive,
);
router.get("/categories", productController.getCategories);
router.get("/slug/:slug", productController.getBySlug);

// Protected routes (require authentication)
router.post(
  "/create",
  authenticate,
  validateBody(createProductSchema),
  productController.create,
);
router.get(
  "/all",
  authenticate,
  validateQuery(paginationSchema),
  productController.getAll,
);
router.get(
  "/:id",
  authenticate,
  validateParams(idParamSchema),
  productController.getById,
);
router.put(
  "/update/:id",
  authenticate,
  validateParams(idParamSchema),
  validateBody(updateProductSchema),
  productController.update,
);
router.delete(
  "/delete/:id",
  authenticate,
  validateParams(idParamSchema),
  productController.delete,
);
router.put(
  "/status/:id",
  authenticate,
  validateParams(idParamSchema),
  productController.updateStatus,
);
router.put(
  "/toggle-active/:id",
  authenticate,
  validateParams(idParamSchema),
  productController.toggleActive,
);

module.exports = router;
