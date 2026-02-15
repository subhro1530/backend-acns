# ACNS Frontend Integration Guide

## Backend API Documentation

**Base URL:** `http://localhost:5000/api`  
**Production URL:** `https://your-domain.com/api`

---

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

---

## 📡 API Endpoints

### 1. Health Check

| Method | Endpoint  | Auth | Description      |
| ------ | --------- | ---- | ---------------- |
| GET    | `/health` | ❌   | Check API status |

**Response:**

```json
{
  "success": true,
  "message": "ACNS Backend API is running",
  "timestamp": "2026-02-15T17:36:35.775Z",
  "version": "1.0.0"
}
```

---

### 2. Admin Authentication

| Method | Endpoint                 | Auth | Description                    |
| ------ | ------------------------ | ---- | ------------------------------ |
| POST   | `/admin/login`           | ❌   | Admin login                    |
| GET    | `/admin/profile`         | ✅   | Get admin profile              |
| PUT    | `/admin/profile`         | ✅   | Update admin profile           |
| PUT    | `/admin/change-password` | ✅   | Change password                |
| GET    | `/admin/all`             | ✅   | List all admins (Super Admin)  |
| POST   | `/admin/create`          | ✅   | Create new admin (Super Admin) |
| PUT    | `/admin/update/:id`      | ✅   | Update admin (Super Admin)     |
| DELETE | `/admin/delete/:id`      | ✅   | Delete admin (Super Admin)     |

#### Login Request

```javascript
// POST /api/admin/login
const response = await fetch("/api/admin/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "acodernamedsubhro@gmail.com",
    password: "Acns@2024!Admin",
  }),
});
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "admin": {
      "id": "uuid",
      "email": "admin@acns.tech",
      "firstName": "Shaswata",
      "lastName": "Saha",
      "role": "SUPER_ADMIN",
      "isActive": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 3. Website Settings

| Method | Endpoint           | Auth | Description              |
| ------ | ------------------ | ---- | ------------------------ |
| GET    | `/settings`        | ❌   | Get all website settings |
| GET    | `/settings/public` | ❌   | Get public settings only |
| PUT    | `/settings/update` | ✅   | Update website settings  |

#### Get Settings

```javascript
// GET /api/settings
const response = await fetch("/api/settings");
const { data } = await response.json();
```

**Response Schema:**

```json
{
  "success": true,
  "data": {
    "id": "main",
    "companyName": "ACNS",
    "companyFullName": "Advanced Cloud & Network Solutions",
    "tagline": "Empowering Businesses with Cutting-Edge Technology",
    "founderName": "Shaswata Saha",
    "contactEmail": "contact@acns.tech",
    "supportEmail": "support@acns.tech",
    "phone": "+1 (555) 123-4567",
    "alternatePhone": null,
    "address": "123 Tech Innovation Drive...",
    "facebook": "https://facebook.com/acns",
    "twitter": "https://twitter.com/acns",
    "linkedin": "https://linkedin.com/company/acns",
    "instagram": "https://instagram.com/acns",
    "youtube": "https://youtube.com/acns",
    "github": "https://github.com/acns",
    "heroTitle": "Transform Your Business...",
    "heroSubtitle": "Unlock the full potential...",
    "heroDescription": "ACNS delivers enterprise-grade...",
    "heroCta": "Get Started",
    "heroCtaLink": "/contact",
    "heroImage": null,
    "aboutTitle": "About ACNS",
    "aboutDescription": "Founded by Shaswata Saha...",
    "aboutImage": null,
    "mission": "To empower businesses worldwide...",
    "vision": "To be the global leader...",
    "footerText": "Your trusted partner...",
    "copyrightText": "© 2024 ACNS...",
    "metaTitle": "ACNS - Advanced Cloud...",
    "metaDescription": "ACNS provides enterprise-grade...",
    "metaKeywords": ["cloud", "network", "cybersecurity"],
    "showBlog": true,
    "showProducts": true,
    "showServices": true,
    "showCareers": true,
    "showTestimonials": true
  }
}
```

#### Update Settings (Admin)

```javascript
// PUT /api/settings/update
const response = await fetch("/api/settings/update", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    heroTitle: "New Hero Title",
    tagline: "New Tagline",
  }),
});
```

---

### 4. Services

| Method | Endpoint               | Auth | Description                  |
| ------ | ---------------------- | ---- | ---------------------------- |
| GET    | `/services/active`     | ❌   | Get active services (public) |
| GET    | `/services/slug/:slug` | ❌   | Get service by slug          |
| GET    | `/services/all`        | ✅   | Get all services (admin)     |
| GET    | `/services/:id`        | ✅   | Get service by ID            |
| POST   | `/services/create`     | ✅   | Create service               |
| PUT    | `/services/update/:id` | ✅   | Update service               |
| DELETE | `/services/delete/:id` | ✅   | Delete service               |
| PATCH  | `/services/toggle/:id` | ✅   | Toggle active status         |
| PATCH  | `/services/reorder`    | ✅   | Reorder services             |

#### Get Active Services

```javascript
// GET /api/services/active?page=1&limit=10
const response = await fetch("/api/services/active?page=1&limit=10");
const { data, pagination } = await response.json();
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Cloud Infrastructure",
      "slug": "cloud-infrastructure",
      "description": "Our cloud infrastructure services...",
      "shortDesc": "Scalable and secure cloud solutions...",
      "icon": "cloud",
      "image": null,
      "features": ["Feature 1", "Feature 2"],
      "isActive": true,
      "sortOrder": 1
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 4,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

#### Create Service (Admin)

```javascript
// POST /api/services/create
const response = await fetch("/api/services/create", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    name: "New Service",
    slug: "new-service",
    description: "Full description...",
    shortDesc: "Short description",
    icon: "icon-name",
    features: ["Feature 1", "Feature 2"],
    isActive: true,
    sortOrder: 5,
  }),
});
```

---

### 5. Products

| Method | Endpoint                 | Auth | Description              |
| ------ | ------------------------ | ---- | ------------------------ |
| GET    | `/products/active`       | ❌   | Get active products      |
| GET    | `/products/featured`     | ❌   | Get featured products    |
| GET    | `/products/slug/:slug`   | ❌   | Get product by slug      |
| GET    | `/products/categories`   | ❌   | Get product categories   |
| GET    | `/products/all`          | ✅   | Get all products (admin) |
| GET    | `/products/:id`          | ✅   | Get product by ID        |
| POST   | `/products/create`       | ✅   | Create product           |
| PUT    | `/products/update/:id`   | ✅   | Update product           |
| DELETE | `/products/delete/:id`   | ✅   | Delete product           |
| PATCH  | `/products/status/:id`   | ✅   | Update product status    |
| PATCH  | `/products/featured/:id` | ✅   | Toggle featured status   |

#### Get Active Products

```javascript
// GET /api/products/active?page=1&limit=10&category=cloud
const response = await fetch("/api/products/active?page=1&limit=10");
const { data, pagination } = await response.json();
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Cloud Server Pro",
      "slug": "cloud-server-pro",
      "description": "Enterprise cloud server...",
      "shortDesc": "High-performance cloud server",
      "price": 99.99,
      "category": "cloud",
      "tags": ["cloud", "server", "enterprise"],
      "image": "/uploads/product.jpg",
      "gallery": [],
      "features": ["Feature 1", "Feature 2"],
      "specifications": { "cpu": "8 cores", "ram": "32GB" },
      "status": "ACTIVE",
      "featured": true,
      "sortOrder": 1
    }
  ],
  "pagination": {...}
}
```

#### Create Product (Admin)

```javascript
// POST /api/products/create
const response = await fetch("/api/products/create", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    name: "Product Name",
    slug: "product-name",
    description: "Full description",
    shortDesc: "Short description",
    price: 99.99,
    category: "cloud",
    tags: ["tag1", "tag2"],
    features: ["Feature 1", "Feature 2"],
    specifications: { key: "value" },
    status: "ACTIVE",
    featured: false,
  }),
});
```

---

### 6. Blog Posts

| Method | Endpoint            | Auth | Description           |
| ------ | ------------------- | ---- | --------------------- |
| GET    | `/blog/published`   | ❌   | Get published blogs   |
| GET    | `/blog/slug/:slug`  | ❌   | Get blog by slug      |
| GET    | `/blog/categories`  | ❌   | Get blog categories   |
| GET    | `/blog/tags`        | ❌   | Get blog tags         |
| GET    | `/blog/all`         | ✅   | Get all blogs (admin) |
| GET    | `/blog/:id`         | ✅   | Get blog by ID        |
| POST   | `/blog/create`      | ✅   | Create blog post      |
| PUT    | `/blog/update/:id`  | ✅   | Update blog post      |
| DELETE | `/blog/delete/:id`  | ✅   | Delete blog post      |
| PATCH  | `/blog/publish/:id` | ✅   | Toggle publish status |

#### Get Published Blogs

```javascript
// GET /api/blog/published?page=1&limit=10&category=technology
const response = await fetch("/api/blog/published?page=1&limit=10");
const { data, pagination } = await response.json();
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Blog Post Title",
      "slug": "blog-post-title",
      "excerpt": "Short excerpt...",
      "content": "Full HTML content...",
      "author": "Shaswata Saha",
      "category": "technology",
      "tags": ["cloud", "innovation"],
      "featuredImage": "/uploads/blog.jpg",
      "isPublished": true,
      "publishedAt": "2026-02-15T00:00:00.000Z",
      "metaTitle": "SEO Title",
      "metaDescription": "SEO Description",
      "views": 150
    }
  ],
  "pagination": {...}
}
```

#### Create Blog Post (Admin)

```javascript
// POST /api/blog/create
const response = await fetch("/api/blog/create", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    title: "Blog Title",
    slug: "blog-title",
    excerpt: "Short excerpt",
    content: "<p>Full HTML content</p>",
    author: "Author Name",
    category: "technology",
    tags: ["tag1", "tag2"],
    isPublished: false,
    metaTitle: "SEO Title",
    metaDescription: "SEO Description",
  }),
});
```

---

### 7. Job Openings

| Method | Endpoint                       | Auth | Description               |
| ------ | ------------------------------ | ---- | ------------------------- |
| GET    | `/jobs/active`                 | ❌   | Get active job openings   |
| GET    | `/jobs/slug/:slug`             | ❌   | Get job by slug           |
| GET    | `/jobs/departments`            | ❌   | Get job departments       |
| POST   | `/jobs/apply/:id`              | ❌   | Apply for a job           |
| GET    | `/jobs/all`                    | ✅   | Get all jobs (admin)      |
| GET    | `/jobs/:id`                    | ✅   | Get job by ID             |
| POST   | `/jobs/create`                 | ✅   | Create job opening        |
| PUT    | `/jobs/update/:id`             | ✅   | Update job opening        |
| DELETE | `/jobs/delete/:id`             | ✅   | Delete job opening        |
| PATCH  | `/jobs/toggle/:id`             | ✅   | Toggle active status      |
| GET    | `/jobs/applications/:id`       | ✅   | Get job applications      |
| PATCH  | `/jobs/application/:id/status` | ✅   | Update application status |

#### Get Active Jobs

```javascript
// GET /api/jobs/active?page=1&limit=10&department=engineering
const response = await fetch("/api/jobs/active?page=1&limit=10");
const { data, pagination } = await response.json();
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Senior Software Engineer",
      "slug": "senior-software-engineer",
      "department": "Engineering",
      "location": "San Francisco, CA",
      "type": "FULL_TIME",
      "experience": "5+ years",
      "salary": "$150,000 - $200,000",
      "description": "Job description...",
      "requirements": ["Req 1", "Req 2"],
      "benefits": ["Benefit 1", "Benefit 2"],
      "isActive": true,
      "deadline": "2026-03-15T00:00:00.000Z"
    }
  ],
  "pagination": {...}
}
```

#### Apply for Job (Public)

```javascript
// POST /api/jobs/apply/:jobId
const formData = new FormData();
formData.append("firstName", "John");
formData.append("lastName", "Doe");
formData.append("email", "john@example.com");
formData.append("phone", "+1234567890");
formData.append("coverLetter", "I am excited to apply...");
formData.append("linkedIn", "https://linkedin.com/in/johndoe");
formData.append("portfolio", "https://johndoe.com");
formData.append("resume", resumeFile); // File object

const response = await fetch(`/api/jobs/apply/${jobId}`, {
  method: "POST",
  body: formData,
});
```

---

### 8. Testimonials

| Method | Endpoint                   | Auth | Description                  |
| ------ | -------------------------- | ---- | ---------------------------- |
| GET    | `/testimonials/active`     | ❌   | Get active testimonials      |
| GET    | `/testimonials/all`        | ✅   | Get all testimonials (admin) |
| GET    | `/testimonials/:id`        | ✅   | Get testimonial by ID        |
| POST   | `/testimonials/create`     | ✅   | Create testimonial           |
| PUT    | `/testimonials/update/:id` | ✅   | Update testimonial           |
| DELETE | `/testimonials/delete/:id` | ✅   | Delete testimonial           |
| PATCH  | `/testimonials/toggle/:id` | ✅   | Toggle active status         |
| PATCH  | `/testimonials/reorder`    | ✅   | Reorder testimonials         |

#### Get Active Testimonials

```javascript
// GET /api/testimonials/active?page=1&limit=10
const response = await fetch("/api/testimonials/active");
const { data } = await response.json();
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Sarah Johnson",
      "title": "CTO",
      "company": "TechFlow Industries",
      "content": "ACNS transformed our entire IT infrastructure...",
      "rating": 5,
      "image": "/uploads/testimonial.jpg",
      "isActive": true,
      "sortOrder": 1
    }
  ],
  "pagination": {...}
}
```

---

### 9. Contact Requests

| Method | Endpoint              | Auth | Description               |
| ------ | --------------------- | ---- | ------------------------- |
| POST   | `/contact/submit`     | ❌   | Submit contact form       |
| GET    | `/contact/all`        | ✅   | Get all contact requests  |
| GET    | `/contact/:id`        | ✅   | Get contact request by ID |
| PATCH  | `/contact/status/:id` | ✅   | Update contact status     |
| DELETE | `/contact/delete/:id` | ✅   | Delete contact request    |
| GET    | `/contact/stats`      | ✅   | Get contact statistics    |

#### Submit Contact Form (Public)

```javascript
// POST /api/contact/submit
const response = await fetch("/api/contact/submit", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    company: "Acme Corp",
    subject: "Partnership Inquiry",
    message: "I would like to discuss...",
  }),
});
```

**Response:**

```json
{
  "success": true,
  "message": "Contact request submitted successfully",
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "status": "NEW"
  }
}
```

#### Contact Status Options

- `NEW` - New unread request
- `READ` - Request has been read
- `REPLIED` - Reply sent to requester
- `ARCHIVED` - Archived request

---

### 10. Media / File Upload

| Method | Endpoint                 | Auth | Description            |
| ------ | ------------------------ | ---- | ---------------------- |
| POST   | `/media/upload`          | ✅   | Upload single file     |
| POST   | `/media/upload-multiple` | ✅   | Upload multiple files  |
| GET    | `/media/all`             | ✅   | Get all media files    |
| GET    | `/media/:id`             | ✅   | Get media by ID        |
| DELETE | `/media/delete/:id`      | ✅   | Delete media file      |
| GET    | `/media/stats`           | ✅   | Get storage statistics |
| GET    | `/media/folders`         | ✅   | Get media folders      |

#### Upload Single File (Admin)

```javascript
// POST /api/media/upload
const formData = new FormData();
formData.append("file", fileObject);
formData.append("folder", "blog"); // Optional folder
formData.append("alt", "Image description"); // Optional alt text

const response = await fetch("/api/media/upload", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
});
```

**Response:**

```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "id": "uuid",
    "filename": "1708012345678-image.jpg",
    "originalName": "image.jpg",
    "mimeType": "image/jpeg",
    "size": 245678,
    "url": "/uploads/blog/1708012345678-image.jpg",
    "alt": "Image description",
    "folder": "blog"
  }
}
```

#### Supported File Types

- **Images:** jpg, jpeg, png, gif, webp, svg
- **Documents:** pdf, doc, docx, xls, xlsx, ppt, pptx
- **Videos:** mp4, webm, mov
- **Max File Size:** 10MB

---

### 11. AI Chatbot & Smart Features (Gemini-Powered)

> **Rate Limit:** AI endpoints are rate-limited to **20 requests per minute** per IP.

| Method | Endpoint            | Auth       | Description                                      |
| ------ | ------------------- | ---------- | ------------------------------------------------ |
| POST   | `/ai/chat`          | Optional   | Conversational chatbot with session memory       |
| GET    | `/ai/search?q=`     | ❌         | Smart search across all content + AI summary     |
| GET    | `/ai/quick-actions` | Optional   | Contextual quick-action suggestions              |
| POST   | `/ai/summarize`     | ❌         | AI-powered content summarization                 |
| POST   | `/ai/generate`      | ✅ (Admin) | AI content generation (blog, SEO, product, etc.) |

#### Chat — Conversational AI with Memory

```javascript
// POST /api/ai/chat
const response = await fetch("/api/ai/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    // Optional: include token if admin is logged in for admin-specific help
    Authorization: `Bearer ${token}`, // optional
  },
  body: JSON.stringify({
    message: "What services does ACNS offer?",
    sessionId: "user-session-abc123", // reuse to maintain conversation memory
  }),
});
```

**Response:**

```json
{
  "success": true,
  "message": "AI response generated",
  "data": {
    "reply": "Hello! ACNS offers 4 core services:\n\n* **Cloud Infrastructure** — scalable cloud solutions...\n* **Network Solutions** — enterprise networking...\n* **Cybersecurity** — comprehensive protection...\n* **Digital Transformation** — modernize your business...\n\nVisit /services to learn more! 🚀",
    "sessionId": "user-session-abc123",
    "timestamp": "2026-02-15T17:48:27.137Z"
  }
}
```

> **Session Memory:** Pass the same `sessionId` across messages to maintain conversation context. Sessions expire after 30 minutes of inactivity.

#### Smart Search — AI-Enhanced Global Search

```javascript
// GET /api/ai/search?q=cloud
const response = await fetch("/api/ai/search?q=cloud");
```

**Response:**

```json
{
  "success": true,
  "data": {
    "query": "cloud",
    "totalResults": 3,
    "results": {
      "services": [
        {
          "name": "Cloud Infrastructure",
          "slug": "cloud-infrastructure",
          "type": "service"
        }
      ],
      "blogs": [
        {
          "title": "Cloud Trends 2026",
          "slug": "cloud-trends-2026",
          "type": "blog"
        }
      ],
      "products": [],
      "jobs": []
    },
    "aiSummary": "Your search for 'cloud' found 1 service and 1 blog post. Check out our Cloud Infrastructure service for enterprise solutions."
  }
}
```

#### Quick Actions — Contextual Suggestions

```javascript
// GET /api/ai/quick-actions?page=home
// Supported pages: home, services, blog, careers, products, any
const response = await fetch("/api/ai/quick-actions?page=home", {
  headers: { Authorization: `Bearer ${token}` }, // optional — adds admin-specific actions
});
```

**Response:**

```json
{
  "success": true,
  "data": {
    "page": "home",
    "actions": [
      {
        "label": "Tell me about ACNS services",
        "action": "chat",
        "message": "What services does ACNS offer?"
      },
      {
        "label": "I need cloud solutions",
        "action": "chat",
        "message": "Tell me about your cloud infrastructure services"
      },
      { "label": "Contact the team", "action": "navigate", "url": "/contact" },
      {
        "label": "View open positions",
        "action": "navigate",
        "url": "/careers"
      }
    ]
  }
}
```

#### Summarize — AI Content Summary

```javascript
// POST /api/ai/summarize
const response = await fetch("/api/ai/summarize", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    type: "blog", // blog | service | product
    id: "uuid-of-content",
  }),
});
```

**Response:**

```json
{
  "success": true,
  "data": {
    "type": "blog",
    "id": "uuid",
    "title": "Cloud Security Best Practices",
    "summary": "• Key point 1...\n• Key point 2...\n• Key point 3...",
    "timestamp": "2026-02-15T17:50:00.000Z"
  }
}
```

#### Generate Content — Admin AI Writing Assistant

```javascript
// POST /api/ai/generate (Admin Only — requires JWT)
const response = await fetch("/api/ai/generate", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    type: "blog", // blog | product | service | seo | email | social
    prompt: "Cloud security trends in 2026",
    tone: "professional", // professional | casual | technical | friendly | formal
  }),
});
```

**Response (type=blog):**

```json
{
  "success": true,
  "data": {
    "type": "blog",
    "generated": {
      "title": "Top Cloud Security Trends in 2026",
      "slug": "top-cloud-security-trends-2026",
      "excerpt": "Discover the latest cloud security trends...",
      "content": "<h2>Introduction</h2><p>As cloud adoption continues...</p>...",
      "category": "cybersecurity",
      "tags": ["cloud security", "trends", "2026"],
      "metaTitle": "Top Cloud Security Trends 2026 | ACNS",
      "metaDescription": "Explore the top cloud security trends..."
    }
  }
}
```

**All Generate Types:**

| Type      | Returns                              | Use Case                |
| --------- | ------------------------------------ | ----------------------- |
| `blog`    | Full blog post with HTML, SEO meta   | Admin blog creation     |
| `product` | Product name, description, features  | New product listing     |
| `service` | Service details with features        | New service page        |
| `seo`     | metaTitle, metaDescription, keywords | SEO optimization        |
| `email`   | Subject line and body text           | Customer communications |
| `social`  | Twitter, LinkedIn, Facebook posts    | Social media marketing  |

---

## 🔄 Standard Response Format

All API responses follow this structure:

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  },
  "timestamp": "2026-02-15T17:36:35.775Z"
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "errors": [{ "field": "email", "message": "Invalid email format" }],
  "timestamp": "2026-02-15T17:36:35.775Z"
}
```

---

## 🔐 Frontend Implementation Guide

### 1. API Client Setup (axios)

```javascript
// src/lib/api.js
import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("adminToken");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error.response?.data || error);
  },
);

export default api;
```

### 2. Auth Context (React)

```javascript
// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      api
        .get("/admin/profile")
        .then(({ data }) => setAdmin(data))
        .catch(() => localStorage.removeItem("adminToken"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/admin/login", { email, password });
    localStorage.setItem("adminToken", data.token);
    setAdmin(data.admin);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

### 3. API Service Functions

```javascript
// src/services/settingsService.js
import api from "@/lib/api";

export const settingsService = {
  getAll: () => api.get("/settings"),
  getPublic: () => api.get("/settings/public"),
  update: (data) => api.put("/settings/update", data),
};

// src/services/servicesService.js
export const servicesService = {
  getActive: (params) => api.get("/services/active", { params }),
  getBySlug: (slug) => api.get(`/services/slug/${slug}`),
  getAll: (params) => api.get("/services/all", { params }),
  getById: (id) => api.get(`/services/${id}`),
  create: (data) => api.post("/services/create", data),
  update: (id, data) => api.put(`/services/update/${id}`, data),
  delete: (id) => api.delete(`/services/delete/${id}`),
  toggle: (id) => api.patch(`/services/toggle/${id}`),
  reorder: (order) => api.patch("/services/reorder", { order }),
};

// src/services/blogService.js
export const blogService = {
  getPublished: (params) => api.get("/blog/published", { params }),
  getBySlug: (slug) => api.get(`/blog/slug/${slug}`),
  getCategories: () => api.get("/blog/categories"),
  getTags: () => api.get("/blog/tags"),
  getAll: (params) => api.get("/blog/all", { params }),
  create: (data) => api.post("/blog/create", data),
  update: (id, data) => api.put(`/blog/update/${id}`, data),
  delete: (id) => api.delete(`/blog/delete/${id}`),
  togglePublish: (id) => api.patch(`/blog/publish/${id}`),
};

// src/services/jobsService.js
export const jobsService = {
  getActive: (params) => api.get("/jobs/active", { params }),
  getBySlug: (slug) => api.get(`/jobs/slug/${slug}`),
  getDepartments: () => api.get("/jobs/departments"),
  apply: (jobId, formData) =>
    api.post(`/jobs/apply/${jobId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getAll: (params) => api.get("/jobs/all", { params }),
  create: (data) => api.post("/jobs/create", data),
  update: (id, data) => api.put(`/jobs/update/${id}`, data),
  delete: (id) => api.delete(`/jobs/delete/${id}`),
  getApplications: (jobId) => api.get(`/jobs/applications/${jobId}`),
  updateApplicationStatus: (appId, status) =>
    api.patch(`/jobs/application/${appId}/status`, { status }),
};

// src/services/contactService.js
export const contactService = {
  submit: (data) => api.post("/contact/submit", data),
  getAll: (params) => api.get("/contact/all", { params }),
  updateStatus: (id, status) => api.patch(`/contact/status/${id}`, { status }),
  delete: (id) => api.delete(`/contact/delete/${id}`),
  getStats: () => api.get("/contact/stats"),
};

// src/services/mediaService.js
export const mediaService = {
  upload: (formData) =>
    api.post("/media/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  uploadMultiple: (formData) =>
    api.post("/media/upload-multiple", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getAll: (params) => api.get("/media/all", { params }),
  delete: (id) => api.delete(`/media/delete/${id}`),
  getStats: () => api.get("/media/stats"),
};

// src/services/aiService.js
export const aiService = {
  chat: (message, sessionId) => api.post("/ai/chat", { message, sessionId }),
  search: (query) => api.get("/ai/search", { params: { q: query } }),
  quickActions: (page) => api.get("/ai/quick-actions", { params: { page } }),
  summarize: (type, id) => api.post("/ai/summarize", { type, id }),
  generate: (type, prompt, tone) =>
    api.post("/ai/generate", { type, prompt, tone }),
};
```

### 4. React Query Hooks (Recommended)

```javascript
// src/hooks/useServices.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { servicesService } from "@/services/servicesService";

export const useActiveServices = (params) => {
  return useQuery({
    queryKey: ["services", "active", params],
    queryFn: () => servicesService.getActive(params),
  });
};

export const useServiceBySlug = (slug) => {
  return useQuery({
    queryKey: ["services", slug],
    queryFn: () => servicesService.getBySlug(slug),
    enabled: !!slug,
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: servicesService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
};
```

### 5. AI Chatbot Component (React)

```javascript
// src/components/AIChatbot.jsx
import { useState, useRef, useEffect } from "react";
import { aiService } from "@/services/aiService";

const SESSION_KEY = "acns_chat_session";

function getSessionId() {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [quickActions, setQuickActions] = useState([]);
  const bottomRef = useRef(null);
  const sessionId = useRef(getSessionId());

  useEffect(() => {
    aiService.quickActions("home").then((res) => {
      setQuickActions(res.data?.actions || []);
    });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await aiService.chat(text, sessionId.current);
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: res.data?.reply || "Sorry, try again." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Oops! Something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg z-50"
      >
        💬
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50">
          <div className="p-4 bg-blue-600 text-white rounded-t-2xl font-bold">
            ACNS AI Assistant
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="space-y-2">
                <p className="text-gray-500 text-sm">Quick actions:</p>
                {quickActions.map((a, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      a.action === "chat"
                        ? sendMessage(a.message)
                        : (window.location.href = a.url)
                    }
                    className="block w-full text-left p-2 bg-gray-100 rounded-lg text-sm hover:bg-blue-50"
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg max-w-[80%] ${
                  msg.role === "user"
                    ? "ml-auto bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="bg-gray-100 p-3 rounded-lg w-16">...</div>
            )}
            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="p-3 border-t flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
```

### 6. AI Smart Search Hook

```javascript
// src/hooks/useAISearch.js
import { useState } from "react";
import { aiService } from "@/services/aiService";

export function useAISearch() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const search = async (query) => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await aiService.search(query);
      setResults(res.data);
    } catch {
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, search };
}
```

---

## 🎨 Frontend Pages to Create

### Public Pages

1. **Homepage** (`/`)
   - Hero section (from settings)
   - Featured services
   - Testimonials
   - Contact CTA

2. **About** (`/about`)
   - Company info (from settings)
   - Mission & Vision
   - Team section

3. **Services** (`/services`)
   - Services list
   - Service detail page (`/services/[slug]`)

4. **Products** (`/products`)
   - Products grid with filters
   - Product detail page (`/products/[slug]`)

5. **Blog** (`/blog`)
   - Blog posts list
   - Blog post detail (`/blog/[slug]`)
   - Category filter

6. **Careers** (`/careers`)
   - Job openings list
   - Job detail with application form (`/careers/[slug]`)

7. **Contact** (`/contact`)
   - Contact form
   - Contact information

### Admin Dashboard Pages

1. **Login** (`/admin/login`)
2. **Dashboard** (`/admin`)
3. **Website Settings** (`/admin/settings`)
4. **Services Management** (`/admin/services`)
5. **Products Management** (`/admin/products`)
6. **Blog Management** (`/admin/blog`)
7. **Jobs Management** (`/admin/jobs`)
8. **Applications** (`/admin/applications`)
9. **Testimonials** (`/admin/testimonials`)
10. **Contact Requests** (`/admin/contacts`)
11. **Media Library** (`/admin/media`)
12. **Admin Users** (`/admin/users`) - Super Admin only

---

## 🔧 Environment Variables (Frontend)

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_UPLOADS_URL=http://localhost:5000/uploads
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 📝 Important Notes

1. **CORS**: The backend allows requests from `http://localhost:3000` and `http://localhost:5173`
2. **File Uploads**: Use `FormData` for file uploads, not JSON
3. **Pagination**: Most list endpoints support `page` and `limit` query params
4. **Authentication**: Store JWT token in localStorage and include in Authorization header
5. **Rate Limiting**: API has rate limiting (100 requests per 15 minutes)
6. **AI Rate Limiting**: AI endpoints have a stricter limit of 20 requests per minute per IP
7. **AI Sessions**: Chat session memory lasts 30 minutes; pass `sessionId` to maintain context
8. **AI Generate**: The `/ai/generate` endpoint requires admin authentication (JWT)

---

## 🚀 Quick Start

```bash
# Backend
cd backend-acns
npm install
npm run prisma:generate
npm run prisma:push
npm run seed
npm run dev

# Frontend (create your own Next.js/React project)
npx create-next-app@latest frontend-acns
cd frontend-acns
npm install axios @tanstack/react-query
# Start building!
```

---

**Default Admin Credentials:**

- Email: `acodernamedsubhro@gmail.com`
- Password: `Acns@2024!Admin`

---

© 2024 ACNS - Advanced Cloud & Network Solutions
