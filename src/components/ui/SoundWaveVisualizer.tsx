"use client";

import React from "react";

interface SoundWaveVisualizerProps {
  isPlaying: boolean;
  className?: string;
}

export default function SoundWaveVisualizer({
  isPlaying,
  className = "",
}: SoundWaveVisualizerProps) {
  // 11 bar dengan tinggi dasar terinspirasi gelombang audio visualizer
  const bars = [
    { baseHeight: 38, animDuration: "0.65s", delay: "0.0s" },
    { baseHeight: 62, animDuration: "0.85s", delay: "0.15s" },
    { baseHeight: 48, animDuration: "0.55s", delay: "0.3s" },
    { baseHeight: 30, animDuration: "0.75s", delay: "0.08s" },
    { baseHeight: 78, animDuration: "0.9s", delay: "0.22s" },
    { baseHeight: 100, animDuration: "0.7s", delay: "0.1s" },
    { baseHeight: 82, animDuration: "0.8s", delay: "0.28s" },
    { baseHeight: 52, animDuration: "0.6s", delay: "0.05s" },
    { baseHeight: 32, animDuration: "0.95s", delay: "0.18s" },
    { baseHeight: 68, animDuration: "0.72s", delay: "0.25s" },
    { baseHeight: 42, animDuration: "0.58s", delay: "0.12s" },
  ];

  return (
    <div
      className={`inline-flex items-center justify-center gap-[2.2px] sm:gap-[2.6px] h-5 sm:h-6 ${className}`}
      aria-hidden="true"
    >
      {bars.map((bar, index) => (
        <span
          key={index}
          className={`w-[2px] sm:w-[2.4px] rounded-full bg-current transform-gpu transition-all duration-300 ${
            isPlaying ? "animate-sound-wave" : "opacity-85"
          }`}
          style={{
            height: isPlaying ? "100%" : `${bar.baseHeight}%`,
            animationDuration: bar.animDuration,
            animationDelay: bar.delay,
            animationPlayState: isPlaying ? "running" : "paused",
            transformOrigin: "center",
          }}
        />
      ))}
    </div>
  );
}
