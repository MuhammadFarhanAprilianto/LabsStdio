"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeCardProjects() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 220;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.4);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    // Main 3D Pivot Group
    const mainGroup = new THREE.Group();
    // Default dynamic isometric angle
    mainGroup.rotation.x = 0.38;
    mainGroup.rotation.y = -0.45;
    mainGroup.rotation.z = 0.12;
    scene.add(mainGroup);

    // --- Helper: Create Rounded Rect 3D Mesh ---
    const createRoundedCard = (
      w: number,
      h: number,
      r: number,
      depth: number,
      color: number,
      opacity: number,
      borderColor: number
    ) => {
      const cardGroup = new THREE.Group();

      const shape = new THREE.Shape();
      shape.moveTo(-w / 2 + r, -h / 2);
      shape.lineTo(w / 2 - r, -h / 2);
      shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
      shape.lineTo(w / 2, h / 2 - r);
      shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
      shape.lineTo(-w / 2 + r, h / 2);
      shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
      shape.lineTo(-w / 2, -h / 2 + r);
      shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);

      const geom = new THREE.ShapeGeometry(shape);

      // Solid glass surface
      const mat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(geom, mat);
      cardGroup.add(mesh);

      // Glowing Wireframe Edge
      const edges = new THREE.EdgesGeometry(geom);
      const edgeMat = new THREE.LineBasicMaterial({
        color: borderColor,
        transparent: true,
        opacity: 0.9,
      });
      const border = new THREE.LineSegments(edges, edgeMat);
      border.position.z = 0.005;
      cardGroup.add(border);

      return cardGroup;
    };

    // --- Layer 1: Base Platform Card (Bottom Deck) ---
    const layer1 = createRoundedCard(1.9, 1.3, 0.16, 0.05, 0x090b10, 0.7, 0x1e293b);
    layer1.position.set(0, -0.3, -0.45);
    mainGroup.add(layer1);

    // --- Layer 2: Mid Analytics Card (Middle Deck) ---
    const layer2 = createRoundedCard(1.8, 1.25, 0.16, 0.05, 0x0c0e16, 0.85, 0x334155);
    layer2.position.set(0, -0.1, -0.15);
    mainGroup.add(layer2);

    // --- Layer 3: Top Hero Workspace Card (Primary Active UI Deck) ---
    const layer3 = createRoundedCard(1.7, 1.2, 0.16, 0.05, 0x11131c, 0.95, 0xd4f938);
    layer3.position.set(0, 0.12, 0.15);
    mainGroup.add(layer3);

    // --- UI Elements on Top Layer ---
    // 1. Mini Animated Holographic 3D Bar Charts
    const barCount = 4;
    const barMeshes: THREE.Mesh[] = [];
    const barHeights = [0.25, 0.45, 0.32, 0.58];

    for (let i = 0; i < barCount; i++) {
      const barGeo = new THREE.BoxGeometry(0.1, 1, 0.08);
      const barMat = new THREE.MeshBasicMaterial({
        color: i === 3 ? 0xd4f938 : 0x475569,
        transparent: true,
        opacity: i === 3 ? 0.95 : 0.65,
      });
      const bar = new THREE.Mesh(barGeo, barMat);
      bar.position.set(-0.55 + i * 0.16, -0.15, 0.18);
      bar.scale.y = barHeights[i];
      layer3.add(bar);
      barMeshes.push(bar);
    }

    // 2. Neon Metric Wave Line (3D Polyline)
    const curvePoints: THREE.Vector3[] = [];
    for (let i = 0; i < 12; i++) {
      const px = -0.55 + (i / 11) * 1.1;
      const py = 0.08 + Math.sin(i * 0.7) * 0.14;
      curvePoints.push(new THREE.Vector3(px, py, 0.18));
    }
    const lineGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xd4f938,
      linewidth: 2,
      transparent: true,
      opacity: 0.95,
    });
    const waveLine = new THREE.Line(lineGeo, lineMat);
    layer3.add(waveLine);

    // 3. Glowing Peak Data Node Indicator
    const peakNodeGeo = new THREE.SphereGeometry(0.045, 16, 16);
    const peakNodeMat = new THREE.MeshBasicMaterial({ color: 0xd4f938 });
    const peakNode = new THREE.Mesh(peakNodeGeo, peakNodeMat);
    peakNode.position.set(curvePoints[8].x, curvePoints[8].y, 0.2);
    layer3.add(peakNode);

    // Glowing Pulse Ring around Peak Node
    const nodeRingGeo = new THREE.RingGeometry(0.06, 0.085, 24);
    const nodeRingMat = new THREE.MeshBasicMaterial({
      color: 0xa6f30d,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });
    const nodeRing = new THREE.Mesh(nodeRingGeo, nodeRingMat);
    nodeRing.position.set(curvePoints[8].x, curvePoints[8].y, 0.2);
    layer3.add(nodeRing);

    // 4. Central Holographic Floating Octahedron (3D Core Project Crystal)
    const crystalGeo = new THREE.OctahedronGeometry(0.22, 0);
    const crystalMat = new THREE.MeshBasicMaterial({
      color: 0xd4f938,
      wireframe: true,
      transparent: true,
      opacity: 0.9,
    });
    const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
    crystalMesh.position.set(0.42, -0.05, 0.28);
    layer3.add(crystalMesh);

    // Inner Glow Crystal
    const innerCrystalGeo = new THREE.OctahedronGeometry(0.12, 0);
    const innerCrystalMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.85,
    });
    const innerCrystal = new THREE.Mesh(innerCrystalGeo, innerCrystalMat);
    crystalMesh.add(innerCrystal);

    // 5. Floating Ambient Sparkle Dust / Particles
    const particleCount = 65;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 2.8;
      particlePos[i + 1] = (Math.random() - 0.5) * 2.2;
      particlePos[i + 2] = (Math.random() - 0.5) * 1.8;

      if (Math.random() > 0.6) {
        // Lime
        particleColors[i] = 0.83;
        particleColors[i + 1] = 0.98;
        particleColors[i + 2] = 0.22;
      } else {
        // Slate / White
        particleColors[i] = 0.6;
        particleColors[i + 1] = 0.7;
        particleColors[i + 2] = 0.9;
      }
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    mainGroup.add(particles);

    // --- Interactive Mouse Parallax & Gyroscope Physics ---
    let targetRotX = 0.38;
    let targetRotY = -0.45;
    let isHovered = false;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      targetRotX = 0.38 - ny * 0.35;
      targetRotY = -0.45 + nx * 0.45;
    };

    const onMouseEnter = () => {
      isHovered = true;
    };

    const onMouseLeave = () => {
      isHovered = false;
      targetRotX = 0.38;
      targetRotY = -0.45;
    };

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseenter", onMouseEnter);
    container.addEventListener("mouseleave", onMouseLeave);

    // Viewport Intersection Observer
    let isVisible = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // --- Animation Loop ---
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const elapsed = clock.getElapsedTime();

      // Smooth Parallax Damping
      mainGroup.rotation.x += (targetRotX - mainGroup.rotation.x) * 0.06;
      mainGroup.rotation.y += (targetRotY - mainGroup.rotation.y) * 0.06;

      // Gentle floating bob
      mainGroup.position.y = Math.sin(elapsed * 1.6) * 0.06;

      // Layer 3 dynamic floating separation
      layer3.position.z = 0.15 + Math.sin(elapsed * 2.0) * 0.035;
      layer2.position.z = -0.15 + Math.sin(elapsed * 2.0 + 0.6) * 0.02;

      // Rotate Crystal Core
      crystalMesh.rotation.x = elapsed * 1.2;
      crystalMesh.rotation.y = elapsed * 1.8;

      // Pulse Node Ring
      nodeRing.scale.setScalar(1.0 + Math.sin(elapsed * 3.5) * 0.25);
      nodeRingMat.opacity = 0.6 + Math.sin(elapsed * 3.5) * 0.3;

      // Animated Bar Chart Heights
      barMeshes.forEach((bar, idx) => {
        const baseH = barHeights[idx];
        bar.scale.y = baseH + Math.sin(elapsed * 2.2 + idx * 0.8) * 0.08;
      });

      // Ambient Particles Drift
      particles.rotation.y = elapsed * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 300;
      const h = container.clientHeight || 220;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      resizeObserver.disconnect();
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseenter", onMouseEnter);
      container.removeEventListener("mouseleave", onMouseLeave);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[220px] sm:h-[240px] flex items-center justify-center select-none pointer-events-auto cursor-pointer"
    />
  );
}
