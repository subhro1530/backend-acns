/**
 * ACNS Backend - Settings Service
 * Business logic for website settings management
 */

const settingsRepository = require("../repositories/settingsRepository");

class SettingsService {
  /**
   * Get all website settings
   */
  async get() {
    return settingsRepository.get();
  }

  /**
   * Update website settings
   */
  async update(data) {
    return settingsRepository.update(data);
  }

  /**
   * Get company info
   */
  async getCompanyInfo() {
    return settingsRepository.getCompanyInfo();
  }

  /**
   * Get social links
   */
  async getSocialLinks() {
    return settingsRepository.getSocialLinks();
  }

  /**
   * Get hero section
   */
  async getHeroSection() {
    return settingsRepository.getHeroSection();
  }

  /**
   * Get about section
   */
  async getAboutSection() {
    return settingsRepository.getAboutSection();
  }

  /**
   * Get footer info
   */
  async getFooterInfo() {
    return settingsRepository.getFooterInfo();
  }

  /**
   * Get SEO settings
   */
  async getSeoSettings() {
    return settingsRepository.getSeoSettings();
  }

  /**
   * Get feature toggles
   */
  async getFeatureToggles() {
    return settingsRepository.getFeatureToggles();
  }

  /**
   * Update specific section
   */
  async updateSection(section, data) {
    // Only update the section fields that are provided
    return settingsRepository.update(data);
  }
}

module.exports = new SettingsService();
