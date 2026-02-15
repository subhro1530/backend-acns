/**
 * ACNS Backend - Contact Routes
 * Contact CRM routes
 */

const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");
const {
  authenticate,
  validateBody,
  validateParams,
  validateQuery,
} = require("../middleware");
const {
  createContactSchema,
  idParamSchema,
  paginationSchema,
} = require("../utils/validators");

// Public routes
router.post(
  "/submit",
  validateBody(createContactSchema),
  contactController.submit,
);

// Protected routes (require authentication)
router.get(
  "/all",
  authenticate,
  validateQuery(paginationSchema),
  contactController.getAll,
);
router.get("/unread-count", authenticate, contactController.getUnreadCount);
router.get("/statistics", authenticate, contactController.getStatistics);
router.get("/recent", authenticate, contactController.getRecent);
router.get(
  "/:id",
  authenticate,
  validateParams(idParamSchema),
  contactController.getById,
);
router.delete(
  "/:id",
  authenticate,
  validateParams(idParamSchema),
  contactController.delete,
);
router.put(
  "/:id/status",
  authenticate,
  validateParams(idParamSchema),
  contactController.updateStatus,
);
router.put(
  "/:id/notes",
  authenticate,
  validateParams(idParamSchema),
  contactController.addNotes,
);

module.exports = router;
