"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";

interface BeforeAfterSliderProps {
  beforeImage?: string;
  afterImage?: string;
  beforeLabel?: string;
  afterLabel?: string;
  beforeTag?: string;
  afterTag?: string;
  metric?: string;
}

export default function BeforeAfterSlider({
  beforeImage = "/images/before_ui.webp",
  afterImage = "/images/after_ui.webp",
  beforeLabel = "Legacy Architecture (2018)",
  afterLabel = "Labs Stdio Redesign (2026)",
  beforeTag = "Low Conversion & Friction",
  afterTag = "+240% Retention • 3.4x D2C Growth",
  metric = "+240% Impact",
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging) return;
      handleMove(e.touches[0].clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    },
    [isDragging, handleMove]
  );

  return (
    <div className="w-full space-y-4">
      {/* Top Header Labels */}
      <div className="flex items-center justify-between text-xs font-semibold px-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-neutral-400" />
          <span className="text-neutral-500 font-['Questrial',sans-serif]">BEFORE: {beforeLabel}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#16a34a]" />
          <span className="text-black font-bold font-['Agrandir',sans-serif]">AFTER: {afterLabel}</span>
        </div>
      </div>

      {/* Main Interactive Comparison Viewport */}
      <div
        ref={containerRef}
        data-cursor="drag"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={handleTouchMove}
        className="relative w-full aspect-video sm:aspect-[16/9] rounded-[28px] sm:rounded-[36px] overflow-hidden select-none cursor-ew-resize border border-neutral-200/90 shadow-2xl bg-neutral-950"
      >
        {/* Layer 1: AFTER Image (Full View under slider) */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={afterImage}
            alt={afterLabel}
            fill
            className="object-cover"
            priority
          />
          {/* After Tag Badge */}
          <div className="absolute bottom-6 right-6 px-4 py-2 rounded-2xl bg-black/80 backdrop-blur-md border border-[#d4f938]/40 text-white flex items-center gap-2 shadow-xl pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-[#d4f938] animate-pulse" />
            <span className="text-xs font-bold text-[#d4f938] font-['Agrandir',sans-serif]">{afterTag}</span>
          </div>
        </div>

        {/* Layer 2: BEFORE Image (Clipped by slider position) */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
        >
          <Image
            src={beforeImage}
            alt={beforeLabel}
            fill
            className="object-cover grayscale contrast-125"
          />
          {/* Before Tag Badge */}
          <div className="absolute bottom-6 left-6 px-4 py-2 rounded-2xl bg-black/75 backdrop-blur-md border border-white/10 text-white flex items-center gap-2 shadow-xl pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-neutral-400" />
            <span className="text-xs font-semibold text-neutral-300 font-['Questrial',sans-serif]">{beforeTag}</span>
          </div>
        </div>

        {/* Draggable Divider Line & Knob */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(0,0,0,0.6)] z-20 pointer-events-none flex items-center justify-center"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Center Handle Knob */}
          <div className="w-10 h-10 -ml-4.5 rounded-full bg-[#d4f938] text-black shadow-[0_0_20px_rgba(212,249,56,0.8)] border-2 border-white flex items-center justify-center text-xs font-black">
            ↔
          </div>
        </div>
      </div>

      <div className="text-center">
        <span className="text-xs text-neutral-400 font-['Questrial',sans-serif]">
          ← Drag slider left or right to compare UX transformation →
        </span>
      </div>
    </div>
  );
}
