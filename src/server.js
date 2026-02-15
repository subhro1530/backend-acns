/**
 * ACNS Backend - Main Server Entry Point
 * Advanced Cloud & Network Solutions
 *
 * Author: Shaswata Saha
 * Email: acodernamedsubhro@gmail.com
 */

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");

// Load environment variables first
require("dotenv").config();

const config = require("./config");
const routes = require("./routes");
const {
  requestLogger,
  notFoundHandler,
  errorHandler,
} = require("./middleware");
const logger = require("./utils/logger");

// Initialize Express app
const app = express();

// ===================
// SECURITY MIDDLEWARE
// ===================

// Helmet.js - Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

// CORS configuration
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

// ===================
// BODY PARSING
// ===================

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ===================
// STATIC FILES
// ===================

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ===================
// REQUEST LOGGING
// ===================

app.use(requestLogger);

// ===================
// API ROUTES
// ===================

app.use("/api", routes);

// ===================
// ROOT ENDPOINT
// ===================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to ACNS Backend API",
    company: "Advanced Cloud & Network Solutions",
    founder: "Shaswata Saha",
    version: "1.0.0",
    docs: "/api/health",
    timestamp: new Date().toISOString(),
  });
});

// ===================
// ERROR HANDLING
// ===================

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// ===================
// SERVER STARTUP
// ===================

const PORT = config.port;

const startServer = async () => {
  try {
    // Test database connection
    const prisma = require("./config/database");
    await prisma.$connect();
    logger.info("Database connected successfully");

    // Start server
    app.listen(PORT, () => {
      logger.info(`🚀 ACNS Backend Server started`, {
        port: PORT,
        environment: config.nodeEnv,
        url: `http://localhost:${PORT}`,
      });

      console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   🌐  ACNS - Advanced Cloud & Network Solutions               ║
║   🚀  Backend Server is Running                               ║
║                                                               ║
║   📍  URL: http://localhost:${PORT}                            ║
║   🔧  Environment: ${config.nodeEnv.padEnd(12)}                        ║
║   📅  Started: ${new Date().toLocaleString().padEnd(27)}║
║                                                               ║
║   👤  Founder: Shaswata Saha                                  ║
║   📧  Email: acodernamedsubhro@gmail.com                      ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    logger.error("Failed to start server", { error: error.message });
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception", {
    error: error.message,
    stack: error.stack,
  });
  console.error("❌ Uncaught Exception:", error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection", { reason, promise });
  console.error("❌ Unhandled Rejection:", reason);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  logger.info("SIGTERM received. Shutting down gracefully...");
  const prisma = require("./config/database");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGINT", async () => {
  logger.info("SIGINT received. Shutting down gracefully...");
  const prisma = require("./config/database");
  await prisma.$disconnect();
  process.exit(0);
});

// Start the server
startServer();

module.exports = app;
