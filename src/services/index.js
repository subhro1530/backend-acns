/**
 * ACNS Backend - Services Index
 * Central export point for all services
 */

const adminService = require("./adminService");
const blogService = require("./blogService");
const productService = require("./productService");
const serviceService = require("./serviceService");
const jobService = require("./jobService");
const testimonialService = require("./testimonialService");
const contactService = require("./contactService");
const mediaService = require("./mediaService");
const settingsService = require("./settingsService");

module.exports = {
  adminService,
  blogService,
  productService,
  serviceService,
  jobService,
  testimonialService,
  contactService,
  mediaService,
  settingsService,
};
