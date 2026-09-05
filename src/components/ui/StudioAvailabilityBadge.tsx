"use client";

import React, { useState, useEffect } from "react";

export default function StudioAvailabilityBadge({
  variant = "pill",
}: {
  variant?: "pill" | "detailed" | "footer";
}) {
  const [times, setTimes] = useState({
    jakarta: "",
    london: "",
    sanFrancisco: "",
  });

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      setTimes({
        jakarta: new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Jakarta",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(now),
        london: new Intl.DateTimeFormat("en-US", {
          timeZone: "Europe/London",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(now),
        sanFrancisco: new Intl.DateTimeFormat("en-US", {
          timeZone: "America/Los_Angeles",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(now),
      });
    };

    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  if (variant === "pill") {
    return (
      <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-neutral-200 text-xs font-semibold text-neutral-800 shadow-sm font-['Agrandir',sans-serif]">
        <span className="font-bold text-black">Available for Q3/Q4</span>
        <span className="text-neutral-400">•</span>
        <span className="text-neutral-500 hidden sm:inline">2 Slots Left</span>
      </div>
    );
  }

  if (variant === "detailed") {
    return (
      <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 text-white space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-white font-['Questrial',sans-serif]">
            Studio Capacity: Available
          </span>
          <span className="text-xs font-bold text-[#d4f938] px-2.5 py-1 rounded-full bg-[#d4f938]/15 border border-[#d4f938]/30">
            2 Project Slots
          </span>
        </div>

        <p className="text-xs text-neutral-400 font-['Agrandir',sans-serif] leading-relaxed">
          Currently taking new engagements for Q3/Q4 sprint cycles. Average initial consultation response time is under <strong>2 hours</strong>.
        </p>

        {/* Live Studio Clocks */}
        <div className="pt-2 grid grid-cols-3 gap-2 border-t border-neutral-800 text-center">
          <div className="p-2 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
            <div className="text-[10px] text-neutral-500 uppercase font-semibold">Jakarta (WIB)</div>
            <div suppressHydrationWarning className="text-xs font-bold text-white font-mono">{times.jakarta || "--:--"}</div>
          </div>
          <div className="p-2 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
            <div className="text-[10px] text-neutral-500 uppercase font-semibold">London (GMT)</div>
            <div suppressHydrationWarning className="text-xs font-bold text-white font-mono">{times.london || "--:--"}</div>
          </div>
          <div className="p-2 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
            <div className="text-[10px] text-neutral-500 uppercase font-semibold">San Francisco (PST)</div>
            <div suppressHydrationWarning className="text-xs font-bold text-white font-mono">{times.sanFrancisco || "--:--"}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 font-['Agrandir',sans-serif]">
      <span className="text-neutral-800 font-bold">
        Studio Active
      </span>
      <span>•</span>
      <span suppressHydrationWarning>Jakarta: {times.jakarta || "--:--"}</span>
      <span>•</span>
      <span suppressHydrationWarning>London: {times.london || "--:--"}</span>
      <span>•</span>
      <span suppressHydrationWarning>SF: {times.sanFrancisco || "--:--"}</span>
    </div>
  );
}
