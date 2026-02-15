/**
 * ACNS Backend - Media Controller
 * HTTP handlers for media upload endpoints
 */

const mediaService = require("../services/mediaService");
const ApiResponse = require("../utils/apiResponse");

class MediaController {
  /**
   * POST /api/media/upload
   * Upload single file
   */
  async upload(req, res, next) {
    try {
      const media = await mediaService.upload(req.file, {
        folder: req.body.folder || req.query.folder || "general",
        alt: req.body.alt,
        uploadedBy: req.user?.id,
      });
      return ApiResponse.created(res, media, "File uploaded successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/media/upload-multiple
   * Upload multiple files
   */
  async uploadMultiple(req, res, next) {
    try {
      const media = await mediaService.uploadMultiple(req.files, {
        folder: req.body.folder || req.query.folder || "general",
        uploadedBy: req.user?.id,
      });
      return ApiResponse.created(res, media, "Files uploaded successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/media/all
   * Get all media
   */
  async getAll(req, res, next) {
    try {
      const result = await mediaService.getAll(req.query);
      return ApiResponse.paginated(
        res,
        result.media,
        result.pagination,
        "Media retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/media/:id
   * Get media by ID
   */
  async getById(req, res, next) {
    try {
      const media = await mediaService.getById(req.params.id);
      return ApiResponse.success(res, media, "Media retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/media/:id
   * Update media info
   */
  async update(req, res, next) {
    try {
      const media = await mediaService.update(req.params.id, req.body);
      return ApiResponse.success(res, media, "Media updated successfully");
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/media/:id
   * Delete media
   */
  async delete(req, res, next) {
    try {
      const result = await mediaService.delete(req.params.id);
      return ApiResponse.success(res, null, result.message);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/media/storage-stats
   * Get storage statistics
   */
  async getStorageStats(req, res, next) {
    try {
      const stats = await mediaService.getStorageStats();
      return ApiResponse.success(
        res,
        stats,
        "Storage stats retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/media/folders
   * Get all folders
   */
  async getFolders(req, res, next) {
    try {
      const folders = await mediaService.getFolders();
      return ApiResponse.success(
        res,
        folders,
        "Folders retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/media/images
   * Get images only
   */
  async getImages(req, res, next) {
    try {
      const result = await mediaService.getImages(req.query);
      return ApiResponse.paginated(
        res,
        result.media,
        result.pagination,
        "Images retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/media/documents
   * Get documents only
   */
  async getDocuments(req, res, next) {
    try {
      const result = await mediaService.getDocuments(req.query);
      return ApiResponse.paginated(
        res,
        result.media,
        result.pagination,
        "Documents retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MediaController();
