/**
 * ACNS Backend - Media Service
 * Business logic for media file management
 */

const path = require("path");
const fs = require("fs").promises;
const mediaRepository = require("../repositories/mediaRepository");
const { NotFoundError, BadRequestError } = require("../utils/errors");
const {
  parsePagination,
  buildOrderBy,
  formatFileSize,
} = require("../utils/helpers");
const config = require("../config");

class MediaService {
  /**
   * Upload file
   */
  async upload(file, additionalData = {}) {
    if (!file) {
      throw new BadRequestError("No file provided");
    }

    const mediaData = {
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      url: `/uploads/${additionalData.folder || "general"}/${file.filename}`,
      folder: additionalData.folder || "general",
      alt: additionalData.alt || null,
      uploadedBy: additionalData.uploadedBy || null,
    };

    const media = await mediaRepository.create(mediaData);

    return {
      ...media,
      sizeFormatted: formatFileSize(media.size),
    };
  }

  /**
   * Upload multiple files
   */
  async uploadMultiple(files, additionalData = {}) {
    if (!files || files.length === 0) {
      throw new BadRequestError("No files provided");
    }

    const results = await Promise.all(
      files.map((file) => this.upload(file, additionalData)),
    );

    return results;
  }

  /**
   * Get all media with pagination and filtering
   */
  async getAll(query) {
    const { page, limit, skip } = parsePagination(query);
    const orderBy = buildOrderBy(query.sortBy || "createdAt", query.sortOrder);

    let where = {};

    // Type filter (images, documents)
    if (query.type === "images") {
      where.mimeType = { startsWith: "image/" };
    } else if (query.type === "documents") {
      where.OR = [
        { mimeType: { startsWith: "application/pdf" } },
        { mimeType: { contains: "document" } },
        { mimeType: { startsWith: "application/msword" } },
      ];
    }

    // Folder filter
    if (query.folder) {
      where.folder = query.folder;
    }

    // Search filter
    if (query.search) {
      where.OR = [
        { filename: { contains: query.search, mode: "insensitive" } },
        { originalName: { contains: query.search, mode: "insensitive" } },
        { alt: { contains: query.search, mode: "insensitive" } },
      ];
    }

    const { data, total } = await mediaRepository.findAll({
      where,
      orderBy,
      skip,
      take: limit,
    });

    // Add formatted size
    const formattedData = data.map((item) => ({
      ...item,
      sizeFormatted: formatFileSize(item.size),
    }));

    return {
      media: formattedData,
      pagination: { page, limit, total },
    };
  }

  /**
   * Get media by ID
   */
  async getById(id) {
    const media = await mediaRepository.findById(id);

    if (!media) {
      throw new NotFoundError("Media not found");
    }

    return {
      ...media,
      sizeFormatted: formatFileSize(media.size),
    };
  }

  /**
   * Update media info
   */
  async update(id, data) {
    const media = await mediaRepository.findById(id);

    if (!media) {
      throw new NotFoundError("Media not found");
    }

    // Only allow updating certain fields
    const updateData = {};
    if (data.alt !== undefined) updateData.alt = data.alt;
    if (data.folder !== undefined) updateData.folder = data.folder;

    return mediaRepository.update(id, updateData);
  }

  /**
   * Delete media
   */
  async delete(id) {
    const media = await mediaRepository.findById(id);

    if (!media) {
      throw new NotFoundError("Media not found");
    }

    // Delete physical file
    try {
      const filePath = path.join(
        __dirname,
        "../../uploads",
        media.folder || "general",
        media.filename,
      );
      await fs.unlink(filePath);
    } catch (err) {
      // File might not exist, continue with DB deletion
      console.warn("Failed to delete physical file:", err.message);
    }

    await mediaRepository.delete(id);
    return { message: "Media deleted successfully" };
  }

  /**
   * Get storage statistics
   */
  async getStorageStats() {
    const stats = await mediaRepository.getStorageStats();
    return {
      ...stats,
      totalSizeFormatted: formatFileSize(stats.totalSize),
    };
  }

  /**
   * Get all folders
   */
  async getFolders() {
    return mediaRepository.getFolders();
  }

  /**
   * Get images only
   */
  async getImages(query) {
    return this.getAll({ ...query, type: "images" });
  }

  /**
   * Get documents only
   */
  async getDocuments(query) {
    return this.getAll({ ...query, type: "documents" });
  }
}

module.exports = new MediaService();
