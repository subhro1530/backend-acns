/**
 * ACNS Backend - Settings Routes
 * Website settings management routes
 */

const express = require("express");
const router = express.Router();
const settingsController = require("../controllers/settingsController");
const { authenticate, validateBody } = require("../middleware");
const { updateSettingsSchema } = require("../utils/validators");

// Public routes (for frontend to fetch settings)
router.get("/", settingsController.get);
router.get("/company", settingsController.getCompanyInfo);
router.get("/social", settingsController.getSocialLinks);
router.get("/hero", settingsController.getHeroSection);
router.get("/about", settingsController.getAboutSection);
router.get("/footer", settingsController.getFooterInfo);
router.get("/seo", settingsController.getSeoSettings);
router.get("/features", settingsController.getFeatureToggles);

// Protected routes (require authentication)
router.put(
  "/update",
  authenticate,
  validateBody(updateSettingsSchema),
  settingsController.update,
);

module.exports = router;
