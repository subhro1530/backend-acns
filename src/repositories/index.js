/**
 * ACNS Backend - Repositories Index
 * Central export point for all repositories
 */

const BaseRepository = require("./baseRepository");
const adminRepository = require("./adminRepository");
const blogRepository = require("./blogRepository");
const productRepository = require("./productRepository");
const serviceRepository = require("./serviceRepository");
const { jobRepository, jobApplicationRepository } = require("./jobRepository");
const testimonialRepository = require("./testimonialRepository");
const contactRepository = require("./contactRepository");
const mediaRepository = require("./mediaRepository");
const settingsRepository = require("./settingsRepository");

module.exports = {
  BaseRepository,
  adminRepository,
  blogRepository,
  productRepository,
  serviceRepository,
  jobRepository,
  jobApplicationRepository,
  testimonialRepository,
  contactRepository,
  mediaRepository,
  settingsRepository,
};
