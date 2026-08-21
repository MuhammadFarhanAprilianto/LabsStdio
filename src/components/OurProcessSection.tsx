"use client";

import React, { useState, useEffect } from "react";

interface ProcessStep {
  id: string;
  tabTitle: string;
  badgeIcons: string[];
  headline: string;
  subheadline: string;
  cards: {
    title: string;
    subtitle: string;
    color: string;
    textColor: string;
  }[];
}

const processSteps: ProcessStep[] = [
  {
    id: "discovery",
    tabTitle: "Discovery",
    badgeIcons: ["🔍", "💡", "🎯"],
    headline: "Uncover. Align. Strategize.",
    subheadline:
      "We dive deep into your brand vision, business model, and target audience to define a clear product roadmap.",
    cards: [
      {
        title: "Stakeholder Alignment",
        subtitle: "Vision & Goals Mapping",
        color: "bg-[#2563eb]",
        textColor: "text-white",
      },
      {
        title: "Market Analysis",
        subtitle: "Competitor Benchmarking",
        color: "bg-[#38bdf8]",
        textColor: "text-black",
      },
      {
        title: "Feature Scope",
        subtitle: "Core Architecture Definition",
        color: "bg-[#d4f938]",
        textColor: "text-black",
      },
    ],
  },
  {
    id: "research",
    tabTitle: "Research",
    badgeIcons: ["📊", "🧠", "🗺️"],
    headline: "Data-Driven. User-Centric.",
    subheadline:
      "Understanding user behaviors, personas, and conversion touchpoints to eliminate guesswork from design.",
    cards: [
      {
        title: "User Personas",
        subtitle: "Behavioral Profiles",
        color: "bg-[#ea580c]",
        textColor: "text-white",
      },
      {
        title: "Journey Mapping",
        subtitle: "Friction & Dropoff Audits",
        color: "bg-[#f59e0b]",
        textColor: "text-black",
      },
      {
        title: "Insight Synthesis",
        subtitle: "Actionable UX Requirements",
        color: "bg-[#a6f30d]",
        textColor: "text-black",
      },
    ],
  },
  {
    id: "uiux",
    tabTitle: "UI/UX Design",
    badgeIcons: ["🎨", "✨", "📐"],
    headline: "Aesthetic Polish. Seamless Utility.",
    subheadline:
      "Crafting high-fidelity wireframes, design systems, and micro-interactions that elevate brand perception.",
    cards: [
      {
        title: "Design System",
        subtitle: "Scalable UI Tokens & Assets",
        color: "bg-[#ec4899]",
        textColor: "text-white",
      },
      {
        title: "Interactive Prototypes",
        subtitle: "Motion & Micro-Interactions",
        color: "bg-[#a855f7]",
        textColor: "text-white",
      },
      {
        title: "Final Art Direction",
        subtitle: "Production-Ready Mockups",
        color: "bg-[#d4f938]",
        textColor: "text-black",
      },
    ],
  },
  {
    id: "development",
    tabTitle: "Development",
    badgeIcons: ["⚡", "💻", "🚀"],
    headline: "Precision Code. Scalable Engineering.",
    subheadline:
      "Building lightning-fast, reactive web applications with Next.js, Three.js WebGL, and robust backend architecture.",
    cards: [
      {
        title: "Next.js & React",
        subtitle: "Modular Component Architecture",
        color: "bg-[#10b981]",
        textColor: "text-black",
      },
      {
        title: "3D & WebGL Shaders",
        subtitle: "Hardware-Accelerated Visuals",
        color: "bg-[#06b6d4]",
        textColor: "text-black",
      },
      {
        title: "API & Performance",
        subtitle: "Sub-Second Load Times",
        color: "bg-[#d4f938]",
        textColor: "text-black",
      },
    ],
  },
  {
    id: "testing",
    tabTitle: "QA Testing",
    badgeIcons: ["🛡️", "⚙️", "✅"],
    headline: "Tested. Approved. Delivered.",
    subheadline:
      "Every screen, flow, and interaction tested thoroughly before anything goes live.",
    cards: [
      {
        title: "Requirement Analysis",
        subtitle: "User Journey Mapping",
        color: "bg-[#f97316]",
        textColor: "text-white",
      },
      {
        title: "Test Planning",
        subtitle: "Edge Case Validation",
        color: "bg-[#f1f5f9]",
        textColor: "text-black",
      },
      {
        title: "Test Execution & Reporting",
        subtitle: "Cross-Device Verification",
        color: "bg-[#bef264]",
        textColor: "text-black",
      },
      {
        title: "Test Design",
        subtitle: "Performance & Stress Testing",
        color: "bg-[#bae6fd]",
        textColor: "text-black",
      },
      {
        title: "Retesting & Regressions",
        subtitle: "Zero-Defect Verification",
        color: "bg-[#fef08a]",
        textColor: "text-black",
      },
      {
        title: "Release Testing",
        subtitle: "Final Production Signoff",
        color: "bg-[#22c55e]",
        textColor: "text-black",
      },
    ],
  },
  {
    id: "launch",
    tabTitle: "Launch",
    badgeIcons: ["🌐", "🚀", "📈"],
    headline: "Deploy. Scale. Dominate.",
    subheadline:
      "Seamless production deployment with continuous monitoring, SEO optimization, and handover training.",
    cards: [
      {
        title: "Cloud Deployment",
        subtitle: "Zero-Downtime Migration",
        color: "bg-[#6366f1]",
        textColor: "text-white",
      },
      {
        title: "SEO & Analytics",
        subtitle: "Tracking & Conversion Setup",
        color: "bg-[#38bdf8]",
        textColor: "text-black",
      },
      {
        title: "Growth Handover",
        subtitle: "Documentation & Ongoing Support",
        color: "bg-[#d4f938]",
        textColor: "text-black",
      },
    ],
  },
];

export default function OurProcessSection() {
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Auto-advance loop ketat dan berurutan: 0 -> 1 -> 2 -> 3 -> 4 -> 5 -> 0 (tanpa lompat)
  useEffect(() => {
    if (isPaused) return;

    const DURATION = 5000; // 5 detik per tahap
    const INTERVAL = 40; // update setiap 40ms
    let localProgress = 0;

    const timer = setInterval(() => {
      localProgress += (INTERVAL / DURATION) * 100;
      if (localProgress >= 100) {
        localProgress = 0;
        setActiveTabIndex((prev) => (prev + 1) % processSteps.length);
      }
      setProgress(localProgress);
    }, INTERVAL);

    return () => clearInterval(timer);
  }, [isPaused]);

  const handleTabClick = (index: number) => {
    setActiveTabIndex(index);
    setProgress(0);
  };

  const currentStep = processSteps[activeTabIndex] || processSteps[0];

  return (
    <section className="relative w-full bg-black text-white pt-24 sm:pt-32 pb-24 sm:pb-32 px-6 sm:px-12 lg:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Main 2-Column Grid (Rata Tengah Vertikal / items-center) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Heading & Description (Rata tengah vertikal dengan kartu di kanan) */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
            {/* Pill Badge: ● Our Process */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#181a20] border border-neutral-800 text-white px-4 py-1.5 text-xs shadow-md">
                <span className="h-2 w-2 rounded-full bg-[#d4f938] animate-pulse" />
                <span className="font-['Questrial',sans-serif] tracking-wider text-neutral-300 font-medium">
                  Our Process
                </span>
              </div>
            </div>

            {/* Main Title: How We Get It Done. */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.08] font-['Questrial',sans-serif]">
              How We Get It
              <br />
              Done.
            </h2>

            {/* Subtitle / Description */}
            <p className="text-sm sm:text-base text-neutral-400 font-['Questrial',sans-serif] leading-relaxed max-w-md">
              Every step, done right. From discovery to launch structured,
              smooth, and built to deliver exceptional digital experiences.
            </p>
          </div>

          {/* Right Column: Top Navigation Tabs (Rata Tengah dengan Kartu) + Process Display Card */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-4 w-full">
            {/* Top Navigation Tabs: Rata Tengah Horizontal (justify-center) */}
            <div className="w-full flex items-center justify-center gap-3 sm:gap-6 lg:gap-7 pb-1.5">
              {processSteps.map((step, idx) => {
                const isActive = activeTabIndex === idx;
                return (
                  <button
                    key={step.id}
                    onClick={() => handleTabClick(idx)}
                    className={`group relative py-1 text-xs sm:text-sm tracking-wide transition-colors duration-300 font-['Questrial',sans-serif] cursor-pointer ${
                      isActive
                        ? "text-white font-bold"
                        : "text-neutral-500 hover:text-white font-normal"
                    }`}
                  >
                    {step.tabTitle}

                    {/* Garis Loading Progress Aktif (0% -> 100% selama 5s) */}
                    {isActive ? (
                      <div className="absolute bottom-[-5px] left-0 right-0 h-[2px] bg-neutral-800/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#d4f938] shadow-[0_0_8px_#d4f938] rounded-full transition-all duration-75 ease-linear"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    ) : (
                      /* Garis Hover Halus yang muncul saat di-hover dan pudar saat mouse keluar */
                      <div className="absolute bottom-[-5px] left-0 right-0 h-[2px] bg-white/40 rounded-full opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Process Display Card Container (Berhenti otomatis saat kursor mouse dihover di sini) */}
            <div
              className="relative rounded-[32px] sm:rounded-[36px] bg-[#10121a] border border-neutral-800/90 p-7 sm:p-10 shadow-2xl overflow-hidden min-h-[440px] sm:min-h-[500px] flex flex-col justify-between transition-all duration-500 hover:border-neutral-700"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Glowing Ambient Background Aura */}
              <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-[radial-gradient(circle,rgba(212,249,56,0.1)_0%,transparent_70%)] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-[radial-gradient(circle,rgba(34,197,94,0.08)_0%,transparent_70%)] pointer-events-none" />

              {/* Card Header: Tool / Icon Badges */}
              <div className="relative z-10 flex items-center gap-2.5">
                {currentStep.badgeIcons.map((icon, idx) => (
                  <div
                    key={idx}
                    className="w-8 h-8 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-sm shadow"
                  >
                    {icon}
                  </div>
                ))}
              </div>

              {/* Card Center: Step Headline & Description */}
              <div className="relative z-10 text-center my-6 space-y-2">
                <h3 className="text-2xl sm:text-3xl font-black text-white font-['Agrandir',sans-serif] tracking-tight">
                  {currentStep.headline}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 font-['Questrial',sans-serif] max-w-lg mx-auto leading-relaxed">
                  {currentStep.subheadline}
                </p>
              </div>

              {/* Card Center: Overlapping Stack of Cards */}
              <div className="relative z-10 flex items-center justify-center overflow-x-auto py-6 sm:py-8">
                <div className="flex items-center -space-x-4 sm:-space-x-6 hover:space-x-2 transition-all duration-500">
                  {currentStep.cards.map((card, idx) => (
                    <div
                      key={idx}
                      className={`relative w-[130px] sm:w-[155px] h-[160px] sm:h-[185px] rounded-[18px] sm:rounded-[22px] p-3.5 sm:p-4 flex flex-col justify-between shadow-[0_15px_35px_rgba(0,0,0,0.6)] border border-black/15 transform transition-all duration-400 hover:-translate-y-4 hover:scale-105 cursor-pointer ${
                        card.color
                      } ${card.textColor} select-none`}
                      style={{
                        transform: `rotate(${
                          (idx - Math.floor(currentStep.cards.length / 2)) * 3
                        }deg)`,
                      }}
                    >
                      <div className="space-y-1">
                        <h4 className="text-xs sm:text-[13px] font-bold leading-tight font-['Agrandir',sans-serif]">
                          {card.title}
                        </h4>
                        <p className="text-[9px] sm:text-[10px] opacity-85 font-['Questrial',sans-serif] leading-tight">
                          {card.subtitle}
                        </p>
                      </div>

                      {/* Bottom Wireframe Bars */}
                      <div className="space-y-1 pt-2">
                        <div className="h-1.5 w-12 rounded-full bg-black/20" />
                        <div className="h-1.5 w-7 rounded-full bg-black/15" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Custom Cursor Pill (e.g. Galib ↗) */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#d4f938] px-3.5 py-1 text-[11px] font-bold text-black shadow-[0_0_15px_rgba(212,249,56,0.6)] font-['Questrial',sans-serif]">
                  <span>Galib</span>
                  <span>↗</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
