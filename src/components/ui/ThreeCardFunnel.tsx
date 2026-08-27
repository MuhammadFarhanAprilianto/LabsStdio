"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeCardFunnel() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 220;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // 1. 3D Gravitational Vortex / Funnel Wireframe
    const funnelGeo = new THREE.CylinderGeometry(1.2, 0.1, 1.2, 24, 8, true);
    const funnelMat = new THREE.MeshBasicMaterial({
      color: 0x334155,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    });
    const funnelMesh = new THREE.Mesh(funnelGeo, funnelMat);
    funnelMesh.rotation.x = Math.PI / 3.2;
    funnelMesh.position.set(0, -0.2, 0);
    group.add(funnelMesh);

    // Glowing Neon Rings on Funnel Top & Middle
    const ring1Geo = new THREE.RingGeometry(1.18, 1.22, 32);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0xd4f938,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3.2;
    ring1.position.set(0, 0.35, 0.28);
    group.add(ring1);

    // 2. Floating Industry Nodes (Fintech, Health, AI / SaaS)
    const createBadge = (color: number, size: number) => {
      const bGroup = new THREE.Group();
      const bgGeo = new THREE.CircleGeometry(size, 24);
      const bgMat = new THREE.MeshBasicMaterial({ color: 0x1e222d });
      const borderGeo = new THREE.RingGeometry(size, size * 1.15, 24);
      const borderMat = new THREE.MeshBasicMaterial({
        color,
        side: THREE.DoubleSide,
      });

      bGroup.add(new THREE.Mesh(bgGeo, bgMat));
      bGroup.add(new THREE.Mesh(borderGeo, borderMat));
      return bGroup;
    };

    const node1 = createBadge(0xd4f938, 0.16); // Fintech
    const node2 = createBadge(0xa6f30d, 0.14); // Health / Biotech
    const node3 = createBadge(0x38bdf8, 0.13); // AI / Cloud

    group.add(node1);
    group.add(node2);
    group.add(node3);

    // Ambient floating particles
    const partCount = 35;
    const partGeo = new THREE.BufferGeometry();
    const partPos = new Float32Array(partCount * 3);
    for (let i = 0; i < partCount * 3; i += 3) {
      partPos[i] = (Math.random() - 0.5) * 3.5;
      partPos[i + 1] = (Math.random() - 0.5) * 2.5;
      partPos[i + 2] = (Math.random() - 0.5) * 1.5;
    }
    partGeo.setAttribute("position", new THREE.BufferAttribute(partPos, 3));
    const partMat = new THREE.PointsMaterial({
      color: 0xd4f938,
      size: 0.035,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(partGeo, partMat);
    group.add(particles);

    // Mouse tilt interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / height) * 2 - 1);
      mouseX = x;
      mouseY = y;
    };

    const handleMouseLeave = () => {
      mouseX = 0;
      mouseY = 0;
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    // Viewport Intersection Observer - pause WebGL loop when offscreen
    let isVisible = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // Animation Loop
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (!isVisible) return; // Skip rendering when card is not in viewport

      const time = clock.getElapsedTime();

      targetRotY = mouseX * 0.45;
      targetRotX = -mouseY * 0.35;

      group.rotation.y += (targetRotY - group.rotation.y) * 0.08;
      group.rotation.x += (targetRotX - group.rotation.x) * 0.08;

      funnelMesh.rotation.z = time * 0.3;

      // Orbiting Badges above funnel
      node1.position.set(
        Math.cos(time * 1.4) * 0.55,
        0.45 + Math.sin(time * 2.0) * 0.08,
        Math.sin(time * 1.4) * 0.45 + 0.3
      );
      node2.position.set(
        Math.cos(time * 1.4 + 2.1) * 0.7,
        0.55 + Math.sin(time * 2.2 + 1) * 0.08,
        Math.sin(time * 1.4 + 2.1) * 0.45 + 0.3
      );
      node3.position.set(
        Math.cos(time * 1.4 + 4.2) * 0.6,
        0.35 + Math.sin(time * 1.8 + 2) * 0.08,
        Math.sin(time * 1.4 + 4.2) * 0.45 + 0.3
      );

      renderer.render(scene, camera);
    };

    animate();

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
      cancelAnimationFrame(animationId);
      observer.disconnect();
      resizeObserver.disconnect();
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-[220px] select-none" />;
}
