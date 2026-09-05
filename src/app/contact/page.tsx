"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/components/Footer";
import StudioAvailabilityBadge from "@/components/ui/StudioAvailabilityBadge";
import { Tick01Icon, FlashIcon, ArrowRight01Icon, LockKeyIcon } from "hugeicons-react";

interface ProductType {
  id: string;
  name: string;
  basePrice: number;
  baseWeeks: number;
  description: string;
}

interface FeatureOption {
  id: string;
  name: string;
  price: number;
  extraWeeks: number;
}

const productTypes: ProductType[] = [
  {
    id: "web-app",
    name: "Web Application",
    basePrice: 8500,
    baseWeeks: 4,
    description: "Next.js dynamic web app with high performance and zero-runtime CSS.",
  },
  {
    id: "saas-platform",
    name: "SaaS Platform",
    basePrice: 14500,
    baseWeeks: 6,
    description: "Full-stack dashboard, billing, multi-tenancy, and scalable design system.",
  },
  {
    id: "headless-ecommerce",
    name: "Headless E-Commerce",
    basePrice: 11000,
    baseWeeks: 5,
    description: "Shopify / Medusa headless storefront with lightning fast checkouts.",
  },
  {
    id: "brand-system",
    name: "Brand & UI/UX System",
    basePrice: 6500,
    baseWeeks: 3,
    description: "Complete visual identity, Figma component library, and guideline token bible.",
  },
];

const featureOptions: FeatureOption[] = [
  { id: "3d-webgl", name: "Three.js 3D & WebGL Shaders", price: 3500, extraWeeks: 1.5 },
  { id: "micro-anim", name: "Physics Micro-Animations", price: 2000, extraWeeks: 1 },
  { id: "ai-integration", name: "AI API & LLM Workflows", price: 3000, extraWeeks: 1 },
  { id: "headless-cms", name: "Sanity / Strapi Headless CMS", price: 2200, extraWeeks: 1 },
  { id: "seo-i18n", name: "Global Multi-Language & SEO", price: 1800, extraWeeks: 0.5 },
];

const formatPrice = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default function ContactPage() {
  const [selectedProduct, setSelectedProduct] = useState<string>("web-app");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(["3d-webgl", "micro-anim"]);
  const [velocity, setVelocity] = useState<"standard" | "express">("standard");

  // Contact Info
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [projectDetails, setProjectDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Toggle Feature
  const toggleFeature = (featureId: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureId) ? prev.filter((id) => id !== featureId) : [...prev, featureId]
    );
  };

  // Real-time Dynamic Estimation Logic
  const calculation = useMemo(() => {
    const product = productTypes.find((p) => p.id === selectedProduct) || productTypes[0];
    let totalPrice = product.basePrice;
    let totalWeeks = product.baseWeeks;

    selectedFeatures.forEach((featId) => {
      const feat = featureOptions.find((f) => f.id === featId);
      if (feat) {
        totalPrice += feat.price;
        totalWeeks += feat.extraWeeks;
      }
    });

    if (velocity === "express") {
      totalPrice = Math.round(totalPrice * 1.25);
      totalWeeks = Math.max(2, Math.round(totalWeeks * 0.65));
    }

    return {
      productName: product.name,
      estimatedPriceMin: Math.round(totalPrice * 0.9),
      estimatedPriceMax: Math.round(totalPrice * 1.15),
      estimatedWeeks: Math.round(totalWeeks),
    };
  }, [selectedProduct, selectedFeatures, velocity]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
  };

  const headlineLine1 = ["Estimate", "Your", "Scope."];
  const headlineLine2 = ["Launch", "Faster."];

  return (
    <main className="min-h-screen bg-white text-gray-900 font-['Agrandir',sans-serif] pt-28 sm:pt-36">
      {/* Header Section */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pb-6 sm:pb-8 text-center sm:text-left">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-neutral-200/80 pb-6">
          <div className="space-y-4 max-w-3xl">
            {/* Main Headline: Blur-to-Clear Upward Animation */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-black leading-[1.12] w-full break-words">
              {/* Baris 1: Estimate Your Scope. (Tebal) */}
              <span className="block pb-1 font-bold text-black font-['Questrial',sans-serif]">
                {headlineLine1.map((word, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 45, filter: "blur(14px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{
                      duration: 0.75,
                      delay: 0.12 + index * 0.12,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="inline-block mr-2 sm:mr-3.5"
                  >
                    {word}
                  </motion.span>
                ))}
              </span>

              {/* Baris 2: Launch Faster. (Abu-abu / Muted Elegan) */}
              <span className="block font-bold text-neutral-400 font-['Questrial',sans-serif]">
                {headlineLine2.map((word, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 45, filter: "blur(14px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{
                      duration: 0.75,
                      delay: 0.48 + index * 0.12,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="inline-block mr-2 sm:mr-3.5"
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
            </h1>

            {/* Subtitle Description with Blur-to-Clear */}
            <motion.p
              initial={{ opacity: 0, y: 25, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="text-neutral-600 text-base sm:text-lg max-w-xl leading-relaxed font-['Agrandir',sans-serif]"
            >
              Use our live project scope &amp; cost calculator below to estimate sprint timelines, deliverables, and investment before submitting your brief.
            </motion.p>
          </div>

          {/* Quick Response Card */}
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="lg:w-80"
          >
            <StudioAvailabilityBadge variant="detailed" />
          </motion.div>
        </div>
      </section>

      {/* Main Section: Calculator (Left) & Inquiry Review (Right) */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pb-14 sm:pb-18">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Interactive Scope Calculator (7 Cols) */}
          <div className="lg:col-span-7 space-y-10">
            {/* Step 1: Product Architecture */}
            <motion.div
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 font-['Agrandir',sans-serif]">
                  Step 01 / 03
                </span>
                <span className="text-xs font-semibold text-neutral-500">Select Architecture</span>
              </div>
              <h3 className="text-2xl font-bold text-black font-['Questrial',sans-serif]">
                What are we building together?
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {productTypes.map((type) => {
                  const isSelected = selectedProduct === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setSelectedProduct(type.id)}
                      className={`p-5 rounded-3xl text-left transition-all duration-300 cursor-pointer border ${
                        isSelected
                          ? "bg-black text-white border-black shadow-xl scale-[1.01]"
                          : "bg-neutral-50/80 text-neutral-800 border-neutral-200 hover:border-neutral-400 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between pb-2">
                        <span className={`text-base font-bold font-['Agrandir',sans-serif] ${isSelected ? "text-[#d4f938]" : "text-black"}`}>
                          {type.name}
                        </span>
                        <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-[#d4f938] bg-[#d4f938]" : "border-neutral-300"}`} />
                      </div>
                      <p className={`text-xs leading-relaxed line-clamp-2 ${isSelected ? "text-neutral-300" : "text-neutral-500"}`}>
                        {type.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Step 2: Special Features */}
            <motion.div
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 font-['Agrandir',sans-serif]">
                  Step 02 / 03
                </span>
                <span className="text-xs font-semibold text-neutral-500 font-['Agrandir',sans-serif]">Select Add-ons</span>
              </div>
              <h3 className="text-2xl font-bold text-black font-['Questrial',sans-serif]">
                Enhance with Specialized Capabilities
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {featureOptions.map((feat) => {
                  const isChecked = selectedFeatures.includes(feat.id);
                  return (
                    <button
                      key={feat.id}
                      type="button"
                      onClick={() => toggleFeature(feat.id)}
                      className={`p-4 rounded-2xl text-left transition-all flex items-center justify-between border cursor-pointer font-['Agrandir',sans-serif] ${
                        isChecked
                          ? "bg-[#111111] text-[#d4f938] border-black shadow-md"
                          : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-5 h-5 rounded-md flex items-center justify-center border text-xs ${isChecked ? "bg-[#d4f938] text-black border-[#d4f938] font-bold" : "border-neutral-300"}`}>
                          {isChecked ? <Tick01Icon className="w-3.5 h-3.5 stroke-[2.5]" /> : null}
                        </span>
                        <span className="text-xs sm:text-sm font-medium">{feat.name}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Step 3: Sprint Velocity */}
            <motion.div
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 font-['Agrandir',sans-serif]">
                  Step 03 / 03
                </span>
                <span className="text-xs font-semibold text-neutral-500 font-['Agrandir',sans-serif]">Deployment Velocity</span>
              </div>
              <h3 className="text-2xl font-bold text-black font-['Questrial',sans-serif]">
                Target Sprint Delivery Speed
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <button
                  type="button"
                  onClick={() => setVelocity("standard")}
                  className={`p-5 rounded-3xl text-left border transition-all cursor-pointer ${
                    velocity === "standard"
                      ? "bg-[#d4f938] text-black border-[#c4eb28] shadow-lg font-bold"
                      : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-white"
                  }`}
                >
                  <div className="text-sm font-bold font-['Questrial',sans-serif]">Standard Studio Sprint</div>
                  <div className="text-xs text-neutral-600 mt-1 font-['Agrandir',sans-serif]">Iterative, thorough QA, and calibrated user tests.</div>
                </button>

                <button
                  type="button"
                  onClick={() => setVelocity("express")}
                  className={`p-5 rounded-3xl text-left border transition-all cursor-pointer ${
                    velocity === "express"
                      ? "bg-black text-[#d4f938] border-black shadow-lg font-bold"
                      : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-white"
                  }`}
                >
                  <div className="text-sm font-bold font-['Questrial',sans-serif] flex items-center gap-1.5">
                    <FlashIcon className="w-4 h-4 fill-current text-[#d4f938]" />
                    <span>Express Fast-Track (Priority)</span>
                  </div>
                  <div className="text-xs text-neutral-400 mt-1 font-['Agrandir',sans-serif]">Dedicated senior pair-engineers for rush launch deadlines.</div>
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Live Estimate Card & Submission Form (5 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 45, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-8 sticky top-28"
          >
            {/* Live Calculation Summary Box */}
            <div className="rounded-[36px] bg-[#0c0d12] text-white p-7 sm:p-9 border border-neutral-800 shadow-2xl relative overflow-hidden space-y-6">
              <div className="absolute top-0 right-0 w-56 h-56 bg-[radial-gradient(circle,rgba(212,249,56,0.14)_0%,transparent_70%)] pointer-events-none" />

              <div className="space-y-2 relative z-10">
                <div className="text-xs font-bold text-[#d4f938] uppercase tracking-widest font-['Agrandir',sans-serif]">
                  Live Scope Estimate
                </div>
                <h4 className="text-2xl font-black font-['Questrial',sans-serif]">
                  {calculation.productName}
                </h4>
              </div>

              {/* Estimate Numbers */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-800">
                <div>
                  <div className="text-[11px] text-neutral-400 uppercase font-semibold font-['Agrandir',sans-serif]">Ballpark Investment</div>
                  <div className="text-2xl sm:text-3xl font-black text-[#d4f938] font-['Questrial',sans-serif] mt-1">
                    ${formatPrice(calculation.estimatedPriceMin)} - ${formatPrice(calculation.estimatedPriceMax)}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-neutral-400 uppercase font-semibold font-['Agrandir',sans-serif]">Target Timeline</div>
                  <div className="text-2xl sm:text-3xl font-black text-white font-['Questrial',sans-serif] mt-1">
                    ~{calculation.estimatedWeeks} Weeks
                  </div>
                </div>
              </div>

              <div className="text-xs text-neutral-400 font-['Agrandir',sans-serif] leading-relaxed pt-2">
                Includes full design system source files, production code deployment, sub-second Turbopack build, and post-launch maintenance.
              </div>
            </div>

            {/* Direct Submission Form */}
            <div className="rounded-[36px] bg-[#fafafa] border border-neutral-200/90 p-7 sm:p-9 shadow-sm font-['Agrandir',sans-serif]">
              {isSubmitted ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[#d4f938] text-black mx-auto flex items-center justify-center shadow-lg font-bold text-xl">
                    <Tick01Icon className="w-7 h-7 stroke-[2.5]" />
                  </div>
                  <h4 className="text-2xl font-black text-black font-['Questrial',sans-serif]">
                    Inquiry Locked In!
                  </h4>
                  <p className="text-xs text-neutral-600 leading-relaxed font-['Agrandir',sans-serif]">
                    Thank you, <strong className="text-black">{fullName}</strong>. We received your estimated scope for <strong>{calculation.productName}</strong> and will follow up under 2 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="px-5 py-2 rounded-full bg-neutral-900 text-white text-xs font-bold"
                  >
                    Reset Form
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-['Questrial',sans-serif]">
                    Send Brief With This Estimate
                  </div>

                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Your Full Name *"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-white border border-neutral-300 rounded-2xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:border-black transition-all font-['Agrandir',sans-serif]"
                    />
                  </div>

                  <div>
                    <input
                      type="email"
                      required
                      placeholder="Your Work Email *"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-neutral-300 rounded-2xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:border-black transition-all font-['Agrandir',sans-serif]"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Company Name / Current URL"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full bg-white border border-neutral-300 rounded-2xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:border-black transition-all font-['Agrandir',sans-serif]"
                    />
                  </div>

                  <div>
                    <textarea
                      rows={3}
                      placeholder="Any specific feature or requirement you'd like to highlight..."
                      value={projectDetails}
                      onChange={(e) => setProjectDetails(e.target.value)}
                      className="w-full bg-white border border-neutral-300 rounded-2xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:border-black transition-all resize-none font-['Agrandir',sans-serif]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative w-full inline-flex items-center justify-center overflow-hidden rounded-full bg-[#d4f938] px-6 py-3.5 text-xs sm:text-sm font-bold tracking-wide text-black border border-[#c4eb28] shadow-md transition-all duration-500 hover:bg-black hover:text-[#d4f938] hover:border-black active:scale-[0.99] cursor-pointer disabled:opacity-50 font-['Agrandir',sans-serif]"
                  >
                    {isSubmitting ? (
                      <span>Transmitting Estimate...</span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <span>Book Project With This Scope</span>
                        <ArrowRight01Icon className="w-4 h-4 stroke-[2.5]" />
                      </span>
                    )}
                  </button>
                  <p className="text-center text-[10px] text-neutral-400 font-['Agrandir',sans-serif] flex items-center justify-center gap-1.5">
                    <LockKeyIcon className="w-3 h-3 text-neutral-400" />
                    <span>All estimates and briefs are protected under strict mutual NDA.</span>
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
