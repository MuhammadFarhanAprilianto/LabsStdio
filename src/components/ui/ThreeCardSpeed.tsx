"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeCardSpeed() {
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

    // 1. Sleek 3D Laptop / Terminal Frame
    const screenShape = new THREE.Shape();
    const sw = 1.5;
    const sh = 1.0;
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

    // Base stand
    const baseGeo = new THREE.PlaneGeometry(1.7, 0.1);
    const baseMat = new THREE.MeshBasicMaterial({ color: 0x242834 });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.set(0, -sh / 2 - 0.05, 0.05);
    group.add(baseMesh);

    // Terminal wire lines
    const lineGeo = new THREE.PlaneGeometry(0.55, 0.04);
    const lineMat = new THREE.MeshBasicMaterial({ color: 0x334155 });
    const line1 = new THREE.Mesh(lineGeo, lineMat);
    line1.position.set(0.2, -0.15, 0.05);
    const line2 = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 0.04), lineMat);
    line2.position.set(0.1, -0.25, 0.05);
    group.add(line1);
    group.add(line2);

    // 2. Glowing "A+" Badge on Screen (Right)
    const gradeCanvas = document.createElement("canvas");
    gradeCanvas.width = 128;
    gradeCanvas.height = 64;
    const gCtx = gradeCanvas.getContext("2d");
    if (gCtx) {
      gCtx.fillStyle = "#d4f938";
      gCtx.font = "bold 44px sans-serif";
      gCtx.textAlign = "center";
      gCtx.textBaseline = "middle";
      gCtx.fillText("A+", 64, 32);
    }
    const gradeTexture = new THREE.CanvasTexture(gradeCanvas);
    const gradeGeo = new THREE.PlaneGeometry(0.55, 0.28);
    const gradeMat = new THREE.MeshBasicMaterial({
      map: gradeTexture,
      transparent: true,
    });
    const gradeMesh = new THREE.Mesh(gradeGeo, gradeMat);
    gradeMesh.position.set(0.25, 0.12, 0.08);
    group.add(gradeMesh);

    // 3. Floating Speed / Briefcase Badge (Left)
    const badgeGroup = new THREE.Group();
    const bCircleGeo = new THREE.CircleGeometry(0.22, 32);
    const bCircleMat = new THREE.MeshBasicMaterial({ color: 0x1f232d });
    const bRingGeo = new THREE.RingGeometry(0.22, 0.25, 32);
    const bRingMat = new THREE.MeshBasicMaterial({
      color: 0xd4f938,
      side: THREE.DoubleSide,
    });

    const bCaseGeo = new THREE.PlaneGeometry(0.18, 0.13);
    const bCaseMat = new THREE.MeshBasicMaterial({ color: 0xd4f938 });
    const bCase = new THREE.Mesh(bCaseGeo, bCaseMat);
    bCase.position.set(0, 0, 0.02);

    badgeGroup.add(new THREE.Mesh(bCircleGeo, bCircleMat));
    badgeGroup.add(new THREE.Mesh(bRingGeo, bRingMat));
    badgeGroup.add(bCase);
    badgeGroup.position.set(-0.55, 0.05, 0.25);
    group.add(badgeGroup);

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

      badgeGroup.position.y = 0.05 + Math.sin(time * 2.2) * 0.04;
      badgeGroup.position.x = -0.55 + Math.cos(time * 1.8) * 0.02;

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
