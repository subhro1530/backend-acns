/**
 * ACNS Backend - Zod Validation Schemas
 * Centralized validation schemas for all API endpoints
 */

const { z } = require("zod");

// Common schemas
const paginationSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

const idParamSchema = z.object({
  id: z.string().uuid("Invalid ID format"),
});

// Admin Authentication Schemas
const adminLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Blog Schemas
const createBlogSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  coverImage: z.string().optional(),
  author: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  isPublished: z.boolean().optional().default(false),
});

const updateBlogSchema = createBlogSchema.partial();

// Product Schemas
const createProductSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  slug: z.string().optional(),
  description: z.string().optional(),
  shortDesc: z.string().optional(),
  price: z.coerce.number().nonnegative().optional(),
  images: z.array(z.string()).optional().default([]),
  features: z.array(z.string()).optional().default([]),
  category: z.string().optional(),
  status: z
    .enum(["DRAFT", "ACTIVE", "DISCONTINUED"])
    .optional()
    .default("DRAFT"),
  isActive: z.boolean().optional().default(true),
  sortOrder: z.coerce.number().int().optional().default(0),
});

const updateProductSchema = createProductSchema.partial();

// Service Schemas
const createServiceSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  slug: z.string().optional(),
  description: z.string().optional(),
  shortDesc: z.string().optional(),
  icon: z.string().optional(),
  image: z.string().optional(),
  features: z.array(z.string()).optional().default([]),
  isActive: z.boolean().optional().default(true),
  sortOrder: z.coerce.number().int().optional().default(0),
});

const updateServiceSchema = createServiceSchema.partial();

// Job Opening Schemas
const createJobSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().optional(),
  department: z.string().optional(),
  location: z.string().optional(),
  type: z
    .enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "REMOTE"])
    .optional()
    .default("FULL_TIME"),
  experience: z.string().optional(),
  salary: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  requirements: z.array(z.string()).optional().default([]),
  benefits: z.array(z.string()).optional().default([]),
  isActive: z.boolean().optional().default(true),
  deadline: z.coerce.date().optional(),
});

const updateJobSchema = createJobSchema.partial();

// Job Application Schema
const jobApplicationSchema = z.object({
  jobId: z.string().uuid("Invalid job ID"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  resumeUrl: z.string().optional(),
  coverLetter: z.string().optional(),
  linkedIn: z.string().url().optional().or(z.literal("")),
  portfolio: z.string().url().optional().or(z.literal("")),
});

// Testimonial Schemas
const createTestimonialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().optional(),
  company: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  rating: z.coerce.number().int().min(1).max(5).optional().default(5),
  image: z.string().optional(),
  isActive: z.boolean().optional().default(true),
  sortOrder: z.coerce.number().int().optional().default(0),
});

const updateTestimonialSchema = createTestimonialSchema.partial();

// Contact Request Schema
const createContactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(1, "Message is required"),
});

// Website Settings Schema
const updateSettingsSchema = z.object({
  companyName: z.string().optional(),
  companyFullName: z.string().optional(),
  tagline: z.string().optional(),
  founderName: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal("")),
  supportEmail: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  alternatePhone: z.string().optional(),
  address: z.string().optional(),
  facebook: z.string().optional(),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
  instagram: z.string().optional(),
  youtube: z.string().optional(),
  github: z.string().optional(),
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
  heroDescription: z.string().optional(),
  heroCta: z.string().optional(),
  heroCtaLink: z.string().optional(),
  heroImage: z.string().optional(),
  aboutTitle: z.string().optional(),
  aboutDescription: z.string().optional(),
  aboutImage: z.string().optional(),
  mission: z.string().optional(),
  vision: z.string().optional(),
  footerText: z.string().optional(),
  copyrightText: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.array(z.string()).optional(),
  showBlog: z.boolean().optional(),
  showProducts: z.boolean().optional(),
  showServices: z.boolean().optional(),
  showCareers: z.boolean().optional(),
  showTestimonials: z.boolean().optional(),
});

module.exports = {
  // Common
  paginationSchema,
  idParamSchema,

  // Admin
  adminLoginSchema,
  changePasswordSchema,

  // Blog
  createBlogSchema,
  updateBlogSchema,

  // Product
  createProductSchema,
  updateProductSchema,

  // Service
  createServiceSchema,
  updateServiceSchema,

  // Jobs
  createJobSchema,
  updateJobSchema,
  jobApplicationSchema,

  // Testimonials
  createTestimonialSchema,
  updateTestimonialSchema,

  // Contact
  createContactSchema,

  // Settings
  updateSettingsSchema,
};
