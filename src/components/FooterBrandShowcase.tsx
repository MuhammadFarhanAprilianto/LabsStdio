"use client";

import React from "react";
import Image from "next/image";
import ThreeFooterGlobe from "./ui/ThreeFooterGlobe";

export default function FooterBrandShowcase() {
  return (
    <section className="relative w-full bg-[#050608] overflow-hidden flex flex-col justify-end items-center min-h-[300px] sm:min-h-[380px] lg:min-h-[440px]">
      {/* ========================================================================= */}
      {/* LAPISAN 1 (Paling Belakang): 3D Planet Globe & Bintang Galaxy Tanpa Titik Hijau */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <ThreeFooterGlobe />
      </div>

      {/* ========================================================================= */}
      {/* LAPISAN 2 (Tengah): Latar Hitam Transparan 50% (bg-black/50) */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 w-full h-full bg-black/50 backdrop-blur-[1px] z-10 pointer-events-none" />

      {/* Subtle Top Gradient for Smooth Blend with Footer Above */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#0a0b10] to-transparent z-15 pointer-events-none" />

      {/* ========================================================================= */}
      {/* LAPISAN 3 (Paling Atas): Logo Promethean Labs Lebih Kecil & Nempel Presisi di Dasar */}
      {/* ========================================================================= */}
      <div className="relative z-20 w-full max-w-4xl mx-auto flex items-end justify-center px-6 pointer-events-none">
        <div className="relative w-full flex items-end justify-center">
          <Image
            src="/images/promethean_logo_cropped.webp"
            alt="PROMETHEAN Labs."
            width={721}
            height={332}
            className="w-full max-w-[340px] sm:max-w-[480px] lg:max-w-[560px] h-auto object-contain select-none drop-shadow-[0_15px_35px_rgba(0,0,0,0.9)] translate-y-[2px]"
            priority
          />
        </div>
      </div>
    </section>
  );
}
