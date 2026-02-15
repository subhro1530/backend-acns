/**
 * ACNS Backend - Email Service
 * Handles all email operations using Nodemailer
 */

const nodemailer = require("nodemailer");
const config = require("../config");
const logger = require("./logger");

class EmailService {
  constructor() {
    this.transporter = null;
    this.initialize();
  }

  initialize() {
    try {
      if (config.email.user && config.email.pass) {
        this.transporter = nodemailer.createTransport({
          host: config.email.host,
          port: config.email.port,
          secure: config.email.port === 465,
          auth: {
            user: config.email.user,
            pass: config.email.pass,
          },
        });

        // Verify connection
        this.transporter.verify((error) => {
          if (error) {
            logger.warn("Email service connection failed", {
              error: error.message,
            });
          } else {
            logger.info("Email service initialized successfully");
          }
        });
      } else {
        logger.warn(
          "Email credentials not configured. Email service disabled.",
        );
      }
    } catch (error) {
      logger.error("Failed to initialize email service", {
        error: error.message,
      });
    }
  }

  async sendEmail(to, subject, html, text = null) {
    if (!this.transporter) {
      logger.warn("Email service not available. Skipping email.", {
        to,
        subject,
      });
      return { success: false, message: "Email service not configured" };
    }

    try {
      const mailOptions = {
        from: `"ACNS" <${config.email.from || config.email.user}>`,
        to,
        subject,
        html,
        text: text || this.stripHtml(html),
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info("Email sent successfully", {
        to,
        subject,
        messageId: info.messageId,
      });
      return { success: true, messageId: info.messageId };
    } catch (error) {
      logger.error("Failed to send email", {
        to,
        subject,
        error: error.message,
      });
      return { success: false, message: error.message };
    }
  }

  stripHtml(html) {
    return html
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  // Contact form notification
  async sendContactNotification(contact) {
    const adminEmail = config.admin.email;
    const subject = `New Contact Form Submission - ${contact.subject || "General Inquiry"}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
          New Contact Form Submission
        </h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Name:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${contact.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${contact.email}</td>
          </tr>
          ${
            contact.phone
              ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Phone:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${contact.phone}</td>
          </tr>
          `
              : ""
          }
          ${
            contact.company
              ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Company:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${contact.company}</td>
          </tr>
          `
              : ""
          }
          ${
            contact.subject
              ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Subject:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${contact.subject}</td>
          </tr>
          `
              : ""
          }
        </table>
        <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
          <strong>Message:</strong>
          <p style="margin: 10px 0 0 0; white-space: pre-wrap;">${contact.message}</p>
        </div>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">
          Submitted on: ${new Date().toLocaleString()}
        </p>
      </div>
    `;

    return this.sendEmail(adminEmail, subject, html);
  }

  // Job application notification
  async sendJobApplicationNotification(application, job) {
    const adminEmail = config.admin.email;
    const subject = `New Job Application - ${job.title}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #28a745; padding-bottom: 10px;">
          New Job Application Received
        </h2>
        <h3 style="color: #007bff;">Position: ${job.title}</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Applicant:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${application.firstName} ${application.lastName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${application.email}</td>
          </tr>
          ${
            application.phone
              ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Phone:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${application.phone}</td>
          </tr>
          `
              : ""
          }
          ${
            application.linkedIn
              ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">LinkedIn:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="${application.linkedIn}">${application.linkedIn}</a></td>
          </tr>
          `
              : ""
          }
          ${
            application.portfolio
              ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Portfolio:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="${application.portfolio}">${application.portfolio}</a></td>
          </tr>
          `
              : ""
          }
        </table>
        ${
          application.resumeUrl
            ? `
        <p style="margin-top: 15px;">
          <a href="${application.resumeUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
            Download Resume
          </a>
        </p>
        `
            : ""
        }
        ${
          application.coverLetter
            ? `
        <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
          <strong>Cover Letter:</strong>
          <p style="margin: 10px 0 0 0; white-space: pre-wrap;">${application.coverLetter}</p>
        </div>
        `
            : ""
        }
        <p style="color: #666; font-size: 12px; margin-top: 20px;">
          Applied on: ${new Date().toLocaleString()}
        </p>
      </div>
    `;

    return this.sendEmail(adminEmail, subject, html);
  }

  // Password reset email
  async sendPasswordResetEmail(email, resetToken, resetUrl) {
    const subject = "Password Reset Request - ACNS";

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #dc3545; padding-bottom: 10px;">
          Password Reset Request
        </h2>
        <p>You have requested to reset your password. Click the button below to proceed:</p>
        <p style="margin: 25px 0;">
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 30px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Reset Password
          </a>
        </p>
        <p style="color: #666;">If you didn't request this, please ignore this email.</p>
        <p style="color: #666;">This link will expire in 1 hour.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <a href="${resetUrl}" style="color: #007bff;">${resetUrl}</a>
        </p>
      </div>
    `;

    return this.sendEmail(email, subject, html);
  }

  // Welcome email for new admin
  async sendWelcomeEmail(email, name) {
    const subject = "Welcome to ACNS Admin Panel";

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
          Welcome to ACNS!
        </h2>
        <p>Hello ${name || "Admin"},</p>
        <p>Your admin account has been created successfully. You can now access the ACNS admin panel.</p>
        <p style="color: #666;">If you have any questions, please contact the system administrator.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">
          Advanced Cloud & Network Solutions (ACNS)<br>
          Founded by Shaswata Saha
        </p>
      </div>
    `;

    return this.sendEmail(email, subject, html);
  }
}

// Export singleton instance
module.exports = new EmailService();
