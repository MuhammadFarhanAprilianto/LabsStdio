"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeCardProjects() {
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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // 1. Central Rounded Glass Card (Wireframe & Solid)
    const cardShape = new THREE.Shape();
    const w = 1.3;
    const h = 1.0;
    const r = 0.15;
    cardShape.moveTo(-w / 2 + r, -h / 2);
    cardShape.lineTo(w / 2 - r, -h / 2);
    cardShape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    cardShape.lineTo(w / 2, h / 2 - r);
    cardShape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
    cardShape.lineTo(-w / 2 + r, h / 2);
    cardShape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
    cardShape.lineTo(-w / 2, -h / 2 + r);
    cardShape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);

    const cardGeo = new THREE.ShapeGeometry(cardShape);
    const cardMat = new THREE.MeshBasicMaterial({
      color: 0x16181f,
      transparent: true,
      opacity: 0.85,
    });
    const cardMesh = new THREE.Mesh(cardGeo, cardMat);
    group.add(cardMesh);

    // Glowing Neon Lime Border
    const edgesGeo = new THREE.EdgesGeometry(cardGeo);
    const edgesMat = new THREE.LineBasicMaterial({
      color: 0xd4f938,
      linewidth: 2,
    });
    const borderLine = new THREE.LineSegments(edgesGeo, edgesMat);
    group.add(borderLine);

    // Inner UI Grid Plus Icon (+)
    const plusGeo = new THREE.BufferGeometry();
    const plusVertices = new Float32Array([
      -0.12, 0, 0.05, 0.12, 0, 0.05,
      0, -0.12, 0.05, 0, 0.12, 0.05,
    ]);
    plusGeo.setAttribute("position", new THREE.BufferAttribute(plusVertices, 3));
    const plusMat = new THREE.LineBasicMaterial({ color: 0xa6f30d, linewidth: 2 });
    const plusMesh = new THREE.LineSegments(plusGeo, plusMat);
    group.add(plusMesh);

    // 2. Floating Cursor Pointer
    const cursorGroup = new THREE.Group();
    const cursorShape = new THREE.Shape();
    cursorShape.moveTo(0, 0);
    cursorShape.lineTo(0.18, -0.32);
    cursorShape.lineTo(0.06, -0.3);
    cursorShape.lineTo(0.01, -0.45);
    cursorShape.lineTo(-0.06, -0.43);
    cursorShape.lineTo(-0.01, -0.28);
    cursorShape.lineTo(-0.16, -0.24);
    cursorShape.closePath();

    const cursorGeo = new THREE.ShapeGeometry(cursorShape);
    const cursorMat = new THREE.MeshBasicMaterial({ color: 0xd4f938 });
    const cursorMesh = new THREE.Mesh(cursorGeo, cursorMat);
    cursorGroup.add(cursorMesh);
    cursorGroup.position.set(-0.25, -0.25, 0.15);
    cursorGroup.rotation.z = 0.35;
    group.add(cursorGroup);

    // 3. Floating Rocket Badge Icon (Top Right)
    const badgeGeo = new THREE.CircleGeometry(0.24, 32);
    const badgeMat = new THREE.MeshBasicMaterial({
      color: 0x222630,
      transparent: true,
      opacity: 0.95,
    });
    const badgeMesh = new THREE.Mesh(badgeGeo, badgeMat);
    badgeMesh.position.set(0.65, 0.52, 0.2);

    const badgeRingGeo = new THREE.RingGeometry(0.24, 0.26, 32);
    const badgeRingMat = new THREE.MeshBasicMaterial({
      color: 0xd4f938,
      side: THREE.DoubleSide,
    });
    const badgeRing = new THREE.Mesh(badgeRingGeo, badgeRingMat);
    badgeRing.position.set(0.65, 0.52, 0.21);

    group.add(badgeMesh);
    group.add(badgeRing);

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
      size: 0.04,
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

    // Animation Loop
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      targetRotY = mouseX * 0.45;
      targetRotX = -mouseY * 0.35;

      group.rotation.y += (targetRotY - group.rotation.y) * 0.08;
      group.rotation.x += (targetRotX - group.rotation.x) * 0.08;

      // Floating oscillation
      badgeMesh.position.y = 0.52 + Math.sin(time * 2.5) * 0.04;
      badgeRing.position.y = 0.52 + Math.sin(time * 2.5) * 0.04;
      cursorGroup.position.x = -0.25 + Math.cos(time * 1.8) * 0.05;
      cursorGroup.position.y = -0.25 + Math.sin(time * 1.8) * 0.05;

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
