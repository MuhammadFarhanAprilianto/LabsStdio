"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [cursorType, setCursorType] = useState<"default" | "hover" | "play" | "view" | "read" | "drag">("default");
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Smooth spring physics for fluid trailing motion
  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);

  useEffect(() => {
    // Detect touch-only screens (mobile/tablet/iPad) to prevent unwanted overlays
    if (
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0
    ) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      // Check element under cursor for custom cursor triggers
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorAttr = target.closest("[data-cursor]")?.getAttribute("data-cursor");
      if (cursorAttr === "play") {
        setCursorType("play");
      } else if (cursorAttr === "view") {
        setCursorType("view");
      } else if (cursorAttr === "read") {
        setCursorType("read");
      } else if (cursorAttr === "drag") {
        setCursorType("drag");
      } else if (
        target.closest("button") ||
        target.closest("a") ||
        target.closest("input") ||
        target.closest("select") ||
        target.closest("textarea") ||
        target.tagName === "BUTTON" ||
        target.tagName === "A"
      ) {
        setCursorType("hover");
      } else {
        setCursorType("default");
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseleave", handleMouseLeave);
    document.body.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      document.body.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden select-none">
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className="flex items-center justify-center pointer-events-none"
      >
        {/* Default / Hover Ring */}
        {cursorType === "default" && (
          <div className="w-3.5 h-3.5 rounded-full bg-[#d4f938] shadow-[0_0_12px_rgba(212,249,56,0.85)] ring-2 ring-black/20" />
        )}

        {cursorType === "hover" && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-10 h-10 rounded-full border-2 border-[#d4f938] bg-[#d4f938]/15 backdrop-blur-[2px] shadow-[0_0_20px_rgba(212,249,56,0.5)] flex items-center justify-center"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-black" />
          </motion.div>
        )}

        {cursorType === "play" && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="px-4 py-2 rounded-full bg-[#d4f938] text-black text-xs font-black font-['Agrandir',sans-serif] shadow-[0_0_25px_rgba(212,249,56,0.8)] tracking-wider"
          >
            ▶ PLAY
          </motion.div>
        )}

        {cursorType === "view" && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="px-4 py-2 rounded-full bg-[#d4f938] text-black text-xs font-black font-['Agrandir',sans-serif] shadow-[0_0_25px_rgba(212,249,56,0.8)] tracking-wider"
          >
            ↗ VIEW
          </motion.div>
        )}

        {cursorType === "read" && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="px-4 py-2 rounded-full bg-black text-[#d4f938] border border-[#d4f938] text-xs font-bold font-['Agrandir',sans-serif] shadow-2xl tracking-wider"
          >
            📖 READ
          </motion.div>
        )}

        {cursorType === "drag" && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="px-4 py-2 rounded-full bg-white text-black text-xs font-black font-['Agrandir',sans-serif] shadow-2xl tracking-wider border border-neutral-300"
          >
            ↔ DRAG
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
