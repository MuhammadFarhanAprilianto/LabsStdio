"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeCardSatisfaction() {
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

    // 1. Laptop / Screen Glass Frame (3D Device)
    const screenShape = new THREE.Shape();
    const sw = 1.6;
    const sh = 1.05;
    const sr = 0.12;
    screenShape.moveTo(-sw / 2 + sr, -sh / 2);
    screenShape.lineTo(sw / 2 - sr, -sh / 2);
    screenShape.quadraticCurveTo(sw / 2, -sh / 2, sw / 2, -sh / 2 + sr);
    screenShape.lineTo(sw / 2, sh / 2 - sr);
    screenShape.quadraticCurveTo(sw / 2, sh / 2, sw / 2 - sr, sh / 2);
    screenShape.lineTo(-sw / 2 + sr, sh / 2);
    screenShape.quadraticCurveTo(-sw / 2, sh / 2, -sw / 2, sh / 2 - sr);
    screenShape.lineTo(-sw / 2, -sh / 2 + sr);
    screenShape.quadraticCurveTo(-sw / 2, -sh / 2, -sw / 2 + sr, -sh / 2);

    const screenGeo = new THREE.ShapeGeometry(screenShape);
    const screenMat = new THREE.MeshBasicMaterial({
      color: 0x16181f,
      transparent: true,
      opacity: 0.9,
    });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    group.add(screenMesh);

    // Laptop Base Stand
    const baseGeo = new THREE.PlaneGeometry(1.8, 0.12);
    const baseMat = new THREE.MeshBasicMaterial({ color: 0x222630 });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.set(0, -sh / 2 - 0.06, 0.05);
    group.add(baseMesh);

    // Screen Border
    const screenEdges = new THREE.EdgesGeometry(screenGeo);
    const screenEdgesMat = new THREE.LineBasicMaterial({
      color: 0x334155,
      linewidth: 1.5,
    });
    const screenBorder = new THREE.LineSegments(screenEdges, screenEdgesMat);
    group.add(screenBorder);

    // 2. Glowing 5-Star Hologram (Centered on Screen)
    const starShape = new THREE.Shape();
    const starRadius = 0.055;
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? starRadius : starRadius * 0.45;
      const angle = (i * Math.PI) / 5 - Math.PI / 2;
      const sx = Math.cos(angle) * r;
      const sy = Math.sin(angle) * r;
      if (i === 0) starShape.moveTo(sx, sy);
      else starShape.lineTo(sx, sy);
    }
    starShape.closePath();

    const starGeo = new THREE.ShapeGeometry(starShape);
    const starMat = new THREE.MeshBasicMaterial({ color: 0xd4f938 });

    const starsGroup = new THREE.Group();
    for (let i = 0; i < 5; i++) {
      const star = new THREE.Mesh(starGeo, starMat);
      star.position.set((i - 2) * 0.14, 0, 0.1);
      starsGroup.add(star);
    }
    starsGroup.position.set(0.12, 0.05, 0.1);
    group.add(starsGroup);

    // 3. User Avatar Search Lens (Floating Left)
    const lensGroup = new THREE.Group();
    const lensRingGeo = new THREE.RingGeometry(0.2, 0.24, 32);
    const lensRingMat = new THREE.MeshBasicMaterial({
      color: 0xd4f938,
      side: THREE.DoubleSide,
    });
    const lensRing = new THREE.Mesh(lensRingGeo, lensRingMat);

    const lensHandleGeo = new THREE.PlaneGeometry(0.06, 0.28);
    const lensHandleMat = new THREE.MeshBasicMaterial({ color: 0xd4f938 });
    const lensHandle = new THREE.Mesh(lensHandleGeo, lensHandleMat);
    lensHandle.position.set(-0.22, -0.22, 0);
    lensHandle.rotation.z = Math.PI / 4;

    const userGeo = new THREE.CircleGeometry(0.18, 32);
    const userMat = new THREE.MeshBasicMaterial({
      color: 0x1f232d,
      transparent: true,
      opacity: 0.95,
    });
    const userMesh = new THREE.Mesh(userGeo, userMat);

    lensGroup.add(userMesh);
    lensGroup.add(lensRing);
    lensGroup.add(lensHandle);
    lensGroup.position.set(-0.55, 0.08, 0.25);
    group.add(lensGroup);

    // 4. Trust Badges (Google / Clutch Icon Dots on right)
    const badge1Geo = new THREE.CircleGeometry(0.12, 24);
    const badge1Mat = new THREE.MeshBasicMaterial({ color: 0x272b38 });
    const badge1 = new THREE.Mesh(badge1Geo, badge1Mat);
    badge1.position.set(0.62, 0.05, 0.1);

    const badge2 = new THREE.Mesh(badge1Geo, badge1Mat);
    badge2.position.set(0.88, 0.05, 0.1);

    group.add(badge1);
    group.add(badge2);

    // Ambient floating particles
    const partCount = 40;
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
      opacity: 0.55,
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
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
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

      // Subtle floating oscillations
      lensGroup.position.y = 0.08 + Math.sin(time * 2.2) * 0.04;
      starsGroup.position.y = 0.05 + Math.cos(time * 2.0) * 0.02;

      particles.rotation.y = time * 0.05;

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
