"use client";

import React, { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import BeforeAfterSlider from "@/components/ui/BeforeAfterSlider";
import StudioAvailabilityBadge from "@/components/ui/StudioAvailabilityBadge";

interface CaseStudyData {
  slug: string;
  title: string;
  client: string;
  year: string;
  category: string;
  deliverables: string[];
  metrics: { label: string; value: string; desc: string }[];
  overview: string;
  challenge: string;
  solution: string;
  beforeImg: string;
  afterImg: string;
}

const caseStudies: Record<string, CaseStudyData> = {
  "blanqs-ai": {
    slug: "blanqs-ai",
    title: "Reimagining Venture-Grade Analytics for 100K+ Active Users",
    client: "Blanqs AI Platform",
    year: "2026",
    category: "SaaS & AI Infrastructure",
    deliverables: ["Product UI/UX Architecture", "Next.js WebGL Frontend", "Design System Bible", "Physics Micro-interactions"],
    metrics: [
      { label: "User Retention", value: "+240%", desc: "Surge in daily active user stickiness" },
      { label: "Conversion Rate", value: "3.4x", desc: "Multiplier on onboarding completion" },
      { label: "Latency", value: "0.38s", desc: "Sub-second global dashboard load time" },
      { label: "Series A Raised", value: "$18.5M", desc: "Funded post-redesign launch" },
    ],
    overview:
      "Blanqs AI is a fast-growing cloud data analytics engine. As their feature set expanded, their legacy 2018 dashboard suffered from high cognitive friction, sluggish table responsiveness, and drop-offs during complex pipeline configurations.",
    challenge:
      "The client required an end-to-end UX overhaul that would simplify high-density real-time telemetry, provide instant clarity on computational costs, and look undeniably venture-grade to attract Fortune 500 enterprise buyers.",
    solution:
      "Labs Stdio completely rebuilt the platform interface from the ground up: introducing dark glassmorphism data surfaces, GPU-accelerated canvas charts, contextual sub-menus, and an atomic Figma design token system integrated straight into Next.js Turbopack.",
    beforeImg: "/images/before_ui.jpg",
    afterImg: "/images/after_ui.jpg",
  },
};

export default function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const data = caseStudies[resolvedParams.slug] || caseStudies["blanqs-ai"];

  return (
    <main className="min-h-screen bg-white text-gray-900 font-['Questrial',sans-serif] pt-28 sm:pt-36">
      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pb-12">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/work"
              className="inline-flex items-center gap-2 text-xs font-bold text-neutral-500 hover:text-black transition-colors uppercase tracking-wider"
            >
              <span>← Back to Work</span>
            </Link>
            <StudioAvailabilityBadge variant="pill" />
          </div>

          <div className="space-y-3 max-w-4xl">
            <div className="text-xs font-bold uppercase tracking-widest text-[#16a34a] font-['Agrandir',sans-serif]">
              {data.client} • {data.category} ({data.year})
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-black font-['Agrandir',sans-serif] leading-tight">
              {data.title}
            </h1>
          </div>

          {/* Deliverables Badges */}
          <div className="flex flex-wrap gap-2 pt-2">
            {data.deliverables.map((item, i) => (
              <span
                key={i}
                className="px-4 py-1.5 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-medium text-neutral-700"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Before / After Comparison Showcase */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pb-20">
        <BeforeAfterSlider
          beforeImage={data.beforeImg}
          afterImage={data.afterImg}
          beforeLabel="Legacy 2018 Cluttered CRM"
          afterLabel="Labs Stdio 2026 Modern Dashboard"
          beforeTag="High Drop-off & Outdated UI"
          afterTag="+240% Retention • 3.4x Conversion Growth"
        />
      </section>

      {/* Metrics Grid */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pb-24">
        <div className="p-8 sm:p-12 rounded-[36px] bg-[#0c0d12] text-white border border-neutral-800 shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-neutral-800">
            {data.metrics.map((m, idx) => (
              <div key={idx} className={`space-y-2 ${idx > 0 ? "pt-6 md:pt-0 md:pl-8" : ""}`}>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#d4f938] font-['Agrandir',sans-serif]">
                  {m.value}
                </div>
                <div className="text-xs font-bold text-white uppercase tracking-wider">
                  {m.label}
                </div>
                <p className="text-xs text-neutral-400 font-['Questrial',sans-serif] leading-relaxed">
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* In-depth Narrative: Challenge & Solution */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pb-28">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-4 space-y-4">
            <h3 className="text-2xl sm:text-3xl font-bold text-black font-['Agrandir',sans-serif]">
              The Strategic Transformation
            </h3>
            <p className="text-sm text-neutral-600 font-['Questrial',sans-serif] leading-relaxed">
              How we partnered with executive founders to re-engineer user retention and market positioning.
            </p>
          </div>

          <div className="md:col-span-8 space-y-8 text-neutral-700 font-['Questrial',sans-serif] text-base leading-relaxed">
            <div className="p-7 rounded-3xl bg-neutral-50 border border-neutral-200 space-y-2">
              <h4 className="text-base font-bold text-black font-['Agrandir',sans-serif]">
                01. The Challenge
              </h4>
              <p className="text-sm text-neutral-600 leading-relaxed">{data.challenge}</p>
            </div>

            <div className="p-7 rounded-3xl bg-neutral-50 border border-neutral-200 space-y-2">
              <h4 className="text-base font-bold text-black font-['Agrandir',sans-serif]">
                02. The Architectural Solution
              </h4>
              <p className="text-sm text-neutral-600 leading-relaxed">{data.solution}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pb-28 text-center">
        <div className="p-10 sm:p-16 rounded-[40px] bg-neutral-900 text-white relative overflow-hidden space-y-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,249,56,0.15)_0%,transparent_70%)] pointer-events-none" />
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-['Agrandir',sans-serif]">
              Ready for a similar transformation?
            </h3>
            <p className="text-sm sm:text-base text-neutral-400 font-['Questrial',sans-serif]">
              Let&apos;s evaluate your current product metrics and craft a venture-grade digital experience.
            </p>
            <div className="pt-4 flex justify-center">
              <Link
                href="/contact"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-[#d4f938] px-8 py-3.5 text-sm font-bold text-black shadow-lg transition-all duration-300 hover:bg-white hover:text-black active:scale-95"
              >
                <span>Calculate Your Project Scope →</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
