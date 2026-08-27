"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeHandshakeWave() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(0, 14, 55);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
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
    };

    const material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms,
      vertexShader: `
        uniform float uTime;
        uniform vec2 uMouse;
        uniform float uMouseHover;
        attribute float alpha;
        attribute float pointSize;
        varying float vAlpha;

        void main() {
          vAlpha = alpha;
          vec3 pos = position;

          // GPU-accelerated wave displacement (0 CPU overhead)
          float wave1 = sin(pos.x * 0.09 + uTime * 0.9) * cos(pos.z * 0.08 + uTime * 0.7) * 2.5;
          float wave2 = cos(pos.x * 0.16 - uTime * 1.0) * sin(pos.z * 0.13 + uTime * 0.8) * 1.4;
          float wave3 = sin((pos.x + pos.z) * 0.07 + uTime * 0.6) * 1.8;

          pos.y += wave1 + wave2 + wave3;

          if (uMouseHover > 0.001) {
            float dx = pos.x - uMouse.x;
            float dz = pos.z - uMouse.y;
            float dist = sqrt(dx * dx + dz * dz);
            if (dist < 18.0) {
              float repelForce = (1.0 - dist / 18.0) * 3.8 * uMouseHover;
              pos.y += sin(dist * 0.6 - uTime * 2.5) * repelForce;
            }
          }

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = pointSize * (52.0 / -mvPosition.z);
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
    pointCloud.position.y = -1.5;
    pointCloud.scale.set(0.85, 0.85, 0.85);
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

    const handleMouseLeave = () => {
      mouse.targetX = 0;
      mouse.targetY = 0;
      mouse.targetHover = 0.0;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    let clock = new THREE.Clock();
    let animationFrameId: number;
    let isVisible = true;

    // Viewport Intersection Observer to pause rendering when scrolled out of view
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
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
      pointCloud.rotation.x = -0.22 + Math.cos(time * 0.1) * 0.015;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);

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
