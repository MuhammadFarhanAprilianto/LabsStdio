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
        <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-none stroke-current stroke-2 text-white" viewBox="0 0 24 24">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
          <circle cx="12" cy="9" r="2.5" />
        </svg>
        <span className="font-sans lowercase text-slate-100">reviewinc</span>
      </div>
    ),
  },
  {
    name: "POWER SYNCH",
    element: (
      <div className="flex items-center gap-2.5 text-[#22c55e] font-black text-xl sm:text-2xl tracking-wider">
        <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current text-[#22c55e]" viewBox="0 0 24 24">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
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
        <div className="w-8 h-8 rounded-full border-2 border-white/50 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
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
        <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current text-cyan-400" viewBox="0 0 24 24">
          <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
        </svg>
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
        <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current text-[#3ecf8e]" viewBox="0 0 24 24">
          <path d="M21.362 9.354H12V.396a.396.396 0 0 0-.716-.233L.116 14.162a.396.396 0 0 0 .316.634H12v8.958a.396.396 0 0 0 .716.233l11.168-13.999a.396.396 0 0 0-.522-.634z" />
        </svg>
        <span className="text-[#3ecf8e]">supabase</span>
      </div>
    ),
  },
  {
    name: "Raycast",
    element: (
      <div className="flex items-center gap-2.5 text-white font-bold text-2xl sm:text-3xl tracking-tight">
        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#ff6363] shadow-[0_0_8px_#ff6363]" />
        <span>Raycast</span>
      </div>
    ),
  },
];

import ScrollReveal from "@/components/ui/ScrollReveal";

export default function ProjectsCompletedSection() {
  // Duplikasi baris untuk infinite marquee tanpa celah
  const marqueeRow1 = [...row1Logos, ...row1Logos, ...row1Logos, ...row1Logos];
  const marqueeRow2 = [...row2Logos, ...row2Logos, ...row2Logos, ...row2Logos];
  const marqueeRow3 = [...row3Logos, ...row3Logos, ...row3Logos, ...row3Logos];

  return (
    <section className="relative w-full bg-black pt-14 sm:pt-12 pb-14 sm:pb-12 overflow-hidden select-none">
      {/* Section Title: PROJECTS COMPLETED FOR */}
      <ScrollReveal distance={24} blur={12} duration={800}>
        <div className="max-w-7xl mx-auto px-6 text-center mb-6 sm:mb-8">
          <h2 className="text-base sm:text-lg md:text-xl font-bold tracking-[0.32em] text-[#a6f30d] uppercase font-['Questrial',sans-serif]">
            PROJECTS COMPLETED FOR
          </h2>
        </div>
      </ScrollReveal>

      {/* Edge gradient fade mask hitam pekat */}
      <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-44 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-44 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none" />

      {/* Marquee Rows Container with Blur-to-Clear Scroll Reveal */}
      <ScrollReveal distance={32} blur={14} delay={100} duration={850}>
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
      </ScrollReveal>
    </section>
  );
}

