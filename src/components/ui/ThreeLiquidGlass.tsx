"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeLiquidGlass() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || 380;
    let height = container.clientHeight || 460;

    // Detect mobile / tablet devices for performance tuning
    const isMobile =
      typeof window !== "undefined" &&
      (window.innerWidth < 1024 ||
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0);

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();

    // Camera with comfortable FOV and distance so model never clips
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.set(0, 0, 5.8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile,
      powerPreference: "high-performance",
      precision: isMobile ? "mediump" : "highp",
    });
    renderer.setSize(width, height);
    // Cap pixel ratio on mobile to prevent GPU thermal throttling and lag
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2.0));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // Dynamic Procedural Environment Map for Glass Refractions
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const gradientCanvas = document.createElement("canvas");
    gradientCanvas.width = 256;
    gradientCanvas.height = 128;
    const ctx = gradientCanvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createLinearGradient(0, 0, 256, 128);
      grad.addColorStop(0, "#08090d");
      grad.addColorStop(0.3, "#06b6d4");
      grad.addColorStop(0.6, "#d4f938");
      grad.addColorStop(0.85, "#a855f7");
      grad.addColorStop(1, "#08090d");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 128);
    }
    const canvasTexture = new THREE.CanvasTexture(gradientCanvas);
    const envMap = pmremGenerator.fromEquirectangular(canvasTexture).texture;
    scene.environment = envMap;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.0);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    const rimLight1 = new THREE.PointLight(0xd4f938, 4, 15);
    rimLight1.position.set(-4, 3, 3);
    scene.add(rimLight1);

    const rimLight2 = new THREE.PointLight(0x06b6d4, 4, 15);
    rimLight2.position.set(4, -3, 3);
    scene.add(rimLight2);

    // Group for combined smooth transforms
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // Scaled-down Torus Knot Geometry (Compact, centered, zero clipping)
    // Optimized polygon count for instant 60/120fps
    const geometry = new THREE.TorusKnotGeometry(0.82, 0.25, isMobile ? 72 : 100, isMobile ? 20 : 30, 2, 3);

    // High-performance Liquid Glass Material
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xf8fafc),
      transmission: isMobile ? 0.88 : 0.95,
      opacity: 0.92,
      transparent: true,
      roughness: 0.06,
      ior: 1.45,
      thickness: 1.6,
      specularIntensity: 1.2,
      specularColor: new THREE.Color(0xffffff),
      envMap: envMap,
      envMapIntensity: 2.2,
      clearcoat: isMobile ? 0.5 : 0.9,
      clearcoatRoughness: 0.05,
      attenuationColor: new THREE.Color(0xd4f938),
      attenuationDistance: 4.0,
    });

    const liquidMesh = new THREE.Mesh(geometry, glassMaterial);
    modelGroup.add(liquidMesh);

    // Inner Glowing Geometric Ribbon
    const innerGeo = new THREE.TorusKnotGeometry(0.72, 0.09, isMobile ? 48 : 64, 16, 2, 3);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xd4f938,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    modelGroup.add(innerMesh);

    // Interactive Drag & Parallax Control (Supports Mouse and Touch)
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let isTouching = false;
    let lastTouchX = 0;
    let lastTouchY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 1.5;
      targetY = y * 1.5;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        isTouching = true;
        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isTouching && e.touches.length > 0) {
        const deltaX = (e.touches[0].clientX - lastTouchX) * 0.01;
        const deltaY = (e.touches[0].clientY - lastTouchY) * 0.01;
        targetX += deltaX;
        targetY += deltaY;
        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = () => {
      isTouching = false;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: true });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    // IntersectionObserver: Pause rendering when scrolled out of view to save 100% battery & CPU
    let isVisible = true;
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // Ultra-Fast GPU-Only Animation Loop (Zero CPU vertex loops = Locked 60-120 FPS!)
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const time = clock.getElapsedTime();

      // Smooth damping interpolation
      mouseX += (targetX - mouseX) * 0.06;
      mouseY += (targetY - mouseY) * 0.06;

      // Harmonic 3D fluid rotations
      modelGroup.rotation.x = time * 0.28 + mouseY * 0.6;
      modelGroup.rotation.y = time * 0.35 + mouseX * 0.6;
      modelGroup.rotation.z = Math.sin(time * 0.2) * 0.12;

      // Gentle floating bob & breathing scale
      modelGroup.position.y = Math.sin(time * 1.2) * 0.06;
      const breathe = 1.0 + Math.sin(time * 0.9) * 0.025;
      modelGroup.scale.set(breathe, breathe, breathe);

      renderer.render(scene, camera);
    };

    animate();

    // Auto-Resize with ResizeObserver
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      if (width === 0 || height === 0) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resizeObserver.observe(container);

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      cancelAnimationFrame(animationFrameId);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      innerGeo.dispose();
      glassMaterial.dispose();
      innerMat.dispose();
      canvasTexture.dispose();
      envMap.dispose();
      pmremGenerator.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[380px] sm:min-h-[440px] lg:min-h-[500px] flex items-center justify-center touch-pan-y cursor-grab active:cursor-grabbing select-none"
    />
  );
}

