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
    title: "HexPay Cards",
    category: "Website Design",
    description:
      "Where users can use their Virtual & Disposable Cards with scalable digital payments.",
    badge: "Figma",
    image: "/images/DigitalPay.webp",
    bgGradient: "from-emerald-950 via-slate-900 to-black",
  },
  {
    id: "project-2",
    title: "Userpath",
    category: "UI/UX Design",
    description:
      "We redesigned an agency site with high-velocity UI/UX, helping marketers automate and convert.",
    badge: "Figma",
    image: "/images/UserPath.webp",
    bgGradient: "from-rose-950 via-slate-900 to-black",
  },
  {
    id: "project-3",
    title: "Zenith SaaS Platform",
    category: "SaaS",
    description:
      "Full-stack analytics workspace enabling teams to track real-time revenue and growth funnels.",
    badge: "Next.js",
    image: "/images/Revenue.webp",
    bgGradient: "from-blue-950 via-slate-900 to-black",
  },
  {
    id: "project-4",
    title: "Lumina Mobile Health",
    category: "Mobile App",
    description:
      "Empowering therapy & counseling with interactive booking and personalized patient care journeys.",
    badge: "Mobile",
    image: "/images/Mobile Health.webp",
    bgGradient: "from-amber-950 via-slate-900 to-black",
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
            className="object-cover object-top opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      ) : (
        <div
          className={`absolute inset-0 bg-gradient-to-br ${project.bgGradient} opacity-90 transition-transform duration-700 ease-out group-hover:scale-105`}
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
        {/* Badge Icon (Figma / Tech) */}
        <div className="w-8 h-8 rounded-lg bg-white/90 shadow-md flex items-center justify-center">
          <div className="flex -space-x-0.5 scale-75">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f24e1e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#a259ff]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#1abcfe]" />
          </div>
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
      ? sampleProjects
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

        {/* Filter Tabs / Pills dengan Rolling Flip & Neon Lime Hover */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 font-['Questrial',sans-serif]">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`group relative inline-flex items-center justify-center overflow-hidden rounded-full px-5 sm:px-6 py-2.5 text-xs sm:text-sm font-medium tracking-wide transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] cursor-pointer active:scale-95 border ${isActive
                    ? "bg-[#d4f938] text-black border-[#c4eb28] shadow-sm"
                    : "bg-white text-neutral-800 border-neutral-300/80 hover:bg-[#111111] hover:border-black hover:shadow-md"
                  }`}
              >
                {/* Teks Layer 1 (Meluncur ke atas saat hover jika tab tidak aktif) */}
                <div
                  className={`transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${isActive
                      ? "text-black"
                      : "text-neutral-800 group-hover:-translate-y-[160%]"
                    }`}
                >
                  {cat}
                </div>

                {/* Teks Layer 2: Neon Lime (Meluncur masuk saat hover jika tab tidak aktif) */}
                {!isActive && (
                  <div className="absolute inset-0 flex items-center justify-center text-[#d4f938] translate-y-[160%] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0">
                    {cat}
                  </div>
                )}
              </button>
            );
          })}
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
