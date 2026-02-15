/**
 * ACNS Backend - Media Repository
 * Database operations for MediaFile model
 */

const BaseRepository = require("./baseRepository");

class MediaRepository extends BaseRepository {
  constructor() {
    super("mediaFile");
  }

  /**
   * Find media by filename
   */
  async findByFilename(filename) {
    return this.model.findFirst({
      where: { filename },
    });
  }

  /**
   * Get media by folder
   */
  async findByFolder(folder, options = {}) {
    return this.findAll({
      ...options,
      where: {
        ...options.where,
        folder,
      },
    });
  }

  /**
   * Get media by mime type
   */
  async findByMimeType(mimeType, options = {}) {
    return this.findAll({
      ...options,
      where: {
        ...options.where,
        mimeType: { startsWith: mimeType },
      },
    });
  }

  /**
   * Get all images
   */
  async getImages(options = {}) {
    return this.findByMimeType("image/", options);
  }

  /**
   * Get all documents
   */
  async getDocuments(options = {}) {
    return this.findAll({
      ...options,
      where: {
        OR: [
          { mimeType: { startsWith: "application/pdf" } },
          { mimeType: { startsWith: "application/msword" } },
          { mimeType: { contains: "document" } },
        ],
      },
    });
  }

  /**
   * Get storage statistics
   */
  async getStorageStats() {
    const result = await this.model.aggregate({
      _sum: { size: true },
      _count: true,
    });
    return {
      totalFiles: result._count,
      totalSize: result._sum.size || 0,
    };
  }

  /**
   * Get unique folders
   */
  async getFolders() {
    const media = await this.model.findMany({
      where: { folder: { not: null } },
      select: { folder: true },
      distinct: ["folder"],
    });
    return media.map((m) => m.folder);
  }

  /**
   * Search media
   */
  async search(query, options = {}) {
    return this.findAll({
      ...options,
      where: {
        OR: [
          { filename: { contains: query, mode: "insensitive" } },
          { originalName: { contains: query, mode: "insensitive" } },
          { alt: { contains: query, mode: "insensitive" } },
        ],
      },
    });
  }
}

module.exports = new MediaRepository();
