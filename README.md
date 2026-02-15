# ACNS Backend API

**Advanced Cloud & Network Solutions** - Enterprise Backend System

## 🏗️ Architecture

```
Routes → Controllers → Services → Repositories → Database (PostgreSQL/Prisma)
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your settings
```

### 3. Setup Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed initial data
npm run db:seed
```

### 4. Start the Server

```bash
# Development mode with hot reload
npm run dev

# Production mode
npm start
```

Server runs at: `http://localhost:5000`

## 📚 API Endpoints

### Authentication

| Method | Endpoint           | Description | Auth |
| ------ | ------------------ | ----------- | ---- |
| POST   | `/api/admin/login` | Admin login | No   |

### Blog

| Method | Endpoint               | Description              | Auth |
| ------ | ---------------------- | ------------------------ | ---- |
| GET    | `/api/blog`            | List all published blogs | No   |
| GET    | `/api/blog/:slug`      | Get blog by slug         | No   |
| GET    | `/api/blog/categories` | Get all categories       | No   |
| POST   | `/api/blog`            | Create blog              | Yes  |
| PUT    | `/api/blog/:id`        | Update blog              | Yes  |
| DELETE | `/api/blog/:id`        | Delete blog              | Yes  |

### Products

| Method | Endpoint                 | Description           | Auth |
| ------ | ------------------------ | --------------------- | ---- |
| GET    | `/api/products`          | List active products  | No   |
| GET    | `/api/products/:slug`    | Get product by slug   | No   |
| GET    | `/api/products/featured` | Get featured products | No   |
| POST   | `/api/products`          | Create product        | Yes  |
| PUT    | `/api/products/:id`      | Update product        | Yes  |
| DELETE | `/api/products/:id`      | Delete product        | Yes  |

### Services

| Method | Endpoint              | Description          | Auth |
| ------ | --------------------- | -------------------- | ---- |
| GET    | `/api/services`       | List active services | No   |
| GET    | `/api/services/:slug` | Get service by slug  | No   |
| POST   | `/api/services`       | Create service       | Yes  |
| PUT    | `/api/services/:id`   | Update service       | Yes  |
| DELETE | `/api/services/:id`   | Delete service       | Yes  |

### Jobs

| Method | Endpoint                     | Description      | Auth |
| ------ | ---------------------------- | ---------------- | ---- |
| GET    | `/api/jobs`                  | List open jobs   | No   |
| GET    | `/api/jobs/:slug`            | Get job by slug  | No   |
| POST   | `/api/jobs/:id/apply`        | Apply for job    | No   |
| POST   | `/api/jobs`                  | Create job       | Yes  |
| GET    | `/api/jobs/:id/applications` | Get applications | Yes  |

### Testimonials

| Method | Endpoint                | Description              | Auth |
| ------ | ----------------------- | ------------------------ | ---- |
| GET    | `/api/testimonials`     | List active testimonials | No   |
| POST   | `/api/testimonials`     | Create testimonial       | Yes  |
| PUT    | `/api/testimonials/:id` | Update testimonial       | Yes  |
| DELETE | `/api/testimonials/:id` | Delete testimonial       | Yes  |

### Contact

| Method | Endpoint                  | Description           | Auth |
| ------ | ------------------------- | --------------------- | ---- |
| POST   | `/api/contact`            | Submit contact form   | No   |
| GET    | `/api/contact`            | List contact requests | Yes  |
| PATCH  | `/api/contact/:id/status` | Update status         | Yes  |

### Media

| Method | Endpoint            | Description       | Auth |
| ------ | ------------------- | ----------------- | ---- |
| POST   | `/api/media/upload` | Upload file       | Yes  |
| GET    | `/api/media`        | List media files  | Yes  |
| DELETE | `/api/media/:id`    | Delete media file | Yes  |

### Settings

| Method | Endpoint             | Description          | Auth |
| ------ | -------------------- | -------------------- | ---- |
| GET    | `/api/settings`      | Get website settings | No   |
| PUT    | `/api/settings/:key` | Update settings      | Yes  |

### Health Check

| Method | Endpoint      | Description          |
| ------ | ------------- | -------------------- |
| GET    | `/api/health` | System health status |

## 🗄️ Database Schema

### Models

- **AdminUser**: Admin accounts with role-based access
- **Blog**: Blog posts with categories, tags, SEO
- **Product**: Products/solutions with status management
- **Service**: Company services with features
- **JobOpening**: Job postings with requirements
- **JobApplication**: Job applications with attachments
- **Testimonial**: Client testimonials with ratings
- **ContactRequest**: Contact form submissions
- **MediaFile**: Uploaded media files
- **WebsiteSettings**: Dynamic site configuration

## 🔐 Admin Credentials (Default)

```
Email: acodernamedsubhro@gmail.com
Password: Acns@2024!Admin
```

⚠️ **Change the password after first login!**

## 📁 Project Structure

```
backend-acns/
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.js           # Seed script
├── src/
│   ├── config/           # Configuration
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Express middleware
│   ├── repositories/     # Database operations
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── utils/            # Utilities
│   └── server.js         # Entry point
├── uploads/              # Uploaded files
├── .env.example          # Environment template
├── package.json          # Dependencies
└── README.md             # This file
```

## 🛠️ Scripts

```bash
npm start        # Start production server
npm run dev      # Start development server (nodemon)
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run migrations
npm run db:seed      # Seed initial data
npm run db:studio    # Open Prisma Studio
```

## 🔧 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + Bcrypt
- **Validation**: Zod
- **File Upload**: Multer
- **Email**: Nodemailer
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Custom Logger

## 👤 Author

**Shaswata Saha**  
Email: acodernamedsubhro@gmail.com

---

© 2024 ACNS - Advanced Cloud & Network Solutions. All rights reserved.
