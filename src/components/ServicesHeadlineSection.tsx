"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ServicesHeadlineSection() {
  return (
    <section className="relative w-full bg-white text-gray-900 pt-20 sm:pt-28 pb-4 px-6 sm:px-12 lg:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Main Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Heading with Expanding Inline Photo (Font: Questrial) */}
          <div className="lg:col-span-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[50px] font-normal tracking-tight text-black leading-[1.28] font-['Questrial',sans-serif]">
              <span>We shape </span>
              {/* Foto Animasi Muncul dari Kiri ke Kanan saat Scroll ke Posisi Teks */}
              <motion.span
                initial={{ width: 0, opacity: 0, scale: 0.95 }}
                whileInView={{ width: "auto", opacity: 1, scale: 1 }}
                viewport={{ once: false, amount: 0.6 }}
                transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center align-middle overflow-hidden mx-1.5 sm:mx-2.5 my-1"
              >
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "135px" }}
                  viewport={{ once: false, amount: 0.6 }}
                  transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                  className="h-[34px] sm:h-[46px] md:h-[50px] w-[95px] sm:w-[125px] md:w-[135px] relative overflow-hidden rounded-[14px] shadow-md border border-neutral-200 shrink-0 bg-neutral-100"
                >
                  <img
                    src="/images/SportPhoto01.webp"
                    alt="Creative digital journey showcase"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </motion.span>
              <span>visionary digital journeys and engineer high-impact experiences. All in ONE studio!</span>
            </h2>
          </div>

          {/* Right Column: Description & Explore Our Services Button (Font: Agrandir) */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-8 pt-2">
            <p className="text-sm sm:text-base text-neutral-600 font-['Agrandir',sans-serif] leading-relaxed font-normal">
              You need a partner who understands your ambition and elevates every touchpoint. From cutting-edge web design to scalable full-stack development, we turn bold concepts into transformative digital realities that drive real growth.
            </p>

            {/* Call to Action Button: Interaksi Rolling Flip Hijau Neon & Hitam */}
            <div className="font-['Questrial',sans-serif]">
              <Link
                href="/services"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-[#d4f938] px-7 py-3 text-sm font-medium tracking-wide border border-[#c4eb28] shadow-sm transition-colors duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] hover:bg-[#111111] hover:border-black hover:shadow-lg active:scale-95"
              >
                {/* Layer 1: Teks & Ikon Hitam Awal (Meluncur keluar ke atas saat hover) */}
                <div className="flex items-center gap-2.5 text-black transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-[160%]">
                  <svg
                    className="w-4 h-4 shrink-0"
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
                  <span>Explore Our Services</span>
                </div>

                {/* Layer 2: Teks & Ikon Hijau Neon (Meluncur masuk dari bawah ke tengah saat hover) */}
                <div className="absolute inset-0 flex items-center justify-center gap-2.5 text-[#d4f938] translate-y-[160%] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0">
                  <svg
                    className="w-4 h-4 shrink-0"
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
                  <span>Explore Our Services</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
