/**
 * ACNS Backend - AI Routes
 * Gemini-powered chatbot, smart search, content generation
 */

const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");
const {
  authenticate,
  optionalAuth,
  validateBody,
  validateQuery,
} = require("../middleware");
const { z } = require("zod");

// ── Validation Schemas ───────────────────────
const chatSchema = z.object({
  message: z
    .string()
    .min(1, "Message is required")
    .max(2000, "Message too long (max 2000 chars)"),
  sessionId: z.string().optional(),
});

const searchSchema = z.object({
  q: z.string().min(2, "Search query must be at least 2 characters"),
});

const generateSchema = z.object({
  type: z.enum(["blog", "product", "service", "seo", "email", "social"], {
    errorMap: () => ({
      message:
        "Type must be one of: blog, product, service, seo, email, social",
    }),
  }),
  prompt: z
    .string()
    .min(5, "Prompt must be at least 5 characters")
    .max(1000, "Prompt too long (max 1000 chars)"),
  tone: z
    .enum(["professional", "casual", "technical", "friendly", "formal"])
    .optional()
    .default("professional"),
});

const summarizeSchema = z.object({
  type: z.enum(["blog", "service", "product"], {
    errorMap: () => ({
      message: "Type must be one of: blog, service, product",
    }),
  }),
  id: z.string().uuid("Invalid ID format"),
});

// ── Rate limiter specifically for AI endpoints ───
const rateLimit = require("express-rate-limit");
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 requests per minute per IP
  message: {
    success: false,
    message: "Too many AI requests. Please wait a moment and try again.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply AI-specific rate limit to all AI routes
router.use(aiLimiter);

// ── Public Routes (optionalAuth to detect admin) ───

// Chat — main conversational endpoint
router.post("/chat", optionalAuth, validateBody(chatSchema), aiController.chat);

// Smart search with AI summary
router.get("/search", validateQuery(searchSchema), aiController.smartSearch);

// Quick actions — contextual suggestions
router.get("/quick-actions", optionalAuth, aiController.getQuickActions);

// Summarize any content piece (public)
router.post(
  "/summarize",
  validateBody(summarizeSchema),
  aiController.summarize,
);

// ── Protected Routes (admin only) ───

// AI content generation — blogs, products, SEO, emails, social
router.post(
  "/generate",
  authenticate,
  validateBody(generateSchema),
  aiController.generateContent,
);

module.exports = router;
