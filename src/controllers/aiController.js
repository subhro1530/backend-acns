/**
 * ACNS Backend - AI Controller
 * HTTP handlers for AI-powered chatbot and smart features
 */

const aiService = require("../services/aiService");
const ApiResponse = require("../utils/apiResponse");
const logger = require("../utils/logger");

class AIController {
  /**
   * POST /api/ai/chat
   * Main chatbot endpoint — conversational AI with session memory
   */
  async chat(req, res, next) {
    try {
      const { message, sessionId } = req.body;
      const isAdmin = !!req.user;

      const result = await aiService.chat({
        message,
        sessionId: sessionId || `anon-${Date.now()}`,
        isAdmin,
      });

      return ApiResponse.success(res, result, "AI response generated");
    } catch (error) {
      logger.error("AI chat error", { error: error.message });
      next(error);
    }
  }

  /**
   * GET /api/ai/search?q=query
   * Smart search across all website content with AI summary
   */
  async smartSearch(req, res, next) {
    try {
      const { q } = req.query;

      if (!q || q.trim().length < 2) {
        return ApiResponse.badRequest(
          res,
          "Search query must be at least 2 characters",
        );
      }

      const results = await aiService.smartSearch(q);
      return ApiResponse.success(res, results, "Search completed");
    } catch (error) {
      logger.error("AI search error", { error: error.message });
      next(error);
    }
  }

  /**
   * POST /api/ai/generate
   * AI content generation (admin only) — blogs, products, SEO, etc.
   */
  async generateContent(req, res, next) {
    try {
      const { type, prompt, tone } = req.body;

      const result = await aiService.generateContent({ type, prompt, tone });
      return ApiResponse.success(
        res,
        result,
        `${type} content generated successfully`,
      );
    } catch (error) {
      logger.error("AI generate error", { error: error.message });
      next(error);
    }
  }

  /**
   * GET /api/ai/quick-actions?page=home
   * Get contextual quick action suggestions for the chatbot UI
   */
  async getQuickActions(req, res, next) {
    try {
      const { page } = req.query;
      const isAdmin = !!req.user;

      const result = await aiService.getQuickActions({
        page: page || "home",
        isAdmin,
      });

      return ApiResponse.success(res, result, "Quick actions retrieved");
    } catch (error) {
      logger.error("AI quick-actions error", { error: error.message });
      next(error);
    }
  }

  /**
   * POST /api/ai/summarize
   * Summarize a blog post, service, or product using AI
   */
  async summarize(req, res, next) {
    try {
      const { type, id } = req.body;

      const result = await aiService.summarize({ type, id });
      return ApiResponse.success(res, result, "Summary generated");
    } catch (error) {
      logger.error("AI summarize error", { error: error.message });
      next(error);
    }
  }
}

module.exports = new AIController();
