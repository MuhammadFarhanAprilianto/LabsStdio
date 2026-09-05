"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { ArrowUpRight01Icon, ArrowRight01Icon } from "hugeicons-react";

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
    id: "ui-ux",
    title: "UI/UX &\nDigital Product",
    image: "/images/UIUXDigitalProduct.webp",
    tags: ["User Research", "Wireframing", "Mobile & Web UI"],
    description:
      "We build intuitive user journeys, interactive interfaces, and seamless digital products that captivate.",
    href: "/services/ui-ux",
  },
  {
    id: "web-design",
    title: "Web Design &\nLanding Pages",
    image: "/images/WebDesignLandingPages.webp",
    tags: ["Custom UI", "Responsive Design", "Conversion Focus"],
    description:
      "Modern, high-converting websites designed to turn visitors into loyal customers and elevate brand trust.",
    href: "/services/web-design",
  },
  {
    id: "mobile-apps",
    title: "Mobile App &\nInterface Design",
    image: "/images/MobileAppInterfaceDesign.webp",
    tags: ["iOS & Android", "Design Systems", "Prototyping"],
    description:
      "Seamless mobile user experiences crafted with precision for iOS and Android platforms.",
    href: "/services/mobile-apps",
  },
  {
    id: "branding",
    title: "Branding &\nVisual Identity",
    image: "/images/BrandingCreativeDesign.webp",
    tags: ["Visual Identity", "Design System", "Art Direction"],
    description:
      "Distinctive brand identities, logos, guidelines, and design systems that stand out in crowded markets.",
    href: "/services/branding",
  },
  {
    id: "web-development",
    title: "Modern Web\nDevelopment",
    image: "/images/UserPath.webp",
    tags: ["Next.js & React", "High Performance", "Clean Architecture"],
    description:
      "Fast, scalable, and secure full-stack web applications engineered with cutting-edge technologies.",
    href: "/services/web-development",
  },
  {
    id: "wordpress",
    title: "WordPress &\nHeadless CMS",
    image: "/images/WordPressHeadlessCMS.webp",
    tags: ["Custom Themes", "Easy CMS", "Enterprise Scale"],
    description:
      "Tailored, easy-to-manage WordPress ecosystems and headless CMS architectures built for scale.",
    href: "/services/wordpress",
  },
  {
    id: "shopify",
    title: "Shopify &\nE-Commerce",
    image: "/images/ShopifyECommerce.webp",
    tags: ["E-Commerce", "Shopify Plus", "High Conversion"],
    description:
      "World-class e-commerce stores designed to maximize average order value and scale global sales.",
    href: "/services/shopify",
  },
  {
    id: "webflow",
    title: "Webflow &\nInteractive Sites",
    image: "/images/DigitalMarketingGrowth.webp",
    tags: ["No-Code Speed", "Fluid Animations", "Custom Code"],
    description:
      "Pixel-perfect, animation-rich Webflow websites delivered with speed and zero compromises.",
    href: "/services/webflow",
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

  // Normalisasi posisi scroll agar looping terus-menerus tanpa pernah mentok (Infinite Loop Wrapping)
  const normalizeScrollPosition = () => {
    const el = carouselRef.current;
    if (!el) return;
    const singleSetWidth = el.scrollWidth / 3;
    if (singleSetWidth <= 10) return;

    if (el.scrollLeft >= singleSetWidth * 2) {
      el.scrollLeft -= singleSetWidth;
      if (isDraggingRef.current) {
        scrollLeftRef.current -= singleSetWidth;
      }
    } else if (el.scrollLeft <= 10) {
      el.scrollLeft += singleSetWidth;
      if (isDraggingRef.current) {
        scrollLeftRef.current += singleSetWidth;
      }
    }
  };

  // Event listener scroll manual (Trackpad / Touch Swipe)
  const handleScroll = () => {
    normalizeScrollPosition();
  };

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
        normalizeScrollPosition();
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
    normalizeScrollPosition();
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
    <section className="relative w-full bg-white pt-6 sm:pt-6 pb-14 sm:pb-16 overflow-hidden select-none">
      {/* Interactive Carousel Container with ScrollReveal Blur-to-Clear */}
      <ScrollReveal distance={32} blur={14} duration={850}>
        <div
          ref={carouselRef}
          onScroll={handleScroll}
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
          tabIndex={0}
          role="region"
          aria-label="Services cards carousel"
          className="w-full overflow-x-auto scrollbar-none flex gap-6 sm:gap-8 px-6 sm:px-12 py-2 cursor-grab active:cursor-grabbing no-scrollbar focus:outline-none focus-visible:ring-1 focus-visible:ring-black/20"
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
              {/* Gambar Latar Belakang (.webp): Black & White saat normal, Berwarna saat di-hover/aktif */}
              <img
                src={item.image}
                alt={item.title}
                draggable={false}
                className={`absolute inset-0 w-full h-full object-cover object-center transition-[filter] duration-700 ease-out pointer-events-none ${
                  isCardActive
                    ? "grayscale-0 contrast-100"
                    : "grayscale contrast-105 group-hover:grayscale-0 group-hover:contrast-100"
                }`}
              />

              {/* Dark Gradient Overlay Dasar */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 pointer-events-none" />

              {/* Tombol Hijau Neon Rolling Flip Panah Diagonal (Pojok Kanan Atas) */}
              <div className="absolute top-5 right-5 z-20 pointer-events-none">
                <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#d4f938] border border-[#c4eb28] overflow-hidden flex items-center justify-center shadow-lg shadow-black/20 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-105 group-hover:bg-[#111111] group-hover:border-black group-hover:shadow-2xl">
                  {/* Layer 1: Ikon Hitam Awal */}
                  <div className="flex items-center justify-center text-black transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-[160%]">
                    <ArrowUpRight01Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>

                  {/* Layer 2: Ikon Hijau Neon */}
                  <div className="absolute inset-0 flex items-center justify-center text-[#d4f938] translate-y-[160%] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0">
                    <ArrowUpRight01Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                </div>
              </div>

              {/* Normal State: Judul Teks Tebal Putih di Bawah (Font: Questrial) */}
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7 z-10 transition-opacity duration-400 group-hover:opacity-0 pointer-events-none transform-gpu">
                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug whitespace-pre-line font-['Questrial',sans-serif] drop-shadow-md">
                  {item.title}
                </h3>
              </div>

              {/* Hover / Active State: Full-Width Seamless Bottom Drawer (100% rapat ke sudut bawah kartu tanpa celah di pojok) */}
              <div
                className={`absolute inset-x-0 bottom-0 z-20 rounded-b-[30px] bg-gradient-to-t from-[#0c0d12] via-[#0c0d12]/95 to-[#0c0d12]/80 border-t border-white/10 p-6 sm:p-7 text-white transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-end transform-gpu will-change-[transform,opacity] pointer-events-none ${
                  isCardActive
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0"
                }`}
              >
                {/* Tag / Kategori Pills (Font: Agrandir) */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 pointer-events-none">
                  {item.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs text-white/95 font-['Agrandir',sans-serif]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#d4f938]" />
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Judul Service (Font: Questrial) */}
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug mb-1.5 font-['Questrial',sans-serif] pointer-events-none">
                  {item.title.replace("\n", " ")}
                </h3>

                {/* Penjelasan Deskripsi Layanan (Font: Agrandir) */}
                <p className="text-xs sm:text-[13px] text-neutral-300 font-['Agrandir',sans-serif] leading-relaxed line-clamp-3 font-light mb-3 pointer-events-none">
                  {item.description}
                </p>

                {/* Link Action */}
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#d4f938] hover:underline pointer-events-auto self-start"
                >
                  <span>Learn more</span>
                  <ArrowRight01Icon className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
        </div>
      </ScrollReveal>
    </section>
  );
}

