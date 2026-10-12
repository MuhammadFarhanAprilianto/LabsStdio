import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting database seeding for Labs Stdio Enterprise...");

  // 1. SEED CLIENT ORGANIZATIONS
  const blanqsOrg = await prisma.clientOrganization.upsert({
    where: { contactEmail: "founders@blanqs.ai" },
    update: {},
    create: {
      name: "Blanqs AI Platform",
      slug: "blanqs-ai",
      website: "https://blanqs.ai",
      industry: "AI Analytics & Cloud Infrastructure",
      contactName: "Sarah Lin (VP Product)",
      contactEmail: "founders@blanqs.ai",
      status: "ACTIVE",
    },
  });

  const hyroOrg = await prisma.clientOrganization.upsert({
    where: { contactEmail: "growth@hyroathletics.com" },
    update: {},
    create: {
      name: "HYRO Athletics",
      slug: "hyro-athletics",
      website: "https://hyroathletics.com",
      industry: "High-Performance Consumer Brands",
      contactName: "Marcus Sterling (Head of D2C)",
      contactEmail: "growth@hyroathletics.com",
      status: "ACTIVE",
    },
  });

  console.log("✅ Seeded Organizations:", [blanqsOrg.name, hyroOrg.name]);

  // 2. SEED ENTERPRISE CASE STUDIES & PROJECTS
  const project1 = await prisma.project.upsert({
    where: { slug: "blanqs-ai" },
    update: {},
    create: {
      slug: "blanqs-ai",
      title: "Reimagining Venture-Grade Analytics for 100K+ Active Users",
      clientName: "Blanqs AI Platform",
      year: "2026",
      category: "SaaS & AI Infrastructure",
      overview:
        "Blanqs AI is a high-growth cloud telemetry and analytics engine. Labs Stdio engineered an end-to-end design system, GPU-accelerated canvas data viz, and frictionless onboarding workflows.",
      challenge:
        "The legacy platform suffered from cognitive friction, sluggish data grids, and a 42% drop-off rate during complex pipeline setup.",
      solution:
        "Labs Stdio introduced dark glassmorphism data surfaces, GPU-accelerated WebGL charts, contextual micro-interactions, and sub-second page transitions via Next.js Turbopack.",
      heroImage: "/images/after_ui.webp",
      beforeImg: "/images/before_ui.webp",
      afterImg: "/images/after_ui.webp",
      deliverables: JSON.stringify([
        "Product UI/UX Architecture",
        "Next.js WebGL Frontend",
        "Design System Bible",
        "Physics Micro-interactions",
      ]),
      metrics: JSON.stringify([
        { label: "User Retention", value: "+240%", desc: "Surge in daily active user stickiness" },
        { label: "Conversion Rate", value: "3.4x", desc: "Multiplier on onboarding completion" },
        { label: "Latency", value: "0.38s", desc: "Sub-second global dashboard load time" },
        { label: "Series A Raised", value: "$18.5M", desc: "Funded post-redesign launch" },
      ]),
      techStack: JSON.stringify(["Next.js 16", "Three.js", "Tailwind CSS v4", "Prisma", "PostgreSQL"]),
      liveDemoUrl: "https://blanqs.ai",
      figmaUrl: "https://figma.com/@labs-stdio/blanqs",
      organizationId: blanqsOrg.id,
      featured: true,
      sortOrder: 1,
    },
  });

  const project2 = await prisma.project.upsert({
    where: { slug: "hyro-commerce" },
    update: {},
    create: {
      slug: "hyro-commerce",
      title: "High-Performance E-Commerce & Interactive Web App",
      clientName: "HYRO Athletics",
      year: "2026",
      category: "Web Architecture & Next.js",
      overview:
        "Decoupled headless storefront with custom 3D configurator, instantaneous edge checkouts, and fluid spring animations.",
      challenge:
        "Standard Shopify themes were too rigid, resulting in poor mobile conversion and 3.8s page load times during global drop campaigns.",
      solution:
        "Rebuilt as a custom Next.js edge storefront with sub-second asset hydration, dynamic cart orchestration, and WebGL product interaction.",
      heroImage: "/images/ShopifyECommerce.webp",
      beforeImg: "/images/before_ui.webp",
      afterImg: "/images/after_ui.webp",
      deliverables: JSON.stringify([
        "Headless Shopify Engineering",
        "Sub-Second Edge Infrastructure",
        "Interactive 3D WebGL",
        "Conversion Architecture",
      ]),
      metrics: JSON.stringify([
        { label: "D2C Growth", value: "3.4x", desc: "Q1 revenue expansion post-launch" },
        { label: "Checkout Conversion", value: "+180%", desc: "Surge in completed purchases" },
        { label: "Page Load", value: "0.42s", desc: "Global edge CDN response time" },
        { label: "Mobile Engagement", value: "88%", desc: "Mobile-first seamless checkout" },
      ]),
      techStack: JSON.stringify(["Next.js", "Shopify Storefront API", "Three.js", "Framer Motion"]),
      organizationId: hyroOrg.id,
      featured: true,
      sortOrder: 2,
    },
  });

  console.log("✅ Seeded Projects:", [project1.title, project2.title]);

  // 3. SEED CLIENT SPRINT MILESTONES (COLLABORATION PORTAL)
  await prisma.milestone.deleteMany({ where: { projectId: project1.id } });
  await prisma.milestone.createMany({
    data: [
      {
        projectId: project1.id,
        title: "Sprint 01: Architecture, Telemetry Audit & Token System",
        order: 1,
        description: "Discovery sprint establishing brand typography, design tokens, and technical data contracts.",
        deliverables: JSON.stringify(["Design System Bible", "Figma Component Library", "Next.js Token Setup"]),
        status: "APPROVED",
        approvedBy: "Sarah Lin (VP Product)",
        approvedAt: new Date("2026-02-15"),
        approvalNotes: "Exceptional speed and precision on the design token definitions.",
      },
      {
        projectId: project1.id,
        title: "Sprint 02: High-Density Analytics Dashboard UX",
        order: 2,
        description: "Dark glassmorphism surface styling and real-time canvas chart interactions.",
        deliverables: JSON.stringify(["Main Telemetry UI", "Pipeline Builder", "Interactive Wireframes"]),
        status: "APPROVED",
        approvedBy: "Sarah Lin (VP Product)",
        approvedAt: new Date("2026-03-01"),
        approvalNotes: "Stakeholders loved the canvas chart latency improvements.",
      },
      {
        projectId: project1.id,
        title: "Sprint 03: WebGL Shaders & Micro-Animation Engineering",
        order: 3,
        description: "Physics spring animations, sub-second route transitions, and responsive polish.",
        deliverables: JSON.stringify(["Frontend Codebase", "WebGL Visuals", "Turbopack Build Optimization"]),
        status: "APPROVED",
        approvedBy: "Sarah Lin (VP Product)",
        approvedAt: new Date("2026-03-22"),
        approvalNotes: "Passed all performance audits on Lighthouse (Score 99).",
      },
      {
        projectId: project1.id,
        title: "Sprint 04: Production Launch & Post-Deployment Monitoring",
        order: 4,
        description: "Global edge deployment, synthetic stress test, and analytics telemetry kickoff.",
        deliverables: JSON.stringify(["Production Deployment", "Automated QA Suite", "Handover Documentation"]),
        status: "APPROVED",
        approvedBy: "Sarah Lin (VP Product)",
        approvedAt: new Date("2026-04-05"),
        approvalNotes: "Successfully launched to 100K+ active users without a hitch.",
      },
    ],
  });

  console.log("✅ Seeded Sprint Milestones for Blanqs AI");

  // 4. SEED BLOG ARTICLES & PUBLICATIONS
  const samplePosts = [
    {
      slug: "10-best-design-agencies-in-toronto-to-hire",
      title: "10 Best Design Agencies in Toronto to Hire (2026 Edition)",
      excerpt:
        "The best design agencies recognized for their expertise in venture branding, UX/UI, digital transformation, and high-performance engineering.",
      image: "/images/BestDesign.webp",
      categories: JSON.stringify(["UI/UX Design", "Website Design"]),
      readTime: "6 min read",
      authorName: "Marcus Vance",
      authorRole: "Lead Product Designer",
      featured: true,
      viewCount: 1420,
    },
    {
      slug: "ai-tokens-explained-cost-context-and-performance",
      title: "AI Tokens Explained: Cost, Context, and Performance (2026)",
      excerpt:
        "AI tokens are the small building blocks models like GPT, Claude, and Gemini use. Here is how modern product teams optimize model economics.",
      image: "/images/AI Token.webp",
      categories: JSON.stringify(["UI/UX Design", "SaaS"]),
      readTime: "5 min read",
      authorName: "Elena Rostova",
      authorRole: "AI Architecture Lead",
      featured: false,
      viewCount: 890,
    },
    {
      slug: "figma-config-2026-every-major-announcement",
      title: "Figma Config 2026: Every Major Announcement You Need to Know",
      excerpt:
        "Major updates affecting design systems, component tokens, prototyping fidelity, and handoff to code.",
      image: "/images/Figma Config.webp",
      categories: JSON.stringify(["UI/UX Design", "Website Design"]),
      readTime: "8 min read",
      authorName: "Sarah Jenkins",
      authorRole: "Design Systems Specialist",
      featured: false,
      viewCount: 1240,
    },
    {
      slug: "nextjs-16-turbopack-production-readiness",
      title: "Next.js 16 & Turbopack: Building Ultra-Fast Web Applications",
      excerpt:
        "How Labs Stdio achieves sub-second transitions, dynamic server rendering, and zero-runtime CSS in high-traffic enterprise platforms.",
      image: "/images/WebDev3.webp",
      categories: JSON.stringify(["Web Development", "SaaS"]),
      readTime: "7 min read",
      authorName: "David Chen",
      authorRole: "Principal Engineer",
      featured: false,
      viewCount: 2150,
    },
  ];

  for (const postData of samplePosts) {
    await prisma.post.upsert({
      where: { slug: postData.slug },
      update: {},
      create: postData,
    });
  }

  console.log("✅ Seeded Blog Publications");

  // 5. SEED ACTIVITY AUDIT LOGS
  await prisma.activityLog.create({
    data: {
      action: "PLATFORM_INITIALIZATION",
      entityType: "System",
      entityId: "init-01",
      actorName: "Labs Stdio Core Engine",
      details: JSON.stringify({ version: "2026.1", stack: "Next.js 16 + Prisma ORM" }),
    },
  });

  // 6. SEED ENTERPRISE USERS (ADMIN & CLIENT)
  const adminPasswordHash = await bcrypt.hash("admin123", 12);
  const clientPasswordHash = await bcrypt.hash("client123", 12);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@labsstdio.com" },
    update: {},
    create: {
      name: "Farhan Aprilianto",
      email: "admin@labsstdio.com",
      passwordHash: adminPasswordHash,
      role: "SUPER_ADMIN",
    },
  });

  const clientUser = await prisma.user.upsert({
    where: { email: "client@blanqs.ai" },
    update: {},
    create: {
      name: "Sarah Lin (VP Product)",
      email: "client@blanqs.ai",
      passwordHash: clientPasswordHash,
      role: "CLIENT",
      clientOrganizationId: blanqsOrg.id,
    },
  });

  console.log("✅ Seeded Users:", [adminUser.email, clientUser.email]);

  console.log("🌟 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
