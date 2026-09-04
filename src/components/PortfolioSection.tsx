"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectItem {
  id: string;
  title: string;
  category: string;
  description: string;
  badge: string;
  image?: string;
  bgGradient: string;
}

const categories = [
  "All",
  "Website Design",
  "Web Development",
  "UI/UX Design",
  "WordPress",
  "Mobile App",
  "SaaS",
];

const sampleProjects: ProjectItem[] = [
  {
    id: "project-1",
    title: "NexusPay Corporate Web",
    category: "Website Design",
    description:
      "High-converting corporate website and digital banking showcase engineered for seamless user onboarding.",
    badge: "Next.js",
    image: "/images/DigitalPay.webp",
    bgGradient: "from-emerald-950 via-slate-900 to-black",
  },
  {
    id: "project-2",
    title: "UserPath Platform Redesign",
    category: "UI/UX Design",
    description:
      "Complete UI/UX design overhaul and scalable design system for an enterprise conversion analytics suite.",
    badge: "Figma",
    image: "/images/UserPath.webp",
    bgGradient: "from-rose-950 via-slate-900 to-black",
  },
  {
    id: "project-3",
    title: "Zenith Cloud SaaS Workspace",
    category: "SaaS",
    description:
      "Full-stack SaaS web application enabling teams to track real-time revenue analytics and automated funnels.",
    badge: "React",
    image: "/images/Revenue.webp",
    bgGradient: "from-blue-950 via-slate-900 to-black",
  },
  {
    id: "project-4",
    title: "Lumina Telehealth Web & App",
    category: "Mobile App",
    description:
      "Modern patient care booking portal and mobile interface with instant physician scheduling.",
    badge: "Mobile",
    image: "/images/Mobile Health.webp",
    bgGradient: "from-amber-950 via-slate-900 to-black",
  },
  {
    id: "project-5",
    title: "Nordic Atelier Headless CMS",
    category: "WordPress",
    description:
      "Custom headless WordPress architecture paired with a high-speed Next.js frontend for an architectural brand.",
    badge: "WordPress",
    image: "/images/WordPressHeadlessCMS.webp",
    bgGradient: "from-cyan-950 via-slate-900 to-black",
  },
  {
    id: "project-6",
    title: "Apex Creative Web Platform",
    category: "Web Development",
    description:
      "High-performance custom web platform featuring smooth scroll physics, interactive 3D elements, and modern SEO.",
    badge: "Next.js",
    image: "/images/WebDesignLandingPages.webp",
    bgGradient: "from-violet-950 via-slate-900 to-black",
  },
  {
    id: "project-7",
    title: "HYRO Commerce Storefront",
    category: "Website Design",
    description:
      "Custom e-commerce storefront with optimized checkout flows and 3.4x conversion uplift.",
    badge: "Shopify",
    image: "/images/ShopifyECommerce.webp",
    bgGradient: "from-amber-950 via-slate-900 to-black",
  },
  {
    id: "project-8",
    title: "Pulse Financial Mobile Interface",
    category: "Mobile App",
    description:
      "Frictionless mobile banking experience with biometric security and real-time transaction tracking.",
    badge: "iOS / Android",
    image: "/images/MobileAppInterfaceDesign.webp",
    bgGradient: "from-indigo-950 via-slate-900 to-black",
  },
  {
    id: "project-9",
    title: "FinFlow Multi-Platform Design",
    category: "UI/UX Design",
    description:
      "Cross-device design system and cohesive component library for a multinational fintech organization.",
    badge: "Figma",
    image: "/images/UIUXDigitalProduct.webp",
    bgGradient: "from-purple-950 via-slate-900 to-black",
  },
  {
    id: "project-10",
    title: "Cognitive AI Enterprise Cloud",
    category: "SaaS",
    description:
      "Scalable Next.js dashboard with interactive telemetry charts and automated machine learning pipelines.",
    badge: "Next.js",
    image: "/images/Photo 1.webp",
    bgGradient: "from-slate-950 via-blue-950 to-black",
  },
  {
    id: "project-11",
    title: "Kanso Minimalist Architecture",
    category: "WordPress",
    description:
      "Bespoke headless WordPress editorial publication with instant page caching and responsive gallery layouts.",
    badge: "WordPress",
    image: "/images/BrandingCreativeDesign.webp",
    bgGradient: "from-stone-950 via-slate-900 to-black",
  },
  {
    id: "project-12",
    title: "Veloce Interactive Studio Web",
    category: "Web Development",
    description:
      "Full-stack agency showcase web application engineered with custom WebGL shaders and sub-second loading speed.",
    badge: "WebGL / React",
    image: "/images/DigitalMarketingGrowth.webp",
    bgGradient: "from-zinc-950 via-neutral-900 to-black",
  },
  {
    id: "project-13",
    title: "Mixxup Real Estate Premier",
    category: "Website Design",
    description:
      "Editorial property listings & immersive architectural showcase designed for a modern luxury brokerage.",
    badge: "Next.js",
    image: "/images/WebDesain3.webp",
    bgGradient: "from-stone-950 via-neutral-900 to-black",
  },
  {
    id: "project-14",
    title: "Freto 3D Studio Showcase",
    category: "Website Design",
    description:
      "Dynamic 3D creative studio portfolio featuring immersive typography and WebGL visual interactions.",
    badge: "WebGL / UI",
    image: "/images/WebDesign4.webp",
    bgGradient: "from-orange-950 via-neutral-900 to-black",
  },
  {
    id: "project-15",
    title: "AeroCase Hardware Platform",
    category: "Web Development",
    description:
      "Interactive product launch platform engineered with high-performance WebGL 3D model configurators.",
    badge: "Next.js / 3D",
    image: "/images/WebDev3.webp",
    bgGradient: "from-red-950 via-neutral-900 to-black",
  },
  {
    id: "project-16",
    title: "Diziver Digital Experience",
    category: "Web Development",
    description:
      "High-velocity web application with fluid micro-interactions, custom API integrations, and sub-second TTFB.",
    badge: "React / Node",
    image: "/images/WebDev4.webp",
    bgGradient: "from-sky-950 via-slate-900 to-black",
  },
  {
    id: "project-17",
    title: "Veri Health Biometrics UI",
    category: "UI/UX Design",
    description:
      "Futuristic metabolic health tracking interface with neon gradient telemetry and tactile micro-interactions.",
    badge: "Figma / UI",
    image: "/images/UI1.webp",
    bgGradient: "from-pink-950 via-purple-950 to-black",
  },
  {
    id: "project-18",
    title: "Mobbin Design Systems Library",
    category: "UI/UX Design",
    description:
      "Comprehensive design curation workspace and component library showcasing multi-platform digital patterns.",
    badge: "Design System",
    image: "/images/UI2.webp",
    bgGradient: "from-slate-900 via-neutral-900 to-black",
  },
  {
    id: "project-19",
    title: "Monza Digital Banking Portal",
    category: "WordPress",
    description:
      "High-performance enterprise WordPress platform powered by GraphQL API and dynamic Gutenberg blocks.",
    badge: "Headless CMS",
    image: "/images/WP3.webp",
    bgGradient: "from-orange-950 via-slate-900 to-black",
  },
  {
    id: "project-20",
    title: "Sorélle Brand & Media CMS",
    category: "WordPress",
    description:
      "Bespoke editorial publication platform with advanced media asset workflows and multi-author management.",
    badge: "Custom Theme",
    image: "/images/WP4.webp",
    bgGradient: "from-amber-950 via-neutral-900 to-black",
  },
  {
    id: "project-21",
    title: "Valta Smart Banking App",
    category: "Mobile App",
    description:
      "Intelligent personal finance mobile application with AI-powered spending analytics and instant payments.",
    badge: "iOS / Swift",
    image: "/images/MAPP3.webp",
    bgGradient: "from-slate-900 via-neutral-900 to-black",
  },
  {
    id: "project-22",
    title: "Marchon Athletics Performance App",
    category: "Mobile App",
    description:
      "High-performance marathon & fitness training tracker with real-time biometric pace algorithms.",
    badge: "React Native",
    image: "/images/MAPP4.webp",
    bgGradient: "from-stone-950 via-neutral-900 to-black",
  },
  {
    id: "project-23",
    title: "AeuxGlobal Climate SaaS",
    category: "SaaS",
    description:
      "Environmental telemetry dashboard tracking industrial carbon offsets and real-time sensor analytics.",
    badge: "SaaS Analytics",
    image: "/images/SaaS3.webp",
    bgGradient: "from-emerald-950 via-slate-900 to-black",
  },
  {
    id: "project-24",
    title: "BlueRock Invoicing Workspace",
    category: "SaaS",
    description:
      "Enterprise billing and automated invoice tracking platform designed with high-contrast dark surfaces.",
    badge: "Next.js / Node",
    image: "/images/SaaS4.webp",
    bgGradient: "from-neutral-950 via-slate-950 to-black",
  },
];

// Sub-komponen Kartu Proyek dengan Custom Cursor Lingkaran (Kursor bawaan disembunyikan total)
function ProjectCard({ project }: { project: ProjectItem }) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      /* cursor-none menyembunyikan kursor tangan/panah bawaan OS sehingga hanya bulatan yang terlihat */
      className="group relative w-full aspect-[16/11] sm:aspect-[16/10] rounded-[28px] sm:rounded-[32px] overflow-hidden bg-neutral-950 border border-neutral-800/80 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-none flex flex-col justify-end p-6 sm:p-8"
    >
      {/* Background Image / Gradient */}
      {project.image ? (
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover object-center opacity-85 group-hover:opacity-100 grayscale contrast-105 group-hover:grayscale-0 group-hover:contrast-100 transition-all duration-700 ease-out"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      ) : (
        <div
          className={`absolute inset-0 bg-gradient-to-br ${project.bgGradient} opacity-90`}
        />
      )}

      {/* Dark Vignette Overlay for Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/15 pointer-events-none" />

      {/* Floating Neon Lime Cursor "See Full Project ↗" Menggantikan Kursor Bawaan */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            style={{
              left: mousePos.x,
              top: mousePos.y,
              translateX: "-50%",
              translateY: "-50%",
            }}
            className="pointer-events-none absolute z-30 flex h-28 w-28 sm:h-32 sm:w-32 flex-col items-center justify-center rounded-full bg-[#d4f938] text-black shadow-2xl shadow-black/60 border border-[#c4eb28]"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 mb-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
            <span className="text-center font-['Agrandir',sans-serif] text-[11px] sm:text-xs font-bold leading-tight uppercase tracking-tight">
              See Full
              <br />
              Project
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Bottom-Left Content */}
      <div className="relative z-20 space-y-3 max-w-md pointer-events-none select-none">
        {/* Badge Icon & Category Pill */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/90 shadow-md flex items-center justify-center">
            <div className="flex -space-x-0.5 scale-75">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f24e1e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#a259ff]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#1abcfe]" />
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white/90 text-xs font-semibold tracking-wide font-['Questrial',sans-serif]">
            {project.category}
          </span>
        </div>

        {/* Project Title (Font: Agrandir) */}
        <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-['Agrandir',sans-serif]">
          {project.title}
        </h3>

        {/* Project Description */}
        <p className="text-xs sm:text-sm text-neutral-300 font-['Questrial',sans-serif] leading-relaxed font-light">
          {project.description}
        </p>
      </div>
    </div>
  );
}

export default function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects =
    activeCategory === "All"
      ? sampleProjects.slice(0, 4)
      : sampleProjects.filter(
        (p) => p.category.toLowerCase() === activeCategory.toLowerCase()
      );

  return (
    <section className="relative w-full bg-white text-gray-900 py-24 sm:py-32 px-6 sm:px-12 lg:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
        {/* Section Heading: Our portfolio (Font: Agrandir) */}
        <div className="text-center space-y-3">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-black font-['Agrandir',sans-serif]">
            Our Portfolio
          </h2>
        </div>

        {/* Filter Tabs / Pills: 4 on Top Row, 3 on Bottom Row */}
        <div className="flex flex-col items-center gap-2.5 sm:gap-3 font-['Questrial',sans-serif]">
          {[
            ["All", "Website Design", "Web Development", "UI/UX Design"],
            ["WordPress", "Mobile App", "SaaS"],
          ].map((row, rowIdx) => (
            <div key={rowIdx} className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
              {row.map((cat) => {
                const isActive = activeCategory === cat;

                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`group relative inline-flex items-center justify-center overflow-hidden rounded-full px-5 sm:px-6 py-2.5 text-xs sm:text-sm font-medium tracking-wide transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] cursor-pointer active:scale-95 border ${
                      isActive
                        ? "bg-[#d4f938] text-black border-[#c4eb28] shadow-sm"
                        : "bg-white text-neutral-800 border-neutral-300/80 hover:bg-[#111111] hover:border-black hover:shadow-md"
                    }`}
                  >
                    {/* Teks Layer 1 */}
                    <div
                      className={`transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                        isActive
                          ? "text-black"
                          : "text-neutral-800 group-hover:-translate-y-[160%]"
                      }`}
                    >
                      {cat}
                    </div>

                    {/* Teks Layer 2: Neon Lime */}
                    {!isActive && (
                      <div className="absolute inset-0 flex items-center justify-center text-[#d4f938] translate-y-[160%] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0">
                        {cat}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Grid Kartu Portofolio (2 Kolom) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 pt-2">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
