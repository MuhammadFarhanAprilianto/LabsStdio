"use client";

import React, { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // Delay in ms (default: 0)
  distance?: number; // Distance in px (default: 24)
  duration?: number; // Duration in ms (default: 950)
  blur?: number; // Initial blur in px (default: 10)
  threshold?: number; // Intersection threshold (default: 0.05)
  once?: boolean; // Reveal once or every time (default: true)
}

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  distance = 24,
  duration = 950,
  blur = 10,
  threshold = 0.05,
  once = true,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Check if element is already inside or above viewport on mount (e.g. above the fold or on reload)
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.96) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(el);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -30px 0px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, filter ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        opacity: isVisible ? 1 : 0,
        filter: isVisible ? "blur(0px)" : `blur(${blur}px)`,
        transform: isVisible ? "translate3d(0, 0px, 0)" : `translate3d(0, ${distance}px, 0)`,
        willChange: "transform, opacity, filter",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}
    >
      {children}
    </div>
  );
}

