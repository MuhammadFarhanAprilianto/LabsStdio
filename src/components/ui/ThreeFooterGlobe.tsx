"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeFooterGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const width = container.clientWidth || 1000;
    const height = container.clientHeight || 400;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 320);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // Globe Group
    const globeGroup = new THREE.Group();
    globeGroup.rotation.x = 0.25;
    scene.add(globeGroup);

    // Inner Dark Core Sphere
    const coreGeo = new THREE.SphereGeometry(98, 36, 36);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x050608,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    globeGroup.add(coreMesh);

    // 1. Galaxy Stars (Diamond lens flare starbursts) - Optimized count
    const starCount = 220;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starScales = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      const radius = 220 + Math.random() * 300;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = radius * Math.cos(phi);
      starScales[i] = Math.random() * 0.8 + 0.4;
    }

    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));

    // Custom 4-Point Star Texture
    const starCanvas = document.createElement("canvas");
    starCanvas.width = 64;
    starCanvas.height = 64;
    const starCtx = starCanvas.getContext("2d");
    if (starCtx) {
      const grad = starCtx.createRadialGradient(32, 32, 0, 32, 32, 30);
      grad.addColorStop(0, "rgba(255, 255, 255, 1)");
      grad.addColorStop(0.2, "rgba(212, 249, 56, 0.8)");
      grad.addColorStop(0.5, "rgba(166, 243, 13, 0.3)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      starCtx.fillStyle = grad;
      starCtx.beginPath();
      starCtx.arc(32, 32, 30, 0, Math.PI * 2);
      starCtx.fill();

      starCtx.strokeStyle = "rgba(255, 255, 255, 0.9)";
      starCtx.lineWidth = 1.5;
      starCtx.beginPath();
      starCtx.moveTo(32, 6);
      starCtx.lineTo(32, 58);
      starCtx.moveTo(6, 32);
      starCtx.lineTo(58, 32);
      starCtx.stroke();
    }

    const starTexture = new THREE.CanvasTexture(starCanvas);
    const starMat = new THREE.PointsMaterial({
      size: 6,
      map: starTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 2. Earth Particle Mesh with Optimized Dot Density (5,500 particles)
    const globeRadius = 100;
    const dotDensity = 5500;
    const globePositions = new Float32Array(dotDensity * 3);
    const globeColors = new Float32Array(dotDensity * 3);

    // Generate textured dots using world map projection logic
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "/images/world_landmask.jpg";

    let dotsMesh: THREE.Points | null = null;
    let globeGeo: THREE.BufferGeometry | null = null;
    let globeMat: THREE.PointsMaterial | null = null;
    let dotTex: THREE.CanvasTexture | null = null;

    const buildGlobePoints = (maskData?: ImageData) => {
      let validIndex = 0;

      for (let i = 0; i < dotDensity; i++) {
        const phi = Math.acos(-1 + (2 * i) / dotDensity);
        const theta = Math.sqrt(dotDensity * Math.PI) * phi;

        const u = 1 - (theta / (Math.PI * 2) - Math.floor(theta / (Math.PI * 2)));
        const v = phi / Math.PI;

        let isLand = true;
        if (maskData) {
          const px = Math.floor(u * maskData.width);
          const py = Math.floor(v * maskData.height);
          const pixelIndex = (py * maskData.width + px) * 4;
          const brightness = maskData.data[pixelIndex];
          isLand = brightness > 60;
        }

        const x = globeRadius * Math.sin(phi) * Math.cos(theta);
        const y = globeRadius * Math.cos(phi);
        const z = globeRadius * Math.sin(phi) * Math.sin(theta);

        globePositions[validIndex * 3] = x;
        globePositions[validIndex * 3 + 1] = y;
        globePositions[validIndex * 3 + 2] = z;

        if (isLand) {
          globeColors[validIndex * 3] = 0.92;
          globeColors[validIndex * 3 + 1] = 0.95;
          globeColors[validIndex * 3 + 2] = 0.98;
        } else {
          globeColors[validIndex * 3] = 0.12;
          globeColors[validIndex * 3 + 1] = 0.15;
          globeColors[validIndex * 3 + 2] = 0.22;
        }

        validIndex++;
      }

      globeGeo = new THREE.BufferGeometry();
      globeGeo.setAttribute(
        "position",
        new THREE.BufferAttribute(globePositions.slice(0, validIndex * 3), 3)
      );
      globeGeo.setAttribute(
        "color",
        new THREE.BufferAttribute(globeColors.slice(0, validIndex * 3), 3)
      );

      // Create soft circle texture for earth particles
      const dotCanvas = document.createElement("canvas");
      dotCanvas.width = 16;
      dotCanvas.height = 16;
      const dotCtx = dotCanvas.getContext("2d");
      if (dotCtx) {
        dotCtx.fillStyle = "#ffffff";
        dotCtx.beginPath();
        dotCtx.arc(8, 8, 7, 0, Math.PI * 2);
        dotCtx.fill();
      }
      dotTex = new THREE.CanvasTexture(dotCanvas);

      globeMat = new THREE.PointsMaterial({
        size: 2.2,
        vertexColors: true,
        map: dotTex,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
      });

      if (dotsMesh) globeGroup.remove(dotsMesh);
      dotsMesh = new THREE.Points(globeGeo, globeMat);
      globeGroup.add(dotsMesh);
    };

    img.onload = () => {
      const maskCanvas = document.createElement("canvas");
      maskCanvas.width = img.width;
      maskCanvas.height = img.height;
      const maskCtx = maskCanvas.getContext("2d");
      if (maskCtx) {
        maskCtx.drawImage(img, 0, 0);
        const data = maskCtx.getImageData(0, 0, img.width, img.height);
        buildGlobePoints(data);
      }
    };
    img.onerror = () => {
      buildGlobePoints();
    };

    // Viewport Intersection Observer - auto-pause when out of view
    let isVisible = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.02 }
    );
    observer.observe(container);

    // Animation Loop with Smooth Rotation
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return; // Skip WebGL render loop when not visible

      // Continuous gentle rotation
      globeGroup.rotation.y += 0.0025;
      starField.rotation.y -= 0.0003;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Observer
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      resizeObserver.disconnect();

      coreGeo.dispose();
      coreMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      starTexture.dispose();
      if (globeGeo) globeGeo.dispose();
      if (globeMat) globeMat.dispose();
      if (dotTex) dotTex.dispose();

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ overflow: "hidden" }}
    />
  );
}
