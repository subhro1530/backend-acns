/**
 * ACNS Backend - Admin Routes
 * Authentication and admin management routes
 */

const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { authenticate, validateBody } = require("../middleware");
const {
  adminLoginSchema,
  changePasswordSchema,
} = require("../utils/validators");

// Public routes
router.post("/login", validateBody(adminLoginSchema), adminController.login);

// Protected routes (require authentication)
router.get("/profile", authenticate, adminController.getProfile);
router.post(
  "/change-password",
  authenticate,
  validateBody(changePasswordSchema),
  adminController.changePassword,
);

module.exports = router;
