"use client";

import React from "react";
import Link from "next/link";
import {
  DribbbleIcon,
  InstagramIcon,
  Behance02Icon,
  Linkedin01Icon,
  Facebook01Icon,
} from "hugeicons-react";

export default function Footer() {
  return (
    <footer className="relative w-full bg-[#0a0b10] text-white pt-16 sm:pt-20 pb-12 px-6 sm:px-12 lg:px-16 border-t border-neutral-800/80 overflow-hidden font-['Agrandir',sans-serif]">
      {/* Subtle Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-[radial-gradient(circle,rgba(212,249,56,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Column 1: Headquarters (Jakarta, Indonesia) & Social Links */}
          <div className="lg:col-span-4 space-y-6">
            <div className="space-y-3">
              <h4 className="text-xs sm:text-sm font-bold tracking-wider text-neutral-300 uppercase font-['Questrial',sans-serif] underline decoration-neutral-600 underline-offset-4">
                Headquarters
              </h4>
              <p className="text-lg sm:text-xl font-bold text-white font-['Agrandir',sans-serif] leading-snug">
                Menara Sudirman, Level 18
                <br />
                Jl. Jend. Sudirman Kav. 60, Jakarta 12190, Indonesia
              </p>
            </div>

            {/* Social Media Circular Buttons */}
            <div className="flex items-center gap-3 pt-2">
              {[
                {
                  name: "Dribbble",
                  href: "https://dribbble.com",
                  icon: <DribbbleIcon className="w-4 h-4" />,
                },
                {
                  name: "Instagram",
                  href: "https://instagram.com",
                  icon: <InstagramIcon className="w-4 h-4" />,
                },
                {
                  name: "Behance",
                  href: "https://behance.net",
                  icon: <Behance02Icon className="w-4 h-4" />,
                },
                {
                  name: "LinkedIn",
                  href: "https://linkedin.com",
                  icon: <Linkedin01Icon className="w-4 h-4" />,
                },
                {
                  name: "Facebook",
                  href: "https://facebook.com",
                  icon: <Facebook01Icon className="w-4 h-4" />,
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
                  <div className="w-8 h-8 rounded-full bg-[#242731] text-neutral-300 flex items-center justify-center transition-all duration-300 group-hover:bg-[#a6f30d] group-hover:text-black group-hover:shadow-[0_0_15px_rgba(166,243,13,0.7)]">
                    {social.icon}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2: Design Services */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs sm:text-sm font-bold tracking-wider text-neutral-300 uppercase font-['Questrial',sans-serif] underline decoration-neutral-600 underline-offset-4">
              Design Services
            </h4>
            <ul className="space-y-2.5 text-sm sm:text-base text-neutral-300">
              {[
                { name: "Web Design", href: "/services/web-design" },
                { name: "Mobile App Design", href: "/services/mobile-apps" },
                { name: "SaaS Web & App Design", href: "/services/ui-ux" },
                { name: "Branding & Identity", href: "/services/branding" },
                { name: "Motion & 3D Visuals", href: "/services/ui-ux" },
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

          {/* Column 3: Development Services */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs sm:text-sm font-bold tracking-wider text-neutral-300 uppercase font-['Questrial',sans-serif] underline decoration-neutral-600 underline-offset-4">
              Development Services
            </h4>
            <ul className="space-y-2.5 text-sm sm:text-base text-neutral-300">
              {[
                { name: "Web Development", href: "/services/web-development" },
                { name: "Next.js & React Apps", href: "/services/web-development" },
                { name: "Three.js & WebGL 3D", href: "/services/web-development" },
                { name: "WordPress & Headless CMS", href: "/services/wordpress" },
                { name: "Shopify & Custom E-Commerce", href: "/services/shopify" },
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

          {/* Column 4: Company */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs sm:text-sm font-bold tracking-wider text-neutral-300 uppercase font-['Questrial',sans-serif] underline decoration-neutral-600 underline-offset-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm sm:text-base text-neutral-300">
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-neutral-400">
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
