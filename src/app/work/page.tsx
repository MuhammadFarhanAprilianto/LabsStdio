"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/components/Footer";
import SoundWaveVisualizer from "@/components/ui/SoundWaveVisualizer";

const testimonials = [
  {
    initial: "C",
    image: "/images/Orang 01.webp",
    company: "Core & More",
    quote: "15 years in business and I rarely say this, but this team nailed it.",
    feedback: "Issues were fixed fast, and the work was solid. Will definitely reach out for the next project.",
    rating: 5,
    happyCount: "200+ happy Customers based on complement and customer reviews",
  },
  {
    initial: "B",
    image: "/images/Orang 02.webp",
    company: "BLANQS Tech",
    quote: "Labs Stdio completely transformed our product UX and engineering velocity.",
    feedback: "Our user retention spiked by +240% within the first 60 days of rolling out the new design system.",
    rating: 5,
    happyCount: "50+ enterprise product rollouts and active workflows",
  },
  {
    initial: "H",
    image: "/images/Orang 03.webp",
    company: "HYRO Athletics",
    quote: "Sub-second speed and a checkout experience that converts like crazy.",
    feedback: "Direct-to-consumer sales grew 3.4x in Q1 following the headless Shopify launch.",
    rating: 5,
    happyCount: "100k+ active athletes and shoppers served seamlessly",
  },
  {
    initial: "F",
    image: "/images/Orang 04.webp",
    company: "Fortified Capital",
    quote: "Institutional data visualization crafted with meticulous precision.",
    feedback: "Managing over $850M in assets on this platform with zero downtime and exceptional client satisfaction.",
    rating: 5,
    happyCount: "$850M+ in institutional assets managed globally",
  },
];

const serviceOptions = [
  "UI/UX Design",
  "Web Development",
  "Full-Stack SaaS Platform",
  "Brand & Visual Identity",
  "Mobile App (iOS / Android)",
];

export default function WorkPage() {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Form & Testimonial States
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [fullName, setFullName] = useState("");
  const [selectedService, setSelectedService] = useState("UI/UX Design");
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);
  const serviceDropdownRef = useRef<HTMLDivElement>(null);

  const [email, setEmail] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("$10k to 20k");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        serviceDropdownRef.current &&
        !serviceDropdownRef.current.contains(event.target as Node)
      ) {
        setIsServiceDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto cycle testimonials every 3.5 seconds with reset on user click
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [activeTestimonial]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFullName("");
      setEmail("");
      setAdditionalInfo("");
    }, 4000);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Kata-kata headline untuk animasi Blur-to-Clear Staggered persis seperti AboutPage
  const headlineLine1 = ["Work", "that", "defines"];
  const headlineLine2 = ["industry", "standards."];

  return (
    <main className="min-h-screen bg-white text-gray-900 font-['Questrial',sans-serif] pt-28 sm:pt-36 overflow-hidden">
      {/* Hero Section: Centered Clean White Layout */}
      <section className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center justify-center pb-12 sm:pb-16">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(212,249,56,0.18)_0%,transparent_70%)] pointer-events-none" />

        <div className="space-y-6 flex flex-col items-center relative z-10 max-w-5xl mx-auto w-full">
          {/* Main Headline: Tepat 2 Baris Saja dengan Blur-to-Clear Upward Animation */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[72px] font-bold tracking-tight text-black leading-[1.12] text-center w-full">
            {/* Baris 1: Work that defines (Tebal) */}
            <span className="block overflow-hidden pb-1 font-bold text-black font-['Agrandir',sans-serif] whitespace-nowrap">
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

            {/* Baris 2: industry standards. (Abu-abu / Muted Elegan) */}
            <span className="block overflow-hidden font-bold text-neutral-400 font-['Agrandir',sans-serif] whitespace-nowrap">
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

          {/* Subtitle Description */}
          <motion.p
            initial={{ opacity: 0, y: 25, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="text-neutral-600 text-sm sm:text-base md:text-lg max-w-[920px] mx-auto leading-relaxed font-['Questrial',sans-serif] px-2 text-center"
          >
            We design and build award-winning websites, high-conversion SaaS platforms, and bespoke mobile apps for high-growth startups and global enterprise leaders worldwide.
          </motion.p>

          {/* Call to Action Button: Interaksi Rolling Text Flip Hijau Neon Sesuai Gambar (Compact Scale) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, filter: "blur(6px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="pt-2 flex items-center justify-center font-['Questrial',sans-serif]"
          >
            <Link
              href="#project-inquiry"
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

      {/* Featured Video Showcase Section (Video02.webm) */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pb-16 sm:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full rounded-[32px] sm:rounded-[44px] overflow-hidden bg-neutral-950 border border-neutral-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] group"
        >
          {/* Main Video Element */}
          <div className="relative w-full aspect-video sm:aspect-[16/9] lg:aspect-[21/9] overflow-hidden bg-neutral-900 flex items-center justify-center">
            <video
              ref={videoRef}
              src="/videos/Video02.webm"
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover select-none"
            />

            {/* Ambient Glass Overlay Controls at Bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

            {/* Video Header Badge */}
            <div className="absolute top-6 left-6 sm:top-8 sm:left-8 flex items-center gap-3 z-10 pointer-events-auto">
              <div className="px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-white flex items-center gap-2 font-['Agrandir',sans-serif]">
                <span className="w-2 h-2 rounded-full bg-[#d4f938] animate-pulse" />
                <span>Showreel & Digital Craft</span>
              </div>
            </div>

            {/* Neon Lime Audio/Mute Toggle Button dengan Rolling Flip Transition Sesuai Desain Showcase Video */}
            <button
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute audio" : "Mute audio"}
              title={isMuted ? "Unmute audio" : "Mute audio"}
              className={`group/btn absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-30 inline-flex h-13 w-13 sm:h-15 sm:w-15 items-center justify-center overflow-hidden rounded-full bg-[#d4f938] border border-[#c4eb28] shadow-xl shadow-black/40 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] hover:bg-[#111111] hover:border-black hover:shadow-2xl active:scale-90 cursor-pointer ${
                !isMuted ? "ring-4 ring-[#d4f938]/40 scale-105 shadow-[#d4f938]/30" : ""
              }`}
            >
              {/* Layer 1: Icon Hitam Awal (Meluncur keluar ke atas saat hover) */}
              <div className="flex items-center justify-center text-black transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover/btn:-translate-y-[160%]">
                <SoundWaveVisualizer isPlaying={!isMuted} />
              </div>

              {/* Layer 2: Icon Hijau Neon (Meluncur masuk dari bawah ke tengah saat hover) */}
              <div className="absolute inset-0 flex items-center justify-center text-[#d4f938] translate-y-[160%] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover/btn:translate-y-0">
                <SoundWaveVisualizer isPlaying={!isMuted} />
              </div>
            </button>
          </div>
        </motion.div>
      </section>

      {/* Featured Deep-Dive Case Study Section */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pb-20">
        <div className="space-y-4 pb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-black font-['Agrandir',sans-serif] tracking-tight">
              Blanqs AI Platform Redesign
            </h2>
            <Link
              href="/work/blanqs-ai"
              data-cursor="view"
              className="inline-flex items-center gap-2 text-xs font-bold text-black hover:text-[#16a34a] font-['Questrial',sans-serif] uppercase tracking-wider transition-colors"
            >
              <span>Explore Interactive Case Study</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        <Link
          href="/work/blanqs-ai"
          data-cursor="view"
          className="group block relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-[32px] sm:rounded-[40px] overflow-hidden bg-neutral-950 border border-neutral-800 shadow-2xl"
        >
          <Image
            src="/images/Photo 1.webp"
            alt="Blanqs AI Case Study"
            fill
            sizes="100vw"
            quality={95}
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-8 sm:p-12 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#d4f938] text-black text-xs font-bold font-['Agrandir',sans-serif]">
                +240% Retention
              </span>
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold">
                SaaS & AI Infrastructure
              </span>
            </div>
            <h3 className="text-xl sm:text-3xl font-bold text-white font-['Agrandir',sans-serif] group-hover:text-[#d4f938] transition-colors">
              Reimagining Venture-Grade Analytics for 100K+ Active Users
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 font-['Questrial',sans-serif] max-w-2xl line-clamp-2">
              Discover how we overhauled user retention with dark glassmorphism surfaces, interactive charts, and sub-second Next.js Turbopack pipelines.
            </p>
          </div>
        </Link>
      </section>

      {/* Interactive Project Inquiry & Testimonial Dual Bento Card (Persis Sesuai Gambar 2) */}
      <section id="project-inquiry" className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pb-28 sm:pb-36 scroll-mt-28">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[36px] sm:rounded-[44px] bg-white border border-neutral-200/90 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.08)] overflow-hidden grid grid-cols-1 lg:grid-cols-12"
        >
          {/* Kolom Kiri (Testimonial Slider & Social Proof) */}
          <div className="lg:col-span-5 bg-[#fbfbfb] p-8 sm:p-12 lg:p-14 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-neutral-200/80 relative">
            <div className="space-y-8">
              {/* Client Tag Pill */}
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-neutral-200 bg-neutral-100 shadow-sm shrink-0">
                  <Image
                    src={testimonials[activeTestimonial].image}
                    alt={testimonials[activeTestimonial].company}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-xs sm:text-sm font-medium text-neutral-500 font-['Questrial',sans-serif]">
                  {testimonials[activeTestimonial].company}
                </span>
              </div>

              {/* Animated Testimonial Text */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-4"
                >
                  <h3 className="text-2xl sm:text-3xl lg:text-[32px] font-black text-black font-['Agrandir',sans-serif] leading-snug tracking-tight">
                    &ldquo;{testimonials[activeTestimonial].quote}&rdquo;
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-500 font-['Questrial',sans-serif] leading-relaxed">
                    {testimonials[activeTestimonial].feedback}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Client Company Branding Badge & Avatar Photo */}
              <div className="flex items-center gap-3 pt-2">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-neutral-200 shadow-sm shrink-0 bg-neutral-100">
                  <Image
                    src={testimonials[activeTestimonial].image}
                    alt={testimonials[activeTestimonial].company}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="font-bold text-sm text-black font-['Agrandir',sans-serif]">
                    {testimonials[activeTestimonial].company}
                  </div>
                </div>
              </div>
            </div>

            {/* Social Proof & Rating Footer */}
            <div className="pt-10 sm:pt-14 space-y-6">
              <div className="space-y-2">
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-black text-sm">
                  {"★".repeat(testimonials[activeTestimonial].rating)}
                </div>
                <p className="text-xs text-neutral-500 font-['Questrial',sans-serif]">
                  {testimonials[activeTestimonial].happyCount}
                </p>
              </div>

              {/* Interactive 4-Segment Animated Loading Progress Bar Indicator */}
              <div className="flex items-center gap-2 pt-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTestimonial(idx)}
                    className="flex-1 h-1.5 rounded-full bg-neutral-200/90 overflow-hidden cursor-pointer relative"
                    aria-label={`Testimonial slide ${idx + 1}`}
                  >
                    {activeTestimonial === idx ? (
                      <motion.div
                        key={`progress-${activeTestimonial}`}
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 3.5, ease: "linear" }}
                        className="h-full bg-[#d4f938] shadow-[0_0_10px_rgba(212,249,56,0.9)] rounded-full"
                      />
                    ) : (
                      <div
                        className={`h-full transition-all duration-300 rounded-full ${
                          idx < activeTestimonial ? "bg-[#d4f938]/70 w-full" : "w-0"
                        }`}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Kolom Kanan (Interactive Project Inquiry Form) */}
          <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14 space-y-7 bg-white">
            {/* Header Badge & Title */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 text-white text-xs font-semibold font-['Questrial',sans-serif]">
                <span className="w-2 h-2 rounded-full bg-[#d4f938] animate-pulse" />
                <span>Get in Touch</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-black text-black font-['Agrandir',sans-serif] tracking-tight">
                Let&apos;s Talk About Your Project
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 font-['Questrial',sans-serif]">
                Tell us what you&apos;re building. We design and build high-quality digital products globally.
              </p>
            </div>

            {/* Interactive Form Fields */}
            <form onSubmit={handleFormSubmit} className="space-y-5">
              {/* Row 1: Name + Services Dropdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-700 font-['Questrial',sans-serif]">
                    Hi, I&apos;m
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full px-4 py-3 rounded-2xl bg-neutral-100/90 border border-neutral-200/80 text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-colors font-['Questrial',sans-serif]"
                  />
                </div>

                <div className="space-y-1.5 relative" ref={serviceDropdownRef}>
                  <label className="text-xs font-semibold text-neutral-700 font-['Questrial',sans-serif]">
                    I need help with
                  </label>
                  <div className="relative">
                    {/* Custom Trigger Button */}
                    <button
                      type="button"
                      onClick={() => setIsServiceDropdownOpen(!isServiceDropdownOpen)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-neutral-100/90 border text-sm text-black transition-all duration-300 font-['Questrial',sans-serif] cursor-pointer ${
                        isServiceDropdownOpen
                          ? "border-black bg-white shadow-md ring-2 ring-[#d4f938]/60"
                          : "border-neutral-200/80 hover:border-neutral-400 hover:bg-white"
                      }`}
                    >
                      <span className="font-medium text-neutral-900">{selectedService}</span>
                      <svg
                        className={`w-4 h-4 transition-transform duration-300 ${
                          isServiceDropdownOpen ? "rotate-180 text-black" : "text-neutral-500"
                        }`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>

                    {/* Animated Dropdown Menu dengan Hover Kuning Stabilo (#d4f938) */}
                    <AnimatePresence>
                      {isServiceDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -6, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -6, scale: 0.98 }}
                          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 rounded-2xl bg-white border border-neutral-200 shadow-[0_20px_45px_rgba(0,0,0,0.14)] p-1.5 space-y-1 overflow-hidden"
                        >
                          {serviceOptions.map((option) => {
                            const isSelected = selectedService === option;
                            return (
                              <button
                                key={option}
                                type="button"
                                onClick={() => {
                                  setSelectedService(option);
                                  setIsServiceDropdownOpen(false);
                                }}
                                className={`group w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-xs sm:text-sm font-medium font-['Questrial',sans-serif] transition-all duration-200 cursor-pointer ${
                                  isSelected
                                    ? "bg-black text-[#d4f938] font-bold shadow-sm"
                                    : "bg-transparent text-neutral-600 hover:bg-transparent hover:text-black hover:font-bold"
                                }`}
                              >
                                <span className="transition-all duration-200 group-hover:translate-x-0.5">
                                  {option}
                                </span>
                                {isSelected ? (
                                  <span className="text-[#d4f938] font-black text-xs">✓</span>
                                ) : (
                                  <span className="opacity-0 group-hover:opacity-100 text-black transition-all duration-200 text-xs font-bold -translate-x-1 group-hover:translate-x-0">
                                    →
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Row 2: Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-700 font-['Questrial',sans-serif]">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full px-4 py-3 rounded-2xl bg-neutral-100/90 border border-neutral-200/80 text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-colors font-['Questrial',sans-serif]"
                />
              </div>

              {/* Row 3: Budget Range Selectors with Rolling Flip Transition */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-700 font-['Questrial',sans-serif]">
                  Budget range
                </label>
                <div className="flex flex-wrap gap-2">
                  {["$1k to 10k", "$10k to 20k", "$20k to $50k", "$100k+"].map((tier) => {
                    const isSelected = selectedBudget === tier;
                    return (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => setSelectedBudget(tier)}
                        className={`group/btn relative inline-flex items-center justify-center overflow-hidden rounded-full px-4.5 py-2 text-xs font-semibold font-['Questrial',sans-serif] transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] cursor-pointer active:scale-95 ${
                          isSelected
                            ? "bg-black text-[#d4f938] border border-black shadow-md hover:bg-[#d4f938] hover:border-[#c4eb28]"
                            : "bg-white text-neutral-700 border border-neutral-300 hover:border-black hover:bg-black"
                        }`}
                      >
                        {/* Layer 1: Teks Utama */}
                        <span
                          className={`inline-block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover/btn:-translate-y-[160%] ${
                            isSelected ? "text-[#d4f938] group-hover/btn:text-black" : "text-neutral-700 group-hover/btn:text-[#d4f938]"
                          }`}
                        >
                          {tier}
                        </span>

                        {/* Layer 2: Teks Rolling Masuk Saat Hover */}
                        <span
                          className={`absolute inset-0 flex items-center justify-center translate-y-[160%] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover/btn:translate-y-0 ${
                            isSelected ? "text-black" : "text-[#d4f938]"
                          }`}
                        >
                          {tier}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 4: Additional info */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-700 font-['Questrial',sans-serif]">
                  Additional info?
                </label>
                <textarea
                  rows={3}
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  placeholder="Goals, scope, timeline, or helpful links"
                  className="w-full px-4 py-3 rounded-2xl bg-neutral-100/90 border border-neutral-200/80 text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-colors resize-none font-['Questrial',sans-serif]"
                />
              </div>

              {/* Submit CTA Button with Signature Rolling Flip Transition */}
              <button
                type="submit"
                className="group/btn relative w-full inline-flex items-center justify-center overflow-hidden rounded-full bg-[#d4f938] py-3.5 sm:py-4 px-6 text-sm sm:text-base font-bold font-['Questrial',sans-serif] text-black border border-[#c4eb28] shadow-[0_4px_20px_rgba(212,249,56,0.35)] transition-colors duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] hover:bg-[#111111] hover:border-black hover:shadow-[0_8px_25px_rgba(0,0,0,0.25)] active:scale-[0.98] cursor-pointer"
              >
                {isSubmitted ? (
                  <span className="text-[#16a34a] flex items-center gap-1.5 font-black">
                    ✓ Request Received! We&apos;ll be in touch.
                  </span>
                ) : (
                  <>
                    {/* Layer 1: Teks & Icon Hitam Awal */}
                    <div className="flex items-center gap-2 text-black transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover/btn:-translate-y-[160%]">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                        <line x1="7" y1="17" x2="17" y2="7" />
                        <polyline points="7 7 17 7 17 17" />
                      </svg>
                      <span>Get in Touch</span>
                    </div>

                    {/* Layer 2: Teks & Icon Hijau Neon Meluncur Masuk */}
                    <div className="absolute inset-0 flex items-center justify-center gap-2 text-[#d4f938] translate-y-[160%] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover/btn:translate-y-0">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                        <line x1="7" y1="17" x2="17" y2="7" />
                        <polyline points="7 7 17 7 17 17" />
                      </svg>
                      <span>Get in Touch</span>
                    </div>
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
