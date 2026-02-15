/**
 * ACNS Backend - Media Routes
 * Media upload and management routes
 */

const express = require("express");
const router = express.Router();
const mediaController = require("../controllers/mediaController");
const {
  authenticate,
  validateParams,
  validateQuery,
  uploadImage,
  handleUploadError,
} = require("../middleware");
const { idParamSchema, paginationSchema } = require("../utils/validators");

// All media routes require authentication
router.use(authenticate);

// Upload routes
router.post(
  "/upload",
  uploadImage.single("file"),
  handleUploadError,
  mediaController.upload,
);
router.post(
  "/upload-multiple",
  uploadImage.array("files", 10),
  handleUploadError,
  mediaController.uploadMultiple,
);

// Get routes
router.get("/all", validateQuery(paginationSchema), mediaController.getAll);
router.get("/storage-stats", mediaController.getStorageStats);
router.get("/folders", mediaController.getFolders);
router.get(
  "/images",
  validateQuery(paginationSchema),
  mediaController.getImages,
);
router.get(
  "/documents",
  validateQuery(paginationSchema),
  mediaController.getDocuments,
);
router.get("/:id", validateParams(idParamSchema), mediaController.getById);

// Update and delete routes
router.put("/:id", validateParams(idParamSchema), mediaController.update);
router.delete("/:id", validateParams(idParamSchema), mediaController.delete);

module.exports = router;
