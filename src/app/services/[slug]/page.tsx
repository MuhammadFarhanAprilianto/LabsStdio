"use client";

import React, { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/components/Footer";
import { notFound } from "next/navigation";
import {
  ArrowRight01Icon,
  ArrowDown01Icon,
  ArrowUpRight01Icon,
  Tick01Icon,
} from "hugeicons-react";

// Definisi Data Layanan Lengkap untuk 8 Halaman Layanan
interface ServiceData {
  slug: string;
  category: "Design Services" | "Development Services";
  categoryBadgeBg: string;
  categoryBadgeBorder: string;
  categoryBadgeText: string;
  title: string;
  subtitle: string;
  heroDescription: string;
  stats: { value: string; label: string }[];
  showcaseImages: { title: string; image: string; tag: string }[];
  deliverables: {
    id: string;
    title: string;
    description: string;
    items: string[];
  }[];
  processSteps: {
    number: string;
    title: string;
    duration: string;
    description: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

const servicesMap: Record<string, ServiceData> = {
  "ui-ux": {
    slug: "ui-ux",
    category: "Design Services",
    categoryBadgeBg: "bg-[#f6f3ff]",
    categoryBadgeBorder: "border-[#ede9fe]",
    categoryBadgeText: "text-neutral-800",
    title: "UI/UX Design",
    subtitle: "Web & Mobile App Interface Experience",
    heroDescription:
      "We design intuitive, high-converting digital products that users genuinely love. From discovery wireframes to pixel-perfect design systems, we build interfaces ready for venture scale.",
    stats: [
      { value: "40%", label: "Conversion Lift" },
      { value: "2.4x", label: "User Retention" },
      { value: "100+", label: "Prototypes Delivered" },
    ],
    showcaseImages: [
      { title: "Digital Product UX Architecture", image: "/images/UIUXDigitalProduct.webp", tag: "Design System" },
      { title: "SaaS Dashboard Interface", image: "/images/after_ui.webp", tag: "SaaS Platform" },
      { title: "Mobile Fintech Experience", image: "/images/UI1.webp", tag: "iOS & Android" },
      { title: "Interactive Design System", image: "/images/Figma Config.webp", tag: "Figma Tokens" },
    ],
    deliverables: [
      {
        id: "wireframing",
        title: "Wireframing & Prototyping",
        description: "Interactive clickable prototypes validating user flows before writing a single line of code.",
        items: ["User Flow Mapping", "Low & High Fidelity Prototypes", "Micro-interaction Specs", "Clickable In-Browser Demo"],
      },
      {
        id: "design-systems",
        title: "Design Systems & Tokens",
        description: "Scalable component libraries built in Figma with production-ready tokens for engineering handoff.",
        items: ["Typography & Color Scales", "Interactive Component States", "Auto-layout Specifications", "Accessibility (WCAG AA)"],
      },
      {
        id: "usability",
        title: "Usability & User Research",
        description: "In-depth user testing and behavioral research to eliminate friction and maximize conversion rates.",
        items: ["User Journey Testing", "A/B Testing Strategies", "Heatmap & Funnel Analysis", "Competitive Benchmarking"],
      },
    ],
    processSteps: [
      { number: "01", title: "Discovery & User Research", duration: "Week 1", description: "Mapping core audience personas, user problems, and business conversion goals." },
      { number: "02", title: "Information Architecture", duration: "Week 2", description: "Creating sitemaps, user flows, and wireframe prototypes to align on UX hierarchy." },
      { number: "03", title: "Visual Design & System", duration: "Week 3-4", description: "Crafting bespoke aesthetic UI components, typography, micro-interactions, and color schemes." },
      { number: "04", title: "Handoff & Engineering QA", duration: "Week 5", description: "Delivering organized Figma tokens, interaction guidelines, and developer asset packages." },
    ],
    faqs: [
      { question: "What deliverables are included in a UI/UX project?", answer: "You receive complete Figma source files, an interactive design system component library, clickable prototypes, developer handoff notes, and all exported vector assets." },
      { question: "How do you ensure the design is developer-ready?", answer: "We build all Figma components with strict auto-layout, named layer hierarchy, design token variables, and detailed responsive breakpoint guidelines." },
      { question: "Do you design for both web and mobile platforms?", answer: "Yes, we specialize in unified cross-platform product experiences tailored to Apple HIG, Material Design, and modern web frameworks." },
    ],
  },

  "web-design": {
    slug: "web-design",
    category: "Design Services",
    categoryBadgeBg: "bg-[#f6f3ff]",
    categoryBadgeBorder: "border-[#ede9fe]",
    categoryBadgeText: "text-neutral-800",
    title: "Web Design",
    subtitle: "Modern Websites That Convert",
    heroDescription:
      "Bespoke websites designed to position your brand as the definitive industry authority. We merge art-direction aesthetics with conversion-focused UX.",
    stats: [
      { value: "99.8%", label: "Client Satisfaction" },
      { value: "120+", label: "Websites Launched" },
      { value: "<1.2s", label: "Perceived Load Speed" },
    ],
    showcaseImages: [
      { title: "Modern Web Landing System", image: "/images/WebDesignLandingPages.webp", tag: "Landing Page" },
      { title: "B2B SaaS High-Converting Web", image: "/images/WebDesain3.webp", tag: "Conversion UI" },
      { title: "Venture Capitalist Portal", image: "/images/WebDesign4.webp", tag: "Corporate Web" },
      { title: "Creative Agency Experience", image: "/images/BestDesign.webp", tag: "Brand Experience" },
    ],
    deliverables: [
      {
        id: "landing-pages",
        title: "High-Converting Landing Pages",
        description: "Laser-focused landing pages engineered to drive signups, demo bookings, and sales.",
        items: ["Storytelling Narrative Flow", "Conversion Anchor CTAs", "Interactive Hero Concepts", "Social Proof Modules"],
      },
      {
        id: "corporate-sites",
        title: "Multi-Page Corporate Portals",
        description: "Comprehensive corporate websites that communicate trustworthiness, scale, and enterprise capabilities.",
        items: ["About, Services & Case Studies", "Interactive Careers & Culture", "CMS Blog & Resource Hubs", "Global SEO Meta Schema"],
      },
      {
        id: "interactive-motion",
        title: "Motion & Micro-interactions",
        description: "Engaging scroll-driven visual elements, animated badges, and fluid layout transitions.",
        items: ["Framer Motion Prototypes", "Hover State Choreography", "Custom SVG Vector Graphics", "Dark & Light Mode Switchers"],
      },
    ],
    processSteps: [
      { number: "01", title: "Brand & Competitor Audit", duration: "Week 1", description: "Analyzing positioning, value proposition, and competitor aesthetic gaps." },
      { number: "02", title: "Wireframing & Copy Alignment", duration: "Week 2", description: "Drafting high-converting page structures and visual hierarchy." },
      { number: "03", title: "Art Direction & Responsive UI", duration: "Week 3", description: "Designing custom desktop, tablet, and mobile layouts with polished micro-animations." },
      { number: "04", title: "Asset Preparation & Delivery", duration: "Week 4", description: "Finalizing responsive artboards and vector assets ready for full-stack build." },
    ],
    faqs: [
      { question: "How long does a full custom web design project take?", answer: "A typical high-converting landing page takes 1-2 weeks, while a full 5-10 page corporate website takes 3-4 weeks." },
      { question: "Is copy/content writing included in the design?", answer: "We assist with headline copywriting, content structure, and call-to-action optimization to ensure high conversion rates." },
      { question: "Are all web designs responsive across all devices?", answer: "Yes, every single page is crafted with bespoke artboards for Desktop, Laptop, Tablet, and Mobile screens." },
    ],
  },

  "mobile-apps": {
    slug: "mobile-apps",
    category: "Design Services",
    categoryBadgeBg: "bg-[#f6f3ff]",
    categoryBadgeBorder: "border-[#ede9fe]",
    categoryBadgeText: "text-neutral-800",
    title: "Mobile App Design",
    subtitle: "Seamless iOS & Android Product Design",
    heroDescription:
      "Crafting native iOS and Android mobile apps with effortless ergonomics, smooth thumb-zone navigation, and tactile micro-gestures.",
    stats: [
      { value: "4.9★", label: "App Store Avg" },
      { value: "50+", label: "Mobile Apps Shipped" },
      { value: "1M+", label: "Active Mobile Users" },
    ],
    showcaseImages: [
      { title: "Native Mobile App Interface", image: "/images/MobileAppInterfaceDesign.webp", tag: "Native iOS" },
      { title: "Health & Wellness Mobile UI", image: "/images/Mobile Health.webp", tag: "iOS & Android" },
      { title: "Fintech Wallet Experience", image: "/images/MAPP3.webp", tag: "Android UI" },
      { title: "Social Interaction Feed", image: "/images/MAPP4.webp", tag: "Cross-Platform" },
    ],
    deliverables: [
      {
        id: "native-ios",
        title: "iOS Native App Architecture",
        description: "Adhering strictly to Apple Human Interface Guidelines with Dynamic Island and widget support.",
        items: ["iOS System Typography & Icons", "Haptic Feedback Specs", "Dark Mode Dynamic Palettes", "App Store Screenshots"],
      },
      {
        id: "native-android",
        title: "Android Material Design UI",
        description: "Adaptive layouts adhering to Google Material 3 standards for diverse Android screen form factors.",
        items: ["Material 3 Token Systems", "Foldable & Tablet Support", "Bottom Navigation Patterns", "Play Store Asset Suite"],
      },
      {
        id: "app-onboarding",
        title: "Onboarding & Retention Flows",
        description: "Frictionless sign-up, biometric authentication, and gamified user activation journeys.",
        items: ["Biometric Login Screens", "Permission Prompt Optimization", "Push Notification Prompts", "In-App Subscription Paywalls"],
      },
    ],
    processSteps: [
      { number: "01", title: "App Concept & User Stories", duration: "Week 1", description: "Defining core user flows, navigation models, and feature prioritization." },
      { number: "02", title: "UX Wireframes & Thumb Mapping", duration: "Week 2", description: "Designing reachable one-handed ergonomics for all screen sizes." },
      { number: "03", title: "Visual UI & Gesture Motion", duration: "Week 3-4", description: "Polishing native components, custom iconography, and micro-interaction animations." },
      { number: "04", title: "Dev Specs & Store Assets", duration: "Week 5", description: "Handing over React Native/Flutter/Swift specs and App Store marketing banners." },
    ],
    faqs: [
      { question: "Do you design for React Native or Flutter developers?", answer: "Yes, our component structures and layout tokens are optimized for easy React Native, Flutter, Swift, or Kotlin implementation." },
      { question: "Do you provide App Store & Google Play screenshots?", answer: "Yes, we design promotional store banners, feature preview slides, and app icon mockups tailored for maximum downloads." },
      { question: "How do you handle dark mode for mobile apps?", answer: "Every screen is designed with dedicated Light and Dark mode variations using semantic color tokens." },
    ],
  },

  "branding": {
    slug: "branding",
    category: "Design Services",
    categoryBadgeBg: "bg-[#f6f3ff]",
    categoryBadgeBorder: "border-[#ede9fe]",
    categoryBadgeText: "text-neutral-800",
    title: "Branding",
    subtitle: "Identity That Stands Out & Commands Authority",
    heroDescription:
      "We forge distinctive brand identities that build instant trust and memorability. From logo architecture to comprehensive guidelines, we shape your company's visual voice.",
    stats: [
      { value: "85+", label: "Brand Identities Built" },
      { value: "3.2x", label: "Higher Brand Recall" },
      { value: "100%", label: "Vector Precision" },
    ],
    showcaseImages: [
      { title: "Creative Branding & Identity", image: "/images/BrandingCreativeDesign.webp", tag: "Brand Identity" },
      { title: "Venture Brand Identity Suite", image: "/images/Work1.webp", tag: "Visual System" },
      { title: "Product Monogram & Logo Mark", image: "/images/AI Token.webp", tag: "Logo System" },
      { title: "Stationery & Brand Assets", image: "/images/Work2.webp", tag: "Collateral" },
    ],
    deliverables: [
      {
        id: "logo-system",
        title: "Logo Architecture & Marks",
        description: "Primary logotypes, responsive monograms, badges, and favicons crafted for all mediums.",
        items: ["Primary & Secondary Logotypes", "Favicons & App Icons", "Monochrome & Inverse Variations", "Vector Source Assets (SVG/EPS)"],
      },
      {
        id: "brand-guidelines",
        title: "Brand Style Guide Book",
        description: "A comprehensive brand playbook covering typography scales, color psychology, and clear space rules.",
        items: ["Color Hierarchy & HEX/RGB Tokens", "Primary & Secondary Type Pairings", "Imagery & Iconography Tone", "Misuse & Clear Space Rules"],
      },
      {
        id: "marketing-collateral",
        title: "Marketing & Pitch Collateral",
        description: "High-impact visual assets for investor decks, social media, merchandise, and business cards.",
        items: ["Pitch Deck Presentation Templates", "Social Media Post Templates", "Business Cards & Stationery", "Digital Signature Templates"],
      },
    ],
    processSteps: [
      { number: "01", title: "Brand Strategy & Positioning", duration: "Week 1", description: "Uncovering your brand mission, target demographic, and distinct visual personality." },
      { number: "02", title: "Moodboards & Concept Directions", duration: "Week 2", description: "Developing 3 distinct visual territories with typography and color palettes." },
      { number: "03", title: "Logo System Refinement", duration: "Week 3", description: "Perfecting the chosen logo geometry, font pairings, and responsive lockups." },
      { number: "04", title: "Brand Book & Asset Export", duration: "Week 4", description: "Compiling the definitive digital brand guide and complete production asset package." },
    ],
    faqs: [
      { question: "What file formats will I receive for my branding assets?", answer: "You will receive vector files (AI, EPS, SVG), high-resolution raster files (PNG, WEBP, PDF), and complete Figma design libraries." },
      { question: "Can you help rename or reposition an existing company?", answer: "Yes, we specialize in both greenfield brand creation and complete brand refreshes for scaling companies." },
      { question: "Is the logo trademarkable?", answer: "Yes, all logos and visual marks are created from scratch with 100% original geometry ready for legal trademark registration." },
    ],
  },

  "web-development": {
    slug: "web-development",
    category: "Development Services",
    categoryBadgeBg: "bg-[#fff4eb]",
    categoryBadgeBorder: "border-[#fee7d6]",
    categoryBadgeText: "text-neutral-800",
    title: "Web Development",
    subtitle: "Built for Speed, Reliability & Exponential Growth",
    heroDescription:
      "Enterprise-grade full-stack web development using Next.js, React, and TypeScript. We build lightning-fast web applications with clean architecture and zero technical debt.",
    stats: [
      { value: "100/100", label: "Lighthouse Score" },
      { value: "0ms", label: "Layout Shift (CLS)" },
      { value: "25+", label: "Years Combined Exp" },
    ],
    showcaseImages: [
      { title: "Full-Stack Web Architecture", image: "/images/WebDev3.webp", tag: "Full-Stack Web" },
      { title: "Next.js & React Engineering", image: "/images/WebDev4.webp", tag: "Next.js & React" },
      { title: "SaaS Cloud Platform Architecture", image: "/images/SaaS3.webp", tag: "TypeScript App" },
      { title: "Interactive 3D WebGL Canvas", image: "/images/SaaS4.webp", tag: "Three.js WebGL" },
    ],
    deliverables: [
      {
        id: "nextjs-apps",
        title: "Next.js & React Engineering",
        description: "Modern web applications utilizing Server Components, Turbopack, and incremental static generation.",
        items: ["App Router Architecture", "TypeScript Type Safety", "Server-Side Rendering (SSR)", "Sub-Second Route Transitions"],
      },
      {
        id: "api-backend",
        title: "API & Backend Integrations",
        description: "Robust REST & GraphQL API integrations with secure authentication, database schemas, and webhooks.",
        items: ["Supabase / PostgreSQL / MongoDB", "Stripe & Payment Gateways", "NextAuth & OAuth Providers", "Automated Webhook Handlers"],
      },
      {
        id: "perf-seo",
        title: "Performance & Technical SEO",
        description: "Optimization ensuring 95+ Google Lighthouse scores, instant asset caching, and clean schema metadata.",
        items: ["Core Web Vitals Optimization", "Edge CDN Asset Delivery", "Dynamic OpenGraph Metadata", "WCAG 2.1 Accessibility Standards"],
      },
    ],
    processSteps: [
      { number: "01", title: "Architecture & Stack Setup", duration: "Week 1", description: "Setting up TypeScript repositories, Next.js App Router, Tailwind CSS, and CI/CD pipelines." },
      { number: "02", title: "Component Development", duration: "Week 2-3", description: "Translating Figma designs into pixel-perfect, accessible React components with Framer Motion." },
      { number: "03", title: "API & Database Integration", duration: "Week 3-4", description: "Hooking up backend APIs, authentication, analytics, and third-party SaaS services." },
      { number: "04", title: "Testing & Production Launch", duration: "Week 5", description: "Running cross-device QA, security audits, and zero-downtime deployment to Vercel/AWS." },
    ],
    faqs: [
      { question: "What tech stack do you recommend for modern web apps?", answer: "We primarily build with Next.js (React), TypeScript, Tailwind CSS, Framer Motion, and scalable backend platforms like Supabase, Node.js, and Vercel." },
      { question: "Will I have full ownership of the source code?", answer: "Yes, you receive 100% intellectual property ownership and full access to the Git repository upon completion." },
      { question: "Do you offer post-launch maintenance and support?", answer: "Yes, we provide flexible monthly engineering retainers for continuous feature rollouts, updates, and monitoring." },
    ],
  },

  "wordpress": {
    slug: "wordpress",
    category: "Development Services",
    categoryBadgeBg: "bg-[#fff4eb]",
    categoryBadgeBorder: "border-[#fee7d6]",
    categoryBadgeText: "text-neutral-800",
    title: "WordPress Development",
    subtitle: "Easy to Manage, Secure & Built to Scale",
    heroDescription:
      "Custom WordPress development built without bloated page builders. We create bespoke block-based themes and headless CMS setups tailored for rapid content publishing.",
    stats: [
      { value: "60+", label: "WP Builds Shipped" },
      { value: "99.9%", label: "Uptime Reliability" },
      { value: "2x", label: "Faster Publishing" },
    ],
    showcaseImages: [
      { title: "Headless WordPress & CMS", image: "/images/WordPressHeadlessCMS.webp", tag: "Headless CMS" },
      { title: "Custom Gutenberg Block Themes", image: "/images/WP3.webp", tag: "Custom Blocks" },
      { title: "Enterprise Scalable WP Portal", image: "/images/WP4.webp", tag: "Enterprise CMS" },
      { title: "Editorial Magazine Architecture", image: "/images/UserPath.webp", tag: "Publishing Hub" },
    ],
    deliverables: [
      {
        id: "gutenberg-blocks",
        title: "Custom Gutenberg Block Themes",
        description: "Tailor-made Gutenberg blocks providing an intuitive visual editing experience without third-party plugin bloat.",
        items: ["Native Block Editor Integration", "Custom Fields (ACF Pro)", "Zero Plugin Dependencies", "Pixel-Perfect Design Match"],
      },
      {
        id: "headless-wp",
        title: "Headless WordPress + Next.js",
        description: "The editorial power of WordPress combined with the speed and security of a Next.js frontend.",
        items: ["GraphQL / REST API Endpoints", "Instant Edge Caching", "Immunity to Direct Database Exploits", "Instant Static Page Generation"],
      },
      {
        id: "security-speed",
        title: "Enterprise Security & Speed",
        description: "Hardened security configuration, automated backups, and advanced Redis/Varnish caching.",
        items: ["Database Query Optimization", "Automated Daily Cloud Backups", "SSL & WAF Firewall Rules", "Spam & Brute-Force Protection"],
      },
    ],
    processSteps: [
      { number: "01", title: "Content Model & Field Mapping", duration: "Week 1", description: "Architecting custom post types, taxonomies, and ACF editor fields." },
      { number: "02", title: "Custom Block Engineering", duration: "Week 2", description: "Developing modular Gutenberg blocks matching your custom Figma designs." },
      { number: "03", title: "Migration & Third-Party Hookup", duration: "Week 3", description: "Migrating existing posts/media and integrating CRM, newsletters, and analytics." },
      { number: "04", title: "Hardening, Training & Launch", duration: "Week 4", description: "Conducting security hardening, providing video editor walkthroughs, and going live." },
    ],
    faqs: [
      { question: "Why avoid generic WordPress page builders like Elementor?", answer: "Generic builders generate heavy, slow code that damages Core Web Vitals. Our custom block themes load in under 1 second and provide a cleaner editing experience." },
      { question: "Is WordPress still secure for business websites?", answer: "When built cleanly with custom code, strong firewalls, and managed hosting, WordPress is an extremely secure and dependable CMS." },
      { question: "Can our non-technical marketing team easily edit content?", answer: "Absolutely. We build visual drag-and-drop custom blocks so your team can publish new pages effortlessly without touching code." },
    ],
  },

  "shopify": {
    slug: "shopify",
    category: "Development Services",
    categoryBadgeBg: "bg-[#fff4eb]",
    categoryBadgeBorder: "border-[#fee7d6]",
    categoryBadgeText: "text-neutral-800",
    title: "Shopify Development",
    subtitle: "Sell More with Bespoke Shopify E-Commerce",
    heroDescription:
      "Custom Shopify 2.0 theme engineering designed for high average order value (AOV), seamless checkout, and rapid international scaling.",
    stats: [
      { value: "3.8x", label: "AOV Growth" },
      { value: "$50M+", label: "GMV Processed" },
      { value: "<1.0s", label: "Fast Checkout" },
    ],
    showcaseImages: [
      { title: "Shopify E-Commerce Storefront", image: "/images/ShopifyECommerce.webp", tag: "Shopify 2.0" },
      { title: "Luxury Apparel E-Commerce", image: "/images/SportPhoto01.webp", tag: "Custom Theme" },
      { title: "Digital Payments & Checkout", image: "/images/DigitalPay.webp", tag: "Custom Checkout" },
      { title: "High-Volume Revenue Dashboard", image: "/images/Revenue.webp", tag: "E-Commerce Scale" },
    ],
    deliverables: [
      {
        id: "custom-shopify-themes",
        title: "Bespoke Shopify 2.0 Themes",
        description: "Fast, custom Liquid themes with modular dynamic sections customizable in the Shopify Theme Editor.",
        items: ["Online Store 2.0 Architecture", "Custom Product Detail Pages (PDP)", "Sticky Quick-Buy Bars", "Dynamic Bundle Selectors"],
      },
      {
        id: "conversion-cart",
        title: "Slide-Out Cart & Upsell Engine",
        description: "High-converting AJAX slide-out cart with free shipping meters, in-cart cross-sells, and tier discounts.",
        items: ["Free Shipping Progress Bar", "One-Click Add-on Cross-sells", "Discount Code Input in Cart", "Buy Now Pay Later (Klarna/Afterpay)"],
      },
      {
        id: "app-integrations",
        title: "App & ERP Integrations",
        description: "Seamless integration with Klaviyo, Gorgias, Recharge subscriptions, and ERP inventory management systems.",
        items: ["Klaviyo Flow Tracking Scripts", "Recharge Subscriptions Setup", "Multi-Currency & Geo-IP Redirection", "Reviews & Social UGC Widgets"],
      },
    ],
    processSteps: [
      { number: "01", title: "Catalog & E-Commerce Strategy", duration: "Week 1", description: "Mapping product variants, collection taxonomies, and conversion funnels." },
      { number: "02", title: "Liquid & Section Theme Dev", duration: "Week 2-3", description: "Coding custom responsive Shopify sections with optimized Liquid scripts." },
      { number: "03", title: "App Stack & Checkout Setup", duration: "Week 3-4", description: "Configuring email marketing, subscription logic, payment gateways, and taxes." },
      { number: "04", title: "Load Testing & Store Launch", duration: "Week 4", description: "Performing test orders, mobile checkout QA, domain DNS cutover, and launch." },
    ],
    faqs: [
      { question: "Do you build custom Shopify themes or use pre-made templates?", answer: "We build 100% bespoke Shopify 2.0 themes tailored specifically to your branding and conversion requirements." },
      { question: "Can you help migrate our store from WooCommerce or Magento?", answer: "Yes, we handle complete product, customer, order history, and 301 redirect migrations to Shopify." },
      { question: "Can we support multiple currencies and languages?", answer: "Yes, we configure Shopify Markets with automated geolocation, multi-currency pricing, and localized checkout." },
    ],
  },

  "webflow": {
    slug: "webflow",
    category: "Development Services",
    categoryBadgeBg: "bg-[#fff4eb]",
    categoryBadgeBorder: "border-[#fee7d6]",
    categoryBadgeText: "text-neutral-800",
    title: "Webflow Development",
    subtitle: "Custom Sites with No Technical Compromises",
    heroDescription:
      "Bridging award-winning visual design with clean, semantic Webflow code. We follow Client-First standards for ultra-scalable CMS websites with bespoke animations.",
    stats: [
      { value: "45+", label: "Webflow Sites Shipped" },
      { value: "0", label: "Technical Debt" },
      { value: "100%", label: "Responsive Precision" },
    ],
    showcaseImages: [
      { title: "Client-First Webflow Portal", image: "/images/WebDesain3.webp", tag: "Client-First" },
      { title: "B2B Tech Webflow Experience", image: "/images/BestDesign.webp", tag: "CMS Hub" },
      { title: "Interactive Product Showcase", image: "/images/product_mockup.webp", tag: "Interactive UI" },
      { title: "Custom GSAP Interaction Build", image: "/images/WebDev3.webp", tag: "Custom JS" },
    ],
    deliverables: [
      {
        id: "client-first-build",
        title: "Client-First Class Naming",
        description: "Strict adherence to Finsweet Client-First standards ensuring your site is organized and easy to maintain.",
        items: ["Consistent Rem-Based Typography", "Modular Section Structures", "Global Color & Style Variables", "Clean HTML Semantic Tags"],
      },
      {
        id: "advanced-cms",
        title: "Dynamic Webflow CMS Hubs",
        description: "Powerful CMS collection structures for blogs, case studies, team directories, and resource libraries.",
        items: ["Multi-Reference CMS Filtering", "Dynamic Case Study Layouts", "Automated SEO OpenGraph Schema", "Custom Pagination & Search"],
      },
      {
        id: "custom-code-motion",
        title: "Custom JS & GSAP Interactions",
        description: "Elevating Webflow with custom JavaScript, GSAP timelines, Lenis smooth scroll, and interactive sliders.",
        items: ["Lenis Smooth Momentum Scroll", "Custom Slider & Tab Swipers", "Scroll-Linked SVG Drawing", "Form Validation & Webhooks"],
      },
    ],
    processSteps: [
      { number: "01", title: "Figma to Webflow Architecture", duration: "Week 1", description: "Setting up the style guide, global CSS variables, and Client-First class structures." },
      { number: "02", title: "Page Build & Responsive QA", duration: "Week 2", description: "Building desktop, tablet, and mobile breakpoints with 1-to-1 Figma accuracy." },
      { number: "03", title: "CMS Collections & Interactions", duration: "Week 3", description: "Connecting dynamic CMS collections and fine-tuning scroll/hover interactions." },
      { number: "04", title: "SEO, Domain Connection & Handover", duration: "Week 4", description: "Configuring 301 redirects, Google Search Console, and providing team video training." },
    ],
    faqs: [
      { question: "Why do companies choose Webflow over WordPress?", answer: "Webflow offers enterprise-grade visual editing, zero server maintenance, built-in global CDN hosting, and seamless marketing agility without plugin vulnerabilities." },
      { question: "Can we connect custom forms to HubSpot or our CRM?", answer: "Yes, we integrate Webflow forms directly with HubSpot, Make/Zapier, Mailchimp, or custom backend webhooks." },
      { question: "Will our marketing team receive training on how to use Webflow?", answer: "Yes, every Webflow handover includes a dedicated video tutorial and a structured visual editor walkthrough." },
    ],
  },
};

export default function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const service = servicesMap[resolvedParams.slug];

  if (!service) {
    notFound();
  }

  const [activeDeliverable, setActiveDeliverable] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <main className="min-h-screen bg-white text-gray-900 font-['Agrandir',sans-serif] pt-28 sm:pt-36">
      {/* 1. Hero Section with Blur-to-Clear Word Animation & Signature Rolling Flip Button */}
      <section className="w-full px-6 sm:px-12 lg:px-16 pb-10 sm:pb-14 max-w-7xl mx-auto">
        {/* Breadcrumb Navigation with Blur */}
        <motion.div
          initial={{ opacity: 0, y: 15, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2 text-xs sm:text-sm text-neutral-500 font-['Agrandir',sans-serif] mb-6"
        >
          <Link href="/services" className="hover:text-black transition-colors">
            Services
          </Link>
          <span>/</span>
          <span className="text-black font-semibold">{service.title}</span>
        </motion.div>

        {/* Hero Category Badge with Blur */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(12px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <span
            className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-wide border font-['Agrandir',sans-serif] ${service.categoryBadgeBg} ${service.categoryBadgeBorder} ${service.categoryBadgeText}`}
          >
            {service.category}
          </span>
        </motion.div>

        {/* Hero Title with Word-by-Word Blur-to-Clear */}
        <div className="space-y-4 max-w-4xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-black font-['Questrial',sans-serif] tracking-tight leading-[1.08] break-words">
            {service.title.split(" ").map((word, index) => (
              <motion.span
                key={`title-${index}`}
                initial={{ opacity: 0, y: 40, filter: "blur(20px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.85,
                  delay: 0.1 + index * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="inline-block mr-3 text-black"
              >
                {word}
              </motion.span>
            ))}
          </h1>

          {/* Subtitle with Blur-to-Clear */}
          <motion.p
            initial={{ opacity: 0, y: 20, filter: "blur(14px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg sm:text-xl md:text-2xl text-neutral-600 font-medium font-['Questrial',sans-serif]"
          >
            {service.subtitle}
          </motion.p>

          {/* Detailed Description with Blur-to-Clear */}
          <motion.p
            initial={{ opacity: 0, y: 20, filter: "blur(14px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm sm:text-base md:text-lg text-neutral-600 leading-relaxed font-['Agrandir',sans-serif] max-w-3xl pt-2"
          >
            {service.heroDescription}
          </motion.p>

          {/* Action Buttons Row with Signature Rolling Flip Button */}
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(12px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-4 pt-6"
          >
            {/* Primary Rolling Flip CTA */}
            <Link
              href="/contact"
              className="group/btn relative inline-flex items-center justify-center overflow-hidden rounded-full bg-[#d4f938] px-8 py-3.5 text-sm font-bold text-black border border-[#c4eb28] shadow-[0_0_25px_rgba(212,249,56,0.35)] transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] hover:bg-[#111111] hover:border-black cursor-pointer active:scale-95 font-['Agrandir',sans-serif]"
            >
              <span className="inline-flex items-center gap-2 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover/btn:-translate-y-[160%]">
                <span>Start a Project</span>
                <ArrowRight01Icon className="w-4 h-4" />
              </span>
              <span className="absolute inset-0 flex items-center justify-center gap-2 text-[#d4f938] translate-y-[160%] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover/btn:translate-y-0">
                <span>Start a Project</span>
                <ArrowRight01Icon className="w-4 h-4" />
              </span>
            </Link>

            {/* Secondary Link */}
            <Link
              href="/#portfolio"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-black text-sm font-bold transition-colors font-['Agrandir',sans-serif]"
            >
              <span>View Case Studies</span>
              <ArrowDown01Icon className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        {/* 3 Metric Stat Highlights with Blur-to-Clear */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 sm:pt-10 mt-12 border-t border-neutral-200">
          {service.stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30, filter: "blur(14px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.75, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-1"
            >
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-black font-['Questrial',sans-serif] tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-medium text-neutral-500 font-['Agrandir',sans-serif]">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 2. Visual Showcase: 2x2 Grid Layout with Crisp Aspect Ratio (No Scaling/Stretching/Blur) */}
      <section className="w-full bg-[#07080b] text-white py-12 sm:py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 space-y-12">
          <div className="max-w-3xl space-y-3">
            <motion.span
              initial={{ opacity: 0, y: 20, filter: "blur(12px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6 }}
              className="inline-block text-xs font-bold uppercase tracking-widest text-[#d4f938] font-['Agrandir',sans-serif]"
            >
              VISUAL SHOWCASE
            </motion.span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-['Questrial',sans-serif] tracking-tight leading-tight">
              {["Crafted", "with", "Precision", "&", "Impact"].map((word, index) => (
                <motion.span
                  key={`showcase-${index}`}
                  initial={{ opacity: 0, y: 35, filter: "blur(18px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.8,
                    delay: 0.1 + index * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="inline-block mr-2.5 sm:mr-3.5 text-white"
                >
                  {word}
                </motion.span>
              ))}
            </h2>
          </div>

          {/* 2x2 Grid Showcase Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {service.showcaseImages.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 35, filter: "blur(16px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.75, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="group relative rounded-3xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-xl flex flex-col cursor-pointer"
              >
                <div className="relative w-full h-[280px] sm:h-[340px] lg:h-[380px] overflow-hidden bg-neutral-950">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                  />
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-xs font-bold text-white font-['Agrandir',sans-serif]">
                      {item.tag}
                    </span>
                  </div>
                </div>
                <div className="p-5 sm:p-6 bg-neutral-950/95 border-t border-neutral-800/80 flex items-center justify-between gap-4">
                  <h3 className="text-base sm:text-lg font-bold text-white font-['Questrial',sans-serif] group-hover:text-[#d4f938] transition-colors">
                    {item.title}
                  </h3>
                  <span className="w-8 h-8 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-400 group-hover:border-[#d4f938] group-hover:text-[#d4f938] transition-colors shrink-0">
                    <ArrowUpRight01Icon className="w-4 h-4" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Core Deliverables Interactive Tabs Section */}
      <section className="w-full bg-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 space-y-8">
          <div className="max-w-3xl space-y-3">
            <motion.span
              initial={{ opacity: 0, y: 20, filter: "blur(12px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6 }}
              className="inline-block text-xs font-bold uppercase tracking-widest text-[#84c405] font-['Agrandir',sans-serif]"
            >
              WHAT WE DELIVER
            </motion.span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-black font-['Questrial',sans-serif] tracking-tight leading-tight">
              {["Scope", "of", "Deliverables"].map((word, index) => (
                <motion.span
                  key={`deliv-${index}`}
                  initial={{ opacity: 0, y: 35, filter: "blur(18px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.8,
                    delay: 0.1 + index * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="inline-block mr-2.5 sm:mr-3.5 text-black"
                >
                  {word}
                </motion.span>
              ))}
            </h2>
            <motion.p
              initial={{ opacity: 0, y: 20, filter: "blur(12px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-neutral-600 text-sm sm:text-base font-['Agrandir',sans-serif]"
            >
              Every build is engineered to production standards with comprehensive assets and scalable foundations.
            </motion.p>
          </div>

          {/* Interactive Deliverables Selector Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Deliverable Tab Selectors */}
            <div className="lg:col-span-5 space-y-3">
              {service.deliverables.map((item, idx) => {
                const isActive = activeDeliverable === idx;
                return (
                  <motion.button
                    key={item.id}
                    type="button"
                    initial={{ opacity: 0, x: -25, filter: "blur(14px)" }}
                    whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ duration: 0.65, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => setActiveDeliverable(idx)}
                    className={`w-full text-left p-5 sm:p-6 rounded-2xl border transition-all duration-300 cursor-pointer font-['Agrandir',sans-serif] ${
                      isActive
                        ? "bg-neutral-950 text-white border-black shadow-lg"
                        : "bg-neutral-50 text-neutral-800 border-neutral-200/80 hover:bg-neutral-100"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-base sm:text-lg font-bold font-['Questrial',sans-serif]">
                        {item.title}
                      </h4>
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isActive
                            ? "bg-[#d4f938] text-black"
                            : "bg-neutral-200 text-neutral-700"
                        }`}
                      >
                        {idx + 1}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Right Column: Active Deliverable Card Details */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeDeliverable}
                  initial={{ opacity: 0, y: 25, filter: "blur(16px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -20, filter: "blur(12px)" }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-3xl bg-neutral-50 border border-neutral-200/90 p-8 sm:p-10 space-y-6 shadow-sm"
                >
                  <div className="space-y-2">
                    <motion.h3
                      initial={{ opacity: 0, y: 15, filter: "blur(10px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ duration: 0.4 }}
                      className="text-2xl sm:text-3xl font-black text-black font-['Questrial',sans-serif]"
                    >
                      {service.deliverables[activeDeliverable].title}
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, y: 15, filter: "blur(10px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ duration: 0.45, delay: 0.05 }}
                      className="text-sm sm:text-base text-neutral-600 font-['Agrandir',sans-serif] leading-relaxed"
                    >
                      {service.deliverables[activeDeliverable].description}
                    </motion.p>
                  </div>

                  <div className="pt-4 border-t border-neutral-200">
                    <motion.div
                      initial={{ opacity: 0, filter: "blur(8px)" }}
                      animate={{ opacity: 1, filter: "blur(0px)" }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                      className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-4 font-['Agrandir',sans-serif]"
                    >
                      Included Features & Deliverables:
                    </motion.div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {service.deliverables[activeDeliverable].items.map((subItem, sIdx) => (
                        <motion.div
                          key={sIdx}
                          initial={{ opacity: 0, y: 15, filter: "blur(10px)" }}
                          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                          transition={{ duration: 0.4, delay: 0.12 + sIdx * 0.06 }}
                          className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-neutral-200/80 shadow-xs"
                        >
                          <span className="w-5 h-5 rounded-full bg-[#d4f938]/30 text-black flex items-center justify-center shrink-0">
                            <Tick01Icon className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                          </span>
                          <span className="text-xs sm:text-sm font-semibold text-neutral-800 font-['Agrandir',sans-serif]">
                            {subItem}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Step-by-Step Delivery Sprint Process */}
      <section className="w-full bg-[#050608] text-white py-12 sm:py-16 relative overflow-hidden border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 space-y-8">
          <div className="max-w-3xl space-y-3">
            <motion.span
              initial={{ opacity: 0, y: 20, filter: "blur(12px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6 }}
              className="inline-block text-xs font-bold uppercase tracking-widest text-[#d4f938] font-['Agrandir',sans-serif]"
            >
              HOW WE WORK
            </motion.span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-['Questrial',sans-serif] tracking-tight leading-tight">
              {["Production", "Sprint", "Workflow"].map((word, index) => (
                <motion.span
                  key={`workflow-${index}`}
                  initial={{ opacity: 0, y: 35, filter: "blur(18px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.8,
                    delay: 0.1 + index * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="inline-block mr-2.5 sm:mr-3.5 text-white"
                >
                  {word}
                </motion.span>
              ))}
            </h2>
          </div>

          {/* 4 Process Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {service.processSteps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 35, filter: "blur(16px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.75, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-3xl bg-neutral-900/90 border border-neutral-800 p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl sm:text-3xl font-black text-[#d4f938] font-['Questrial',sans-serif]">
                      {step.number}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-neutral-300 font-['Agrandir',sans-serif]">
                      {step.duration}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white font-['Questrial',sans-serif]">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 font-['Agrandir',sans-serif] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Frequently Asked Questions (FAQ) Accordion */}
      <section className="w-full bg-white py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-6 sm:px-12 space-y-8">
          <div className="text-center space-y-3">
            <motion.span
              initial={{ opacity: 0, y: 20, filter: "blur(12px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6 }}
              className="inline-block text-xs font-bold uppercase tracking-widest text-[#84c405] font-['Agrandir',sans-serif]"
            >
              FAQS
            </motion.span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-black font-['Questrial',sans-serif] tracking-tight">
              {["Frequently", "Asked", "Questions"].map((word, index) => (
                <motion.span
                  key={`faq-title-${index}`}
                  initial={{ opacity: 0, y: 35, filter: "blur(18px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.8,
                    delay: 0.1 + index * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="inline-block mr-2.5 sm:mr-3.5 text-black"
                >
                  {word}
                </motion.span>
              ))}
            </h2>
          </div>

          <div className="space-y-4">
            {service.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 25, filter: "blur(14px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.65, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-2xl border border-neutral-200/90 bg-neutral-50/60 overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-5 sm:p-6 text-left font-['Questrial',sans-serif] font-bold text-base sm:text-lg text-black cursor-pointer hover:bg-neutral-100/70 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center bg-neutral-200 text-xs font-bold transition-transform duration-300 shrink-0 ml-4 ${
                        isOpen ? "rotate-180 bg-[#d4f938] text-black" : "text-neutral-700"
                      }`}
                    >
                      <ArrowDown01Icon className="w-4 h-4" />
                    </span>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0, filter: "blur(10px)" }}
                        animate={{ height: "auto", opacity: 1, filter: "blur(0px)" }}
                        exit={{ height: 0, opacity: 0, filter: "blur(10px)" }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="p-5 sm:p-6 pt-0 text-xs sm:text-sm text-neutral-600 font-['Agrandir',sans-serif] leading-relaxed border-t border-neutral-200/60">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Ready to Build Banner CTA with Rolling Flip Button */}
      <section className="w-full bg-[#07080b] text-white py-12 sm:py-16 relative overflow-hidden border-t border-neutral-900">
        <div className="max-w-4xl mx-auto px-6 sm:px-12 text-center space-y-6 relative z-10">
          <motion.span
            initial={{ opacity: 0, y: 20, filter: "blur(12px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6 }}
            className="inline-block text-xs font-bold uppercase tracking-widest text-[#d4f938] font-['Agrandir',sans-serif]"
          >
            LET&apos;S COLLABORATE
          </motion.span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-['Questrial',sans-serif] tracking-tight leading-tight">
            {`Ready to Build Your Next ${service.title}?`.split(" ").map((word, index) => (
              <motion.span
                key={`cta-${index}`}
                initial={{ opacity: 0, y: 35, filter: "blur(18px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.8,
                  delay: 0.1 + index * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="inline-block mr-2.5 sm:mr-3.5 text-white"
              >
                {word}
              </motion.span>
            ))}
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 20, filter: "blur(14px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto font-['Agrandir',sans-serif] leading-relaxed"
          >
            Let&apos;s turn your vision into high-performance reality. Book a discovery call today to discuss timelines, scope, and deliverables.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(12px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="pt-4 flex items-center justify-center"
          >
            <Link
              href="/contact"
              className="group/btn relative inline-flex items-center justify-center overflow-hidden rounded-full bg-[#d4f938] px-9 py-4 text-sm sm:text-base font-bold text-black border border-[#c4eb28] shadow-[0_0_30px_rgba(212,249,56,0.4)] transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] hover:bg-[#111111] hover:border-black cursor-pointer active:scale-95 font-['Agrandir',sans-serif]"
            >
              <span className="inline-flex items-center gap-2 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover/btn:-translate-y-[160%]">
                <span>Book a Discovery Call</span>
                <ArrowRight01Icon className="w-4 h-4" />
              </span>
              <span className="absolute inset-0 flex items-center justify-center gap-2 text-[#d4f938] translate-y-[160%] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover/btn:translate-y-0">
                <span>Book a Discovery Call</span>
                <ArrowRight01Icon className="w-4 h-4" />
              </span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Standard Footer */}
      <Footer />
    </main>
  );
}
