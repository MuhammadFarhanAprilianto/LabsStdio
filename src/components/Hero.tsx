"use client";

import React from "react";
import Link from "next/link";
import ThreeHandshakeWave from "@/components/ui/ThreeHandshakeWave";
import { motion } from "framer-motion";
import { ArrowUpRight01Icon } from "hugeicons-react";

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] sm:min-h-[88vh] w-full flex flex-col items-center justify-center overflow-hidden bg-white text-gray-900 pt-28 pb-14 sm:pb-12 px-6">
      {/* Three.js WebGL Points Wave & Handshake Connection Particle Field */}
      <ThreeHandshakeWave />

      {/* Subtle Radial Gradient Mask di Tengah untuk Menjamin Teks 100% Jelas & Kontras tanpa Menutupi Titik Ombak */}
      <div className="absolute inset-0 z-[1] pointer-events-none bg-[radial-gradient(ellipse_75%_65%_at_50%_42%,rgba(255,255,255,0.72)_0%,rgba(255,255,255,0)_100%)]" />

      {/* Hero Content Container with Blur-to-Clear Entrance */}
      <motion.div
        initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mx-auto max-w-3xl text-center flex flex-col items-center justify-center -mt-8 sm:-mt-12"
      >

        {/* Main Heading (Font: Questrial) */}
        <h1 className="text-center tracking-tight leading-[1.12] font-['Questrial',sans-serif]">
          <span className="block text-2xl sm:text-3xl md:text-4xl text-neutral-400 font-normal tracking-tight mb-1">
            Redefining the
          </span>
          <span className="block text-3xl sm:text-4xl md:text-5xl font-black text-black tracking-tight">
            Digital Experience.
          </span>
        </h1>

        {/* Subtitle Description (Font: Agrandir) */}
        <p className="mt-5 max-w-md text-xs sm:text-sm text-neutral-500 font-['Agrandir',sans-serif] leading-relaxed">
          We don&apos;t just design websites. We create memorable digital journeys that drive real growth.
        </p>

        {/* Call to Action Button: Interaksi Rolling Text Flip ke Atas (Font: Agrandir) */}
        <div className="mt-8 flex items-center justify-center font-['Agrandir',sans-serif]">
          <Link
            href="/contact"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-[#d4f938] px-7 py-3 text-sm font-medium tracking-wide border border-[#c4eb28] shadow-sm transition-colors duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] hover:bg-[#111111] hover:border-black hover:shadow-lg active:scale-95"
          >
            {/* Layer 1: Teks & Ikon Hitam Awal (Meluncur keluar ke atas saat hover) */}
            <div className="flex items-center gap-2.5 text-black transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-[160%]">
              <ArrowUpRight01Icon className="w-4 h-4 shrink-0" />
              <span>Join our World</span>
            </div>

            {/* Layer 2: Teks & Ikon Hijau Neon (Meluncur masuk dari bawah ke tengah saat hover) */}
            <div className="absolute inset-0 flex items-center justify-center gap-2.5 text-[#d4f938] translate-y-[160%] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0">
              <ArrowUpRight01Icon className="w-4 h-4 shrink-0" />
              <span>Join our World</span>
            </div>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

