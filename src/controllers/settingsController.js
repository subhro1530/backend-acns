/**
 * ACNS Backend - Settings Controller
 * HTTP handlers for website settings endpoints
 */

const settingsService = require("../services/settingsService");
const ApiResponse = require("../utils/apiResponse");

class SettingsController {
  /**
   * GET /api/settings
   * Get all website settings
   */
  async get(req, res, next) {
    try {
      const settings = await settingsService.get();
      return ApiResponse.success(
        res,
        settings,
        "Settings retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/settings/update
   * Update website settings
   */
  async update(req, res, next) {
    try {
      const settings = await settingsService.update(req.body);
      return ApiResponse.success(
        res,
        settings,
        "Settings updated successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/settings/company
   * Get company info
   */
  async getCompanyInfo(req, res, next) {
    try {
      const info = await settingsService.getCompanyInfo();
      return ApiResponse.success(
        res,
        info,
        "Company info retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/settings/social
   * Get social links
   */
  async getSocialLinks(req, res, next) {
    try {
      const links = await settingsService.getSocialLinks();
      return ApiResponse.success(
        res,
        links,
        "Social links retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/settings/hero
   * Get hero section
   */
  async getHeroSection(req, res, next) {
    try {
      const hero = await settingsService.getHeroSection();
      return ApiResponse.success(
        res,
        hero,
        "Hero section retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/settings/about
   * Get about section
   */
  async getAboutSection(req, res, next) {
    try {
      const about = await settingsService.getAboutSection();
      return ApiResponse.success(
        res,
        about,
        "About section retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/settings/footer
   * Get footer info
   */
  async getFooterInfo(req, res, next) {
    try {
      const footer = await settingsService.getFooterInfo();
      return ApiResponse.success(
        res,
        footer,
        "Footer info retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/settings/seo
   * Get SEO settings
   */
  async getSeoSettings(req, res, next) {
    try {
      const seo = await settingsService.getSeoSettings();
      return ApiResponse.success(
        res,
        seo,
        "SEO settings retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/settings/features
   * Get feature toggles
   */
  async getFeatureToggles(req, res, next) {
    try {
      const features = await settingsService.getFeatureToggles();
      return ApiResponse.success(
        res,
        features,
        "Feature toggles retrieved successfully",
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SettingsController();
