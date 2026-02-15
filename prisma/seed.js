/**
 * ACNS Backend - Database Seed Script
 * Creates default admin user and initial website settings
 *
 * Run: npm run db:seed
 */

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const ADMIN_EMAIL = "acodernamedsubhro@gmail.com";
const ADMIN_PASSWORD = "Acns@2024!Admin";

async function main() {
  console.log("🌱 Starting database seed...\n");

  // ==================
  // CREATE ADMIN USER
  // ==================
  console.log("👤 Creating admin user...");

  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: ADMIN_EMAIL },
  });

  if (existingAdmin) {
    console.log(`   ℹ️  Admin user already exists: ${ADMIN_EMAIL}`);
  } else {
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    const admin = await prisma.adminUser.create({
      data: {
        email: ADMIN_EMAIL,
        password: hashedPassword,
        firstName: "Shaswata",
        lastName: "Saha",
        role: "SUPER_ADMIN",
        isActive: true,
      },
    });

    console.log(`   ✅ Admin user created: ${admin.email}`);
    console.log(`   📧 Email: ${ADMIN_EMAIL}`);
    console.log(`   🔑 Password: ${ADMIN_PASSWORD}`);
    console.log("   ⚠️  Please change the password after first login!\n");
  }

  // ========================
  // CREATE WEBSITE SETTINGS
  // ========================
  console.log("⚙️  Creating website settings...");

  const existingSettings = await prisma.websiteSettings.findFirst();

  if (existingSettings) {
    console.log("   ℹ️  Website settings already exist");
  } else {
    const settings = await prisma.websiteSettings.create({
      data: {
        id: "main",
        companyName: "ACNS",
        companyFullName: "Advanced Cloud & Network Solutions",
        tagline: "Empowering Businesses with Cutting-Edge Technology",
        founderName: "Shaswata Saha",
        contactEmail: "contact@acns.tech",
        supportEmail: "acodernamedsubhro@gmail.com",
        phone: "+1 (555) 123-4567",
        address: "123 Tech Innovation Drive, San Francisco, CA 94105, USA",
        facebook: "https://facebook.com/acns",
        twitter: "https://twitter.com/acns",
        linkedin: "https://linkedin.com/company/acns",
        instagram: "https://instagram.com/acns",
        youtube: "https://youtube.com/acns",
        github: "https://github.com/acns",
        heroTitle: "Transform Your Business with Advanced Technology",
        heroSubtitle:
          "Unlock the full potential of your enterprise with our cutting-edge cloud and network solutions",
        heroDescription:
          "ACNS delivers enterprise-grade cloud infrastructure, network solutions, cybersecurity services, and digital transformation consulting for businesses worldwide.",
        heroCta: "Get Started",
        heroCtaLink: "/contact",
        aboutTitle: "About ACNS",
        aboutDescription:
          "Founded by Shaswata Saha, ACNS is a leading global technology company dedicated to helping businesses harness the power of modern technology. With expertise spanning cloud infrastructure, network architecture, cybersecurity, and digital transformation, we partner with organizations of all sizes to drive innovation and growth.",
        mission:
          "To empower businesses worldwide with innovative, secure, and scalable technology solutions that drive growth and success in the digital age.",
        vision:
          "To be the global leader in technology solutions, recognized for our commitment to excellence, innovation, and customer success.",
        footerText: "Your trusted partner in technology transformation.",
        copyrightText:
          "© 2024 ACNS - Advanced Cloud & Network Solutions. All rights reserved.",
        metaTitle:
          "ACNS - Advanced Cloud & Network Solutions | Global Technology Partner",
        metaDescription:
          "ACNS provides enterprise-grade cloud infrastructure, network solutions, cybersecurity services, and digital transformation consulting for businesses worldwide.",
        metaKeywords: [
          "cloud solutions",
          "network infrastructure",
          "cybersecurity",
          "digital transformation",
          "IT consulting",
          "enterprise technology",
        ],
        showBlog: true,
        showProducts: true,
        showServices: true,
        showCareers: true,
        showTestimonials: true,
      },
    });

    console.log(`   ✅ Website settings created`);
    console.log(`   📛 Company: ${settings.companyFullName}`);
  }

  // ========================
  // CREATE SAMPLE SERVICES
  // ========================
  console.log("\n🛠️  Creating sample services...");

  const servicesCount = await prisma.service.count();

  if (servicesCount > 0) {
    console.log("   ℹ️  Services already exist");
  } else {
    const services = [
      {
        name: "Cloud Infrastructure",
        slug: "cloud-infrastructure",
        shortDesc:
          "Scalable and secure cloud solutions tailored to your business needs.",
        description:
          "Our cloud infrastructure services provide robust, scalable, and cost-effective solutions built on leading platforms including AWS, Azure, and Google Cloud. We help you migrate, manage, and optimize your cloud environment for maximum performance and efficiency.",
        icon: "cloud",
        isActive: true,
        sortOrder: 1,
        features: [
          "Cloud Migration & Strategy",
          "Multi-Cloud Architecture",
          "Cloud Security & Compliance",
          "Cost Optimization",
          "24/7 Monitoring & Support",
        ],
      },
      {
        name: "Network Solutions",
        slug: "network-solutions",
        shortDesc: "Enterprise-grade networking for reliable connectivity.",
        description:
          "Build a resilient and high-performance network infrastructure with our comprehensive networking solutions. From SD-WAN implementation to network security, we ensure your organization stays connected and protected.",
        icon: "globe",
        isActive: true,
        sortOrder: 2,
        features: [
          "SD-WAN Implementation",
          "Network Security",
          "Wireless Solutions",
          "Network Monitoring",
          "Performance Optimization",
        ],
      },
      {
        name: "Cybersecurity",
        slug: "cybersecurity",
        shortDesc:
          "Comprehensive security solutions to protect your digital assets.",
        description:
          "Protect your organization from evolving cyber threats with our comprehensive security services. Our team of security experts provides end-to-end protection including threat assessment, implementation, and ongoing monitoring.",
        icon: "shield",
        isActive: true,
        sortOrder: 3,
        features: [
          "Threat Assessment & Penetration Testing",
          "Security Operations Center (SOC)",
          "Identity & Access Management",
          "Compliance & Risk Management",
          "Incident Response",
        ],
      },
      {
        name: "Digital Transformation",
        slug: "digital-transformation",
        shortDesc: "Modernize your business with end-to-end digital solutions.",
        description:
          "Embrace the digital future with our comprehensive transformation services. We help organizations reimagine their processes, adopt modern technologies, and create exceptional digital experiences.",
        icon: "rocket",
        isActive: true,
        sortOrder: 4,
        features: [
          "Business Process Automation",
          "Legacy System Modernization",
          "API Integration",
          "Data Analytics & BI",
          "Change Management",
        ],
      },
    ];

    for (const service of services) {
      await prisma.service.create({ data: service });
    }

    console.log(`   ✅ Created ${services.length} sample services`);
  }

  // ========================
  // CREATE SAMPLE TESTIMONIALS
  // ========================
  console.log("\n💬 Creating sample testimonials...");

  const testimonialsCount = await prisma.testimonial.count();

  if (testimonialsCount > 0) {
    console.log("   ℹ️  Testimonials already exist");
  } else {
    const testimonials = [
      {
        name: "Sarah Johnson",
        title: "CTO",
        company: "TechFlow Industries",
        content:
          "ACNS transformed our entire IT infrastructure. Their cloud migration expertise saved us 40% on operational costs while improving our system reliability dramatically.",
        rating: 5,
        isActive: true,
        sortOrder: 1,
      },
      {
        name: "Michael Chen",
        title: "VP of Engineering",
        company: "DataDrive Solutions",
        content:
          "Working with ACNS on our network security has been game-changing. Their team identified vulnerabilities we never knew existed and implemented world-class protection.",
        rating: 5,
        isActive: true,
        sortOrder: 2,
      },
      {
        name: "Emily Rodriguez",
        title: "CEO",
        company: "InnovateTech Startup",
        content:
          "As a growing startup, we needed a technology partner who could scale with us. ACNS provided exactly that, with flexible solutions and exceptional support.",
        rating: 5,
        isActive: true,
        sortOrder: 3,
      },
    ];

    for (const testimonial of testimonials) {
      await prisma.testimonial.create({ data: testimonial });
    }

    console.log(`   ✅ Created ${testimonials.length} sample testimonials`);
  }

  console.log("\n✨ Database seeding completed successfully!\n");
  console.log("═".repeat(50));
  console.log("Admin Credentials:");
  console.log(`   Email: ${ADMIN_EMAIL}`);
  console.log(`   Password: ${ADMIN_PASSWORD}`);
  console.log("═".repeat(50));
  console.log(
    "\n⚠️  Remember to change the admin password after first login!\n",
  );
}

main()
  .catch((error) => {
    console.error("❌ Error during seeding:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
