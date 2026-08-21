"use client";

import React, { useEffect, useRef } from "react";

interface HandshakeDotCanvasProps {
  className?: string;
}

export default function HandshakeDotCanvas({ className = "" }: HandshakeDotCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize);

    // Mouse tracking
    let mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000, radius: 140 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    let time = 0;

    // Handshake / Digital Connection silhouette density function
    // Calculates particle weight at coordinate (x, y)
    const getDensity = (px: number, py: number, t: number) => {
      const nx = px / width;
      const ny = py / height;

      // Left hand / wave cluster (reaching from left to center)
      const leftDx = (nx - 0.26) * 1.8;
      const leftDy = (ny - 0.58) * 2.6;
      const leftDist = Math.sqrt(leftDx * leftDx + leftDy * leftDy);
      const leftArm = Math.exp(-leftDist * 2.8) * 1.4;

      // Left fingers reaching right towards center
      const leftFingers =
        Math.exp(-Math.pow((nx - 0.42) * 3.5, 2) - Math.pow((ny - 0.52) * 4.0, 2)) * 1.1;

      // Right hand / wave cluster (reaching from right to center)
      const rightDx = (nx - 0.74) * 1.8;
      const rightDy = (ny - 0.58) * 2.6;
      const rightDist = Math.sqrt(rightDx * rightDx + rightDy * rightDy);
      const rightArm = Math.exp(-rightDist * 2.8) * 1.4;

      // Right fingers reaching left towards center
      const rightFingers =
        Math.exp(-Math.pow((nx - 0.58) * 3.5, 2) - Math.pow((ny - 0.52) * 4.0, 2)) * 1.1;

      // Handshake meeting point in center
      const centerClasp =
        Math.exp(-Math.pow((nx - 0.5) * 5.0, 2) - Math.pow((ny - 0.54) * 5.0, 2)) * 0.9;

      // Flowing wave ripple field
      const wave1 = Math.sin(nx * 8 + t * 0.8) * Math.cos(ny * 6 + t * 0.6) * 0.22;
      const wave2 = Math.cos(nx * 14 - t * 1.1) * Math.sin(ny * 10 + t * 0.7) * 0.15;

      const totalShape = Math.max(0, leftArm + leftFingers + rightArm + rightFingers + centerClasp + wave1 + wave2);
      return totalShape;
    };

    const render = () => {
      time += 0.02;

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      ctx.clearRect(0, 0, width, height);

      const spacing = Math.max(12, Math.min(18, width / 70));
      const cols = Math.floor(width / spacing);
      const rows = Math.floor(height / spacing);

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const originX = i * spacing + spacing / 2;
          const originY = j * spacing + spacing / 2;

          // Undulating wave vertical offset
          const waveOffsetY =
            Math.sin(originX * 0.015 + time * 1.2) * 4 +
            Math.cos(originY * 0.02 + time * 0.8) * 3;

          let posX = originX;
          let posY = originY + waveOffsetY;

          // Mouse repulsion interaction
          const mdx = posX - mouse.x;
          const mdy = posY - mouse.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);

          if (mDist < mouse.radius && mDist > 0) {
            const force = (1 - mDist / mouse.radius) * 16;
            posX += (mdx / mDist) * force;
            posY += (mdy / mDist) * force;
          }

          const density = getDensity(posX, posY, time);

          if (density > 0.15) {
            // Halftone dot radius and opacity based on density
            const radius = Math.min(3.6, Math.max(0.6, density * 2.6));
            const opacity = Math.min(0.85, Math.max(0.08, density * 0.75));

            ctx.beginPath();
            ctx.arc(posX, posY, radius, 0, Math.PI * 2);

            // Dark Charcoal / Black dots matching the monochrome aesthetic
            ctx.fillStyle = `rgba(15, 20, 25, ${opacity})`;
            ctx.fill();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 h-full w-full pointer-events-none ${className}`}
    />
  );
}
