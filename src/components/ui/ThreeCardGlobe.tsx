"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeCardGlobe() {
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

    // 1. Central Mini Glowing Earth
    const sphereGeo = new THREE.SphereGeometry(0.55, 32, 32);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0xa6f30d,
      wireframe: false,
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    group.add(sphereMesh);

    // Dark Earth Continents / Wireframe overlay
    const wireGeo = new THREE.SphereGeometry(0.56, 16, 16);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x111318,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    group.add(wireMesh);

    // 2. Three Concentric Orbital Ellipse Rings
    const createOrbitRing = (radiusX: number, radiusY: number, rotZ: number) => {
      const curve = new THREE.EllipseCurve(
        0, 0,
        radiusX, radiusY,
        0, 2 * Math.PI,
        false,
        0
      );
      const points = curve.getPoints(64);
      const ringGeo = new THREE.BufferGeometry().setFromPoints(points);
      const ringMat = new THREE.LineBasicMaterial({
        color: 0x334155,
        transparent: true,
        opacity: 0.6,
      });
      const ring = new THREE.Line(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2.8;
      ring.rotation.z = rotZ;
      return ring;
    };

    const orbit1 = createOrbitRing(1.15, 0.9, 0.2);
    const orbit2 = createOrbitRing(1.45, 1.15, -0.4);
    group.add(orbit1);
    group.add(orbit2);

    // 3. Team Node Avatars on Orbit
    const nodeGeo = new THREE.CircleGeometry(0.12, 24);
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0x222630 });
    const nodeBorderGeo = new THREE.RingGeometry(0.12, 0.14, 24);
    const nodeBorderMat = new THREE.MeshBasicMaterial({
      color: 0xd4f938,
      side: THREE.DoubleSide,
    });

    const createTeamNode = (initialAngle: number, radius: number) => {
      const nodeGroup = new THREE.Group();
      const nodeBg = new THREE.Mesh(nodeGeo, nodeMat);
      const nodeBorder = new THREE.Mesh(nodeBorderGeo, nodeBorderMat);
      nodeGroup.add(nodeBg);
      nodeGroup.add(nodeBorder);
      group.add(nodeGroup);
      return { group: nodeGroup, angle: initialAngle, radius };
    };

    const teamNodes = [
      createTeamNode(0.5, 1.1),
      createTeamNode(2.6, 1.2),
      createTeamNode(4.2, 1.45),
      createTeamNode(5.8, 1.05),
    ];

    // Background stardust
    const dustCount = 40;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i += 3) {
      dustPos[i] = (Math.random() - 0.5) * 3.5;
      dustPos[i + 1] = (Math.random() - 0.5) * 2.5;
      dustPos[i + 2] = (Math.random() - 0.5) * 1.5;
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xd4f938,
      size: 0.035,
      transparent: true,
      opacity: 0.5,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    group.add(dust);

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

      sphereMesh.rotation.y = time * 0.4;
      wireMesh.rotation.y = time * 0.4;

      // Animate orbiting team nodes
      teamNodes.forEach((item, idx) => {
        const currentAngle = item.angle + time * (0.3 + idx * 0.08);
        const x = Math.cos(currentAngle) * item.radius;
        const y = Math.sin(currentAngle) * (item.radius * 0.65);
        const z = Math.sin(currentAngle) * 0.35;
        item.group.position.set(x, y, z);
      });

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
