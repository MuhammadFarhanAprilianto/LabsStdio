"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/components/Footer";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  categories: string[];
  readTime: string;
  date: string;
  author: {
    name: string;
    role: string;
  };
  featured?: boolean;
}

const blogPosts: BlogPost[] = [
  {
    id: "post-1",
    slug: "10-best-design-agencies-in-toronto-to-hire",
    title: "10 Best Design Agencies in Toronto to Hire",
    excerpt:
      "The 10 best design agencies in Toronto in 2026 include six2eight, Brand Vision, Orizon Design, and other firms recognized for their expertise in branding, UX/UI, web design, and digital transformation.",
    image: "/images/blog_1.jpg",
    categories: ["UI/UX Design", "Website Design"],
    readTime: "6 min read",
    date: "June 2026",
    author: {
      name: "Marcus Vance",
      role: "Lead Product Designer",
    },
    featured: true,
  },
  {
    id: "post-2",
    slug: "ai-tokens-explained-cost-context-and-performance",
    title: "AI Tokens Explained: Cost, Context, and Performance (2026)",
    excerpt:
      "AI tokens are the small building blocks that models like GPT, Claude, and Gemini use to process and generate text. Tokens are subword pieces, not fixed characters or words, and their pricing dictates model economics.",
    image: "/images/blog_2.jpg",
    categories: ["UI/UX Design", "SaaS"],
    readTime: "5 min read",
    date: "May 2026",
    author: {
      name: "Elena Rostova",
      role: "AI Architecture Lead",
    },
  },
  {
    id: "post-3",
    slug: "figma-config-2026-every-major-announcement",
    title: "Figma Config 2026: Every Major Announcement You Need to Know",
    excerpt:
      "Figma Config 2026 introduced some of the biggest updates Figma has ever released, and if you use it every day, these changes are going to affect how you design, prototype, and build scalable design systems.",
    image: "/images/blog_3.jpg",
    categories: ["UI/UX Design", "Website Design"],
    readTime: "8 min read",
    date: "May 2026",
    author: {
      name: "Sarah Jenkins",
      role: "Design Systems Specialist",
    },
  },
  {
    id: "post-4",
    slug: "nextjs-16-turbopack-production-readiness",
    title: "Next.js 16 & Turbopack: Building Ultra-Fast Web Applications",
    excerpt:
      "How we achieve sub-second page transitions, dynamic server rendering, and zero-runtime CSS in high-traffic enterprise platforms.",
    image: "/images/UIUXDigitalProduct.webp",
    categories: ["Web Development", "SaaS"],
    readTime: "7 min read",
    date: "April 2026",
    author: {
      name: "David Chen",
      role: "Principal Engineer",
    },
  },
  {
    id: "post-5",
    slug: "modern-brand-identity-rules-for-saas",
    title: "The New Rules of Brand Identity for Venture-Backed SaaS",
    excerpt:
      "Why traditional corporate branding fails in modern software products, and how typography-driven design systems build instant trust.",
    image: "/images/BrandingCreativeDesign.webp",
    categories: ["SaaS", "Website Design"],
    readTime: "4 min read",
    date: "April 2026",
    author: {
      name: "Farhan Aprilianto",
      role: "Founder & Creative Director",
    },
  },
  {
    id: "post-6",
    slug: "micro-interactions-and-physics-based-animation",
    title: "The Science of Micro-Interactions: Physics-Based UI Animation",
    excerpt:
      "Crafting delightful micro-animations with spring physics and GPU-accelerated shaders that elevate user retention without hurting performance.",
    image: "/images/DigitalMarketingGrowth.webp",
    categories: ["Mobile App", "UI/UX Design"],
    readTime: "6 min read",
    date: "March 2026",
    author: {
      name: "Marcus Vance",
      role: "Lead Product Designer",
    },
  },
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<BlogPost | null>(null);

  // Filter posts based on category and search query
  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory =
      activeCategory === "All" || post.categories.includes(activeCategory);
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Featured and secondary posts for the main bento layout (matching screenshot)
  const featuredPost = blogPosts[0];
  const secondaryPosts = [blogPosts[1], blogPosts[2]];
  const additionalPosts = filteredPosts.filter(
    (p) => p.id !== featuredPost.id && !secondaryPosts.some((sp) => sp.id === p.id)
  );

  // Headline words for Blur-to-Clear animation
  const headlineLine1 = ["Insights", "&", "creative"];
  const headlineLine2 = ["thinking."];

  return (
    <main className="min-h-screen bg-white text-gray-900 font-['Questrial',sans-serif] pt-28 sm:pt-36 overflow-hidden">
      {/* Hero Section: Centered Clean White Layout */}
      <section className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center justify-center pb-12 sm:pb-16">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(212,249,56,0.18)_0%,transparent_70%)] pointer-events-none" />

        <div className="space-y-6 flex flex-col items-center relative z-10 max-w-5xl mx-auto w-full">
          {/* Main Headline: Tepat 2 Baris Saja dengan Blur-to-Clear Upward Animation */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[72px] font-bold tracking-tight text-black leading-[1.12] text-center w-full">
            {/* Baris 1: Insights & creative (Tebal) */}
            <span className="block overflow-hidden pb-1 font-bold text-black font-['Agrandir',sans-serif] whitespace-nowrap">
              {headlineLine1.map((word, index) => (
                <motion.span
                  key={`blog-1-${index}`}
                  initial={{ opacity: 0, y: 45, filter: "blur(18px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.85,
                    delay: 0.15 + index * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="inline-block mx-1 sm:mx-1.5 md:mx-2 text-black"
                >
                  {word}
                </motion.span>
              ))}
            </span>

            {/* Baris 2: thinking. (Normal Weight, Abu-abu Elegan) */}
            <span className="block overflow-hidden pt-1 font-normal text-neutral-400 font-['Questrial',sans-serif] whitespace-nowrap">
              {headlineLine2.map((word, index) => (
                <motion.span
                  key={`blog-2-${index}`}
                  initial={{ opacity: 0, y: 45, filter: "blur(18px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.85,
                    delay: 0.45 + index * 0.09,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="inline-block mx-1 sm:mx-1.5 md:mx-2 text-neutral-400 font-normal"
                >
                  {word}
                </motion.span>
              ))}
            </span>
          </h1>

          {/* Subtitle Description */}
          <motion.p
            initial={{ opacity: 0, y: 25, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="text-neutral-600 text-sm sm:text-base md:text-lg max-w-[920px] mx-auto leading-relaxed font-['Questrial',sans-serif] px-2 text-center"
          >
            Deep-dives into digital product design, web engineering, AI interfaces, and proven growth strategies from our studio craft.
          </motion.p>
        </div>
      </section>

      {/* Filter Tabs & Search Bar */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pb-12">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
          {/* Category Filter Pills dengan Interaksi Rolling Text Flip & Style Sesuai Gambar 1 */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {[
              "All",
              "Website Design",
              "Web Development",
              "UI/UX Design",
              "Mobile App",
              "SaaS",
            ].map((tab) => {
              const isActive = activeCategory === tab;
              const isAllActive = isActive && tab === "All";
              const isOtherActive = isActive && tab !== "All";

              return (
                <button
                  key={tab}
                  onClick={() => setActiveCategory(tab)}
                  className={`group relative inline-flex items-center justify-center overflow-hidden rounded-full px-5 py-2.5 text-xs sm:text-sm font-medium tracking-wide transition-all duration-300 cursor-pointer ${
                    isAllActive
                      ? "bg-[#d4f938] text-black font-bold border border-[#c4eb28] shadow-[0_3px_15px_rgba(212,249,56,0.4)]"
                      : isOtherActive
                      ? "bg-[#111111] text-[#d4f938] font-bold border border-black shadow-md"
                      : "bg-white text-neutral-700 border border-neutral-200/90 shadow-sm hover:border-neutral-900 hover:bg-[#111111]"
                  }`}
                >
                  {/* Kondisi Jika Sedang Aktif: Teks Tetap Stabil */}
                  {isActive ? (
                    <span className={isAllActive ? "text-black" : "text-[#d4f938]"}>
                      {tab}
                    </span>
                  ) : (
                    /* Kondisi Inaktif: Rolling Text Flip ke Atas saat Hover */
                    <div className="relative overflow-hidden h-4 sm:h-5 flex flex-col justify-center font-['Questrial',sans-serif]">
                      {/* Layer 1: Teks Abu/Hitam Normal (Meluncur keluar ke atas saat hover) */}
                      <span className="block transform transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full text-neutral-700">
                        {tab}
                      </span>
                      {/* Layer 2: Teks Hijau Neon (Meluncur masuk dari bawah ke tengah saat hover) */}
                      <span className="absolute top-0 left-0 block transform translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0 text-[#d4f938] font-semibold">
                        {tab}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Interactive Search Input */}
          <div className="relative min-w-[240px] sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full px-4 py-2.5 pl-10 rounded-full bg-neutral-100/90 border border-neutral-200 text-xs sm:text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-colors font-['Questrial',sans-serif]"
            />
            <svg
              className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>
      </section>

      {/* Main Bento Layout (Persis Sesuai Gambar User) */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pb-20">
        {/* Bento Grid 2 Kolom: Kiri (1 Besar) & Kanan (2 Baris) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Kolom Kiri: Featured Big Article Card (7 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            data-cursor="read"
            onClick={() => setSelectedArticle(featuredPost)}
            className="lg:col-span-6 xl:col-span-6 flex flex-col space-y-5 group cursor-pointer"
          >
            {/* Big Thumbnail Container */}
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden bg-neutral-950 border border-neutral-800 shadow-xl">
              <Image
                src={featuredPost.image}
                alt={featuredPost.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>

            {/* Content Details */}
            <div className="space-y-3 pt-1">
              {/* Category Badges */}
              <div className="flex flex-wrap items-center gap-2">
                {featuredPost.categories.map((cat, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full border border-neutral-300 text-[11px] font-medium text-neutral-600 bg-white font-['Questrial',sans-serif]"
                  >
                    {cat}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-black font-['Agrandir',sans-serif] tracking-tight leading-snug group-hover:text-[#84c405] transition-colors">
                {featuredPost.title}
              </h2>

              {/* Excerpt */}
              <p className="text-xs sm:text-sm text-neutral-600 font-['Questrial',sans-serif] leading-relaxed line-clamp-3">
                {featuredPost.excerpt}
              </p>
            </div>
          </motion.div>

          {/* Kolom Kanan: 2 Secondary Horizontal Cards (6 Cols) */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col space-y-8">
            {secondaryPosts.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 * (idx + 1) }}
                data-cursor="read"
                onClick={() => setSelectedArticle(post)}
                className="flex flex-col sm:flex-row items-start gap-5 sm:gap-6 group cursor-pointer"
              >
                {/* Square Rounded Thumbnail */}
                <div className="relative w-full sm:w-44 sm:h-44 md:w-48 md:h-48 shrink-0 aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-950 border border-neutral-800 shadow-md">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 200px"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>

                {/* Content Container */}
                <div className="space-y-2 flex-1 pt-1">
                  {/* Category Pill */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {post.categories.map((cat, catIdx) => (
                      <span
                        key={catIdx}
                        className="px-2.5 py-0.5 rounded-full border border-neutral-300 text-[11px] font-medium text-neutral-600 bg-white font-['Questrial',sans-serif]"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-bold text-black font-['Agrandir',sans-serif] tracking-tight leading-snug group-hover:text-[#84c405] transition-colors">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-xs sm:text-sm text-neutral-600 font-['Questrial',sans-serif] leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Articles Grid (Jika ada lebih banyak artikel atau hasil filter) */}
      {additionalPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pb-24 border-t border-neutral-200 pt-16">
          <div className="space-y-2 pb-8">
            <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest font-['Agrandir',sans-serif]">
              More Publications
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-black font-['Agrandir',sans-serif]">
              Latest Architecture & Engineering Reads
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {additionalPosts.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                onClick={() => setSelectedArticle(post)}
                className="group flex flex-col space-y-4 cursor-pointer"
              >
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-200 shadow-sm">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-[#84c405] font-['Agrandir',sans-serif]">
                      {post.categories.join(" • ")}
                    </span>
                    <span className="text-neutral-300 text-xs">•</span>
                    <span className="text-xs text-neutral-400 font-['Questrial',sans-serif]">{post.readTime}</span>
                  </div>
                  <h4 className="text-lg font-bold text-black font-['Agrandir',sans-serif] group-hover:text-[#84c405] transition-colors leading-snug">
                    {post.title}
                  </h4>
                  <p className="text-xs text-neutral-600 font-['Questrial',sans-serif] leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Interactive Article Detail Lightbox Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedArticle(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl cursor-default max-h-[90vh] flex flex-col border border-neutral-200"
            >
              {/* Header Image */}
              <div className="relative w-full h-64 sm:h-80 shrink-0 bg-neutral-950">
                <Image
                  src={selectedArticle.image}
                  alt={selectedArticle.title}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Body Content */}
              <div className="p-8 sm:p-10 space-y-6 overflow-y-auto">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {selectedArticle.categories.map((c, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full bg-neutral-100 text-xs font-semibold text-neutral-700"
                      >
                        {c}
                      </span>
                    ))}
                    <span className="text-xs text-neutral-400">
                      {selectedArticle.readTime} • {selectedArticle.date}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-black font-['Agrandir',sans-serif] leading-snug">
                    {selectedArticle.title}
                  </h2>

                  <div className="text-xs text-neutral-500 font-['Questrial',sans-serif] flex items-center gap-2 pt-1 border-b border-neutral-100 pb-4">
                    <span>Written by <strong>{selectedArticle.author.name}</strong> ({selectedArticle.author.role})</span>
                  </div>
                </div>

                <div className="space-y-4 text-sm sm:text-base text-neutral-700 font-['Questrial',sans-serif] leading-relaxed">
                  <p>{selectedArticle.excerpt}</p>
                  <p>
                    In the fast-moving landscape of 2026 digital product development, precision in UX craft and software architecture separates market leaders from also-rans. By structuring robust design tokens, automated CI/CD design pipelines, and zero-runtime CSS layouts, creative agencies and product studios are able to ship venture-grade platforms in days rather than months.
                  </p>
                  <p>
                    At Labs Stdio, our philosophy centres on removing unnecessary friction between creative ideation and technical execution. Every micro-interaction is engineered with physics-based springs and GPU-optimized rendering to guarantee maximum conversion and user delight.
                  </p>
                </div>

                <div className="pt-6 border-t border-neutral-100 flex items-center justify-between">
                  <Link
                    href="/contact"
                    className="px-6 py-3 rounded-full bg-[#d4f938] hover:bg-[#c8f219] text-black font-bold text-xs sm:text-sm font-['Questrial',sans-serif] transition-all shadow-md"
                  >
                    Discuss Your Project With Us
                  </Link>
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="text-xs font-semibold text-neutral-500 hover:text-black transition-colors"
                  >
                    Close Article
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <Footer />
    </main>
  );
}
