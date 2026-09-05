"use client";

import React from "react";
import Link from "next/link";
import ThreeInteractiveGlobe from "./ui/ThreeInteractiveGlobe";
import ScrollReveal from "./ui/ScrollReveal";

export default function TestimonialsSection() {
  return (
    <section className="relative w-full bg-white text-gray-900 pt-14 sm:pt-16 pb-18 sm:pb-20 px-6 sm:px-12 lg:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12">
        {/* Section Header: Main Title */}
        <ScrollReveal distance={28} blur={14} duration={850}>
          <div className="text-center flex flex-col items-center justify-center space-y-5">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-black leading-[1.15] font-['Questrial',sans-serif] max-w-3xl break-words">
              Words from the People
              <br />
              We&apos;ve Worked With
            </h2>
          </div>
        </ScrollReveal>

        {/* Kotak Interaktif dengan 3D Planet Bumi (Three.js Interactive Globe) */}
        <ScrollReveal distance={36} blur={14} duration={900}>
          <div className="relative w-full min-h-[500px] sm:min-h-[620px] rounded-[32px] sm:rounded-[40px] bg-[#0c0d12] border border-neutral-800/80 shadow-2xl overflow-hidden flex items-center justify-center">
            {/* Ambient Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-[radial-gradient(circle,rgba(212,249,56,0.12)_0%,transparent_70%)] pointer-events-none" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle,rgba(56,189,248,0.08)_0%,transparent_70%)] pointer-events-none" />

            {/* 3D Planet Bumi Canvas Component */}
            <div className="absolute inset-0 z-10">
              <ThreeInteractiveGlobe className="w-full h-full" />
            </div>
          </div>
        </ScrollReveal>

        {/* Bottom Info Bar: 200+ Happy Customers & Book a Free Consultation Button */}
        <ScrollReveal distance={24} blur={12} delay={80} duration={850}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-2 px-1">
            {/* Left Text */}
            <div className="text-sm sm:text-base font-['Agrandir',sans-serif] leading-relaxed">
              <p className="font-semibold text-black">
                200+ Happy Customers based on
              </p>
              <p className="text-neutral-500">
                complement and customer reviews
              </p>
            </div>

            {/* Right Action Button: Book a Free Consultation dengan Rolling Flip Hover */}
            <Link
              href="/contact"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-[#d4f938] px-7 sm:px-8 py-3 sm:py-3.5 text-xs sm:text-sm font-bold tracking-wide text-black border border-[#c4eb28] shadow-md transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] hover:bg-[#111111] hover:border-black hover:shadow-xl active:scale-95"
            >
              {/* Layer 1: Teks Hitam Awal (Meluncur keluar ke atas saat hover) */}
              <span className="inline-flex items-center gap-2 font-['Agrandir',sans-serif] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-[160%]">
                Book a Free Consultation
              </span>

              {/* Layer 2: Teks Hijau Neon (Meluncur masuk dari bawah ke tengah saat hover) */}
              <span className="absolute inset-0 flex items-center justify-center gap-2 text-[#d4f938] font-['Agrandir',sans-serif] translate-y-[160%] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0">
                Book a Free Consultation
              </span>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

