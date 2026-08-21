"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ConsultationBannerSection() {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const teamAvatars = [
    { name: "Sarah Chen", role: "Design Lead", bg: "bg-emerald-600", text: "SC" },
    { name: "David Kim", role: "Product Strategist", bg: "bg-blue-600", text: "DK" },
    { name: "Alex Thorne", role: "Tech Architect", bg: "bg-neutral-800", text: "AT" },
    { name: "Elena Rostova", role: "UX Director", bg: "bg-purple-600", text: "ER" },
  ];

  const featureKeys = [
    { id: "audit", icon: "📞", title: "Quick product audit", row: "top", col: "col-span-1" },
    { id: "growth", icon: "🎯", title: "Growth direction", row: "top", col: "col-span-1" },
    { id: "expert", icon: "👤", title: "Expert perspective", row: "top", col: "col-span-1" },
    { id: "revenue", icon: "🚀", title: "$2B+ Revenue influenced", row: "bottom", col: "col-span-1" },
    { id: "onboarding", icon: "⏱️", title: "48h avg kickoff", row: "bottom", col: "col-span-1" },
  ];

  return (
    <section className="relative w-full bg-white text-gray-900 pt-10 sm:pt-16 pb-24 sm:pb-32 px-6 sm:px-12 lg:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Main Banner Card: Light Frosted Box with Stylized Keyboard Keys Grid */}
        <div className="relative rounded-[36px] sm:rounded-[44px] bg-[#f6f6f8] border border-neutral-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden p-8 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-[radial-gradient(circle,rgba(212,249,56,0.15)_0%,transparent_70%)] pointer-events-none" />

          {/* Left Column: Heading, Inline Team Avatars, Description, and Rolling Flip Button */}
          <div className="lg:col-span-6 space-y-7 z-10">
            {/* Pill Badge: ● Let's talk */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white border border-neutral-200/90 shadow-sm px-4 py-1.5 text-xs">
              <span className="h-2 w-2 rounded-full bg-[#a6f30d] animate-pulse" />
              <span className="font-['Questrial',sans-serif] tracking-wider text-neutral-800 font-medium">
                Let&apos;s talk
              </span>
            </div>

            {/* Main Title with Inline Avatar Stack */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-black tracking-tight text-neutral-950 leading-[1.18] font-['Agrandir',sans-serif]">
              Consult{" "}
              <span className="inline-flex items-center align-middle -space-x-2 sm:-space-x-2.5 mx-1.5">
                {teamAvatars.map((member, i) => (
                  <div
                    key={i}
                    title={`${member.name} • ${member.role}`}
                    className={`relative w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white ${member.bg} text-white text-[10px] sm:text-xs font-bold flex items-center justify-center shadow-md transform transition-transform hover:scale-115 hover:z-20 cursor-pointer`}
                  >
                    {member.text}
                  </div>
                ))}
              </span>{" "}
              strategy
              <br />
              to build stronger product
            </h2>

            {/* Subtitle / Description */}
            <p className="text-sm sm:text-base text-neutral-600 font-['Questrial',sans-serif] leading-relaxed max-w-md">
              30 minutes to understand your product, uncover the real problems, and figure out what actually needs to change to accelerate growth.
            </p>

            {/* Action Button: Book a Free Consultation dengan Rolling Flip Animation (Sama seperti Explore Our Services) */}
            <div className="pt-2">
              <Link
                href="/contact"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-[#d4f938] px-8 sm:px-9 py-3.5 sm:py-4 text-xs sm:text-sm font-bold tracking-wide text-black border border-[#c4eb28] shadow-md transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] hover:bg-[#111111] hover:border-black hover:shadow-xl active:scale-95"
              >
                {/* Layer 1: Teks Hitam Awal (Meluncur keluar ke atas saat hover) */}
                <span className="inline-flex items-center gap-2 font-['Questrial',sans-serif] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-[160%]">
                  Book a Free Consultation
                </span>

                {/* Layer 2: Teks Hijau Neon (Meluncur masuk dari bawah ke tengah saat hover) */}
                <span className="absolute inset-0 flex items-center justify-center gap-2 text-[#d4f938] font-['Questrial',sans-serif] translate-y-[160%] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0">
                  Book a Free Consultation
                </span>
              </Link>
            </div>
          </div>

          {/* Right Column: Stylized 3D Keyboard Keys Graphic Grid with Feature Tiles */}
          <div className="lg:col-span-6 relative w-full flex items-center justify-center">
            {/* Keyboard Frame Container */}
            <div className="relative w-full max-w-lg bg-[#ececf0] rounded-[28px] p-4 sm:p-5 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_15px_35px_rgba(0,0,0,0.06)] border border-neutral-300/70 select-none">

              {/* Row 1: Function Keys (F1, F2, F3, F4) */}
              <div className="grid grid-cols-4 gap-2 mb-2.5 opacity-60">
                {["F1", "F2", "F3", "F4"].map((key) => (
                  <div
                    key={key}
                    className="h-7 rounded-lg bg-white/70 border border-neutral-300/80 shadow-[0_2px_0_#cbd5e1] flex items-center justify-center text-[10px] font-bold text-neutral-500 font-mono"
                  >
                    {key}
                  </div>
                ))}
              </div>

              {/* Row 2: Number Keys (~, 1, 2, 3, 4) */}
              <div className="grid grid-cols-5 gap-2 mb-2.5 opacity-50">
                {["~", "1", "2", "3", "4"].map((key) => (
                  <div
                    key={key}
                    className="h-8 rounded-lg bg-white/70 border border-neutral-300/80 shadow-[0_2px_0_#cbd5e1] flex items-center justify-center text-[11px] font-bold text-neutral-500 font-mono"
                  >
                    {key}
                  </div>
                ))}
              </div>

              {/* Row 3: Prominent Interactive Feature Keys (Top Row) */}
              <div className="grid grid-cols-3 gap-2.5 mb-2.5">
                {featureKeys.slice(0, 3).map((item) => {
                  const isHover = activeKey === item.id;
                  return (
                    <div
                      key={item.id}
                      onMouseEnter={() => setActiveKey(item.id)}
                      onMouseLeave={() => setActiveKey(null)}
                      className={`h-24 sm:h-28 rounded-2xl bg-white border border-neutral-200/90 p-3 sm:p-3.5 flex flex-col justify-between shadow-[0_4px_0_#cbd5e1,0_8px_20px_rgba(0,0,0,0.04)] transition-all duration-300 cursor-pointer ${isHover
                          ? "translate-y-1 shadow-[0_1px_0_#cbd5e1] border-[#a6f30d] bg-neutral-900 text-white"
                          : "hover:-translate-y-0.5 text-neutral-900"
                        }`}
                    >
                      <div className="text-base sm:text-lg">{item.icon}</div>
                      <p
                        className={`text-[11px] sm:text-xs font-bold leading-tight font-['Agrandir',sans-serif] ${isHover ? "text-[#d4f938]" : "text-neutral-900"
                          }`}
                      >
                        {item.title}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Row 4: Prominent Feature Keys (Bottom Row) + Side Keys */}
              <div className="grid grid-cols-4 gap-2.5 mb-2.5">
                {/* 2 Big Feature Keys */}
                {featureKeys.slice(3, 5).map((item) => {
                  const isHover = activeKey === item.id;
                  return (
                    <div
                      key={item.id}
                      onMouseEnter={() => setActiveKey(item.id)}
                      onMouseLeave={() => setActiveKey(null)}
                      className={`col-span-1.5 sm:col-span-1 h-22 sm:h-26 rounded-2xl bg-white border border-neutral-200/90 p-3 flex flex-col justify-between shadow-[0_4px_0_#cbd5e1,0_8px_20px_rgba(0,0,0,0.04)] transition-all duration-300 cursor-pointer ${isHover
                          ? "translate-y-1 shadow-[0_1px_0_#cbd5e1] border-[#a6f30d] bg-neutral-900 text-white"
                          : "hover:-translate-y-0.5 text-neutral-900"
                        }`}
                    >
                      <div className="text-base">{item.icon}</div>
                      <p
                        className={`text-[10px] sm:text-[11px] font-bold leading-tight font-['Agrandir',sans-serif] ${isHover ? "text-[#d4f938]" : "text-neutral-900"
                          }`}
                      >
                        {item.title}
                      </p>
                    </div>
                  );
                })}

                {/* Additional Alphabet Keys (S, D) */}
                {["S", "D"].map((key) => (
                  <div
                    key={key}
                    className="h-22 sm:h-26 rounded-2xl bg-white/75 border border-neutral-300/80 shadow-[0_3px_0_#cbd5e1] flex items-center justify-center text-sm font-bold text-neutral-500 font-mono opacity-80"
                  >
                    {key}
                  </div>
                ))}
              </div>

              {/* Row 5: Bottom Alphabet Row (Shift, Z, X, C) */}
              <div className="grid grid-cols-4 gap-2 opacity-50">
                {["⇧", "Z", "X", "C"].map((key) => (
                  <div
                    key={key}
                    className="h-9 rounded-xl bg-white/70 border border-neutral-300/80 shadow-[0_2px_0_#cbd5e1] flex items-center justify-center text-xs font-bold text-neutral-500 font-mono"
                  >
                    {key}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
