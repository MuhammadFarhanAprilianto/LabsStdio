"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
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
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  
  // Gunakan Ref untuk kontrol pause instan tanpa delay re-render
  const isPausedRef = useRef(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);

  // Duplikasi data 3 set untuk infinite scrolling yang seamless
  const marqueeItems = [...servicesData, ...servicesData, ...servicesData];

  // Inisialisasi posisi scroll di tengah (set ke-2) agar bisa di-scroll bebas ke kiri & kanan
  useEffect(() => {
    const el = carouselRef.current;
    if (el) {
      const singleSetWidth = el.scrollWidth / 3;
      el.scrollLeft = singleSetWidth;
    }
  }, []);

  // Smooth Auto-scroll dengan penghentian instan saat hover kartu manapun
  useEffect(() => {
    let animId: number;

    const step = () => {
      const el = carouselRef.current;
      if (el && !isPausedRef.current && !isDraggingRef.current) {
        el.scrollLeft += 0.85; // Kecepatan gerak lembut

        const singleSetWidth = el.scrollWidth / 3;
        // Wrapping mulus tanpa lonjakan
        if (el.scrollLeft >= singleSetWidth * 2) {
          el.scrollLeft -= singleSetWidth;
        } else if (el.scrollLeft <= 10) {
          el.scrollLeft += singleSetWidth;
        }
      }
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Pause instan saat kursor menyentuh kartu manapun (seketika diam di tempat)
  const handleMouseEnter = () => {
    isPausedRef.current = true;
  };

  // Lanjutkan putaran saat kursor benar-benar keluar dari carousel
  const handleMouseLeave = () => {
    if (!activeCardId && !isDraggingRef.current) {
      isPausedRef.current = false;
    }
    isDraggingRef.current = false;
  };

  // Mouse Drag to Scroll
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = carouselRef.current;
    if (!el) return;
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    isPausedRef.current = true;
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const el = carouselRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    if (Math.abs(walk) > 5) {
      hasMovedRef.current = true;
    }
    el.scrollLeft = scrollLeftRef.current - walk;

    // Infinite wrapping saat di-drag
    const singleSetWidth = el.scrollWidth / 3;
    if (el.scrollLeft >= singleSetWidth * 2) {
      el.scrollLeft -= singleSetWidth;
      scrollLeftRef.current -= singleSetWidth;
    } else if (el.scrollLeft <= 10) {
      el.scrollLeft += singleSetWidth;
      scrollLeftRef.current += singleSetWidth;
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleCardClick = (uniqueId: string) => {
    if (hasMovedRef.current) return; // Abaikan klik saat user sedang drag
    if (activeCardId === uniqueId) {
      setActiveCardId(null);
      isPausedRef.current = false;
    } else {
      setActiveCardId(uniqueId);
      isPausedRef.current = true;
    }
  };

  return (
    <section className="relative w-full bg-white pt-2 sm:pt-4 pb-20 sm:pb-28 overflow-hidden select-none">
      {/* Interactive Carousel Container dengan Drag-to-Scroll & Touch Support */}
      <div
        ref={carouselRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={() => {
          isPausedRef.current = true;
        }}
        onTouchEnd={() => {
          if (!activeCardId) isPausedRef.current = false;
        }}
        className="w-full overflow-x-auto scrollbar-none flex gap-6 sm:gap-8 px-6 sm:px-12 py-2 cursor-grab active:cursor-grabbing no-scrollbar"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {marqueeItems.map((item, index) => {
          const uniqueId = `${item.id}-${index}`;
          const isCardActive = activeCardId === uniqueId;

          return (
            <div
              key={uniqueId}
              onClick={() => handleCardClick(uniqueId)}
              onMouseEnter={handleMouseEnter}
              className="group relative w-[290px] sm:w-[340px] md:w-[370px] h-[390px] sm:h-[440px] md:h-[470px] rounded-[30px] overflow-hidden bg-neutral-900 border border-neutral-200/80 shadow-md hover:shadow-2xl transition-all duration-500 shrink-0 select-none cursor-pointer"
            >
              {/* Gambar Latar Belakang (.webp) */}
              <img
                src={item.image}
                alt={item.title}
                draggable={false}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none"
              />

              {/* Dark Gradient Overlay Dasar */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 pointer-events-none" />

              {/* Tombol Hijau Neon Rolling Flip Panah Diagonal (Pojok Kanan Atas) */}
              <div className="absolute top-5 right-5 z-20 pointer-events-none">
                <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#d4f938] border border-[#c4eb28] overflow-hidden flex items-center justify-center shadow-lg shadow-black/20 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-105 group-hover:bg-[#111111] group-hover:border-black group-hover:shadow-2xl">
                  {/* Layer 1: Ikon Hitam Awal */}
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

                  {/* Layer 2: Ikon Hijau Neon */}
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
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7 z-10 transition-opacity duration-300 group-hover:opacity-0 pointer-events-none">
                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug whitespace-pre-line font-['Agrandir',sans-serif] drop-shadow-md">
                  {item.title}
                </h3>
              </div>

              {/* Hover / Active State: Frosted Glass Panel Penjelasan Lengkap (Sekarang berhenti total saat kursor di atas kartu ini) */}
              <div
                className={`absolute inset-x-3 bottom-3 z-20 rounded-[24px] bg-black/75 backdrop-blur-xl border border-white/20 p-5 sm:p-6 text-white transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-end ${
                  isCardActive
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto"
                }`}
              >
                {/* Tag / Kategori Pills */}
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
                <p className="text-xs sm:text-[13px] text-neutral-300 font-['Questrial',sans-serif] leading-relaxed line-clamp-3 font-light mb-3">
                  {item.description}
                </p>

                {/* Link Action */}
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#d4f938] hover:underline"
                >
                  <span>Learn more</span>
                  <svg
                    className="w-3.5 h-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
