/**
 * ACNS Backend - Helper Utilities
 * Common utility functions used across the application
 */

const config = require("../config");

/**
 * Generate URL-friendly slug from string
 */
const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
};

/**
 * Generate unique slug with timestamp suffix if needed
 */
const generateUniqueSlug = (text, existingSlugs = []) => {
  let slug = generateSlug(text);

  if (existingSlugs.includes(slug)) {
    slug = `${slug}-${Date.now()}`;
  }

  return slug;
};

/**
 * Parse pagination parameters
 */
const parsePagination = (query) => {
  const page = Math.max(
    1,
    parseInt(query.page, 10) || config.pagination.defaultPage,
  );
  const limit = Math.min(
    config.pagination.maxLimit,
    Math.max(1, parseInt(query.limit, 10) || config.pagination.defaultLimit),
  );
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

/**
 * Build Prisma orderBy object from query params
 */
const buildOrderBy = (sortBy = "createdAt", sortOrder = "desc") => {
  const validOrders = ["asc", "desc"];
  const order = validOrders.includes(sortOrder.toLowerCase())
    ? sortOrder.toLowerCase()
    : "desc";

  return { [sortBy]: order };
};

/**
 * Build Prisma where clause for search
 */
const buildSearchFilter = (search, fields = ["name", "title"]) => {
  if (!search || search.trim() === "") {
    return {};
  }

  return {
    OR: fields.map((field) => ({
      [field]: {
        contains: search.trim(),
        mode: "insensitive",
      },
    })),
  };
};

/**
 * Clean object by removing undefined/null values
 */
const cleanObject = (obj) => {
  const cleaned = {};

  Object.keys(obj).forEach((key) => {
    if (obj[key] !== undefined && obj[key] !== null) {
      cleaned[key] = obj[key];
    }
  });

  return cleaned;
};

/**
 * Format file size in human readable format
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * Get file extension from filename
 */
const getFileExtension = (filename) => {
  return filename
    .slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2)
    .toLowerCase();
};

/**
 * Check if file is an image
 */
const isImage = (mimeType) => {
  return mimeType && mimeType.startsWith("image/");
};

/**
 * Generate random string
 */
const generateRandomString = (length = 32) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
};

/**
 * Delay execution (for rate limiting, etc.)
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Truncate text with ellipsis
 */
const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
};

/**
 * Parse boolean from string
 */
const parseBoolean = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    return value.toLowerCase() === "true" || value === "1";
  }
  return Boolean(value);
};

module.exports = {
  generateSlug,
  generateUniqueSlug,
  parsePagination,
  buildOrderBy,
  buildSearchFilter,
  cleanObject,
  formatFileSize,
  getFileExtension,
  isImage,
  generateRandomString,
  delay,
  truncateText,
  parseBoolean,
};
