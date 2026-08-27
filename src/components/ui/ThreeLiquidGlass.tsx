"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeLiquidGlass() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || 450;
    let height = container.clientHeight || 560;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    
    // Camera with wider field of view & generous distance to PREVENT ANY CLIPPING
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.6);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    container.appendChild(renderer.domElement);

    // Dynamic Procedural Environment Map for Luxurious Liquid Glass Reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    // Create a beautiful procedural gradient canvas for glass refraction
    const gradientCanvas = document.createElement("canvas");
    gradientCanvas.width = 512;
    gradientCanvas.height = 256;
    const ctx = gradientCanvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createLinearGradient(0, 0, 512, 256);
      grad.addColorStop(0, "#0a0a0f");
      grad.addColorStop(0.3, "#06b6d4");
      grad.addColorStop(0.6, "#d4f938");
      grad.addColorStop(0.85, "#a855f7");
      grad.addColorStop(1, "#0a0a0f");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 256);
    }
    const canvasTexture = new THREE.CanvasTexture(gradientCanvas);
    const envMap = pmremGenerator.fromEquirectangular(canvasTexture).texture;
    scene.environment = envMap;

    // Studio Lights for Glass Specular Glints
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.5);
    keyLight.position.set(5, 8, 6);
    scene.add(keyLight);

    const rimLight1 = new THREE.PointLight(0xd4f938, 5, 20);
    rimLight1.position.set(-6, 4, 4);
    scene.add(rimLight1);

    const rimLight2 = new THREE.PointLight(0x06b6d4, 5, 20);
    rimLight2.position.set(6, -4, 4);
    scene.add(rimLight2);

    const backLight = new THREE.DirectionalLight(0xffffff, 2.5);
    backLight.position.set(0, -6, -4);
    scene.add(backLight);

    // 3D Liquid Ribbon Geometry: Scaled to fit 100% inside view without any clipping
    const geometry = new THREE.TorusKnotGeometry(1.2, 0.38, 160, 40, 2, 3);
    const originalPositions = geometry.attributes.position.clone();

    // Pure Crystal Liquid Glass Material (No flat solid color circles!)
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xffffff),
      transmission: 0.98,
      opacity: 1,
      transparent: true,
      roughness: 0.02,
      ior: 1.55,
      thickness: 3.2,
      specularIntensity: 1.5,
      specularColor: new THREE.Color(0xffffff),
      envMap: envMap,
      envMapIntensity: 2.8,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      iridescence: 0.95,
      iridescenceIOR: 1.4,
      iridescenceThicknessRange: [150, 600],
      attenuationColor: new THREE.Color(0xd4f938),
      attenuationDistance: 5.0,
    });

    const liquidMesh = new THREE.Mesh(geometry, glassMaterial);
    scene.add(liquidMesh);

    // Inner Glowing Structure Ribbon
    const innerGeo = new THREE.TorusKnotGeometry(1.0, 0.12, 80, 20, 2, 3);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xd4f938,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    liquidMesh.add(innerMesh);

    // Mouse Parallax Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 1.2;
      targetY = y * 1.2;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Performance Optimization: IntersectionObserver
    let isVisible = true;
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // Render Loop: Smooth Organic Fluid Morphing
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const time = clock.getElapsedTime();

      // Smooth mouse interpolation
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      // Rotation & Gentle Wave Floating (Kept within viewport bounds)
      liquidMesh.rotation.x = time * 0.2 + mouseY * 0.5;
      liquidMesh.rotation.y = time * 0.28 + mouseX * 0.5;
      liquidMesh.rotation.z = Math.sin(time * 0.15) * 0.08;

      liquidMesh.position.y = Math.sin(time * 1.0) * 0.05;

      // Organic Liquid Vertex Wave Morphing
      const positions = geometry.attributes.position;
      const orig = originalPositions.array;
      const posArray = positions.array as Float32Array;

      for (let i = 0; i < posArray.length; i += 3) {
        const u = orig[i];
        const v = orig[i + 1];
        const w = orig[i + 2];

        // 3D fluid noise
        const wave =
          Math.sin(u * 2.0 + time * 1.5) * 0.035 +
          Math.cos(v * 2.0 + time * 1.3) * 0.035 +
          Math.sin(w * 1.5 + time * 1.6) * 0.025;

        posArray[i] = u + u * wave;
        posArray[i + 1] = v + v * wave;
        posArray[i + 2] = w + w * wave;
      }
      positions.needsUpdate = true;
      geometry.computeVertexNormals();

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
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      originalPositions.dispose();
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
      className="relative w-full h-full min-h-[480px] lg:min-h-[560px] flex items-center justify-center pointer-events-none select-none"
    />
  );
}
