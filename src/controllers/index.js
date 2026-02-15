/**
 * ACNS Backend - Controllers Index
 * Central export point for all controllers
 */

const adminController = require("./adminController");
const blogController = require("./blogController");
const productController = require("./productController");
const serviceController = require("./serviceController");
const jobController = require("./jobController");
const testimonialController = require("./testimonialController");
const contactController = require("./contactController");
const mediaController = require("./mediaController");
const settingsController = require("./settingsController");

module.exports = {
  adminController,
  blogController,
  productController,
  serviceController,
  jobController,
  testimonialController,
  contactController,
  mediaController,
  settingsController,
};
