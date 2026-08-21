"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    let lastScrollY = typeof window !== "undefined" ? window.scrollY : 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Ubah gaya navbar (frosted glass capsule) saat mulai discroll
      if (currentScrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Logika Sembunyi saat Scroll ke Bawah & Muncul saat Scroll ke Atas
      if (currentScrollY < 100) {
        // Masih di area paling atas (Hero Section) -> selalu terlihat
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 400 && !isMobileMenuOpen) {
        // Scroll ke bawah melewati hero section -> sembunyikan navbar
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scroll ke atas -> langsung munculkan kembali navbar
        setIsVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobileMenuOpen]);

  // Tutup menu saat resize ke layar besar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 flex flex-col items-center pointer-events-none px-4 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] font-['Questrial',sans-serif] ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "-translate-y-full opacity-0"
      }`}
    >
      {/* Navbar Container: Translucent Frosted Glass (Bentuk 100% Asli Dipertahankan) */}
      <nav
        className={`pointer-events-auto relative flex items-center justify-between transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden ${
          isScrolled
            ? "mt-4 w-full max-w-5xl rounded-full bg-white/40 text-gray-900 shadow-[0_20px_45px_-12px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.03),inset_0_1.5px_1.5px_rgba(255,255,255,0.85),inset_0_-1px_1.5px_rgba(0,0,0,0.04)] backdrop-blur-md backdrop-saturate-150 px-5 sm:px-7 py-2.5 sm:py-3 border border-white/60 ring-1 ring-black/[0.05]"
            : "mt-0 w-full max-w-7xl rounded-none bg-transparent text-gray-900 px-4 sm:px-6 py-4 sm:py-5 border-none shadow-none"
        }`}
      >
        {/* Specular Ambient Light Flare */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
            isScrolled ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(255, 255, 255, 0.75), transparent 70%)",
          }}
        />

        {/* Brand / Logo Promethean Labs */}
        <Link
          href="/"
          onClick={() => setIsMobileMenuOpen(false)}
          className="relative z-10 shrink-0 transition-all duration-700 hover:opacity-90 flex items-center"
        >
          <Logo className="h-9 sm:h-11 w-auto" inverted={false} />
        </Link>

        {/* Menu Navigasi Desktop (Font Questrial + Hover Neon Lime Green) */}
        <div className="relative z-10 hidden md:flex items-center gap-6 lg:gap-8 text-base lg:text-[18px] tracking-wide transition-all duration-700 text-gray-800">
          <Link
            href="/"
            className="transition-colors duration-200 hover:text-[#a6f30d]"
          >
            Services
          </Link>
          <Link
            href="/about"
            className="transition-colors duration-200 hover:text-[#a6f30d]"
          >
            About Us
          </Link>
          <Link
            href="/services"
            className="transition-colors duration-200 hover:text-[#a6f30d]"
          >
            Work
          </Link>
          <Link
            href="/contact"
            className="transition-colors duration-200 hover:text-[#a6f30d]"
          >
            Blog
          </Link>
        </div>

        {/* Action Button Desktop: Tell Me More */}
        <div className="relative z-10 hidden md:block shrink-0 transition-all duration-700">
          <Link
            href="/contact"
            className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full border border-gray-300/80 bg-white/70 px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-[16px] font-medium tracking-wide text-gray-900 shadow-sm transition-all duration-300 hover:border-[#a6f30d] hover:shadow-md"
          >
            {/* Animasi latar belakang hijau neon menyapu dari kiri ke kanan */}
            <span className="absolute inset-0 z-0 bg-[#a6f30d] -translate-x-full transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:translate-x-0" />

            {/* Icon Chevron '>' */}
            <span className="relative z-10 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-black/5 transition-all duration-300 group-hover:bg-black/10 group-hover:translate-x-0.5">
              <svg
                className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-800 transition-colors duration-300 group-hover:text-black"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </span>

            {/* Teks Tombol */}
            <span className="relative z-10 font-medium text-gray-900 transition-colors duration-300 group-hover:text-black">
              Tell Me More
            </span>
          </Link>
        </div>

        {/* Mobile Hamburger Button (Muncul di layar HP / Layar < md) */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
          className="relative z-20 md:hidden flex flex-col items-center justify-center w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 transition-colors focus:outline-none cursor-pointer"
        >
          <span
            className={`w-5 h-0.5 bg-gray-900 rounded-full transition-all duration-300 ${
              isMobileMenuOpen ? "rotate-45 translate-y-1" : "-translate-y-1"
            }`}
          />
          <span
            className={`w-5 h-0.5 bg-gray-900 rounded-full transition-all duration-300 ${
              isMobileMenuOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`w-5 h-0.5 bg-gray-900 rounded-full transition-all duration-300 ${
              isMobileMenuOpen ? "-rotate-45 -translate-y-1" : "translate-y-1"
            }`}
          />
        </button>
      </nav>

      {/* Mobile Drawer Dropdown Menu (Frosted Glass Mobile Pop-up) */}
      <div
        className={`pointer-events-auto md:hidden w-full max-w-sm transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden ${
          isMobileMenuOpen
            ? "max-h-[380px] opacity-100 mt-2"
            : "max-h-0 opacity-0 mt-0 pointer-events-none"
        }`}
      >
        <div className="rounded-[28px] bg-white/85 backdrop-blur-xl border border-white/80 shadow-[0_20px_40px_rgba(0,0,0,0.12)] p-6 flex flex-col gap-4 text-center">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-lg font-medium text-gray-800 hover:text-[#a6f30d] py-1.5 transition-colors"
          >
            Services
          </Link>
          <Link
            href="/about"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-lg font-medium text-gray-800 hover:text-[#a6f30d] py-1.5 transition-colors"
          >
            About Us
          </Link>
          <Link
            href="/services"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-lg font-medium text-gray-800 hover:text-[#a6f30d] py-1.5 transition-colors"
          >
            Work
          </Link>
          <Link
            href="/contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-lg font-medium text-gray-800 hover:text-[#a6f30d] py-1.5 transition-colors"
          >
            Blog
          </Link>

          <div className="pt-2 border-t border-gray-200/60">
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="inline-flex items-center justify-center gap-2 w-full rounded-full bg-[#d4f938] py-3 text-sm font-bold text-black shadow-sm active:scale-95 transition-transform"
            >
              <span>Tell Me More</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
