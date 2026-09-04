"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";

interface ProcessStep {
  id: string;
  tabTitle: string;
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
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const carouselRef = useRef<HTMLDivElement | null>(null);
  const isHoveredRef = useRef<boolean>(false);
  const isDraggingRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const scrollLeftRef = useRef<number>(0);

  const currentStep = processSteps[activeTabIndex] || processSteps[0];

  // Repeat cards so infinite scroll is smooth in both directions (minimum 3 sets or 12 cards)
  const repeatCount = useMemo(() => {
    return Math.max(3, Math.ceil(12 / Math.max(1, currentStep.cards.length)));
  }, [currentStep.cards.length]);

  const displayCards = useMemo(() => {
    return Array.from({ length: repeatCount })
      .flatMap(() => currentStep.cards);
  }, [currentStep.cards, repeatCount]);

  // Normalisasi posisi scroll agar looping terus-menerus tanpa pernah mentok
  const normalizeScrollPosition = () => {
    const el = carouselRef.current;
    if (!el) return;
    const singleSetWidth = el.scrollWidth / repeatCount;
    if (singleSetWidth <= 10) return;

    if (el.scrollLeft >= singleSetWidth * (repeatCount - 1)) {
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

  // Set initial scroll position to middle set on mount or tab change
  useEffect(() => {
    const el = carouselRef.current;
    if (el) {
      // Delay briefly for layout paint
      const timer = setTimeout(() => {
        const singleSetWidth = el.scrollWidth / repeatCount;
        el.scrollLeft = singleSetWidth;
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [activeTabIndex, repeatCount]);

  // Smooth continuous auto-drift when not hovered or dragged
  useEffect(() => {
    let animId: number;

    const step = () => {
      const el = carouselRef.current;
      if (el && !isHoveredRef.current && !isDraggingRef.current) {
        el.scrollLeft += 0.55;
        normalizeScrollPosition();
      }
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [repeatCount]);

  // Auto-advance loop antar tab (0 -> 1 -> 2 -> 3 -> 4 -> 5 -> 0)
  useEffect(() => {
    if (isPaused || isDragging) return;

    const DURATION = 6000; // 6 detik per tahap
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
  }, [isPaused, isDragging]);

  const handleTabClick = (index: number) => {
    setActiveTabIndex(index);
    setProgress(0);
  };

  // Drag-to-scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    setIsDragging(true);
    startXRef.current = e.pageX - (carouselRef.current?.offsetLeft || 0);
    scrollLeftRef.current = carouselRef.current?.scrollLeft || 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - (carouselRef.current.offsetLeft || 0);
    const walk = (x - startXRef.current) * 1.5;
    carouselRef.current.scrollLeft = scrollLeftRef.current - walk;
    normalizeScrollPosition();
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  const handleMouseLeaveContainer = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
    isHoveredRef.current = false;
    setIsPaused(false);
  };

  // Wheel / Trackpad scroll horizontal
  const handleWheel = (e: React.WheelEvent) => {
    const el = carouselRef.current;
    if (!el) return;

    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      // User is scrolling horizontally
      normalizeScrollPosition();
      return;
    }

    if (Math.abs(e.deltaY) > 1) {
      el.scrollLeft += e.deltaY * 0.9;
      normalizeScrollPosition();
    }
  };

  const handleScroll = () => {
    normalizeScrollPosition();
  };

  return (
    <section className="relative w-full bg-black text-white pt-24 sm:pt-32 pb-24 sm:pb-32 px-6 sm:px-12 lg:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Heading & Description */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.08] font-['Questrial',sans-serif]">
              How We Get It
              <br />
              Done.
            </h2>

            <p className="text-sm sm:text-base text-neutral-300 font-['Questrial',sans-serif] leading-relaxed max-w-md">
              Every step, done right. From discovery to launch structured,
              smooth, and built to deliver exceptional digital experiences.
            </p>
          </div>

          {/* Right Column: Top Navigation Tabs + Process Display Card */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-4 w-full">
            {/* Top Navigation Tabs */}
            <div className="w-full flex items-center justify-center gap-3 sm:gap-6 lg:gap-7 pb-1.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {processSteps.map((step, idx) => {
                const isActive = activeTabIndex === idx;
                return (
                  <button
                    key={step.id}
                    onClick={() => handleTabClick(idx)}
                    className={`group relative py-1 text-xs sm:text-sm tracking-wide transition-colors duration-300 font-['Questrial',sans-serif] cursor-pointer whitespace-nowrap ${
                      isActive
                        ? "text-white font-bold"
                        : "text-neutral-400 hover:text-white font-normal"
                    }`}
                  >
                    {step.tabTitle}

                    {/* Active tab progress line */}
                    {isActive ? (
                      <div className="absolute bottom-[-5px] left-0 right-0 h-[2px] bg-neutral-800/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#d4f938] shadow-[0_0_8px_#d4f938] rounded-full transition-all duration-75 ease-linear"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    ) : (
                      <div className="absolute bottom-[-5px] left-0 right-0 h-[2px] bg-white/40 rounded-full opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Process Display Card Container */}
            <div
              className="relative rounded-[32px] sm:rounded-[36px] bg-[#10121a] border border-neutral-800/90 p-6 sm:p-9 shadow-2xl overflow-hidden min-h-[420px] sm:min-h-[480px] flex flex-col justify-between transition-all duration-500 hover:border-neutral-700"
              onMouseEnter={() => {
                setIsPaused(true);
                isHoveredRef.current = true;
              }}
              onMouseLeave={handleMouseLeaveContainer}
            >
              {/* Glowing Ambient Background Aura */}
              <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-[radial-gradient(circle,rgba(212,249,56,0.1)_0%,transparent_70%)] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-[radial-gradient(circle,rgba(34,197,94,0.08)_0%,transparent_70%)] pointer-events-none" />

              {/* Step Headline & Description */}
              <div className="relative z-10 text-center my-4 space-y-2">
                <h3 className="text-2xl sm:text-3xl font-black text-white font-['Agrandir',sans-serif] tracking-tight">
                  {currentStep.headline}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 font-['Questrial',sans-serif] max-w-lg mx-auto leading-relaxed">
                  {currentStep.subheadline}
                </p>
              </div>

              {/* Infinite Looping Cards Showcase */}
              <div
                ref={carouselRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onWheel={handleWheel}
                onScroll={handleScroll}
                tabIndex={0}
                role="region"
                aria-label="Process step cards infinite showcase"
                className={`relative z-10 w-full overflow-x-auto py-6 sm:py-8 select-none focus:outline-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
                  isDragging ? "cursor-grabbing" : "cursor-grab"
                }`}
              >
                <div className="inline-flex items-center -space-x-3 sm:-space-x-5 hover:space-x-2 transition-[spacing] duration-500 px-6">
                  {displayCards.map((card, idx) => {
                    const rot = ((idx % currentStep.cards.length) - Math.floor(currentStep.cards.length / 2)) * 2.5;
                    return (
                      <div
                        key={idx}
                        className={`relative w-[135px] sm:w-[160px] h-[165px] sm:h-[190px] flex-shrink-0 rounded-[20px] sm:rounded-[24px] p-4 flex flex-col justify-between shadow-[0_15px_35px_rgba(0,0,0,0.6)] border border-black/15 transform transition-all duration-300 hover:-translate-y-4 hover:scale-105 hover:z-30 cursor-pointer ${
                          card.color
                        } ${card.textColor} select-none`}
                        style={{
                          transform: `rotate(${rot}deg)`,
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
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

