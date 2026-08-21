"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

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
      } else if (currentScrollY > lastScrollY && currentScrollY > 400) {
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
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none px-4 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] font-['Questrial',sans-serif] ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "-translate-y-full opacity-0"
      }`}
    >
      {/* Navbar Container: Translucent Frosted Glass (Bentuk 100% Asli Dipertahankan) */}
      <nav
        className={`pointer-events-auto relative flex items-center justify-between transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden ${
          isScrolled
            ? "mt-4 w-full max-w-5xl rounded-full bg-white/35 text-gray-900 shadow-[0_20px_45px_-12px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.03),inset_0_1.5px_1.5px_rgba(255,255,255,0.85),inset_0_-1px_1.5px_rgba(0,0,0,0.04)] backdrop-blur-md backdrop-saturate-150 px-7 py-3 border border-white/60 ring-1 ring-black/[0.05]"
            : "mt-0 w-full max-w-7xl rounded-none bg-transparent text-gray-900 px-6 py-5 border-none shadow-none"
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
          className="relative z-10 shrink-0 transition-all duration-700 hover:opacity-90 flex items-center"
        >
          <Logo className="h-11 w-auto" inverted={false} />
        </Link>

        {/* Menu Navigasi (Font Questrial + Hover Neon Lime Green) */}
        <div className="relative z-10 flex items-center gap-8 text-[18px] tracking-wide transition-all duration-700 text-gray-800">
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

        {/* Action Button: Tell Me More dengan animasi hover sapuan kiri ke kanan warna Hijau Neon */}
        <div className="relative z-10 shrink-0 transition-all duration-700">
          <Link
            href="/contact"
            className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full border border-gray-300/80 bg-white/70 px-5 py-2.5 text-[16px] font-medium tracking-wide text-gray-900 shadow-sm transition-all duration-300 hover:border-[#a6f30d] hover:shadow-md"
          >
            {/* Animasi latar belakang hijau neon menyapu dari kiri ke kanan */}
            <span className="absolute inset-0 z-0 bg-[#a6f30d] -translate-x-full transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:translate-x-0" />

            {/* Icon Chevron '>' */}
            <span className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black/5 transition-all duration-300 group-hover:bg-black/10 group-hover:translate-x-0.5">
              <svg
                className="h-3.5 w-3.5 text-gray-800 transition-colors duration-300 group-hover:text-black"
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
      </nav>
    </header>
  );
}
