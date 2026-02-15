/**
 * ACNS Backend - Routes Index
 * Central route configuration
 */

const express = require("express");
const router = express.Router();

// Import routes
const adminRoutes = require("./adminRoutes");
const blogRoutes = require("./blogRoutes");
const productRoutes = require("./productRoutes");
const serviceRoutes = require("./serviceRoutes");
const jobRoutes = require("./jobRoutes");
const testimonialRoutes = require("./testimonialRoutes");
const contactRoutes = require("./contactRoutes");
const mediaRoutes = require("./mediaRoutes");
const settingsRoutes = require("./settingsRoutes");
const aiRoutes = require("./aiRoutes");

// Health check route
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "ACNS Backend API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// Mount routes
router.use("/admin", adminRoutes);
router.use("/blog", blogRoutes);
router.use("/products", productRoutes);
router.use("/services", serviceRoutes);
router.use("/jobs", jobRoutes);
router.use("/testimonials", testimonialRoutes);
router.use("/contact", contactRoutes);
router.use("/media", mediaRoutes);
router.use("/settings", settingsRoutes);
router.use("/ai", aiRoutes);

module.exports = router;
