"use client";

import React, { useState } from "react";
import Link from "next/link";

interface ServiceCardData {
  id: string;
  title: string;
  image: string;
  tags: string[];
  description: string;
  href: string;
}

const servicesData: ServiceCardData[] = [
  {
    id: "branding",
    title: "Branding &\nCreative Design",
    image: "/images/BrandingCreativeDesign.webp",
    tags: ["Visual Identity", "Design System", "Art Direction"],
    description:
      "We craft distinctive visual identities, design systems, and creative direction that set your brand apart.",
    href: "/services/branding",
  },
  {
    id: "uiux",
    title: "UI/UX &\nDigital Product",
    image: "/images/UIUXDigitalProduct.webp",
    tags: ["User Research", "Wireframing", "Mobile & Web UI"],
    description:
      "We build intuitive user journeys, interactive interfaces, and seamless digital products that captivate.",
    href: "/services/ui-ux",
  },
  {
    id: "marketing",
    title: "Digital Marketing\n& Growth",
    image: "/images/DigitalMarketingGrowth.webp",
    tags: ["Growth Funnels", "SEO & Content", "Performance Ads"],
    description:
      "Data-backed optimization strategies and scalable marketing funnels that drive real, measurable conversion.",
    href: "/services/marketing",
  },
  {
    id: "content",
    title: "Content &\nProduction",
    image: "/images/ContentProduction.webp",
    tags: ["3D Motion", "Video Production", "Social Creative"],
    description:
      "High-impact visual storytelling, creative motion design, and rich media assets that bring your story to life.",
    href: "/services/content",
  },
];

export default function ServicesCardsCarousel() {
  const [isPaused, setIsPaused] = useState(false);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const togglePause = (id: string) => {
    if (activeCardId === id && isPaused) {
      setIsPaused(false);
      setActiveCardId(null);
    } else {
      setIsPaused(true);
      setActiveCardId(id);
    }
  };

  // Duplikasi data 3 kali untuk infinite marquee yang mulus tanpa celah
  const marqueeItems = [...servicesData, ...servicesData, ...servicesData];

  return (
    <section className="relative w-full bg-white pt-8 sm:pt-12 pb-20 sm:pb-28 overflow-hidden select-none">
      {/* Infinite Marquee Track: Bergerak dari Kanan ke Kiri */}
      <div
        className="relative w-full overflow-hidden flex"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => !activeCardId && setIsPaused(false)}
      >
        <div
          className={`flex gap-6 sm:gap-8 shrink-0 py-2 will-change-transform ${
            isPaused ? "animate-none" : "animate-marquee"
          }`}
          style={{
            animationPlayState: isPaused ? "paused" : "running",
          }}
        >
          {marqueeItems.map((item, index) => {
            const isCardActive = activeCardId === `${item.id}-${index}`;

            return (
              <div
                key={`${item.id}-${index}`}
                onClick={() => togglePause(`${item.id}-${index}`)}
                className="group relative w-[290px] sm:w-[340px] md:w-[370px] h-[390px] sm:h-[440px] md:h-[470px] rounded-[30px] overflow-hidden bg-neutral-900 border border-neutral-200/80 shadow-md hover:shadow-2xl transition-all duration-500 shrink-0 cursor-pointer"
              >
                {/* Gambar Latar Belakang (.webp) */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Dark Gradient Overlay Dasar */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 pointer-events-none" />

                {/* Tombol Hijau Neon Rolling Flip Panah Diagonal (Pojok Kanan Atas) */}
                <div className="absolute top-5 right-5 z-20">
                  <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#d4f938] border border-[#c4eb28] overflow-hidden flex items-center justify-center shadow-lg shadow-black/20 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-105 group-hover:bg-[#111111] group-hover:border-black group-hover:shadow-2xl">
                    {/* Layer 1: Ikon Hitam Awal (Meluncur keluar ke atas saat hover) */}
                    <div className="flex items-center justify-center text-black transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-[160%]">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5"
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
                    </div>

                    {/* Layer 2: Ikon Hijau Neon (Meluncur masuk dari bawah ke tengah saat hover) */}
                    <div className="absolute inset-0 flex items-center justify-center text-[#d4f938] translate-y-[160%] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5"
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
                    </div>
                  </div>
                </div>

                {/* Normal State: Judul Teks Tebal Putih di Bawah */}
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7 z-10 transition-opacity duration-300 group-hover:opacity-0">
                  <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug whitespace-pre-line font-['Agrandir',sans-serif] drop-shadow-md">
                    {item.title}
                  </h3>
                </div>

                {/* Hover / Active State: Frosted Glass Panel Penjelasan Lengkap (Gambar Kedua) */}
                <div
                  className={`absolute inset-x-3 bottom-3 z-20 rounded-[24px] bg-black/65 backdrop-blur-xl border border-white/20 p-5 sm:p-6 text-white transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-end ${
                    isCardActive
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-6 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto"
                  }`}
                >
                  {/* Tag / Kategori Pills dengan Dot Putih */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3">
                    {item.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="inline-flex items-center gap-1.5 rounded-full bg-white/15 border border-white/20 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs text-white/95 font-['Questrial',sans-serif]"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Judul Service */}
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug mb-1.5 font-['Agrandir',sans-serif]">
                    {item.title.replace("\n", " ")}
                  </h3>

                  {/* Penjelasan Deskripsi Layanan */}
                  <p className="text-xs sm:text-[13px] text-neutral-300 font-['Questrial',sans-serif] leading-relaxed line-clamp-3 font-light">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
