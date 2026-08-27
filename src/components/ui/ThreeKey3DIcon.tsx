"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface ThreeKey3DIconProps {
  type: "audit" | "growth" | "expert" | "revenue" | "onboarding";
  isHovered?: boolean;
  className?: string;
}

export default function ThreeKey3DIcon({
  type,
  isHovered = false,
  className = "w-9 h-9 sm:w-10 sm:h-10",
}: ThreeKey3DIconProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const hoverRef = useRef(isHovered);
  hoverRef.current = isHovered;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 40;
    const height = container.clientHeight || 40;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xd4f938, 2.8);
    keyLight.position.set(3, 4, 4);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0x38bdf8, 2.0, 10);
    fillLight.position.set(-3, -2, 3);
    scene.add(fillLight);

    const group = new THREE.Group();
    scene.add(group);

    // Materials
    const limeMetalMat = new THREE.MeshStandardMaterial({
      color: 0xd4f938,
      metalness: 0.7,
      roughness: 0.25,
    });

    const darkChromeMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      metalness: 0.9,
      roughness: 0.15,
    });

    const cyanGlowMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      metalness: 0.6,
      roughness: 0.3,
    });

    const coralMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      metalness: 0.65,
      roughness: 0.2,
    });

    // Geometries based on icon type
    const disposables: (THREE.BufferGeometry | THREE.Material)[] = [
      limeMetalMat,
      darkChromeMat,
      cyanGlowMat,
      coralMat,
    ];

    if (type === "audit") {
      // 3D Audio/Communication Pill + Orbiting Torus Ring
      const pillGeo = new THREE.CapsuleGeometry(0.45, 0.6, 12, 16);
      const pillMesh = new THREE.Mesh(pillGeo, darkChromeMat);
      pillMesh.rotation.z = Math.PI / 4;

      const ringGeo = new THREE.TorusGeometry(0.85, 0.08, 12, 32);
      const ringMesh = new THREE.Mesh(ringGeo, limeMetalMat);
      ringMesh.rotation.x = Math.PI / 3;

      group.add(pillMesh, ringMesh);
      disposables.push(pillGeo, ringGeo);
    } else if (type === "growth") {
      // 3D Concentric Precision Target Ring & Center Arrow Pointer
      const outerRingGeo = new THREE.TorusGeometry(0.8, 0.09, 12, 32);
      const outerRing = new THREE.Mesh(outerRingGeo, limeMetalMat);

      const innerRingGeo = new THREE.TorusGeometry(0.45, 0.07, 12, 24);
      const innerRing = new THREE.Mesh(innerRingGeo, cyanGlowMat);

      const centerConeGeo = new THREE.ConeGeometry(0.28, 0.7, 16);
      const centerCone = new THREE.Mesh(centerConeGeo, darkChromeMat);
      centerCone.rotation.x = Math.PI / 2;

      group.add(outerRing, innerRing, centerCone);
      disposables.push(outerRingGeo, innerRingGeo, centerConeGeo);
    } else if (type === "expert") {
      // 3D Geometric Icosahedron / Expert Sphere with Orbiting Electron Ring
      const icoGeo = new THREE.IcosahedronGeometry(0.65, 0);
      const icoMesh = new THREE.Mesh(icoGeo, darkChromeMat);

      const orbitGeo = new THREE.TorusGeometry(0.95, 0.05, 10, 32);
      const orbitMesh = new THREE.Mesh(orbitGeo, limeMetalMat);
      orbitMesh.rotation.x = Math.PI / 2.5;

      const dotGeo = new THREE.SphereGeometry(0.12, 12, 12);
      const dotMesh = new THREE.Mesh(dotGeo, cyanGlowMat);
      dotMesh.position.set(0.95, 0, 0);
      orbitMesh.add(dotMesh);

      group.add(icoMesh, orbitMesh);
      disposables.push(icoGeo, orbitGeo, dotGeo);
    } else if (type === "revenue") {
      // 3D Sleek Rocket / Thrust Cone with Velocity Ring
      const coneGeo = new THREE.ConeGeometry(0.5, 1.1, 16);
      const coneMesh = new THREE.Mesh(coneGeo, coralMat);
      coneMesh.rotation.z = -Math.PI / 6;

      const baseRingGeo = new THREE.TorusGeometry(0.4, 0.07, 10, 24);
      const baseRing = new THREE.Mesh(baseRingGeo, limeMetalMat);
      baseRing.position.set(-0.25, -0.4, 0);
      baseRing.rotation.x = Math.PI / 3;

      group.add(coneMesh, baseRing);
      disposables.push(coneGeo, baseRingGeo);
    } else if (type === "onboarding") {
      // 3D Chronograph Cylinder Dial with Rotating Indicator
      const cylGeo = new THREE.CylinderGeometry(0.75, 0.75, 0.22, 28);
      const cylMesh = new THREE.Mesh(cylGeo, darkChromeMat);
      cylMesh.rotation.x = Math.PI / 5;

      const handGeo = new THREE.BoxGeometry(0.08, 0.55, 0.06);
      const handMesh = new THREE.Mesh(handGeo, limeMetalMat);
      handMesh.position.set(0, 0.15, 0.15);
      handMesh.rotation.z = Math.PI / 4;

      const topRingGeo = new THREE.TorusGeometry(0.78, 0.05, 10, 32);
      const topRing = new THREE.Mesh(topRingGeo, cyanGlowMat);
      topRing.rotation.x = Math.PI / 5;

      group.add(cylMesh, handMesh, topRing);
      disposables.push(cylGeo, handGeo, topRingGeo);
    }

    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    let reqId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const delta = clock.getDelta();
      const speedMultiplier = hoverRef.current ? 3.2 : 1.0;

      group.rotation.y += delta * 1.2 * speedMultiplier;
      group.rotation.x += delta * 0.6 * (hoverRef.current ? 1.5 : 0.5);

      if (hoverRef.current) {
        group.scale.lerp(new THREE.Vector3(1.18, 1.18, 1.18), 0.1);
      } else {
        group.scale.lerp(new THREE.Vector3(1.0, 1.0, 1.0), 0.1);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      observer.disconnect();
      disposables.forEach((item) => item.dispose());
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [type]);

  return (
    <div
      ref={mountRef}
      className={`relative flex items-center justify-center pointer-events-none select-none ${className}`}
    />
  );
}
