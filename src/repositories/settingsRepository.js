/**
 * ACNS Backend - Settings Repository
 * Database operations for WebsiteSettings model (Singleton)
 */

const prisma = require("../config/database");

class SettingsRepository {
  constructor() {
    this.model = prisma.websiteSettings;
    this.SETTINGS_ID = "main";
  }

  /**
   * Get website settings
   */
  async get() {
    // Create default settings if not exists
    return this.model.upsert({
      where: { id: this.SETTINGS_ID },
      create: {
        id: this.SETTINGS_ID,
        companyName: "ACNS",
        companyFullName: "Advanced Cloud & Network Solutions",
        founderName: "Shaswata Saha",
        contactEmail: "acodernamedsubhro@gmail.com",
      },
      update: {},
    });
  }

  /**
   * Update website settings
   */
  async update(data) {
    return this.model.upsert({
      where: { id: this.SETTINGS_ID },
      create: {
        id: this.SETTINGS_ID,
        ...data,
      },
      update: data,
    });
  }

  /**
   * Get specific setting fields
   */
  async getFields(fields) {
    const select = {};
    fields.forEach((field) => {
      select[field] = true;
    });

    const settings = await this.model.findUnique({
      where: { id: this.SETTINGS_ID },
      select,
    });

    return settings || this.get();
  }

  /**
   * Get company info
   */
  async getCompanyInfo() {
    return this.getFields([
      "companyName",
      "companyFullName",
      "tagline",
      "founderName",
      "contactEmail",
      "supportEmail",
      "phone",
      "alternatePhone",
      "address",
    ]);
  }

  /**
   * Get social links
   */
  async getSocialLinks() {
    return this.getFields([
      "facebook",
      "twitter",
      "linkedin",
      "instagram",
      "youtube",
      "github",
    ]);
  }

  /**
   * Get hero section
   */
  async getHeroSection() {
    return this.getFields([
      "heroTitle",
      "heroSubtitle",
      "heroDescription",
      "heroCta",
      "heroCtaLink",
      "heroImage",
    ]);
  }

  /**
   * Get about section
   */
  async getAboutSection() {
    return this.getFields([
      "aboutTitle",
      "aboutDescription",
      "aboutImage",
      "mission",
      "vision",
    ]);
  }

  /**
   * Get footer info
   */
  async getFooterInfo() {
    return this.getFields(["footerText", "copyrightText"]);
  }

  /**
   * Get SEO settings
   */
  async getSeoSettings() {
    return this.getFields(["metaTitle", "metaDescription", "metaKeywords"]);
  }

  /**
   * Get feature toggles
   */
  async getFeatureToggles() {
    return this.getFields([
      "showBlog",
      "showProducts",
      "showServices",
      "showCareers",
      "showTestimonials",
    ]);
  }
}

module.exports = new SettingsRepository();
