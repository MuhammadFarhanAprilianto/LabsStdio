"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/components/Footer";
import ThreeLiquidGlass from "@/components/ui/ThreeLiquidGlass";

// Kumpulan Semua Logo Brand dari Projects Completed For (Lengkap dengan Ikon Asli)
const allCompletedLogos = [
  {
    name: "BLANQS",
    element: (
      <div className="flex items-center gap-2 text-neutral-900 font-mono text-xl sm:text-2xl font-black tracking-[0.3em]">
        B L A N Q S
      </div>
    ),
  },
  {
    name: "Crecer.ai",
    element: (
      <div className="flex items-center gap-2 text-2xl sm:text-3xl font-black tracking-tight text-neutral-900">
        <span className="text-[#16a34a]">Crecer.</span>
        <span className="text-xs px-2 py-0.5 rounded-md bg-[#16a34a]/15 text-[#16a34a] border border-[#16a34a]/30 font-bold">
          ai
        </span>
      </div>
    ),
  },
  {
    name: "Berlitz",
    element: (
      <div className="text-2xl sm:text-3xl font-black tracking-tighter text-[#2563eb] italic">
        Berlitz
      </div>
    ),
  },
  {
    name: "FORTIFIED ROOFING",
    element: (
      <div className="px-3 py-1.5 border-2 border-neutral-700 bg-neutral-900 rounded-md text-center text-xs sm:text-sm font-black tracking-widest text-white uppercase shadow-sm">
        <div>FORTIFIED</div>
        <div className="text-[9px] text-neutral-400 tracking-[0.25em]">ROOFING</div>
      </div>
    ),
  },
  {
    name: "TeleTraining",
    element: (
      <div className="flex items-center gap-2 text-neutral-900 font-medium text-xl sm:text-2xl tracking-tight">
        <span className="w-6 h-6 rounded bg-[#0284c7] text-white text-xs font-black flex items-center justify-center shadow">
          TT
        </span>
        <span className="font-serif italic font-bold">TeleTraining</span>
      </div>
    ),
  },
  {
    name: "Stripe",
    element: (
      <div className="text-2xl sm:text-3xl font-black tracking-tight text-[#635bff]">
        stripe
      </div>
    ),
  },
  {
    name: "Vercel",
    element: (
      <div className="flex items-center gap-2 text-neutral-900 font-bold text-xl sm:text-2xl tracking-wide">
        <svg className="w-5 h-5 fill-black" viewBox="0 0 24 24">
          <path d="M12 2L2 19.7778H22L12 2Z" />
        </svg>
        <span>Vercel</span>
      </div>
    ),
  },
  {
    name: "Microsoft",
    element: (
      <div className="flex items-center gap-2.5 text-neutral-900 font-semibold text-xl sm:text-2xl tracking-tight">
        <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
          <div className="bg-[#f25022] w-2 h-2" />
          <div className="bg-[#7fba00] w-2 h-2" />
          <div className="bg-[#00a4ef] w-2 h-2" />
          <div className="bg-[#ffb900] w-2 h-2" />
        </div>
        <span className="text-neutral-900 font-medium">Microsoft</span>
      </div>
    ),
  },
  {
    name: "eCom Triage",
    element: (
      <div className="flex items-center gap-2 text-neutral-900 font-bold text-lg sm:text-xl">
        <div className="w-6 h-6 rounded-full border-2 border-red-500 flex items-center justify-center text-red-500 text-xs font-black">
          T
        </div>
        <span className="tracking-tight">eCom Triage</span>
      </div>
    ),
  },
  {
    name: "reviewinc",
    element: (
      <div className="flex items-center gap-1.5 text-neutral-900 font-bold text-xl sm:text-2xl tracking-tight">
        <span className="text-xl">📍</span>
        <span className="font-sans lowercase text-neutral-800">reviewinc</span>
      </div>
    ),
  },
  {
    name: "POWER SYNCH",
    element: (
      <div className="flex items-center gap-2 text-[#16a34a] font-black text-lg sm:text-xl tracking-wider">
        <span className="text-xl">⚡</span>
        <div className="leading-none text-left">
          <div className="text-[10px] text-neutral-500 tracking-widest font-normal">POWER</div>
          <div className="text-sm sm:text-base text-[#16a34a]">SYNCH</div>
        </div>
      </div>
    ),
  },
  {
    name: "Linear",
    element: (
      <div className="flex items-center gap-2 text-neutral-900 font-semibold text-xl sm:text-2xl tracking-tight">
        <svg className="w-5 h-5 fill-neutral-900" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
        </svg>
        <span className="font-mono">Linear</span>
      </div>
    ),
  },
  {
    name: "Figma",
    element: (
      <div className="flex items-center gap-2 text-neutral-900 font-bold text-xl sm:text-2xl tracking-tight">
        <div className="flex -space-x-1">
          <span className="w-3.5 h-3.5 rounded-full bg-[#f24e1e] inline-block" />
          <span className="w-3.5 h-3.5 rounded-full bg-[#a259ff] inline-block" />
          <span className="w-3.5 h-3.5 rounded-full bg-[#1abcfe] inline-block" />
        </div>
        <span>Figma</span>
      </div>
    ),
  },
  {
    name: "Cenario.ai",
    element: (
      <div className="flex items-center gap-2 text-neutral-900 font-medium text-xl sm:text-2xl tracking-tight">
        <div className="w-6 h-6 rounded-full border-2 border-neutral-700 flex items-center justify-center text-xs">
          🌐
        </div>
        <span>Cenario.ai</span>
      </div>
    ),
  },
  {
    name: "JUDYCO.",
    element: (
      <div className="text-xl sm:text-2xl font-black text-neutral-900 tracking-[0.25em] font-sans">
        JUDYCO.
      </div>
    ),
  },
  {
    name: "SQUIRE",
    element: (
      <div className="px-3 py-1 rounded-t-full bg-gradient-to-b from-blue-700 to-blue-900 border border-blue-400/50 text-center text-xs font-black text-amber-300 tracking-wider shadow">
        SQUIRE
      </div>
    ),
  },
  {
    name: "QORE LOGIQ",
    element: (
      <div className="flex items-center gap-1.5 text-neutral-900 font-bold text-lg sm:text-xl tracking-wider">
        <span className="text-cyan-600 text-xl">💠</span>
        <span className="text-neutral-800">QORE LOGIQ</span>
      </div>
    ),
  },
  {
    name: "ROMULUS LABS",
    element: (
      <div className="text-left font-black tracking-wider text-indigo-600 text-base sm:text-lg border-b-2 border-indigo-400/60 pb-0.5">
        ROMULUS <span className="text-xs text-neutral-600 font-normal">LABS</span>
      </div>
    ),
  },
  {
    name: "Supabase",
    element: (
      <div className="flex items-center gap-2 text-neutral-900 font-bold text-xl sm:text-2xl tracking-tight">
        <span className="text-[#16a34a] text-2xl">⚡</span>
        <span className="text-[#16a34a]">supabase</span>
      </div>
    ),
  },
  {
    name: "Raycast",
    element: (
      <div className="flex items-center gap-2 text-neutral-900 font-bold text-xl sm:text-2xl tracking-tight">
        <span className="text-[#ef4444] text-xl">🔴</span>
        <span>Raycast</span>
      </div>
    ),
  },
];

export default function AboutPage() {
  const stats = [
    { number: "200+", label: "Products Engineered", desc: "Delivered across 15+ industries worldwide" },
    { number: "$2B+", label: "Client Valuation Influenced", desc: "Capital raised by our partner founders" },
    { number: "98%", label: "Client Retention Rate", desc: "Long-term partnerships rooted in real ROI" },
    { number: "50+", label: "Global Specialists", desc: "Designers & engineers across worldwide timezones" },
  ];

  const corePrinciples = [
    {
      num: "01",
      title: "Obsessive Craft",
      desc: "We don't settle for 'good enough'. Every line of code, interaction gesture, and pixel is crafted to perfection.",
    },
    {
      num: "02",
      title: "Venture Speed",
      desc: "Speed is a feature. We eliminate unnecessary bureaucracy and move at agile sprint velocity from kickoff to deployment.",
    },
    {
      num: "03",
      title: "Radical Transparency",
      desc: "Direct communication with senior designers & architects. No junior handoffs, no opaque pricing, no surprises.",
    },
    {
      num: "04",
      title: "Engineering Integrity",
      desc: "Exceptional aesthetics backed by high-performance code, sub-second load times, and scalable architecture.",
    },
  ];

  const team = [
    {
      name: "Farhan Aprilianto",
      role: "Founder & Executive Creative Director",
      focus: "Product Strategy & Brand Systems",
      location: "Jakarta / Global",
    },
    {
      name: "Alex Thorne",
      role: "Head of Engineering",
      focus: "Next.js & WebGL 3D Architectures",
      location: "San Francisco, USA",
    },
    {
      name: "Elena Rostova",
      role: "Lead Product Designer",
      focus: "UI/UX & Interactive Design Systems",
      location: "London, UK",
    },
    {
      name: "Marcus Vance",
      role: "Principal Growth Strategist",
      focus: "Conversion Funnels & CRO Analytics",
      location: "Singapore",
    },
  ];

  // Interactive Culture Gallery Data
  const cultureGallery = [
    {
      id: "culture-1",
      col: 1,
      image: "/images/culture_1.jpg",
      title: "Venture-Grade Systems",
      role: "Full-Stack & WebGL Engineering",
      location: "San Francisco, USA",
      category: "Engineering",
    },
    {
      id: "culture-2",
      col: 2,
      image: "/images/culture_2.jpg",
      title: "Founder-Led Strategy",
      role: "Executive Product Architecture",
      location: "Jakarta, Indonesia",
      category: "Leadership",
    },
    {
      id: "culture-3",
      col: 3,
      image: "/images/culture_5.jpg",
      title: "Global Creative Sparks",
      role: "Brand Identity & Strategy",
      location: "London, UK",
      category: "Culture",
    },
    {
      id: "culture-4",
      col: 1,
      image: "/images/culture_3.jpg",
      title: "Team Worldwide Synergy",
      role: "Creative Summit",
      location: "Tokyo, Japan",
      category: "Culture",
    },
    {
      id: "culture-5",
      col: 2,
      image: "/images/culture_4.jpg",
      title: "High-Velocity Remote Sprints",
      role: "Global Sprint Sync",
      location: "Across 6 Timezones",
      category: "Engineering",
    },
    {
      id: "culture-6",
      col: 3,
      image: "/images/culture_6.jpg",
      title: "Crafting UI Micro-Moments",
      role: "Lead Product Designer",
      location: "Singapore",
      category: "Design",
    },
  ];

  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedCultureImage, setSelectedCultureImage] = useState<typeof cultureGallery[0] | null>(null);

  // Duplikasi logo array untuk animasi marquee tak terbatas (seamless infinite loop)
  const infiniteLogos = [...allCompletedLogos, ...allCompletedLogos, ...allCompletedLogos, ...allCompletedLogos];

  // Kata-kata untuk animasi Blur-to-Clear Staggered
  const headlineLine1 = ["We", "make", "complex", "products"];
  const headlineLine2 = ["feel", "effortless."];

  return (
    <main className="min-h-screen bg-white text-gray-900 font-['Questrial',sans-serif] pt-28 sm:pt-36 overflow-hidden">
      {/* Header Section: Rata Tengah Penuh Latar Putih (Clean White Centered Hero - Luas & Spacius) */}
      <section className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center justify-center pb-14 sm:pb-20">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(212,249,56,0.18)_0%,transparent_70%)] pointer-events-none" />

        <div className="space-y-6 flex flex-col items-center relative z-10 max-w-5xl mx-auto w-full">
          {/* Main Headline: Tepat 2 Baris Saja dengan Blur-to-Clear Upward Animation */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[72px] font-bold tracking-tight text-black leading-[1.12] text-center w-full">
            {/* Baris 1: We make complex products (1 Baris Utuh, Tebal) */}
            <span className="block overflow-hidden pb-1 font-bold text-black font-['Agrandir',sans-serif] whitespace-nowrap">
              {headlineLine1.map((word, index) => (
                <motion.span
                  key={index}
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

            {/* Baris 2: feel effortless. (1 Baris Utuh, Normal Weight) */}
            <span className="block overflow-hidden pt-1 font-normal text-neutral-400 font-['Questrial',sans-serif] whitespace-nowrap">
              {headlineLine2.map((word, index) => (
                <motion.span
                  key={index}
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

          {/* Subtitle Description: Lebih Luas ke Samping */}
          <motion.p
            initial={{ opacity: 0, y: 25, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="text-neutral-600 text-sm sm:text-base md:text-lg max-w-[920px] mx-auto leading-relaxed font-['Questrial',sans-serif] px-2 text-center"
          >
            We are a global UI/UX design and web development agency. We design websites, SaaS platforms, and mobile apps that people actually enjoy using, then build them into fast, scalable products that grow your business.
          </motion.p>

          {/* Call to Action Button: Interaksi Rolling Text Flip ke Atas (Sama seperti Hero Landing Page) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, filter: "blur(6px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.6, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="pt-2 font-['Questrial',sans-serif]"
          >
            <Link
              href="/contact"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-[#d4f938] px-6 sm:px-7 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold tracking-wide border border-[#c4eb28] shadow-[0_3px_15px_rgba(212,249,56,0.3)] transition-colors duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] hover:bg-[#111111] hover:border-black hover:shadow-[0_8px_25px_rgba(0,0,0,0.2)] active:scale-95"
            >
              {/* Layer 1: Teks & Ikon Hitam Awal (Meluncur keluar ke atas saat hover) */}
              <div className="flex items-center gap-2 text-black transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-[160%]">
                <svg
                  className="w-3.5 h-3.5 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
                <span>Book a Free Consultation</span>
              </div>

              {/* Layer 2: Teks & Ikon Hijau Neon (Meluncur masuk dari bawah ke tengah saat hover) */}
              <div className="absolute inset-0 flex items-center justify-center gap-2 text-[#d4f938] translate-y-[160%] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0">
                <svg
                  className="w-3.5 h-3.5 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
                <span>Book a Free Consultation</span>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Single-Row Marquee Logo Carousel (Muter dari Kanan ke Kiri Tanpa Henti) */}
      <section className="relative w-full py-6 pb-20 sm:pb-28 overflow-hidden select-none">
        {/* Edge gradient fade masks (Putih ke Transparan) di Kiri dan Kanan */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-36 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-36 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none" />

        {/* 1 Baris Tunggal: Bergerak Super Halus & Lambat dari Kanan ke Kiri */}
        <div className="flex overflow-hidden group">
          <div
            className="flex items-center gap-12 sm:gap-20 shrink-0 animate-marquee-left will-change-transform py-2 group-hover:[animation-play-state:paused]"
            style={{ animationDuration: "120s" }}
          >
            {infiniteLogos.map((item, idx) => (
              <div
                key={`logo-${idx}`}
                className="flex items-center justify-center shrink-0 min-w-[160px] sm:min-w-[190px] opacity-75 hover:opacity-100 hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                {item.element}
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* What Makes Us Different From Others Section (Clean White Background, Studio Fonts - Tanpa Garis Pembatas) */}
      <section className="w-full bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column: Heading & Key Differentiators (7 Cols) */}
            <div className="lg:col-span-7 space-y-10">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-black font-['Agrandir',sans-serif] tracking-tight leading-[1.08]">
                {/* Baris 1: What Makes Us */}
                <span className="block overflow-hidden pb-1">
                  {["What", "Makes", "Us"].map((word, index) => (
                    <motion.span
                      key={`diff-1-${index}`}
                      initial={{ opacity: 0, y: 40, filter: "blur(18px)" }}
                      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{
                        duration: 0.85,
                        delay: 0.1 + index * 0.08,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="inline-block mr-3 sm:mr-4 text-black"
                    >
                      {word}
                    </motion.span>
                  ))}
                </span>

                {/* Baris 2: Different From */}
                <span className="block overflow-hidden pb-1 pt-0.5">
                  {["Different", "From"].map((word, index) => (
                    <motion.span
                      key={`diff-2-${index}`}
                      initial={{ opacity: 0, y: 40, filter: "blur(18px)" }}
                      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{
                        duration: 0.85,
                        delay: 0.35 + index * 0.09,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="inline-block mr-3 sm:mr-4 text-black"
                    >
                      {word}
                    </motion.span>
                  ))}
                </span>

                {/* Baris 3: Others */}
                <span className="block overflow-hidden pt-0.5">
                  {["Others"].map((word, index) => (
                    <motion.span
                      key={`diff-3-${index}`}
                      initial={{ opacity: 0, y: 40, filter: "blur(18px)" }}
                      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{
                        duration: 0.85,
                        delay: 0.55 + index * 0.09,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="inline-block text-black"
                    >
                      {word}
                    </motion.span>
                  ))}
                </span>
              </h2>

              <div className="space-y-8 pt-4">
                {/* Differentiator 1 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="space-y-3 pb-8 border-b border-neutral-200"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#16a34a] shadow-[0_0_8px_rgba(22,163,74,0.6)]" />
                    <h3 className="text-xl sm:text-2xl font-bold text-black font-['Agrandir',sans-serif]">
                      Design Plus Development
                    </h3>
                  </div>
                  <p className="text-sm sm:text-base text-neutral-600 font-['Questrial',sans-serif] leading-relaxed pl-5">
                    Most agencies do one or the other. We handle design and development under one roof, so nothing gets lost between the mockup and the live, working site.
                  </p>
                </motion.div>

                {/* Differentiator 2 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="space-y-3 pb-8 border-b border-neutral-200"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#16a34a] shadow-[0_0_8px_rgba(22,163,74,0.6)]" />
                    <h3 className="text-xl sm:text-2xl font-bold text-black font-['Agrandir',sans-serif]">
                      Founder-Led Expertise
                    </h3>
                  </div>
                  <p className="text-sm sm:text-base text-neutral-600 font-['Questrial',sans-serif] leading-relaxed pl-5">
                    Every project is guided by 25+ years of hands-on UI/UX and web development experience, never handed off to juniors learning on your budget.
                  </p>
                </motion.div>

                {/* Differentiator 3 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#16a34a] shadow-[0_0_8px_rgba(22,163,74,0.6)]" />
                    <h3 className="text-xl sm:text-2xl font-bold text-black font-['Agrandir',sans-serif]">
                      Speed Without Shortcuts
                    </h3>
                  </div>
                  <p className="text-sm sm:text-base text-neutral-600 font-['Questrial',sans-serif] leading-relaxed pl-5">
                    We move at venture velocity with rigorous code standards, ensuring your product launches fast while remaining scalable for enterprise growth.
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Right Column: Dedicated 3D Liquid Glass Centerpiece (5 Cols - Sejajar Sempurna ke Bawah) */}
            <div className="lg:col-span-5 h-full flex flex-col">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full h-full min-h-[480px] lg:min-h-[580px] rounded-3xl bg-gradient-to-b from-[#0e1017] via-[#08090c] to-black p-6 border border-neutral-800 shadow-2xl overflow-hidden flex flex-col items-center justify-center"
              >
                {/* Ambient Radial Color Glows */}
                <div className="absolute top-0 right-1/4 w-56 h-56 bg-[radial-gradient(circle,rgba(212,249,56,0.2)_0%,transparent_70%)] pointer-events-none" />
                <div className="absolute bottom-0 left-1/4 w-56 h-56 bg-[radial-gradient(circle,rgba(6,182,212,0.2)_0%,transparent_70%)] pointer-events-none" />

                {/* 3D WebGL Liquid Glass Canvas */}
                <div className="w-full h-full relative z-10 flex items-center justify-center flex-1">
                  <ThreeLiquidGlass />
                </div>

                {/* Ambient Glass Tag Badge */}
                <div className="absolute bottom-6 left-6 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-neutral-300 font-['Agrandir',sans-serif]">
                  <span className="w-2 h-2 rounded-full bg-[#d4f938] animate-pulse" />
                  <span>Interactive Liquid Glass 3D</span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Full-Width Mission & Vision Row (Glassmorphic Cards seperti Navbar - Tanpa Garis Pembatas) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 pt-6 sm:pt-8 mt-6 sm:mt-8">
            {/* Mission Card (Frosted Light Glassmorphic Card) */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative overflow-hidden rounded-[32px] bg-white/70 backdrop-blur-xl backdrop-saturate-150 border border-white/80 ring-1 ring-black/[0.06] shadow-[0_20px_45px_-12px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.03),inset_0_1.5px_1.5px_rgba(255,255,255,0.9),inset_0_-1px_1.5px_rgba(0,0,0,0.04)] p-8 sm:p-10 space-y-4 flex flex-col justify-between"
            >
              {/* Specular Ambient Light Flare */}
              <div
                className="absolute inset-0 rounded-[32px] pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255, 255, 255, 0.85), transparent 70%)",
                }}
              />

              <div className="relative z-10 space-y-3.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900/5 border border-neutral-900/10 text-xs font-bold text-neutral-700 uppercase tracking-widest font-['Agrandir',sans-serif]">
                  <span className="w-1.5 h-1.5 rounded-full bg-black" />
                  <span>MISSION</span>
                </div>
                <p className="text-base sm:text-lg text-neutral-900 font-medium font-['Questrial',sans-serif] leading-relaxed">
                  To help growing brands turn great ideas into digital products that are genuinely easy to use and built to scale. We design and build websites, SaaS platforms, and mobile apps that drive real growth and revenue for businesses worldwide.
                </p>
              </div>
            </motion.div>

            {/* Vision Card (Frosted Dark Glassmorphic Card dengan Glowing Accent) */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="relative overflow-hidden rounded-[32px] bg-[#0c0d12]/90 backdrop-blur-xl backdrop-saturate-150 border border-white/15 ring-1 ring-white/[0.1] shadow-[0_20px_45px_-12px_rgba(0,0,0,0.4),inset_0_1.5px_1.5px_rgba(255,255,255,0.2),inset_0_-1px_1.5px_rgba(0,0,0,0.2)] p-8 sm:p-10 space-y-4 flex flex-col justify-between text-white"
            >
              {/* Specular Ambient Radial Light Flare */}
              <div
                className="absolute inset-0 rounded-[32px] pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212, 249, 56, 0.12), transparent 70%)",
                }}
              />
              <div className="absolute top-0 right-0 w-36 h-36 bg-[radial-gradient(circle,rgba(212,249,56,0.18)_0%,transparent_70%)] pointer-events-none" />

              <div className="relative z-10 space-y-3.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-[#d4f938] uppercase tracking-widest font-['Agrandir',sans-serif]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4f938]" />
                  <span>VISION</span>
                </div>
                <p className="text-base sm:text-lg text-neutral-200 font-normal font-['Questrial',sans-serif] leading-relaxed">
                  To be the global benchmark for venture-grade digital experiences, proving that extraordinary aesthetics and high-performance engineering can live together effortlessly.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Brands Choose Us Section (Clean White Background, Studio Fonts, Blur-to-Clear Animation) */}
      <section className="w-full bg-white py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 space-y-16">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <h2 className="text-3xl sm:text-5xl lg:text-[54px] font-black text-black font-['Agrandir',sans-serif] tracking-tight leading-[1.15]">
              {/* Baris 1: Why brands choose Labs Stdio for */}
              <span className="block overflow-hidden pb-1">
                {["Why", "brands", "choose", "Labs", "Stdio", "for"].map((word, index) => (
                  <motion.span
                    key={`choose-1-${index}`}
                    initial={{ opacity: 0, y: 40, filter: "blur(18px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{
                      duration: 0.85,
                      delay: 0.1 + index * 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="inline-block mr-2.5 sm:mr-3.5 text-black"
                  >
                    {word}
                  </motion.span>
                ))}
              </span>

              {/* Baris 2: design & development? */}
              <span className="block overflow-hidden pt-0.5">
                {["design", "&", "development?"].map((word, index) => (
                  <motion.span
                    key={`choose-2-${index}`}
                    initial={{ opacity: 0, y: 40, filter: "blur(18px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{
                      duration: 0.85,
                      delay: 0.55 + index * 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="inline-block mr-2.5 sm:mr-3.5 text-black"
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
            </h2>
          </div>

          {/* 6 Interactive Reason Metric Cards (Grid 3 Kolom x 2 Baris - Warna Putih Bersih) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Card 1: 200+ Projects delivered */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -6 }}
              className="rounded-3xl bg-white text-black p-7 sm:p-8 border border-neutral-200/90 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] flex flex-col justify-between space-y-6 group hover:border-neutral-300 hover:shadow-[0_20px_45px_-12px_rgba(0,0,0,0.1)] transition-all duration-300 relative overflow-hidden"
            >
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-black text-black font-['Agrandir',sans-serif] tracking-tight">
                  200+
                </div>
                <div className="text-xs sm:text-sm font-medium text-neutral-500 font-['Questrial',sans-serif]">
                  Projects delivered
                </div>
              </div>

              {/* Interactive Graphic 1: Clean Project Box & Rocket */}
              <div className="h-36 sm:h-40 flex items-center justify-center relative my-2">
                <div className="relative w-32 h-24 rounded-2xl bg-neutral-50 border border-neutral-200 p-2.5 flex flex-col justify-between shadow-inner group-hover:border-[#16a34a]/50 transition-colors">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#16a34a]/10 text-[#16a34a] font-mono font-bold">
                      Projects
                    </span>
                    <span className="text-xs text-neutral-400">+</span>
                  </div>
                  {/* Cursor Arrow */}
                  <motion.div
                    animate={{ x: [0, 4, 0], y: [0, -3, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                    className="w-3.5 h-3.5 border-t-2 border-l-2 border-[#16a34a] rotate-45 self-center"
                  />
                  {/* Floating Rocket Badge */}
                  <motion.div
                    animate={{ y: [-2, 2, -2] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-sm shadow-md"
                  >
                    🚀
                  </motion.div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-neutral-600 font-['Questrial',sans-serif] leading-relaxed">
                From landing pages to full SaaS platforms, we ship work that looks sharp and performs.
              </p>
            </motion.div>

            {/* Card 2: 50+ Team members worldwide */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -6 }}
              className="rounded-3xl bg-white text-black p-7 sm:p-8 border border-neutral-200/90 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] flex flex-col justify-between space-y-6 group hover:border-neutral-300 hover:shadow-[0_20px_45px_-12px_rgba(0,0,0,0.1)] transition-all duration-300 relative overflow-hidden"
            >
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-black text-black font-['Agrandir',sans-serif] tracking-tight">
                  50+
                </div>
                <div className="text-xs sm:text-sm font-medium text-neutral-500 font-['Questrial',sans-serif]">
                  Team members worldwide
                </div>
              </div>

              {/* Interactive Graphic 2: Orbiting Global Crew */}
              <div className="h-36 sm:h-40 flex items-center justify-center relative my-2">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  {/* Orbit Ring */}
                  <div className="absolute inset-0 rounded-full border border-neutral-200 group-hover:border-[#16a34a]/40 transition-colors" />
                  
                  {/* Glowing Center Globe */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                    className="w-12 h-12 rounded-full bg-[#16a34a]/15 border border-[#16a34a]/30 flex items-center justify-center shadow-sm"
                  >
                    <span className="text-lg">🌍</span>
                  </motion.div>

                  {/* Orbiting Avatar 1 */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                    className="absolute inset-0 flex items-start justify-center"
                  >
                    <span className="w-6 h-6 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-[10px] -translate-y-3 shadow-sm">
                      👩‍💻
                    </span>
                  </motion.div>

                  {/* Orbiting Avatar 2 */}
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                    className="absolute inset-0 flex items-end justify-center"
                  >
                    <span className="w-6 h-6 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-[10px] translate-y-3 shadow-sm">
                      👨‍🎨
                    </span>
                  </motion.div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-neutral-600 font-['Questrial',sans-serif] leading-relaxed">
                We started as a small team and grew into a global crew working across time zones.
              </p>
            </motion.div>

            {/* Card 3: 5.0 Clutch rating */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ y: -6 }}
              className="rounded-3xl bg-white text-black p-7 sm:p-8 border border-neutral-200/90 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] flex flex-col justify-between space-y-6 group hover:border-neutral-300 hover:shadow-[0_20px_45px_-12px_rgba(0,0,0,0.1)] transition-all duration-300 relative overflow-hidden"
            >
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-black text-black font-['Agrandir',sans-serif] tracking-tight">
                  5.0
                </div>
                <div className="text-xs sm:text-sm font-medium text-neutral-500 font-['Questrial',sans-serif]">
                  Clutch rating
                </div>
              </div>

              {/* Interactive Graphic 3: Laptop with A+ Grade */}
              <div className="h-36 sm:h-40 flex items-center justify-center relative my-2">
                <div className="relative w-36 h-24 rounded-xl bg-neutral-50 border border-neutral-200 p-3 flex items-center justify-between shadow-inner group-hover:border-[#16a34a]/40 transition-colors">
                  {/* Floating Orb with Briefcase */}
                  <div className="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-xs shadow-sm">
                    💼
                  </div>
                  {/* A+ Rating Stamp */}
                  <div className="text-right space-y-0.5">
                    <span className="text-lg font-black text-[#16a34a] font-['Agrandir',sans-serif]">
                      A+
                    </span>
                    <div className="w-8 h-1 bg-neutral-200 rounded-full" />
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-neutral-600 font-['Questrial',sans-serif] leading-relaxed">
                Most clients do not leave, and the ones who review us on Clutch tell you exactly why.
              </p>
            </motion.div>

            {/* Card 4: 15+ Industries served */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ y: -6 }}
              className="rounded-3xl bg-white text-black p-7 sm:p-8 border border-neutral-200/90 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] flex flex-col justify-between space-y-6 group hover:border-neutral-300 hover:shadow-[0_20px_45px_-12px_rgba(0,0,0,0.1)] transition-all duration-300 relative overflow-hidden"
            >
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-black text-black font-['Agrandir',sans-serif] tracking-tight">
                  15+
                </div>
                <div className="text-xs sm:text-sm font-medium text-neutral-500 font-['Questrial',sans-serif]">
                  Industries served
                </div>
              </div>

              {/* Interactive Graphic 4: Funnel with Floating Spheres */}
              <div className="h-36 sm:h-40 flex items-center justify-center relative my-2">
                <div className="relative w-36 h-28 flex flex-col items-center justify-center">
                  {/* Floating Icons */}
                  <div className="flex gap-2 mb-2">
                    <motion.span
                      animate={{ y: [-3, 3, -3] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                      className="w-6 h-6 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-[10px] shadow-sm"
                    >
                      ☁️
                    </motion.span>
                    <motion.span
                      animate={{ y: [3, -3, 3] }}
                      transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                      className="w-6 h-6 rounded-full bg-white border border-[#16a34a]/40 flex items-center justify-center text-[10px] shadow-sm"
                    >
                      💳
                    </motion.span>
                    <motion.span
                      animate={{ y: [-2, 2, -2] }}
                      transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
                      className="w-6 h-6 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-[10px] shadow-sm"
                    >
                      🏥
                    </motion.span>
                  </div>
                  {/* Funnel Outline */}
                  <div className="w-24 h-10 border-b-2 border-l-2 border-r-2 border-neutral-300 rounded-b-full opacity-70" />
                </div>
              </div>

              <p className="text-xs sm:text-sm text-neutral-600 font-['Questrial',sans-serif] leading-relaxed">
                Fintech, SaaS, healthcare, e-commerce, and more. We adapt to your domain, not the other way around.
              </p>
            </motion.div>

            {/* Card 5: 25+ Years of expertise */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              whileHover={{ y: -6 }}
              className="rounded-3xl bg-white text-black p-7 sm:p-8 border border-neutral-200/90 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] flex flex-col justify-between space-y-6 group hover:border-neutral-300 hover:shadow-[0_20px_45px_-12px_rgba(0,0,0,0.1)] transition-all duration-300 relative overflow-hidden"
            >
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-black text-black font-['Agrandir',sans-serif] tracking-tight">
                  25+
                </div>
                <div className="text-xs sm:text-sm font-medium text-neutral-500 font-['Questrial',sans-serif]">
                  Years of expertise
                </div>
              </div>

              {/* Interactive Graphic 5: Laptop with 5 Golden Stars */}
              <div className="h-36 sm:h-40 flex items-center justify-center relative my-2">
                <div className="relative w-36 h-24 rounded-xl bg-neutral-50 border border-neutral-200 p-3 flex flex-col justify-between shadow-inner group-hover:border-[#16a34a]/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-neutral-500">🔍</span>
                    <span className="w-2 h-2 rounded-full bg-[#16a34a] animate-ping" />
                  </div>
                  {/* 5 Stars */}
                  <div className="flex items-center gap-1 text-amber-500 text-xs">
                    {"★★★★★".split("").map((star, i) => (
                      <span key={i}>{star}</span>
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-neutral-600 font-['Questrial',sans-serif] leading-relaxed">
                Our founder brings more than 25 years in UI/UX and web development to every build.
              </p>
            </motion.div>

            {/* Card 6: 100+ Brands served */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              whileHover={{ y: -6 }}
              className="rounded-3xl bg-white text-black p-7 sm:p-8 border border-neutral-200/90 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] flex flex-col justify-between space-y-6 group hover:border-neutral-300 hover:shadow-[0_20px_45px_-12px_rgba(0,0,0,0.1)] transition-all duration-300 relative overflow-hidden"
            >
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-black text-black font-['Agrandir',sans-serif] tracking-tight">
                  100+
                </div>
                <div className="text-xs sm:text-sm font-medium text-neutral-500 font-['Questrial',sans-serif]">
                  Brands served
                </div>
              </div>

              {/* Interactive Graphic 6: Stacked UI Cards with Checkmarks */}
              <div className="h-36 sm:h-40 flex items-center justify-center relative my-2">
                <div className="space-y-1.5 w-32">
                  <div className="h-4 rounded-md bg-neutral-100 border border-neutral-200 w-3/4 mx-auto" />
                  <div className="h-6 rounded-lg bg-neutral-50 border border-[#16a34a]/40 flex items-center justify-between px-2.5 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-neutral-400" />
                    <span className="text-[#16a34a] text-xs font-bold">✓</span>
                  </div>
                  <div className="h-4 rounded-md bg-neutral-100 border border-neutral-200 w-full" />
                </div>
              </div>

              <p className="text-xs sm:text-sm text-neutral-600 font-['Questrial',sans-serif] leading-relaxed">
                Behind every product we build is a real person using it. That is what good design is for.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Meet the Minds Behind the MAGIC from Around the World Section (Dark Black Background) */}
      <section className="w-full bg-[#050507] text-white py-28 sm:py-36 relative overflow-hidden border-t border-neutral-900">
        {/* Ambient Subtle Radial Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(212,249,56,0.06)_0%,transparent_70%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 space-y-14 relative z-10">
          {/* Centered Heading with Blur-to-Clear Word Animation */}
          <div className="max-w-4xl mx-auto text-center space-y-5">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white font-['Agrandir',sans-serif] tracking-tight leading-[1.12]">
              {/* Baris 1: Meet the minds behind */}
              <span className="block overflow-hidden pb-1">
                {["Meet", "the", "minds", "behind"].map((word, index) => (
                  <motion.span
                    key={`minds-1-${index}`}
                    initial={{ opacity: 0, y: 40, filter: "blur(18px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{
                      duration: 0.85,
                      delay: 0.1 + index * 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="inline-block mr-2.5 sm:mr-3.5 text-white"
                  >
                    {word}
                  </motion.span>
                ))}
              </span>

              {/* Baris 2: the MAGIC from around the world! */}
              <span className="block overflow-hidden pt-0.5">
                {["the", "MAGIC", "from", "around", "the", "world!"].map((word, index) => (
                  <motion.span
                    key={`minds-2-${index}`}
                    initial={{ opacity: 0, y: 40, filter: "blur(18px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{
                      duration: 0.85,
                      delay: 0.45 + index * 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={`inline-block mr-2.5 sm:mr-3.5 ${
                      word === "MAGIC"
                        ? "text-[#d4f938] font-black tracking-wider drop-shadow-[0_0_25px_rgba(212,249,56,0.4)]"
                        : "text-white"
                    }`}
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
            </h2>

            {/* Subtitle Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.65 }}
              className="text-neutral-400 text-sm sm:text-base md:text-lg max-w-3xl mx-auto leading-relaxed font-['Questrial',sans-serif]"
            >
              A powerhouse team of UI UX & brand identity designers, strategists, and web developers working remotely to create digital experiences that make an impact.
            </motion.p>

            {/* Interactive Category Filter Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.75 }}
              className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-2"
            >
              {["All", "Design", "Engineering", "Leadership", "Culture"].map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveFilter(category)}
                  className={`px-5 py-2 rounded-full text-xs sm:text-sm font-medium font-['Questrial',sans-serif] transition-all duration-300 ${
                    activeFilter === category
                      ? "bg-[#d4f938] text-black font-bold shadow-[0_0_15px_rgba(212,249,56,0.35)] scale-105"
                      : "bg-neutral-900/90 text-neutral-400 border border-neutral-800 hover:text-white hover:border-neutral-700"
                  }`}
                >
                  {category}
                </button>
              ))}
            </motion.div>
          </div>

          {/* 3-Column Bento Masonry Photo Grid: Hitam Putih ke Berwarna Saat Hover Tanpa Zoom & Tanpa Teks Overlay */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7 items-start">
            {/* Column 1 */}
            <div className="space-y-6 sm:space-y-7 flex flex-col">
              {/* Item 1: Multi-Monitor Dev Workspace */}
              <motion.div
                layout
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                onClick={() => setSelectedCultureImage(cultureGallery[0])}
                className={`relative rounded-3xl overflow-hidden border border-neutral-800/80 bg-neutral-900 group cursor-pointer shadow-2xl transition-all duration-500 ${
                  activeFilter !== "All" && cultureGallery[0].category !== activeFilter
                    ? "opacity-30 scale-95"
                    : "opacity-100"
                }`}
              >
                <div className="relative w-full h-[260px] sm:h-[300px]">
                  <Image
                    src={cultureGallery[0].image}
                    alt={cultureGallery[0].title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                  />
                </div>
              </motion.div>

              {/* Item 4: Global Team Outdoors */}
              <motion.div
                layout
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                onClick={() => setSelectedCultureImage(cultureGallery[3])}
                className={`relative rounded-3xl overflow-hidden border border-neutral-800/80 bg-neutral-900 group cursor-pointer shadow-2xl transition-all duration-500 ${
                  activeFilter !== "All" && cultureGallery[3].category !== activeFilter
                    ? "opacity-30 scale-95"
                    : "opacity-100"
                }`}
              >
                <div className="relative w-full h-[360px] sm:h-[420px]">
                  <Image
                    src={cultureGallery[3].image}
                    alt={cultureGallery[3].title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                  />
                </div>
              </motion.div>
            </div>

            {/* Column 2 */}
            <div className="space-y-6 sm:space-y-7 flex flex-col">
              {/* Item 2: Founder at Laptop in Lounge */}
              <motion.div
                layout
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                onClick={() => setSelectedCultureImage(cultureGallery[1])}
                className={`relative rounded-3xl overflow-hidden border border-neutral-800/80 bg-neutral-900 group cursor-pointer shadow-2xl transition-all duration-500 ${
                  activeFilter !== "All" && cultureGallery[1].category !== activeFilter
                    ? "opacity-30 scale-95"
                    : "opacity-100"
                }`}
              >
                <div className="relative w-full h-[360px] sm:h-[420px]">
                  <Image
                    src={cultureGallery[1].image}
                    alt={cultureGallery[1].title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                  />
                </div>
              </motion.div>

              {/* Item 5: Remote Meeting Screen POV */}
              <motion.div
                layout
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.25 }}
                onClick={() => setSelectedCultureImage(cultureGallery[4])}
                className={`relative rounded-3xl overflow-hidden border border-neutral-800/80 bg-neutral-900 group cursor-pointer shadow-2xl transition-all duration-500 ${
                  activeFilter !== "All" && cultureGallery[4].category !== activeFilter
                    ? "opacity-30 scale-95"
                    : "opacity-100"
                }`}
              >
                <div className="relative w-full h-[260px] sm:h-[300px]">
                  <Image
                    src={cultureGallery[4].image}
                    alt={cultureGallery[4].title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                  />
                </div>
              </motion.div>
            </div>

            {/* Column 3 */}
            <div className="space-y-6 sm:space-y-7 flex flex-col">
              {/* Item 3: Colleagues Outdoor Hangout */}
              <motion.div
                layout
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
                onClick={() => setSelectedCultureImage(cultureGallery[2])}
                className={`relative rounded-3xl overflow-hidden border border-neutral-800/80 bg-neutral-900 group cursor-pointer shadow-2xl transition-all duration-500 ${
                  activeFilter !== "All" && cultureGallery[2].category !== activeFilter
                    ? "opacity-30 scale-95"
                    : "opacity-100"
                }`}
              >
                <div className="relative w-full h-[260px] sm:h-[300px]">
                  <Image
                    src={cultureGallery[2].image}
                    alt={cultureGallery[2].title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                  />
                </div>
              </motion.div>

              {/* Item 6: Designer Sketching in Cafe */}
              <motion.div
                layout
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                onClick={() => setSelectedCultureImage(cultureGallery[5])}
                className={`relative rounded-3xl overflow-hidden border border-neutral-800/80 bg-neutral-900 group cursor-pointer shadow-2xl transition-all duration-500 ${
                  activeFilter !== "All" && cultureGallery[5].category !== activeFilter
                    ? "opacity-30 scale-95"
                    : "opacity-100"
                }`}
              >
                <div className="relative w-full h-[360px] sm:h-[420px]">
                  <Image
                    src={cultureGallery[5].image}
                    alt={cultureGallery[5].title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Fullscreen Interactive Lightbox Modal */}
        <AnimatePresence>
          {selectedCultureImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCultureImage(null)}
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 cursor-zoom-out"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-4xl w-full bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl cursor-default"
              >
                <div className="relative w-full h-[380px] sm:h-[500px]">
                  <Image
                    src={selectedCultureImage.image}
                    alt={selectedCultureImage.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-neutral-950">
                  <div>
                    <span className="text-xs font-bold text-[#d4f938] uppercase tracking-widest">
                      {selectedCultureImage.category} • {selectedCultureImage.location}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white font-['Agrandir',sans-serif]">
                      {selectedCultureImage.title}
                    </h3>
                    <p className="text-sm text-neutral-400 font-['Questrial',sans-serif]">
                      {selectedCultureImage.role}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedCultureImage(null)}
                    className="px-6 py-2.5 rounded-full bg-white text-black font-bold text-sm hover:bg-[#d4f938] transition-colors"
                  >
                    Close Preview
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
