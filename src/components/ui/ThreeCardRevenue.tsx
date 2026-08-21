"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeCardRevenue() {
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

    // 1. Stacked 3D Glass Layer Cards
    const createLayer = (y: number, z: number, isHighlighted: boolean) => {
      const layerGroup = new THREE.Group();
      const shape = new THREE.Shape();
      const w = 1.6;
      const h = 0.42;
      const r = 0.08;

      shape.moveTo(-w / 2 + r, -h / 2);
      shape.lineTo(w / 2 - r, -h / 2);
      shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
      shape.lineTo(w / 2, h / 2 - r);
      shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
      shape.lineTo(-w / 2 + r, h / 2);
      shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
      shape.lineTo(-w / 2, -h / 2 + r);
      shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);

      const geo = new THREE.ShapeGeometry(shape);
      const mat = new THREE.MeshBasicMaterial({
        color: isHighlighted ? 0x1f232e : 0x14161d,
        transparent: true,
        opacity: 0.9,
      });
      const mesh = new THREE.Mesh(geo, mat);
      layerGroup.add(mesh);

      // Border outline
      const edges = new THREE.EdgesGeometry(geo);
      const edgesMat = new THREE.LineBasicMaterial({
        color: isHighlighted ? 0xd4f938 : 0x2b303d,
        linewidth: isHighlighted ? 2 : 1,
      });
      layerGroup.add(new THREE.LineSegments(edges, edgesMat));

      // Internal text placeholder line
      const lineGeo = new THREE.PlaneGeometry(0.6, 0.04);
      const lineMat = new THREE.MeshBasicMaterial({ color: 0x3b4252 });
      const line = new THREE.Mesh(lineGeo, lineMat);
      line.position.set(-0.35, 0, 0.02);
      layerGroup.add(line);

      // Glowing Checkmark for highlighted layer
      if (isHighlighted) {
        const checkShape = new THREE.Shape();
        checkShape.moveTo(-0.06, 0);
        checkShape.lineTo(-0.01, -0.05);
        checkShape.lineTo(0.08, 0.06);
        const checkGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-0.06, 0, 0.03),
          new THREE.Vector3(-0.01, -0.05, 0.03),
          new THREE.Vector3(0.08, 0.06, 0.03),
        ]);
        const checkMat = new THREE.LineBasicMaterial({
          color: 0xd4f938,
          linewidth: 3,
        });
        const checkLine = new THREE.Line(checkGeo, checkMat);
        checkLine.position.set(0.52, 0, 0.02);
        layerGroup.add(checkLine);
      }

      layerGroup.position.set(0, y, z);
      return layerGroup;
    };

    const layer1 = createLayer(0.52, -0.1, false);
    const layer2 = createLayer(0.02, 0.1, true); // Active highlighted layer
    const layer3 = createLayer(-0.48, -0.05, false);

    group.add(layer1);
    group.add(layer2);
    group.add(layer3);

    // 2. Floating Growth / Investment Badge at Bottom Right
    const badgeGroup = new THREE.Group();
    const bGeo = new THREE.CircleGeometry(0.18, 24);
    const bMat = new THREE.MeshBasicMaterial({ color: 0x222630 });
    const bRingGeo = new THREE.RingGeometry(0.18, 0.21, 24);
    const bRingMat = new THREE.MeshBasicMaterial({
      color: 0xd4f938,
      side: THREE.DoubleSide,
    });
    badgeGroup.add(new THREE.Mesh(bGeo, bMat));
    badgeGroup.add(new THREE.Mesh(bRingGeo, bRingMat));
    badgeGroup.position.set(0.48, -0.55, 0.2);
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

      // Floating layer depth oscillations
      layer2.position.z = 0.1 + Math.sin(time * 2.2) * 0.03;
      badgeGroup.position.y = -0.55 + Math.sin(time * 2.0) * 0.03;

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
