"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative w-full bg-[#0a0b10] text-white pt-16 sm:pt-20 pb-12 px-6 sm:px-12 lg:px-16 border-t border-neutral-800/80 overflow-hidden font-['Questrial',sans-serif]">
      {/* Subtle Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-[radial-gradient(circle,rgba(212,249,56,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Column 1: Headquarters (Jakarta, Indonesia) & Social Links */}
          <div className="lg:col-span-4 space-y-6">
            <div className="space-y-3">
              <h4 className="text-xs sm:text-sm font-bold tracking-wider text-neutral-400 uppercase font-['Questrial',sans-serif] underline decoration-neutral-600 underline-offset-4">
                Headquarters
              </h4>
              <p className="text-lg sm:text-xl font-bold text-white font-['Agrandir',sans-serif] leading-snug">
                Menara Sudirman, Level 18
                <br />
                Jl. Jend. Sudirman Kav. 60, Jakarta 12190, Indonesia
              </p>
            </div>

            {/* Social Media Circular Buttons (Tanpa animasi naik, hanya ikon dalam yang berganti warna hijau neon saat hover) */}
            <div className="flex items-center gap-3 pt-2">
              {[
                {
                  name: "Dribbble",
                  href: "https://dribbble.com",
                  svg: (
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm7.842 5.539a10.024 10.024 0 012.158 6.461c-.347-.076-2.614-.543-5.234-.239a25.105 25.105 0 00-.776-1.789c3.08-1.503 3.852-4.433 3.852-4.433zm-4.992-1.921c.582 1.488 1.077 3.09 1.48 4.773-2.909.842-5.836.936-6.425.948-.052-.119-.104-.238-.158-.356a18.232 18.232 0 015.103-5.365zm-7.61 1.745a16.275 16.275 0 00-4.887 5.09A10.04 10.04 0 0112 1.996c-1.849 0-3.559.504-5.025 1.378l.265.01zm-5.244 8.637c.05.006 1.405.158 3.513-.306.46 1.258.988 2.502 1.583 3.71-3.181-.786-4.981-3.23-5.096-3.404zm7.414 4.542a27.674 27.674 0 01-1.637-3.805c2.47-.531 5.379-.472 7.822.109a10.038 10.038 0 01-6.185 3.696zm7.876-1.517c-2.317-.604-4.99-.689-7.399-.187a22.259 22.259 0 01.733 1.696c2.518-.328 5.253.303 6.666.691z" />
                    </svg>
                  ),
                },
                {
                  name: "Instagram",
                  href: "https://instagram.com",
                  svg: (
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  ),
                },
                {
                  name: "Behance",
                  href: "https://behance.net",
                  svg: (
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-4.971 3-3.401 0-5.755-2.202-5.755-5.736 0-3.298 2.146-5.764 5.399-5.764 3.498 0 5.176 2.394 4.887 5.9h-7.794c.148 1.947 1.432 3.125 3.327 3.125 1.42 0 2.457-.655 2.907-1.525h2zm-4.996-6.143c-1.391 0-2.316.924-2.529 2.378h5.059c-.067-1.454-.932-2.378-2.53-2.378zm-11.73 6.143h-2v-10h4.526c2.417 0 3.731 1.258 3.731 2.825 0 1.077-.611 2.016-1.637 2.443 1.341.385 2.138 1.464 2.138 2.766 0 1.836-1.536 3.102-4.004 3.102l-2.754-.136zm0-4.086h2.208c1.139 0 1.849-.499 1.849-1.399 0-.877-.71-1.35-1.849-1.35h-2.208v2.749zm0-4.228h2.006c.995 0 1.635-.453 1.635-1.242 0-.825-.664-1.258-1.635-1.258h-2.006v2.5z" />
                    </svg>
                  ),
                },
                {
                  name: "LinkedIn",
                  href: "https://linkedin.com",
                  svg: (
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  ),
                },
                {
                  name: "Facebook",
                  href: "https://facebook.com",
                  svg: (
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.597 0 9 1.583 9 4.615V8z" />
                    </svg>
                  ),
                },
              ].map((social, i) => (
                <Link
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="group relative w-11 h-11 rounded-full bg-[#181a20] border border-neutral-800/80 flex items-center justify-center cursor-pointer transition-colors duration-300"
                >
                  {/* Lingkaran Ikon Dalam: Default Gelap, saat Hover berubah menjadi Hijau Neon dengan cutout logo hitam (Persis seperti gambar referensi) */}
                  <div className="w-8 h-8 rounded-full bg-[#242731] text-neutral-400 flex items-center justify-center transition-all duration-300 group-hover:bg-[#a6f30d] group-hover:text-black group-hover:shadow-[0_0_15px_rgba(166,243,13,0.7)]">
                    {social.svg}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2: Design Services */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs sm:text-sm font-bold tracking-wider text-neutral-400 uppercase font-['Questrial',sans-serif] underline decoration-neutral-600 underline-offset-4">
              Design Services
            </h4>
            <ul className="space-y-2.5 text-sm sm:text-base text-neutral-400">
              {[
                "Web Design",
                "Mobile App Design",
                "SaaS Web & App Design",
                "Branding & Identity",
                "Motion & 3D Visuals",
              ].map((item, i) => (
                <li key={i}>
                  <Link
                    href="/services"
                    className="hover:text-[#d4f938] transition-colors duration-200 block"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Development Services */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs sm:text-sm font-bold tracking-wider text-neutral-400 uppercase font-['Questrial',sans-serif] underline decoration-neutral-600 underline-offset-4">
              Development Services
            </h4>
            <ul className="space-y-2.5 text-sm sm:text-base text-neutral-400">
              {[
                "Web Development",
                "Next.js & React Apps",
                "Three.js & WebGL 3D",
                "WordPress & Headless CMS",
                "Custom API & Backend",
              ].map((item, i) => (
                <li key={i}>
                  <Link
                    href="/services"
                    className="hover:text-[#d4f938] transition-colors duration-200 block"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Company */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs sm:text-sm font-bold tracking-wider text-neutral-400 uppercase font-['Questrial',sans-serif] underline decoration-neutral-600 underline-offset-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm sm:text-base text-neutral-400">
              {[
                { name: "About Us", href: "/about" },
                { name: "Our Work", href: "/#portfolio" },
                { name: "Process", href: "/#process" },
                { name: "Testimonials", href: "/#testimonials" },
                { name: "Careers", href: "/contact" },
              ].map((item, i) => (
                <li key={i}>
                  <Link
                    href={item.href}
                    className="hover:text-[#d4f938] transition-colors duration-200 block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider Line */}
        <div className="w-full h-px bg-neutral-800/80" />

        {/* Bottom Footer Bar: Copyright & Legal Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-neutral-500">
          <p>© 2026 Promethean Labs. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="hover:text-white transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-white transition-colors duration-200"
            >
              Terms of use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
