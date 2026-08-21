"use client";

import React, { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // Delay in ms (optional)
  distance?: number; // Distance to translate in px (default: 48px)
  duration?: number; // Duration in ms (default: 900ms)
}

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  distance = 48,
  duration = 900,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el); // Animate once when scrolled into view
        }
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0px)" : `translateY(${distance}px)`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
