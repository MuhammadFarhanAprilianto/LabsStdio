"use client";

import React from "react";

// Kumpulan Logo Brand & Perusahaan Berukuran Lebih Besar & Tegas
const row1Logos = [
  {
    name: "BLANQS",
    element: (
      <div className="flex items-center gap-2 text-white font-mono text-2xl sm:text-3xl font-black tracking-[0.35em] opacity-90 hover:opacity-100 transition-opacity">
        B L A N Q S
      </div>
    ),
  },
  {
    name: "Crecer.ai",
    element: (
      <div className="flex items-center gap-2 text-3xl sm:text-4xl font-black tracking-tight text-white hover:text-[#22c55e] transition-colors">
        <span className="text-[#22c55e]">Crecer.</span>
        <span className="text-sm px-2 py-0.5 rounded-md bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/40 font-bold">
          ai
        </span>
      </div>
    ),
  },
  {
    name: "Berlitz",
    element: (
      <div className="text-3xl sm:text-4xl font-black tracking-tighter text-[#2563eb] italic hover:text-[#3b82f6] transition-colors">
        Berlitz
      </div>
    ),
  },
  {
    name: "FORTIFIED ROOFING",
    element: (
      <div className="px-4 py-2 border-2 border-slate-400/80 bg-slate-900/60 rounded-md text-center text-sm sm:text-base font-black tracking-widest text-slate-100 uppercase shadow-md">
        <div>FORTIFIED</div>
        <div className="text-[10px] sm:text-[11px] text-slate-400 tracking-[0.3em]">ROOFING</div>
      </div>
    ),
  },
  {
    name: "TeleTraining",
    element: (
      <div className="flex items-center gap-2.5 text-white font-medium text-2xl sm:text-3xl tracking-tight">
        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-[#0284c7] text-white text-sm font-black flex items-center justify-center shadow">
          TT
        </span>
        <span className="font-serif italic font-bold">TeleTraining</span>
      </div>
    ),
  },
  {
    name: "Stripe",
    element: (
      <div className="text-3xl sm:text-4xl font-black tracking-tight text-[#635bff] hover:text-[#7a73ff] transition-colors">
        stripe
      </div>
    ),
  },
  {
    name: "Vercel",
    element: (
      <div className="flex items-center gap-2.5 text-white font-bold text-2xl sm:text-3xl tracking-wide">
        <svg className="w-6 h-6 sm:w-7 sm:h-7 fill-white" viewBox="0 0 24 24">
          <path d="M12 2L2 19.7778H22L12 2Z" />
        </svg>
        <span>Vercel</span>
      </div>
    ),
  },
];

const row2Logos = [
  {
    name: "Microsoft",
    element: (
      <div className="flex items-center gap-3 text-white font-semibold text-2xl sm:text-3xl tracking-tight">
        <div className="grid grid-cols-2 gap-1 w-5 h-5 sm:w-6 sm:h-6">
          <div className="bg-[#f25022] w-2.5 h-2.5" />
          <div className="bg-[#7fba00] w-2.5 h-2.5" />
          <div className="bg-[#00a4ef] w-2.5 h-2.5" />
          <div className="bg-[#ffb900] w-2.5 h-2.5" />
        </div>
        <span className="text-slate-100 font-medium">Microsoft</span>
      </div>
    ),
  },
  {
    name: "eCom Triage",
    element: (
      <div className="flex items-center gap-2.5 text-white font-bold text-xl sm:text-2xl">
        <div className="w-8 h-8 rounded-full border-2 border-red-500 flex items-center justify-center text-red-500 text-sm font-black">
          T
        </div>
        <span className="tracking-tight">eCom Triage</span>
      </div>
    ),
  },
  {
    name: "reviewinc",
    element: (
      <div className="flex items-center gap-2 text-white font-bold text-2xl sm:text-3xl tracking-tight">
        <span className="text-white text-2xl">📍</span>
        <span className="font-sans lowercase text-slate-100">reviewinc</span>
      </div>
    ),
  },
  {
    name: "POWER SYNCH",
    element: (
      <div className="flex items-center gap-2.5 text-[#22c55e] font-black text-xl sm:text-2xl tracking-wider">
        <span className="text-2xl">⚡</span>
        <div className="leading-none text-left">
          <div className="text-xs text-white tracking-widest font-normal">POWER</div>
          <div className="text-base sm:text-lg text-[#22c55e]">SYNCH</div>
        </div>
      </div>
    ),
  },
  {
    name: "Linear",
    element: (
      <div className="flex items-center gap-2.5 text-white font-semibold text-2xl sm:text-3xl tracking-tight">
        <svg className="w-6 h-6 sm:w-7 sm:h-7 fill-white" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" />
        </svg>
        <span className="font-mono">Linear</span>
      </div>
    ),
  },
  {
    name: "Figma",
    element: (
      <div className="flex items-center gap-2.5 text-white font-bold text-2xl sm:text-3xl tracking-tight">
        <div className="flex -space-x-1.5">
          <span className="w-4 h-4 rounded-full bg-[#f24e1e] inline-block" />
          <span className="w-4 h-4 rounded-full bg-[#a259ff] inline-block" />
          <span className="w-4 h-4 rounded-full bg-[#1abcfe] inline-block" />
        </div>
        <span>Figma</span>
      </div>
    ),
  },
];

const row3Logos = [
  {
    name: "Cenario.ai",
    element: (
      <div className="flex items-center gap-2.5 text-white font-medium text-2xl sm:text-3xl tracking-tight">
        <div className="w-8 h-8 rounded-full border-2 border-white/50 flex items-center justify-center text-sm">
          🌐
        </div>
        <span>Cenario.ai</span>
      </div>
    ),
  },
  {
    name: "JUDYCO.",
    element: (
      <div className="text-2xl sm:text-3xl font-black text-white tracking-[0.25em] font-sans">
        JUDYCO.
      </div>
    ),
  },
  {
    name: "SQUIRE",
    element: (
      <div className="px-4 py-1.5 rounded-t-full bg-gradient-to-b from-blue-700 to-blue-900 border border-blue-400/50 text-center text-sm font-black text-amber-300 tracking-wider shadow">
        SQUIRE
      </div>
    ),
  },
  {
    name: "QORE LOGIQ",
    element: (
      <div className="flex items-center gap-2 text-white font-bold text-xl sm:text-2xl tracking-wider">
        <span className="text-cyan-400 text-2xl">💠</span>
        <span className="text-slate-100">QORE LOGIQ</span>
      </div>
    ),
  },
  {
    name: "ROMULUS LABS",
    element: (
      <div className="text-left font-black tracking-wider text-indigo-400 text-base sm:text-xl border-b-2 border-indigo-400/60 pb-0.5">
        ROMULUS <span className="text-xs sm:text-sm text-white/80 font-normal">LABS</span>
      </div>
    ),
  },
  {
    name: "Supabase",
    element: (
      <div className="flex items-center gap-2.5 text-white font-bold text-2xl sm:text-3xl tracking-tight">
        <span className="text-[#3ecf8e] text-3xl">⚡</span>
        <span className="text-[#3ecf8e]">supabase</span>
      </div>
    ),
  },
  {
    name: "Raycast",
    element: (
      <div className="flex items-center gap-2.5 text-white font-bold text-2xl sm:text-3xl tracking-tight">
        <span className="text-[#ff6363] text-2xl">🔴</span>
        <span>Raycast</span>
      </div>
    ),
  },
];

export default function ProjectsCompletedSection() {
  // Duplikasi baris untuk infinite marquee tanpa celah
  const marqueeRow1 = [...row1Logos, ...row1Logos, ...row1Logos, ...row1Logos];
  const marqueeRow2 = [...row2Logos, ...row2Logos, ...row2Logos, ...row2Logos];
  const marqueeRow3 = [...row3Logos, ...row3Logos, ...row3Logos, ...row3Logos];

  return (
    <section className="relative w-full bg-black py-14 sm:py-18 overflow-hidden select-none">
      {/* Section Title: PROJECTS COMPLETED FOR */}
      <div className="max-w-7xl mx-auto px-6 text-center mb-8 sm:mb-12">
        <h2 className="text-base sm:text-lg md:text-xl font-bold tracking-[0.32em] text-[#a6f30d] uppercase font-['Agrandir',sans-serif]">
          PROJECTS COMPLETED FOR
        </h2>
      </div>

      {/* Edge gradient fade mask hitam pekat */}
      <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-44 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-44 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none" />

      {/* Marquee Rows Container - Spacing lebih rapat & proporsional */}
      <div className="space-y-7 sm:space-y-9 overflow-hidden">
        {/* Baris 1: Bergerak dari KANAN ke KIRI */}
        <div className="flex overflow-hidden">
          <div className="flex items-center gap-16 sm:gap-24 shrink-0 animate-marquee-left will-change-transform py-1.5">
            {marqueeRow1.map((item, idx) => (
              <div
                key={`r1-${idx}`}
                className="flex items-center justify-center shrink-0 min-w-[180px] sm:min-w-[220px] opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                {item.element}
              </div>
            ))}
          </div>
        </div>

        {/* Baris 2: Bergerak dari KIRI ke KANAN */}
        <div className="flex overflow-hidden">
          <div className="flex items-center gap-16 sm:gap-24 shrink-0 animate-marquee-right will-change-transform py-1.5">
            {marqueeRow2.map((item, idx) => (
              <div
                key={`r2-${idx}`}
                className="flex items-center justify-center shrink-0 min-w-[180px] sm:min-w-[220px] opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                {item.element}
              </div>
            ))}
          </div>
        </div>

        {/* Baris 3: Bergerak dari KANAN ke KIRI */}
        <div className="flex overflow-hidden">
          <div className="flex items-center gap-16 sm:gap-24 shrink-0 animate-marquee-left will-change-transform py-1.5">
            {marqueeRow3.map((item, idx) => (
              <div
                key={`r3-${idx}`}
                className="flex items-center justify-center shrink-0 min-w-[180px] sm:min-w-[220px] opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                {item.element}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
