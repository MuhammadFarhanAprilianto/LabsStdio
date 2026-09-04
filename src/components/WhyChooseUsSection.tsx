"use client";

import React from "react";
import ThreeCardProjects from "./ui/ThreeCardProjects";
import ThreeCardGlobe from "./ui/ThreeCardGlobe";
import ThreeCardSatisfaction from "./ui/ThreeCardSatisfaction";
import ThreeCardFunnel from "./ui/ThreeCardFunnel";
import ThreeCardSpeed from "./ui/ThreeCardSpeed";
import ThreeCardRevenue from "./ui/ThreeCardRevenue";

export default function WhyChooseUsSection() {
  return (
    <section className="relative w-full bg-black text-white pt-24 sm:pt-32 pb-24 sm:pb-32 px-6 sm:px-12 lg:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16 sm:space-y-20">
        {/* Section Heading */}
        <div className="text-center flex flex-col items-center justify-center space-y-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.18] font-['Questrial',sans-serif] max-w-4xl">
            Why brands choose Promethean Labs for
            <br />
            Design &amp; Digital experience?
          </h2>
        </div>

        {/* 6 Interactive 3D WebGL Cards (2 Rows x 3 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Card 1: 200+ Projects Delivered */}
          <div className="group relative rounded-[32px] bg-[#0c0d12] border border-neutral-800/80 p-7 sm:p-8 flex flex-col justify-between min-h-[470px] shadow-2xl transition-all duration-500 hover:border-neutral-600 hover:shadow-[0_20px_50px_rgba(212,249,56,0.06)] overflow-hidden">
            <div className="space-y-1 z-10">
              <h3 className="text-4xl sm:text-5xl font-medium text-white font-['Questrial',sans-serif] tracking-tight">
                200+
              </h3>
              <p className="text-sm sm:text-base text-neutral-200 font-['Agrandir',sans-serif]">
                Projects Delivered
              </p>
            </div>
            <div className="my-2 flex items-center justify-center relative z-10">
              <ThreeCardProjects />
            </div>
            <div className="z-10 pt-2 border-t border-white/5">
              <p className="text-xs sm:text-sm text-neutral-300 font-['Questrial',sans-serif] leading-relaxed">
                Behind every digital product we engineer is a human experience. We craft interfaces that blend aesthetic perfection with seamless utility.
              </p>
            </div>
            <div className="absolute top-0 right-0 w-48 h-48 bg-[radial-gradient(circle,rgba(212,249,56,0.08)_0%,transparent_70%)] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </div>

          {/* Card 2: 50+ Global Specialists */}
          <div className="group relative rounded-[32px] bg-[#0c0d12] border border-neutral-800/80 p-7 sm:p-8 flex flex-col justify-between min-h-[470px] shadow-2xl transition-all duration-500 hover:border-neutral-600 hover:shadow-[0_20px_50px_rgba(212,249,56,0.06)] overflow-hidden">
            <div className="space-y-1 z-10">
              <h3 className="text-4xl sm:text-5xl font-medium text-white font-['Questrial',sans-serif] tracking-tight">
                50+
              </h3>
              <p className="text-sm sm:text-base text-neutral-200 font-['Agrandir',sans-serif]">
                Global Digital Specialists
              </p>
            </div>
            <div className="my-2 flex items-center justify-center relative z-10">
              <ThreeCardGlobe />
            </div>
            <div className="z-10 pt-2 border-t border-white/5">
              <p className="text-xs sm:text-sm text-neutral-300 font-['Questrial',sans-serif] leading-relaxed">
                What started as an ambitious studio is now 50+ elite designers &amp; digital engineers collaborating seamlessly across worldwide timezones.
              </p>
            </div>
            <div className="absolute top-0 right-0 w-48 h-48 bg-[radial-gradient(circle,rgba(56,189,248,0.08)_0%,transparent_70%)] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </div>

          {/* Card 3: 98% Client Satisfaction */}
          <div className="group relative rounded-[32px] bg-[#0c0d12] border border-neutral-800/80 p-7 sm:p-8 flex flex-col justify-between min-h-[470px] shadow-2xl transition-all duration-500 hover:border-neutral-600 hover:shadow-[0_20px_50px_rgba(212,249,56,0.06)] overflow-hidden">
            <div className="space-y-1 z-10">
              <h3 className="text-4xl sm:text-5xl font-medium text-white font-['Questrial',sans-serif] tracking-tight">
                98%
              </h3>
              <p className="text-sm sm:text-base text-neutral-200 font-['Agrandir',sans-serif]">
                Client Retention &amp; Trust
              </p>
            </div>
            <div className="my-2 flex items-center justify-center relative z-10">
              <ThreeCardSatisfaction />
            </div>
            <div className="z-10 pt-2 border-t border-white/5">
              <p className="text-xs sm:text-sm text-neutral-300 font-['Questrial',sans-serif] leading-relaxed">
                True partnership is measured by lasting impact. Our clients scale with us over the long term, backed by exceptional delivery and 5-star craft.
              </p>
            </div>
            <div className="absolute top-0 right-0 w-48 h-48 bg-[radial-gradient(circle,rgba(212,249,56,0.08)_0%,transparent_70%)] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </div>

          {/* Card 4: 15+ Industries Served */}
          <div className="group relative rounded-[32px] bg-[#0c0d12] border border-neutral-800/80 p-7 sm:p-8 flex flex-col justify-between min-h-[470px] shadow-2xl transition-all duration-500 hover:border-neutral-600 hover:shadow-[0_20px_50px_rgba(212,249,56,0.06)] overflow-hidden">
            <div className="space-y-1 z-10">
              <h3 className="text-4xl sm:text-5xl font-medium text-white font-['Questrial',sans-serif] tracking-tight">
                15+
              </h3>
              <p className="text-sm sm:text-base text-neutral-200 font-['Agrandir',sans-serif]">
                Industries Served
              </p>
            </div>
            <div className="my-2 flex items-center justify-center relative z-10">
              <ThreeCardFunnel />
            </div>
            <div className="z-10 pt-2 border-t border-white/5">
              <p className="text-xs sm:text-sm text-neutral-300 font-['Questrial',sans-serif] leading-relaxed">
                Fintech, SaaS, AI, Web3, and Enterprise — we adapt seamlessly to your domain with deep industry acumen and tailored product strategy.
              </p>
            </div>
            <div className="absolute top-0 right-0 w-48 h-48 bg-[radial-gradient(circle,rgba(212,249,56,0.08)_0%,transparent_70%)] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </div>

          {/* Card 5: 48hr Average Kickoff Time */}
          <div className="group relative rounded-[32px] bg-[#0c0d12] border border-neutral-800/80 p-7 sm:p-8 flex flex-col justify-between min-h-[470px] shadow-2xl transition-all duration-500 hover:border-neutral-600 hover:shadow-[0_20px_50px_rgba(212,249,56,0.06)] overflow-hidden">
            <div className="space-y-1 z-10">
              <h3 className="text-4xl sm:text-5xl font-medium text-white font-['Questrial',sans-serif] tracking-tight">
                48hr
              </h3>
              <p className="text-sm sm:text-base text-neutral-200 font-['Agrandir',sans-serif]">
                Average Kickoff Time
              </p>
            </div>
            <div className="my-2 flex items-center justify-center relative z-10">
              <ThreeCardSpeed />
            </div>
            <div className="z-10 pt-2 border-t border-white/5">
              <p className="text-xs sm:text-sm text-neutral-300 font-['Questrial',sans-serif] leading-relaxed">
                No prolonged onboarding or friction. We move at venture speed with agile sprints without ever cutting corners on engineering quality.
              </p>
            </div>
            <div className="absolute top-0 right-0 w-48 h-48 bg-[radial-gradient(circle,rgba(56,189,248,0.08)_0%,transparent_70%)] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </div>

          {/* Card 6: $2B+ Revenue Influenced */}
          <div className="group relative rounded-[32px] bg-[#0c0d12] border border-neutral-800/80 p-7 sm:p-8 flex flex-col justify-between min-h-[470px] shadow-2xl transition-all duration-500 hover:border-neutral-600 hover:shadow-[0_20px_50px_rgba(212,249,56,0.06)] overflow-hidden">
            <div className="space-y-1 z-10">
              <h3 className="text-4xl sm:text-5xl font-medium text-white font-['Questrial',sans-serif] tracking-tight">
                $2B+
              </h3>
              <p className="text-sm sm:text-base text-neutral-200 font-['Agrandir',sans-serif]">
                Revenue Influenced
              </p>
            </div>
            <div className="my-2 flex items-center justify-center relative z-10">
              <ThreeCardRevenue />
            </div>
            <div className="z-10 pt-2 border-t border-white/5">
              <p className="text-xs sm:text-sm text-neutral-300 font-['Questrial',sans-serif] leading-relaxed">
                Capital raised and enterprise valuation generated by our partners over the past decade. Exceptional design compounds returns.
              </p>
            </div>
            <div className="absolute top-0 right-0 w-48 h-48 bg-[radial-gradient(circle,rgba(212,249,56,0.08)_0%,transparent_70%)] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </div>
        </div>
      </div>
    </section>
  );
}
