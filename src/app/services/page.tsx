"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import { ArrowUpRight01Icon, Clock01Icon, FlashIcon, RepeatIcon } from "hugeicons-react";

interface ServiceDetail {
  id: string;
  category: "design" | "engineering" | "growth";
  title: string;
  subtitle: string;
  description: string;
  deliverables: string[];
  technologies: string[];
  badge: string;
  href: string;
}

const allServicesData: ServiceDetail[] = [
  // Design Services
  {
    id: "ui-ux",
    category: "design",
    title: "UI/UX & Product Design",
    subtitle: "Intuitive digital journeys built for enterprise scale.",
    badge: "Core Capability",
    description:
      "We design interactive digital products that combine aesthetic perfection with frictionless human-centered usability. From complex multi-tenant SaaS dashboards to consumer mobile applications.",
    deliverables: [
      "User Journey & Persona Mapping",
      "Interactive High-Fidelity Wireframes",
      "Design Systems & Component Libraries",
      "Micro-interaction & Animation Prototypes",
      "Usability Testing & Accessibility Audits",
    ],
    technologies: ["Figma", "Framer", "Protopie", "Design Tokens", "Storybook"],
    href: "/contact",
  },
  {
    id: "branding",
    category: "design",
    title: "Brand Identity & Strategy",
    subtitle: "Distinctive brand systems that command market authority.",
    badge: "Brand Craft",
    description:
      "A great digital product starts with an unmistakable brand soul. We sculpt visual identities, bespoke typography, art direction, and guideline ecosystems that resonate across all digital touchpoints.",
    deliverables: [
      "Brand Core Strategy & Positioning",
      "Logomark & Custom Typography",
      "Color Palettes & Visual Language",
      "3D Brand Assets & Motion Guidelines",
      "Digital Brand Guidelines Book",
    ],
    technologies: ["Illustrator", "Cinema 4D", "Blender", "After Effects"],
    href: "/contact",
  },
  {
    id: "mobile-apps",
    category: "design",
    title: "Mobile App Experience",
    subtitle: "Native-grade iOS & Android applications with fluid gestures.",
    badge: "Mobile First",
    description:
      "Crafting mobile experiences that feel responsive and alive. We design native iOS and Android interfaces that maximize engagement, retention, and app store conversion.",
    deliverables: [
      "iOS & Android Guideline Compliance",
      "Tactile Haptic & Gesture Interfaces",
      "Onboarding & Subscription Funnels",
      "App Store Asset & Screenshot Kits",
    ],
    technologies: ["SwiftUI / React Native", "Figma", "Lottie Animations"],
    href: "/contact",
  },

  // Engineering Services
  {
    id: "web-development",
    category: "engineering",
    title: "Next.js & Frontend Engineering",
    subtitle: "Blazing-fast, SEO-optimized web applications at venture speed.",
    badge: "Engineering",
    description:
      "We build robust web applications using cutting-edge modern architectures (Next.js App Router, React Server Components, TypeScript, and Three.js WebGL) engineered for sub-second load times.",
    deliverables: [
      "Next.js App Router Architecture",
      "3D WebGL / Three.js Interactive Shaders",
      "Server-Side Rendering & Edge Caching",
      "Lighthouse 95+ Core Web Vitals",
      "Clean TypeScript & Modular Architecture",
    ],
    technologies: ["Next.js 16", "React 19", "Three.js / WebGL", "TailwindCSS", "TypeScript"],
    href: "/contact",
  },
  {
    id: "e-commerce",
    category: "engineering",
    title: "Shopify & Headless Commerce",
    subtitle: "High-converting digital storefronts engineered to maximize AOV.",
    badge: "Commerce",
    description:
      "Custom Shopify Plus and headless storefronts built to scale. We turn high-growth DTC and luxury retail brands into high-converting digital storefronts with seamless checkout flows.",
    deliverables: [
      "Custom Shopify Plus Theme Architecture",
      "Headless Storefront Development",
      "Cart Optimization & 1-Click Checkout",
      "ERP & Inventory API Integrations",
    ],
    technologies: ["Shopify Plus", "Liquid", "Hydrogen / Next.js", "Sanity CMS"],
    href: "/contact",
  },
  {
    id: "cms-webflow",
    category: "engineering",
    title: "Webflow & Headless CMS",
    subtitle: "Empower marketing teams with scalable no-code / low-code systems.",
    badge: "Marketing Sites",
    description:
      "Bespoke Webflow websites with custom JavaScript enhancements that allow your marketing and content teams to publish landing pages instantly without developer bottlenecks.",
    deliverables: [
      "Custom Webflow CMS Architecture",
      "Client-First Styling Framework",
      "Custom GSAP / JavaScript Animations",
      "Zapier / Make Automation Integrations",
    ],
    technologies: ["Webflow", "GSAP", "Relume", "Memberstack", "Zapier"],
    href: "/contact",
  },

  // Growth & Strategy
  {
    id: "growth-cro",
    category: "growth",
    title: "Conversion Rate Optimization (CRO)",
    subtitle: "Data-driven experimentation that turns traffic into recurring revenue.",
    badge: "Growth",
    description:
      "We audit your digital funnels, identify drop-off bottlenecks, and deploy continuous A/B test variations to systematically increase conversion rates and customer lifetime value.",
    deliverables: [
      "Funnel & Analytics Drop-off Audit",
      "A/B Testing Hypothesis & Roadmap",
      "High-Converting Landing Page Sprints",
      "PostHog / Mixpanel Event Tracking",
    ],
    technologies: ["PostHog", "Google Analytics 4", "VWO", "Hotjar"],
    href: "/contact",
  },
];

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState<"all" | "design" | "engineering" | "growth">("all");

  const filteredServices =
    activeTab === "all"
      ? allServicesData
      : allServicesData.filter((item) => item.category === activeTab);

  const headlineLine1 = ["Crafting", "Digital", "Products"];
  const headlineLine2 = ["That", "Command", "Growth."];

  return (
    <main className="min-h-screen bg-white text-gray-900 font-['Agrandir',sans-serif] pt-28 sm:pt-36">
      {/* Header Section */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pb-10 sm:pb-12 text-center sm:text-left">
        <div className="space-y-4 max-w-3xl border-b border-neutral-200/80 pb-6">
          {/* Main Headline: Blur-to-Clear Upward Animation */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-black leading-[1.12] w-full break-words">
            {/* Baris 1: Crafting Digital Products (Tebal) */}
            <span className="block pb-1 font-bold text-black font-['Questrial',sans-serif]">
              {headlineLine1.map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 45, filter: "blur(14px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.75,
                    delay: 0.12 + index * 0.12,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="inline-block mr-2 sm:mr-3.5"
                >
                  {word}
                </motion.span>
              ))}
            </span>

            {/* Baris 2: That Command Growth. (Abu-abu / Muted Elegan) */}
            <span className="block font-bold text-neutral-400 font-['Questrial',sans-serif]">
              {headlineLine2.map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 45, filter: "blur(14px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.75,
                    delay: 0.48 + index * 0.12,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="inline-block mr-2 sm:mr-3.5"
                >
                  {word}
                </motion.span>
              ))}
            </span>
          </h1>

          {/* Subtitle Description with Blur-to-Clear */}
          <motion.p
            initial={{ opacity: 0, y: 25, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="text-neutral-600 text-base sm:text-lg max-w-xl leading-relaxed"
          >
            From initial concept wireframing to high-performance Next.js engineering and scalable design systems — we build what modern businesses need to lead their industry.
          </motion.p>
        </div>
      </section>

      {/* Category Tabs Filter */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pb-8 sm:pb-8">
        <motion.div
          initial={{ opacity: 0, y: 25, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center gap-2 sm:gap-3"
        >
          {[
            { id: "all", label: "All Capabilities" },
            { id: "design", label: "Design & Identity" },
            { id: "engineering", label: "Engineering & Tech" },
            { id: "growth", label: "Growth & Strategy" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`group/btn relative inline-flex items-center justify-center overflow-hidden rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold tracking-wide transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] cursor-pointer active:scale-95 ${
                  isActive
                    ? "bg-black text-[#d4f938] shadow-md border border-black scale-[1.02] hover:bg-[#d4f938] hover:border-[#c4eb28]"
                    : "bg-neutral-100 text-neutral-600 border border-neutral-200 hover:border-black hover:bg-black"
                }`}
              >
                {/* Layer 1: Teks Utama */}
                <span
                  className={`inline-block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover/btn:-translate-y-[160%] ${
                    isActive ? "text-[#d4f938] group-hover/btn:text-black" : "text-neutral-600 group-hover/btn:text-[#d4f938]"
                  }`}
                >
                  {tab.label}
                </span>

                {/* Layer 2: Teks Rolling Masuk Saat Hover */}
                <span
                  className={`absolute inset-0 flex items-center justify-center translate-y-[160%] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover/btn:translate-y-0 ${
                    isActive ? "text-black" : "text-[#d4f938]"
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </motion.div>
      </section>

      {/* Services Cards Bento Grid (Row 1: 3 cards, Row 2: 3 cards, Row 3: 1 wide full-width banner) */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pb-16 sm:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
          {filteredServices.map((service, idx) => {
            const isFullWidth = activeTab === "all" && idx === 6;

            if (isFullWidth) {
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 55, filter: "blur(14px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="lg:col-span-3 md:col-span-2 group rounded-[32px] sm:rounded-[40px] bg-[#0c0d12] text-white p-8 sm:p-10 lg:p-12 border border-neutral-800/80 shadow-2xl transition-all duration-500 hover:border-neutral-600 hover:shadow-[0_20px_50px_rgba(212,249,56,0.08)] relative overflow-hidden"
                >
                  {/* Subtle ambient light */}
                  <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(circle,rgba(212,249,56,0.1)_0%,transparent_70%)] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10 w-full">
                    {/* Left Info Column */}
                    <div className="lg:col-span-6 space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="px-3.5 py-1 rounded-full bg-white/10 text-neutral-300 text-xs font-bold font-['Agrandir',sans-serif]">
                          {service.badge}
                        </span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-['Questrial',sans-serif] tracking-tight leading-tight">
                        {service.title}
                      </h3>
                      <p className="text-sm sm:text-base font-semibold text-[#d4f938] font-['Agrandir',sans-serif]">
                        {service.subtitle}
                      </p>
                      <p className="text-xs sm:text-sm text-neutral-400 font-['Agrandir',sans-serif] leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    {/* Right Deliverables + Tech Stack + CTA */}
                    <div className="lg:col-span-6 space-y-6 lg:border-l lg:border-neutral-800/80 lg:pl-10">
                      <div className="space-y-3">
                        <div className="text-xs uppercase font-bold text-neutral-400 tracking-wider">
                          Core Deliverables
                        </div>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-neutral-300">
                          {service.deliverables.map((item, dIdx) => (
                            <li key={dIdx} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#d4f938] shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-4 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap gap-1.5">
                          {service.technologies.map((tech, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-neutral-400"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        <Link
                          href="/contact"
                          className="group/btn relative inline-flex items-center justify-center overflow-hidden rounded-full bg-[#d4f938] px-6 py-2.5 text-xs font-bold tracking-wide border border-[#c4eb28] shadow-[0_3px_15px_rgba(212,249,56,0.3)] transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] hover:bg-[#111111] hover:border-black hover:shadow-lg active:scale-95 cursor-pointer"
                        >
                          {/* Layer 1: Teks Hitam Awal */}
                          <div className="flex items-center gap-1.5 text-black transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover/btn:-translate-y-[160%]">
                            <span>Request Scope</span>
                            <span>→</span>
                          </div>

                          {/* Layer 2: Teks Hijau Neon */}
                          <div className="absolute inset-0 flex items-center justify-center gap-1.5 text-[#d4f938] translate-y-[160%] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover/btn:translate-y-0">
                            <span>Request Scope</span>
                            <span>→</span>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 50, filter: "blur(12px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.75,
                  delay: (idx % 3) * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group rounded-[32px] sm:rounded-[36px] bg-[#0c0d12] text-white p-7 sm:p-8 border border-neutral-800/80 shadow-2xl flex flex-col justify-between transition-all duration-500 hover:border-neutral-600 hover:shadow-[0_20px_50px_rgba(212,249,56,0.08)] relative overflow-hidden"
              >
                {/* Subtle ambient light */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-[radial-gradient(circle,rgba(212,249,56,0.08)_0%,transparent_70%)] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="space-y-5 relative z-10">
                  {/* Header Badge */}
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-white/10 text-neutral-300 text-xs font-bold font-['Agrandir',sans-serif]">
                      {service.badge}
                    </span>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-[#d4f938] group-hover:text-black transition-colors">
                      <ArrowUpRight01Icon className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                  </div>

                  {/* Service Title & Subtitle */}
                  <div className="space-y-1.5">
                    <h3 className="text-xl sm:text-2xl font-black text-white font-['Questrial',sans-serif] tracking-tight leading-tight">
                      {service.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] font-semibold text-[#d4f938] font-['Agrandir',sans-serif]">
                      {service.subtitle}
                    </p>
                    <p className="text-xs text-neutral-400 font-['Agrandir',sans-serif] leading-relaxed pt-1">
                      {service.description}
                    </p>
                  </div>

                  {/* Deliverables Checklist */}
                  <div className="space-y-2 pt-2 border-t border-neutral-800/80">
                    <div className="text-[11px] uppercase font-bold text-neutral-400 tracking-wider">
                      Core Deliverables
                    </div>
                    <ul className="space-y-1.5 text-xs text-neutral-300">
                      {service.deliverables.map((item, dIdx) => (
                        <li key={dIdx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#d4f938] shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Tech Stack Tags & CTA Button */}
                <div className="pt-5 mt-5 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-3 relative z-10">
                  <div className="flex flex-wrap gap-1">
                    {service.technologies.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-neutral-400"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <Link
                    href="/contact"
                    className="group/btn relative inline-flex items-center justify-center overflow-hidden rounded-full bg-[#d4f938] px-4.5 py-2 text-xs font-bold tracking-wide border border-[#c4eb28] shadow-[0_3px_12px_rgba(212,249,56,0.25)] transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] hover:bg-[#111111] hover:border-black active:scale-95 cursor-pointer"
                  >
                    {/* Layer 1: Teks Hitam Awal */}
                    <div className="flex items-center gap-1.5 text-black transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover/btn:-translate-y-[160%]">
                      <span>Request Scope</span>
                      <span>→</span>
                    </div>

                    {/* Layer 2: Teks Hijau Neon */}
                    <div className="absolute inset-0 flex items-center justify-center gap-1.5 text-[#d4f938] translate-y-[160%] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover/btn:translate-y-0">
                      <span>Request Scope</span>
                      <span>→</span>
                    </div>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Engagement Models Section */}
      <section className="w-full bg-[#f8f8fa] py-16 sm:py-20 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 space-y-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-black font-['Questrial',sans-serif] tracking-tight">
              {["Engagement", "Models"].map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 35, filter: "blur(14px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.75,
                    delay: index * 0.12,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="inline-block mr-2 sm:mr-3"
                >
                  {word}
                </motion.span>
              ))}
            </h2>
            <motion.p
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="text-sm sm:text-base text-neutral-600 font-['Agrandir',sans-serif]"
            >
              Flexible partnership structures designed around your product stage and velocity.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 35, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm space-y-4"
            >
              <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Model 01</div>
              <h3 className="text-xl font-bold text-black font-['Questrial',sans-serif]">Project-Based Sprints</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Fixed scope, timeline, and milestone-driven deliverables. Perfect for discrete product redesigns, landing page overhauls, or brand launches.
              </p>
              <div className="pt-2 text-xs font-bold text-black flex items-center gap-1.5">
                <Clock01Icon className="w-3.5 h-3.5 text-neutral-800 stroke-[2]" />
                <span>Timeline: 3 - 8 Weeks</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 35, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="bg-black text-white rounded-3xl p-8 border border-neutral-800 shadow-xl space-y-4 relative"
            >
              <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-[#d4f938] text-black text-[10px] font-black uppercase">
                Most Popular
              </div>
              <div className="text-xs font-bold text-[#d4f938] uppercase tracking-wider">Model 02</div>
              <h3 className="text-xl font-bold text-white font-['Questrial',sans-serif]">Dedicated Product Squad</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                An embedded team of senior designers &amp; engineers working exclusively as an extension of your in-house product team with daily syncs.
              </p>
              <div className="pt-2 text-xs font-bold text-[#d4f938] flex items-center gap-1.5">
                <FlashIcon className="w-3.5 h-3.5 fill-current text-[#d4f938]" />
                <span>High-Velocity Product Scaling</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 35, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm space-y-4"
            >
              <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Model 03</div>
              <h3 className="text-xl font-bold text-black font-['Questrial',sans-serif]">Monthly Retainer</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Guaranteed monthly development and design bandwidth for ongoing feature releases, CRO experimentation, and continuous improvements.
              </p>
              <div className="pt-2 text-xs font-bold text-black flex items-center gap-1.5">
                <RepeatIcon className="w-3.5 h-3.5 text-neutral-800 stroke-[2]" />
                <span>Continuous Evolution</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
