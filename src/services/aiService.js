/**
 * ACNS Backend - AI Service (Gemini-Powered)
 * Intelligent chatbot with full API knowledge, content generation,
 * smart search, and admin content assistance.
 *
 * Features:
 *  - 10-key round-robin rotation for load balancing
 *  - Full ACNS API knowledge baked into system prompt
 *  - Conversation memory per session
 *  - Content generation (blog, SEO, product descriptions)
 *  - Smart site search across all content
 *  - Admin assistant mode for dashboard help
 */

const { GoogleGenerativeAI } = require("@google/generative-ai");
const prisma = require("../config/database");
const logger = require("../utils/logger");

// ══════════════════════════════════════
// KEY ROTATION (round-robin across 10 keys)
// ══════════════════════════════════════
const GEMINI_KEYS = [];
for (let i = 1; i <= 10; i++) {
  const key = process.env[`GEMINI_KEY_${i}`];
  if (key) GEMINI_KEYS.push(key);
}

if (GEMINI_KEYS.length === 0) {
  logger.warn("No Gemini API keys configured. AI features disabled.");
}

let keyIndex = 0;
const getNextKey = () => {
  if (GEMINI_KEYS.length === 0) throw new Error("No Gemini API keys available");
  const key = GEMINI_KEYS[keyIndex % GEMINI_KEYS.length];
  keyIndex++;
  return key;
};

const getModel = () => {
  const key = getNextKey();
  const genAI = new GoogleGenerativeAI(key);
  const modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  return genAI.getGenerativeModel({ model: modelName });
};

// ══════════════════════════════════════
// CONVERSATION STORE (in-memory per session)
// ══════════════════════════════════════
const sessions = new Map();
const SESSION_TTL = 30 * 60 * 1000; // 30 minutes

const getSession = (sessionId) => {
  const s = sessions.get(sessionId);
  if (s) {
    s.lastAccess = Date.now();
    return s;
  }
  const newSession = { history: [], lastAccess: Date.now() };
  sessions.set(sessionId, newSession);
  return newSession;
};

// Cleanup expired sessions every 10 minutes
setInterval(
  () => {
    const now = Date.now();
    for (const [id, s] of sessions) {
      if (now - s.lastAccess > SESSION_TTL) sessions.delete(id);
    }
  },
  10 * 60 * 1000,
);

// ══════════════════════════════════════
// SYSTEM PROMPT — full API & company knowledge
// ══════════════════════════════════════
const buildSystemPrompt = (context = {}) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

  return `You are **ACNS AI Assistant** — an intelligent, friendly, and professional support chatbot for **ACNS (Advanced Cloud & Network Solutions)**, a global technology company founded by **Shaswata Saha**.

══════════ COMPANY INFO ══════════
• Full Name: Advanced Cloud & Network Solutions (ACNS)
• Founder: Shaswata Saha
• Contact Email: acodernamedsubhro@gmail.com
• Core Services: Cloud Infrastructure, Network Solutions, Cybersecurity, Digital Transformation
• Mission: To empower businesses worldwide with innovative, secure, and scalable technology solutions
• Vision: To be the global leader in technology solutions
• Frontend URL: ${frontendUrl}

══════════ YOUR CAPABILITIES ══════════
1. **Website Navigation Helper** — Guide users to the right pages:
   - Home: ${frontendUrl}/
   - About: ${frontendUrl}/about
   - Services: ${frontendUrl}/services
   - Products: ${frontendUrl}/products
   - Blog: ${frontendUrl}/blog
   - Careers: ${frontendUrl}/careers
   - Contact: ${frontendUrl}/contact

2. **Service Expert** — Explain ACNS services in depth:
   - Cloud Infrastructure (migration, multi-cloud, security, cost optimization)
   - Network Solutions (SD-WAN, security, wireless, monitoring)
   - Cybersecurity (pen testing, SOC, IAM, compliance, incident response)
   - Digital Transformation (automation, modernization, APIs, analytics)

3. **Product Advisor** — Help users find the right product/solution

4. **Career Guide** — Tell users about open positions, how to apply, what to expect

5. **Contact Helper** — Help users draft contact inquiries, explain response times

6. **Blog Recommender** — Suggest relevant blog posts or summarize content

7. **Technical Consultant** — Answer general cloud, network, cyber-security questions

8. **Admin Assistant** (when user is admin) — Help with dashboard operations:
   - Managing blog posts, products, services
   - Handling contact requests
   - Media uploads
   - Website settings

══════════ LIVE CONTEXT ══════════
${context.settings ? `Website Settings: ${JSON.stringify(context.settings)}` : ""}
${context.services ? `Active Services: ${JSON.stringify(context.services)}` : ""}
${context.recentBlogs ? `Recent Blog Posts: ${JSON.stringify(context.recentBlogs)}` : ""}
${context.activeJobs ? `Open Positions: ${JSON.stringify(context.activeJobs)}` : ""}
${context.products ? `Active Products: ${JSON.stringify(context.products)}` : ""}

══════════ PERSONALITY ══════════
• Tone: Professional yet warm and approachable
• Always be helpful; never refuse a reasonable question
• Use **bold** and bullet points for readability
• When referencing pages, provide the full URL link
• If you don't have specific information, say so and direct to the contact page
• Keep replies concise but comprehensive
• Use emojis sparingly for a modern feel 🚀
• When asked about pricing, say "Pricing is customized to your needs — please reach out via our contact page or I can help you send an inquiry right now!"
• Never reveal internal API details, database schemas, or credentials
• You can understand and reply in multiple languages`;
};

// ══════════════════════════════════════
// FETCH LIVE CONTEXT FROM DATABASE
// ══════════════════════════════════════
const fetchLiveContext = async () => {
  try {
    const [settings, services, recentBlogs, activeJobs, products] =
      await Promise.all([
        prisma.websiteSettings.findFirst().then((s) =>
          s
            ? {
                companyName: s.companyFullName,
                tagline: s.tagline,
                phone: s.phone,
                email: s.contactEmail,
                address: s.address,
              }
            : null,
        ),
        prisma.service.findMany({
          where: { isActive: true },
          select: { name: true, slug: true, shortDesc: true },
          orderBy: { sortOrder: "asc" },
          take: 10,
        }),
        prisma.blog.findMany({
          where: { isPublished: true },
          select: { title: true, slug: true, excerpt: true, category: true },
          orderBy: { createdAt: "desc" },
          take: 5,
        }),
        prisma.jobOpening.findMany({
          where: { isActive: true },
          select: {
            title: true,
            slug: true,
            department: true,
            location: true,
            type: true,
          },
          take: 10,
        }),
        prisma.product.findMany({
          where: { isActive: true },
          select: { name: true, slug: true, shortDesc: true, category: true },
          orderBy: { sortOrder: "asc" },
          take: 10,
        }),
      ]);

    return { settings, services, recentBlogs, activeJobs, products };
  } catch (error) {
    logger.error("Error fetching AI context", { error: error.message });
    return {};
  }
};

// ══════════════════════════════════════
// CORE: CHAT
// ══════════════════════════════════════
const chat = async ({ message, sessionId, isAdmin = false }) => {
  if (GEMINI_KEYS.length === 0) throw new Error("AI service is not configured");

  const context = await fetchLiveContext();
  const systemPrompt = buildSystemPrompt(context);

  const session = getSession(sessionId);

  // Build contents array for Gemini
  const contents = [];

  // Add history
  for (const h of session.history.slice(-20)) {
    contents.push(
      { role: "user", parts: [{ text: h.user }] },
      { role: "model", parts: [{ text: h.assistant }] },
    );
  }

  // Current message
  contents.push({ role: "user", parts: [{ text: message }] });

  const model = getModel();

  const result = await model.generateContent({
    contents,
    systemInstruction: {
      parts: [
        {
          text:
            systemPrompt +
            (isAdmin
              ? "\n\nThe current user is an ADMIN with dashboard access. You can help them with admin-specific tasks like managing content, viewing analytics, handling contact requests, etc."
              : ""),
        },
      ],
    },
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      topK: 40,
      maxOutputTokens: 2048,
    },
  });

  const reply =
    result.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "I apologize, I could not generate a response. Please try again.";

  // Store in history
  session.history.push({ user: message, assistant: reply });

  return {
    reply,
    sessionId,
    timestamp: new Date().toISOString(),
  };
};

// ══════════════════════════════════════
// SMART SEARCH — search across all content
// ══════════════════════════════════════
const smartSearch = async (query) => {
  if (!query || query.trim().length < 2)
    throw new Error("Search query too short");

  const searchTerm = query.trim();

  const [services, blogs, products, jobs] = await Promise.all([
    prisma.service.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: searchTerm, mode: "insensitive" } },
          { description: { contains: searchTerm, mode: "insensitive" } },
          { shortDesc: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
      select: { name: true, slug: true, shortDesc: true },
      take: 5,
    }),
    prisma.blog.findMany({
      where: {
        isPublished: true,
        OR: [
          { title: { contains: searchTerm, mode: "insensitive" } },
          { content: { contains: searchTerm, mode: "insensitive" } },
          { excerpt: { contains: searchTerm, mode: "insensitive" } },
          { category: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
      select: { title: true, slug: true, excerpt: true, category: true },
      take: 5,
    }),
    prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: searchTerm, mode: "insensitive" } },
          { description: { contains: searchTerm, mode: "insensitive" } },
          { shortDesc: { contains: searchTerm, mode: "insensitive" } },
          { category: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
      select: { name: true, slug: true, shortDesc: true, category: true },
      take: 5,
    }),
    prisma.jobOpening.findMany({
      where: {
        isActive: true,
        OR: [
          { title: { contains: searchTerm, mode: "insensitive" } },
          { description: { contains: searchTerm, mode: "insensitive" } },
          { department: { contains: searchTerm, mode: "insensitive" } },
          { location: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
      select: { title: true, slug: true, department: true, location: true },
      take: 5,
    }),
  ]);

  const results = {
    services: services.map((s) => ({ ...s, type: "service" })),
    blogs: blogs.map((b) => ({ ...b, type: "blog" })),
    products: products.map((p) => ({ ...p, type: "product" })),
    jobs: jobs.map((j) => ({ ...j, type: "job" })),
  };

  const totalResults =
    results.services.length +
    results.blogs.length +
    results.products.length +
    results.jobs.length;

  // Generate AI summary of search results
  let aiSummary = null;
  if (totalResults > 0 && GEMINI_KEYS.length > 0) {
    try {
      const model = getModel();
      const summaryResult = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Summarize these search results for the query "${searchTerm}" in 2-3 helpful sentences, guiding the user to the most relevant result:\n${JSON.stringify(results)}`,
              },
            ],
          },
        ],
        systemInstruction: {
          parts: [
            {
              text: "You are a helpful search assistant for ACNS website. Be concise and helpful. Use the frontend URL for links.",
            },
          ],
        },
        generationConfig: { maxOutputTokens: 256, temperature: 0.5 },
      });
      aiSummary =
        summaryResult.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
        null;
    } catch (err) {
      logger.error("AI summary generation failed", { error: err.message });
    }
  }

  return { query: searchTerm, totalResults, results, aiSummary };
};

// ══════════════════════════════════════
// CONTENT GENERATION — AI writing assistant for admin
// ══════════════════════════════════════
const generateContent = async ({ type, prompt, tone = "professional" }) => {
  if (GEMINI_KEYS.length === 0) throw new Error("AI service is not configured");

  const templates = {
    blog: `Write a well-structured blog post for a technology company called ACNS (Advanced Cloud & Network Solutions). Use HTML formatting with <h2>, <h3>, <p>, <ul>, <li> tags for rich content.
Title/Topic: ${prompt}
Tone: ${tone}
Include: Introduction, main body with 3-4 sections, conclusion, and a call-to-action.
Return JSON: { "title": "...", "slug": "...", "excerpt": "...", "content": "...<html>...", "category": "...", "tags": ["...", "..."], "metaTitle": "...", "metaDescription": "..." }`,

    product: `Write a compelling product description for ACNS (Advanced Cloud & Network Solutions).
Product: ${prompt}
Tone: ${tone}
Return JSON: { "name": "...", "slug": "...", "description": "...", "shortDesc": "...", "features": ["...", "..."], "category": "..." }`,

    service: `Write a detailed service description for ACNS (Advanced Cloud & Network Solutions).
Service: ${prompt}
Tone: ${tone}
Return JSON: { "name": "...", "slug": "...", "description": "...", "shortDesc": "...", "features": ["...", "..."] }`,

    seo: `Generate SEO-optimized metadata for a page about: ${prompt}
Company: ACNS - Advanced Cloud & Network Solutions
Return JSON: { "metaTitle": "... (max 60 chars)", "metaDescription": "... (max 160 chars)", "metaKeywords": ["...", "..."] }`,

    email: `Write a professional email for ACNS (Advanced Cloud & Network Solutions).
Context: ${prompt}
Tone: ${tone}
Return JSON: { "subject": "...", "body": "..." }`,

    social: `Write engaging social media posts for ACNS (Advanced Cloud & Network Solutions).
Topic: ${prompt}
Return JSON: { "twitter": "... (max 280 chars)", "linkedin": "...", "facebook": "..." }`,
  };

  const instruction =
    templates[type] ||
    `Generate content about: ${prompt}\nTone: ${tone}\nReturn as JSON.`;

  const model = getModel();

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: instruction }] }],
    systemInstruction: {
      parts: [
        {
          text: "You are a professional content writer for ACNS, a technology company. Return ONLY valid JSON with no markdown code fences, no explanation, just the raw JSON object.",
        },
      ],
    },
    generationConfig: {
      temperature: 0.8,
      topP: 0.9,
      maxOutputTokens: 4096,
    },
  });

  const raw =
    result.response?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

  // Try to parse JSON, strip code fences if present
  let parsed;
  try {
    const cleaned = raw
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    parsed = JSON.parse(cleaned);
  } catch {
    parsed = { raw };
  }

  return { type, generated: parsed, timestamp: new Date().toISOString() };
};

// ══════════════════════════════════════
// QUICK ACTIONS — smart action suggestions
// ══════════════════════════════════════
const getQuickActions = async ({ page = "home", isAdmin = false }) => {
  const actions = [];

  if (page === "home" || page === "any") {
    actions.push(
      {
        label: "Tell me about ACNS services",
        action: "chat",
        message: "What services does ACNS offer?",
      },
      {
        label: "I need cloud solutions",
        action: "chat",
        message: "Tell me about your cloud infrastructure services",
      },
      { label: "Contact the team", action: "navigate", url: "/contact" },
      { label: "View open positions", action: "navigate", url: "/careers" },
    );
  }

  if (page === "services") {
    actions.push(
      {
        label: "Compare services",
        action: "chat",
        message: "Can you compare your cloud and cybersecurity services?",
      },
      { label: "Get a consultation", action: "navigate", url: "/contact" },
    );
  }

  if (page === "blog") {
    const latestBlog = await prisma.blog.findFirst({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      select: { title: true, slug: true },
    });
    if (latestBlog) {
      actions.push({
        label: `Read: ${latestBlog.title}`,
        action: "navigate",
        url: `/blog/${latestBlog.slug}`,
      });
    }
    actions.push({
      label: "Suggest articles for me",
      action: "chat",
      message: "Recommend blog posts based on cloud computing",
    });
  }

  if (page === "careers") {
    const jobCount = await prisma.jobOpening.count({
      where: { isActive: true },
    });
    actions.push(
      {
        label: `Browse ${jobCount} open positions`,
        action: "navigate",
        url: "/careers",
      },
      {
        label: "Help me prepare my application",
        action: "chat",
        message: "Can you help me prepare for a job application at ACNS?",
      },
    );
  }

  if (isAdmin) {
    actions.push(
      {
        label: "Generate a blog post",
        action: "chat",
        message: "Help me write a blog post about cloud security trends",
      },
      {
        label: "Write product description",
        action: "chat",
        message:
          "Help me create a compelling product description for a new cloud service",
      },
      {
        label: "Generate SEO metadata",
        action: "chat",
        message: "Generate SEO metadata for our services page",
      },
    );
  }

  return { page, actions, timestamp: new Date().toISOString() };
};

// ══════════════════════════════════════
// SUMMARIZE — summarize any content piece
// ══════════════════════════════════════
const summarize = async ({ type, id }) => {
  if (GEMINI_KEYS.length === 0) throw new Error("AI service is not configured");

  let content = null;
  let title = "";

  if (type === "blog") {
    const blog = await prisma.blog.findUnique({ where: { id } });
    if (!blog) throw new Error("Blog post not found");
    content = blog.content;
    title = blog.title;
  } else if (type === "service") {
    const service = await prisma.service.findUnique({ where: { id } });
    if (!service) throw new Error("Service not found");
    content = service.description;
    title = service.name;
  } else if (type === "product") {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw new Error("Product not found");
    content = product.description;
    title = product.name;
  } else {
    throw new Error("Invalid content type. Use: blog, service, or product");
  }

  const model = getModel();

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Summarize this content in 3-4 concise bullet points:\nTitle: ${title}\nContent: ${content}`,
          },
        ],
      },
    ],
    systemInstruction: {
      parts: [
        {
          text: "You are a content summarizer for ACNS. Return a brief, clear summary in bullet points.",
        },
      ],
    },
    generationConfig: { maxOutputTokens: 512, temperature: 0.3 },
  });

  const summary =
    result.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "Unable to generate summary.";

  return { type, id, title, summary, timestamp: new Date().toISOString() };
};

module.exports = {
  chat,
  smartSearch,
  generateContent,
  getQuickActions,
  summarize,
};
