/**
 * ACNS Backend - File Upload Middleware
 * Multer configuration for handling file uploads
 */

const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// File filter
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = {
    images: [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ],
    documents: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    resumes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
  };

  // Get upload type from route or default to images
  const uploadType = req.uploadType || "images";
  const allowed = allowedTypes[uploadType] || allowedTypes.images;

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(`Invalid file type. Allowed types: ${allowed.join(", ")}`),
      false,
    );
  }
};

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create subfolder based on upload type
    const subfolder = req.uploadType || "general";
    const destDir = path.join(uploadDir, subfolder);

    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    cb(null, destDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueId = uuidv4();
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${uniqueId}${ext}`;
    cb(null, filename);
  },
});

// Memory storage for cloud upload
const memoryStorage = multer.memoryStorage();

// Upload configurations
const createUploader = (options = {}) => {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    useMemoryStorage = false,
  } = options;

  return multer({
    storage: useMemoryStorage ? memoryStorage : storage,
    fileFilter,
    limits: {
      fileSize: maxSize,
      files: 10, // Max 10 files at once
    },
  });
};

// Pre-configured uploaders
const uploadImage = createUploader({ maxSize: 5 * 1024 * 1024 }); // 5MB
const uploadDocument = createUploader({ maxSize: 10 * 1024 * 1024 }); // 10MB
const uploadResume = createUploader({ maxSize: 5 * 1024 * 1024 }); // 5MB

// Middleware to set upload type
const setUploadType = (type) => (req, res, next) => {
  req.uploadType = type;
  next();
};

// Single file upload
const uploadSingle = (fieldName, type = "images") => [
  setUploadType(type),
  uploadImage.single(fieldName),
];

// Multiple files upload
const uploadMultiple = (fieldName, maxCount = 5, type = "images") => [
  setUploadType(type),
  uploadImage.array(fieldName, maxCount),
];

// Handle upload errors
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File too large",
        error: err.message,
      });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        message: "Too many files",
        error: err.message,
      });
    }
    return res.status(400).json({
      success: false,
      message: "Upload error",
      error: err.message,
    });
  }

  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || "File upload failed",
    });
  }

  next();
};

module.exports = {
  uploadImage,
  uploadDocument,
  uploadResume,
  uploadSingle,
  uploadMultiple,
  handleUploadError,
  setUploadType,
  createUploader,
  uploadDir,
};
