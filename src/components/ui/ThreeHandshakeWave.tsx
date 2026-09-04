"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeHandshakeWave() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight * 0.85;

    // Helper to calculate responsive camera and mesh transform parameters
    const getResponsiveParams = (w: number, h: number) => {
      const aspect = w / h;
      if (w < 640 || aspect < 0.65) {
        // Mobile screens: pull camera back and lift wave so Layer 1 foreground is prominently centered
        return {
          camY: 8.5,
          camZ: 78,
          fov: 52,
          pointY: 0.2,
          scale: 0.72,
          pointSizeMultiplier: 46.0,
        };
      } else if (w < 1024 || aspect < 1.1) {
        // Tablet screens (portrait & landscape): balanced camera distance for full grid visibility
        return {
          camY: 10.5,
          camZ: 66,
          fov: 54,
          pointY: -0.8,
          scale: 0.80,
          pointSizeMultiplier: 50.0,
        };
      } else {
        // Desktop screens
        return {
          camY: 13.5,
          camZ: 56,
          fov: 55,
          pointY: -1.5,
          scale: 0.85,
          pointSizeMultiplier: 52.0,
        };
      }
    };

    let params = getResponsiveParams(width, height);

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(params.fov, width / height, 0.1, 1000);
    camera.position.set(0, params.camY, params.camZ);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.appendChild(renderer.domElement);

    // Optimized Particle Grid Parameters (130 x 75 = 9,750 particles - ultra lightweight with GPU shader)
    const cols = 130;
    const rows = 75;
    const count = cols * rows;

    const positions = new Float32Array(count * 3);
    const alphas = new Float32Array(count);
    const sizes = new Float32Array(count);

    let idx = 0;
    const gridWidth = 118;
    const gridHeight = 70;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const u = i / (cols - 1);
        const v = j / (rows - 1);

        const x = (u - 0.5) * gridWidth;
        const z = (v - 0.5) * gridHeight;
        const y = -4.0;

        // Density function for Handshake & Wave Formations
        const leftDist = Math.sqrt(Math.pow((u - 0.25) * 1.5, 2) + Math.pow((v - 0.52) * 1.6, 2));
        const leftHand = Math.exp(-leftDist * 1.8) * 1.5;

        const rightDist = Math.sqrt(Math.pow((u - 0.75) * 1.5, 2) + Math.pow((v - 0.52) * 1.6, 2));
        const rightHand = Math.exp(-rightDist * 1.8) * 1.5;

        const centerDist = Math.sqrt(Math.pow((u - 0.5) * 2.5, 2) + Math.pow((v - 0.52) * 2.2, 2));
        const centerClasp = Math.exp(-centerDist * 1.6) * 0.95;

        const ambientWave =
          Math.sin(u * Math.PI) * Math.sin(v * Math.PI) * 0.65 +
          Math.sin(u * 6.0) * Math.cos(v * 4.0) * 0.25;

        const totalDensity = Math.max(0.12, leftHand + rightHand + centerClasp + ambientWave);

        positions[idx * 3] = x;
        positions[idx * 3 + 1] = y;
        positions[idx * 3 + 2] = z;

        alphas[idx] = Math.min(0.85, Math.max(0.08, totalDensity * 0.65));
        sizes[idx] = Math.min(2.0, Math.max(0.5, totalDensity * 1.3));

        idx++;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("alpha", new THREE.BufferAttribute(alphas, 1));
    geometry.setAttribute("pointSize", new THREE.BufferAttribute(sizes, 1));

    const uniforms = {
      uColor: { value: new THREE.Color(0x0f172a) },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uMouseHover: { value: 0.0 },
      uPointSizeMultiplier: { value: params.pointSizeMultiplier },
    };

    const material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms,
      vertexShader: `
        uniform float uTime;
        uniform vec2 uMouse;
        uniform float uMouseHover;
        uniform float uPointSizeMultiplier;
        attribute float alpha;
        attribute float pointSize;
        varying float vAlpha;

        void main() {
          vAlpha = alpha;
          vec3 pos = position;

          // Normalized depth ratio (0.0 = back/layer 3, 1.0 = front/layer 1)
          float depthNorm = clamp((pos.z + 35.0) / 70.0, 0.0, 1.0);

          // Layer 1: Foreground prominent primary flowing wave (strongest in front)
          float layer1 = sin(pos.x * 0.085 + uTime * 0.85) * cos(pos.z * 0.06 + uTime * 0.65) * 2.8;

          // Layer 2: Midground harmonic rhythm
          float layer2 = cos(pos.x * 0.15 - uTime * 0.95) * sin(pos.z * 0.12 + uTime * 0.75) * 1.5;

          // Layer 3: Background ambient elevation
          float layer3 = sin((pos.x + pos.z) * 0.065 + uTime * 0.55) * 1.2;

          // Progressive layer blending: Layer 1 is primary in foreground, smoothly connecting to Layers 2 & 3
          float waveDisplacement = layer1 * (0.6 + 0.5 * depthNorm) + layer2 * 0.8 + layer3 * (1.1 - 0.4 * depthNorm);
          pos.y += waveDisplacement;

          // Interactive ripple repulsion
          if (uMouseHover > 0.001) {
            float dx = pos.x - uMouse.x;
            float dz = pos.z - uMouse.y;
            float dist = sqrt(dx * dx + dz * dz);
            if (dist < 20.0) {
              float repelForce = (1.0 - dist / 20.0) * 3.5 * uMouseHover;
              pos.y += sin(dist * 0.6 - uTime * 2.5) * repelForce;
            }
          }

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = pointSize * (uPointSizeMultiplier / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vAlpha;
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float smoothEdge = smoothstep(0.5, 0.2, dist);
          gl_FragColor = vec4(uColor, vAlpha * smoothEdge);
        }
      `,
    });

    const pointCloud = new THREE.Points(geometry, material);
    pointCloud.position.y = params.pointY;
    pointCloud.scale.set(params.scale, params.scale, params.scale);
    scene.add(pointCloud);

    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0, hoverValue: 0, targetHover: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / height) * 2 - 1);
      mouse.targetX = x * 35;
      mouse.targetY = y * 20;
      mouse.targetHover = 1.0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = container.getBoundingClientRect();
        const x = ((touch.clientX - rect.left) / width) * 2 - 1;
        const y = -(((touch.clientY - rect.top) / height) * 2 - 1);
        mouse.targetX = x * 35;
        mouse.targetY = y * 20;
        mouse.targetHover = 0.85;
      }
    };

    const handleMouseLeave = () => {
      mouse.targetX = 0;
      mouse.targetY = 0;
      mouse.targetHover = 0.0;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    window.addEventListener("touchend", handleMouseLeave, { passive: true });

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight * 0.85;

      const newParams = getResponsiveParams(width, height);
      camera.aspect = width / height;
      camera.fov = newParams.fov;
      camera.position.set(0, newParams.camY, newParams.camZ);
      camera.updateProjectionMatrix();

      pointCloud.position.y = newParams.pointY;
      pointCloud.scale.set(newParams.scale, newParams.scale, newParams.scale);
      uniforms.uPointSizeMultiplier.value = newParams.pointSizeMultiplier;

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    };

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("orientationchange", handleResize, { passive: true });

    let clock = new THREE.Clock();
    let animationFrameId: number;
    let isVisible = true;

    // Viewport Intersection Observer to pause rendering when scrolled out of view
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    observer.observe(container);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return; // Skip work when off-screen

      const time = clock.getElapsedTime() * 0.38;

      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;
      mouse.hoverValue += (mouse.targetHover - mouse.hoverValue) * 0.05;

      // Update uniforms for GPU vertex shader
      uniforms.uTime.value = time;
      uniforms.uMouse.value.set(mouse.x, mouse.y);
      uniforms.uMouseHover.value = mouse.hoverValue;

      pointCloud.rotation.y = Math.sin(time * 0.08) * 0.035;
      pointCloud.rotation.x = -0.20 + Math.cos(time * 0.1) * 0.015;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("touchend", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);

      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 h-full w-full pointer-events-none overflow-hidden"
    />
  );
}
