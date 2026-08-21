"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface TestimonialPin {
  id: string;
  lat: number;
  lng: number;
  city: string;
  country: string;
  flag: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  content: string;
}

const pinsData: TestimonialPin[] = [
  {
    id: "pin-jakarta",
    lat: -6.2,
    lng: 106.8,
    city: "Jakarta",
    country: "Indonesia",
    flag: "🇮🇩",
    name: "Rian Pratama",
    role: "VP of Product",
    company: "Nusantara Labs",
    avatar: "RP",
    rating: 5,
    content:
      "Kualitas visual dan animasi 3D WebGL-nya luar biasa! Brand kami langsung terlihat bertaraf internasional.",
  },
  {
    id: "pin-ny",
    lat: 40.7,
    lng: -74.0,
    city: "New York",
    country: "United States",
    flag: "🇺🇸",
    name: "Alex Rivera",
    role: "Head of Product",
    company: "HexPay Cards",
    avatar: "AR",
    rating: 5,
    content:
      "They completely elevated our digital presence. Flawless execution from initial UX concept to Next.js deployment.",
  },
  {
    id: "pin-london",
    lat: 51.5,
    lng: -0.1,
    city: "London",
    country: "United Kingdom",
    flag: "🇬🇧",
    name: "Marcus Vance",
    role: "Design Director",
    company: "Zenith Studio",
    avatar: "MV",
    rating: 5,
    content:
      "World-class aesthetic polish and technical depth. A truly exceptional team to partner with.",
  },
  {
    id: "pin-tokyo",
    lat: 35.6,
    lng: 139.6,
    city: "Tokyo",
    country: "Japan",
    flag: "🇯🇵",
    name: "Kenji Sato",
    role: "Founder & CEO",
    company: "Cenario AI",
    avatar: "KS",
    rating: 5,
    content:
      "The micro-interactions and smooth performance captivated our users and increased engagement significantly.",
  },
  {
    id: "pin-sydney",
    lat: -33.8,
    lng: 151.2,
    city: "Sydney",
    country: "Australia",
    flag: "🇦🇺",
    name: "Chloe Harrison",
    role: "Marketing Lead",
    company: "Lumina Digital",
    avatar: "CH",
    rating: 5,
    content:
      "The user journey design is unmatched. Our clients are consistently wowed by the interactive experience.",
  },
];

interface PinScreenPosition {
  id: string;
  pin: TestimonialPin;
  x: number;
  y: number;
  isVisible: boolean;
}

interface ThreeInteractiveGlobeProps {
  className?: string;
}

export default function ThreeInteractiveGlobe({
  className = "",
}: ThreeInteractiveGlobeProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [screenPins, setScreenPins] = useState<PinScreenPosition[]>([]);
  const [activePinId, setActivePinId] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- 1. Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    const width = container.clientWidth;
    const height = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // --- 2. Globe Group ---
    const globeGroup = new THREE.Group();
    globeGroup.scale.set(0.82, 0.82, 0.82);
    scene.add(globeGroup);

    // Initial slight axial tilt
    globeGroup.rotation.x = 0.25;
    globeGroup.rotation.z = -0.05;

    // --- 3. Create Circular Dot Texture for Earth Landmass ---
    const dotCanvas = document.createElement("canvas");
    dotCanvas.width = 64;
    dotCanvas.height = 64;
    const dotCtx = dotCanvas.getContext("2d");
    if (dotCtx) {
      const gradient = dotCtx.createRadialGradient(32, 32, 0, 32, 32, 30);
      gradient.addColorStop(0, "rgba(255, 255, 255, 1.0)");
      gradient.addColorStop(0.4, "rgba(255, 255, 255, 0.95)");
      gradient.addColorStop(0.85, "rgba(255, 255, 255, 0.3)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      dotCtx.fillStyle = gradient;
      dotCtx.beginPath();
      dotCtx.arc(32, 32, 30, 0, Math.PI * 2);
      dotCtx.fill();
    }
    const dotTexture = new THREE.CanvasTexture(dotCanvas);

    // --- 4. Create Luminous Starburst / Lens Flare Texture for Sparkling Galaxy Stars ---
    const starCanvas = document.createElement("canvas");
    starCanvas.width = 128;
    starCanvas.height = 128;
    const sCtx = starCanvas.getContext("2d");
    if (sCtx) {
      // Outer Glowing Halo
      const haloGrad = sCtx.createRadialGradient(64, 64, 0, 64, 64, 60);
      haloGrad.addColorStop(0, "rgba(255, 255, 255, 1.0)");
      haloGrad.addColorStop(0.18, "rgba(235, 255, 210, 0.95)");
      haloGrad.addColorStop(0.45, "rgba(212, 249, 56, 0.55)");
      haloGrad.addColorStop(0.75, "rgba(56, 189, 248, 0.25)");
      haloGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      sCtx.fillStyle = haloGrad;
      sCtx.beginPath();
      sCtx.arc(64, 64, 60, 0, Math.PI * 2);
      sCtx.fill();

      // Horizontal Lens Flare Beam
      const beamGradH = sCtx.createLinearGradient(0, 64, 128, 64);
      beamGradH.addColorStop(0, "rgba(255, 255, 255, 0)");
      beamGradH.addColorStop(0.5, "rgba(255, 255, 255, 1)");
      beamGradH.addColorStop(1, "rgba(255, 255, 255, 0)");
      sCtx.fillStyle = beamGradH;
      sCtx.fillRect(4, 62, 120, 4);

      // Vertical Lens Flare Beam
      const beamGradV = sCtx.createLinearGradient(64, 0, 64, 128);
      beamGradV.addColorStop(0, "rgba(255, 255, 255, 0)");
      beamGradV.addColorStop(0.5, "rgba(255, 255, 255, 1)");
      beamGradV.addColorStop(1, "rgba(255, 255, 255, 0)");
      sCtx.fillStyle = beamGradV;
      sCtx.fillRect(62, 4, 4, 120);

      // Brilliant Core Point
      sCtx.fillStyle = "#ffffff";
      sCtx.beginPath();
      sCtx.arc(64, 64, 7, 0, Math.PI * 2);
      sCtx.fill();
    }
    const starTexture = new THREE.CanvasTexture(starCanvas);

    // --- 5. Load Accurate World Landmask ---
    const img = new Image();
    img.src = "/images/world_landmask.jpg";
    img.crossOrigin = "anonymous";

    let pointsMesh: THREE.Points | null = null;
    let oceanPointsMesh: THREE.Points | null = null;

    const RADIUS = 1.55;

    img.onload = () => {
      const offscreenCanvas = document.createElement("canvas");
      offscreenCanvas.width = img.width;
      offscreenCanvas.height = img.height;
      const offCtx = offscreenCanvas.getContext("2d");
      if (!offCtx) return;

      offCtx.drawImage(img, 0, 0);
      const imgData = offCtx.getImageData(0, 0, img.width, img.height);
      const pixels = imgData.data;

      const landPositions: number[] = [];
      const landColors: number[] = [];
      const oceanPositions: number[] = [];

      const LAT_RINGS = 160;

      for (let i = 0; i <= LAT_RINGS; i++) {
        const lat = -86 + (172 * i) / LAT_RINGS;
        const latRad = THREE.MathUtils.degToRad(lat);
        const cosLat = Math.cos(latRad);
        const sinLat = Math.sin(latRad);

        const numLng = Math.max(1, Math.floor(LAT_RINGS * 2.8 * cosLat));

        for (let j = 0; j < numLng; j++) {
          const lng = -180 + (360 * j) / numLng;
          const lngRad = THREE.MathUtils.degToRad(lng);

          const u = (lng + 180) / 360;
          const v = 1 - (lat + 90) / 180;

          const px = Math.min(img.width - 1, Math.floor(u * img.width));
          const py = Math.min(img.height - 1, Math.floor(v * img.height));
          const pixelIndex = (py * img.width + px) * 4;

          const brightness = pixels[pixelIndex];

          const x = -RADIUS * cosLat * Math.cos(lngRad);
          const y = RADIUS * sinLat;
          const z = RADIUS * cosLat * Math.sin(lngRad);

          if (brightness > 90) {
            landPositions.push(x, y, z);
            const isHighlight = Math.random() > 0.94;
            if (isHighlight) {
              landColors.push(0.85, 1.0, 0.25);
            } else {
              landColors.push(1.0, 1.0, 1.0);
            }
          } else {
            if (i % 2 === 0 && j % 3 === 0) {
              oceanPositions.push(x * 0.996, y * 0.996, z * 0.996);
            }
          }
        }
      }

      const landGeo = new THREE.BufferGeometry();
      landGeo.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(landPositions, 3)
      );
      landGeo.setAttribute(
        "color",
        new THREE.Float32BufferAttribute(landColors, 3)
      );

      const landMat = new THREE.PointsMaterial({
        size: 0.032,
        vertexColors: true,
        map: dotTexture,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      pointsMesh = new THREE.Points(landGeo, landMat);
      globeGroup.add(pointsMesh);

      const oceanGeo = new THREE.BufferGeometry();
      oceanGeo.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(oceanPositions, 3)
      );
      const oceanMat = new THREE.PointsMaterial({
        size: 0.015,
        color: 0x334155,
        map: dotTexture,
        transparent: true,
        opacity: 0.22,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      oceanPointsMesh = new THREE.Points(oceanGeo, oceanMat);
      globeGroup.add(oceanPointsMesh);
    };

    // Dark Core & Glow Shell
    const coreGeo = new THREE.SphereGeometry(1.52, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x07080c });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    globeGroup.add(coreMesh);

    const glowGeo = new THREE.SphereGeometry(1.56, 32, 32);
    const glowMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 2.5);
          gl_FragColor = vec4(0.9, 0.95, 1.0, 1.0) * intensity * 0.85;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    globeGroup.add(glowMesh);

    // --- 6. Interactive 3D Glowing Hotspot Pins ---
    const latLngToVector3 = (lat: number, lng: number, radius: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );
    };

    const pinObjects: { id: string; mesh: THREE.Mesh; pin: TestimonialPin }[] =
      [];

    pinsData.forEach((pin) => {
      const pos = latLngToVector3(pin.lat, pin.lng, RADIUS * 1.008);

      const pinGeo = new THREE.SphereGeometry(0.024, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({
        color: 0xd4f938,
      });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.copy(pos);
      globeGroup.add(pinMesh);

      const ringGeo = new THREE.RingGeometry(0.034, 0.046, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xa6f30d,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos);
      ringMesh.lookAt(new THREE.Vector3(0, 0, 0));
      globeGroup.add(ringMesh);

      pinObjects.push({ id: pin.id, mesh: pinMesh, pin });
    });

    // --- 7. Rich Glowing Cosmic Galaxy Stars (Bintang Berkilau & Memantulkan Cahaya Nyata) ---
    // Layer 1: Bintang Cemerlang Utama Berkilau (Sparkling Lens Flare Stars)
    const starCount = 380;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      // Posisi di sekitar pandangan kamera luar angkasa
      const dist = 2.4 + Math.random() * 5.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 1.2;

      starPos[i] = dist * Math.cos(phi) * Math.cos(theta);
      starPos[i + 1] = dist * Math.sin(phi) * 0.9;
      starPos[i + 2] = dist * Math.cos(phi) * Math.sin(theta) - 0.5;

      const randColor = Math.random();
      if (randColor > 0.82) {
        // Neon Lime Sparkle Star
        starColors[i] = 0.83;
        starColors[i + 1] = 0.98;
        starColors[i + 2] = 0.22;
      } else if (randColor > 0.65) {
        // Cyan Diamond Star
        starColors[i] = 0.45;
        starColors[i + 1] = 0.88;
        starColors[i + 2] = 1.0;
      } else {
        // Pure Brilliant White Star
        starColors[i] = 1.0;
        starColors[i + 1] = 1.0;
        starColors[i + 2] = 1.0;
      }
    }

    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute("color", new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.16, // Ukuran diperbesar dan sangat jelas bercahaya
      vertexColors: true,
      map: starTexture,
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const starPoints = new THREE.Points(starGeo, starMat);
    scene.add(starPoints);

    // Layer 2: Debu Partikel Kosmik Halus (Nebula Shimmer)
    const dustCount = 500;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    const dustColors = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount * 3; i += 3) {
      const dist = 2.0 + Math.random() * 6.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      dustPos[i] = dist * Math.cos(phi) * Math.cos(theta);
      dustPos[i + 1] = dist * Math.sin(phi);
      dustPos[i + 2] = dist * Math.cos(phi) * Math.sin(theta) - 1.2;

      dustColors[i] = 0.85 + Math.random() * 0.15;
      dustColors[i + 1] = 0.95 + Math.random() * 0.05;
      dustColors[i + 2] = 0.9 + Math.random() * 0.1;
    }

    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    dustGeo.setAttribute("color", new THREE.BufferAttribute(dustColors, 3));

    const dustMat = new THREE.PointsMaterial({
      size: 0.065,
      vertexColors: true,
      map: starTexture,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const dustPoints = new THREE.Points(dustGeo, dustMat);
    scene.add(dustPoints);

    // --- 8. Interaction & Damping ---
    let isHovered = false;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotationX = 0.25;
    let mouseVelocity = { x: 0, y: 0 };

    const onMouseEnter = () => {
      isHovered = true;
    };

    const onMouseLeave = () => {
      isHovered = false;
      isDragging = false;
    };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        mouseVelocity.x = deltaX * 0.005;
        mouseVelocity.y = deltaY * 0.005;

        globeGroup.rotation.y += mouseVelocity.x;
        globeGroup.rotation.x += mouseVelocity.y;

        previousMousePosition = { x: e.clientX, y: e.clientY };
      } else if (isHovered) {
        targetRotationX = 0.25 + normY * 0.22;
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Touch support for mobile
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - previousMousePosition.x;
        const deltaY = e.touches[0].clientY - previousMousePosition.y;

        globeGroup.rotation.y += deltaX * 0.006;
        globeGroup.rotation.x += deltaY * 0.006;

        previousMousePosition = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    container.addEventListener("mouseenter", onMouseEnter);
    container.addEventListener("mouseleave", onMouseLeave);
    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    // --- 9. Animation Loop & Twinkling Galaxy Stars ---
    let animationFrameId: number;
    const tempVec = new THREE.Vector3();
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      const autoSpeed = isHovered ? 0.00035 : 0.0025;

      if (!isDragging) {
        globeGroup.rotation.y += autoSpeed;
        globeGroup.rotation.x +=
          (targetRotationX - globeGroup.rotation.x) * 0.05;

        mouseVelocity.x *= 0.92;
        mouseVelocity.y *= 0.92;
        globeGroup.rotation.y += mouseVelocity.x;
        globeGroup.rotation.x += mouseVelocity.y;
      }

      // Animasi Berkedip & Memantulkan Cahaya (Sparkling Pulse)
      starMat.size = 0.15 + Math.sin(elapsedTime * 2.2) * 0.035;
      starMat.opacity = 0.85 + Math.sin(elapsedTime * 2.5) * 0.15;
      starPoints.rotation.y -= 0.0003;
      starPoints.rotation.x += 0.0001;

      dustMat.opacity = 0.65 + Math.cos(elapsedTime * 1.8) * 0.2;
      dustPoints.rotation.y += 0.0002;

      // Project 3D Hotspot positions to 2D Screen Space
      if (container) {
        const cWidth = container.clientWidth;
        const cHeight = container.clientHeight;

        const updatedPositions: PinScreenPosition[] = pinObjects.map((item) => {
          item.mesh.getWorldPosition(tempVec);

          const isFacingCamera = tempVec.z > -0.2;
          tempVec.project(camera);

          const screenX = (tempVec.x * 0.5 + 0.5) * cWidth;
          const screenY = (-tempVec.y * 0.5 + 0.5) * cHeight;

          return {
            id: item.id,
            pin: item.pin,
            x: screenX,
            y: screenY,
            isVisible:
              isFacingCamera &&
              screenX >= 0 &&
              screenX <= cWidth &&
              screenY >= 0 &&
              screenY <= cHeight,
          };
        });

        setScreenPins(updatedPositions);
      }

      renderer.render(scene, camera);
    };

    animate();

    // --- 10. Resize Observer ---
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();

      container.removeEventListener("mouseenter", onMouseEnter);
      container.removeEventListener("mouseleave", onMouseLeave);
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      container.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      glowGeo.dispose();
      glowMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      dotTexture.dispose();
      starTexture.dispose();
      if (pointsMesh) {
        pointsMesh.geometry.dispose();
        (pointsMesh.material as THREE.Material).dispose();
      }
      if (oceanPointsMesh) {
        oceanPointsMesh.geometry.dispose();
        (oceanPointsMesh.material as THREE.Material).dispose();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full cursor-grab active:cursor-grabbing select-none ${className}`}
    >
      {/* Interactive 2D Projected Hotspot Elements & Chat Bubbles */}
      {screenPins.map((item) => {
        if (!item.isVisible) return null;

        const isCardActive = activePinId === item.id;
        const isNearTop = item.y < 270;

        return (
          <div
            key={item.id}
            style={{
              position: "absolute",
              left: item.x,
              top: item.y,
              transform: "translate(-50%, -50%)",
              zIndex: isCardActive ? 50 : 30,
            }}
            className="pointer-events-auto"
            onMouseEnter={() => setActivePinId(item.id)}
            onMouseLeave={() => setActivePinId(null)}
            onClick={(e) => {
              e.stopPropagation();
              setActivePinId(activePinId === item.id ? null : item.id);
            }}
          >
            {/* Titik Neon Hijau Lebih Kecil & Halus */}
            <div className="relative group cursor-pointer flex items-center justify-center p-1.5">
              <span className="absolute w-4 h-4 rounded-full bg-[#d4f938]/30 animate-ping pointer-events-none" />
              <span className="relative w-2.5 h-2.5 rounded-full bg-[#d4f938] border border-black shadow-[0_0_8px_#d4f938] transition-transform duration-300 group-hover:scale-150" />
            </div>

            {/* Bubble Chat Testimonial Card */}
            <div
              className={`absolute left-1/2 -translate-x-1/2 w-[280px] sm:w-[310px] rounded-[22px] bg-neutral-950/92 backdrop-blur-xl border border-white/20 p-4 sm:p-5 text-white shadow-[0_20px_50px_rgba(0,0,0,0.85)] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-auto ${
                isNearTop ? "top-full mt-3.5" : "bottom-full mb-3.5"
              } ${
                isCardActive
                  ? "opacity-100 scale-100 translate-y-0"
                  : `opacity-0 scale-90 ${
                      isNearTop ? "-translate-y-2" : "translate-y-2"
                    } pointer-events-none`
              }`}
            >
              {/* Country Badge & Stars */}
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white/90 font-['Questrial',sans-serif]">
                  <span>{item.pin.flag}</span>
                  <span className="font-semibold">{item.pin.city}</span>
                  <span className="text-neutral-400">• {item.pin.country}</span>
                </div>

                {/* Star Rating */}
                <div className="flex items-center gap-0.5 text-[#d4f938]">
                  {[...Array(item.pin.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-3.5 h-3.5 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>

              {/* Testimonial Quote */}
              <p className="text-xs sm:text-[13px] text-neutral-200 font-['Questrial',sans-serif] leading-relaxed mb-3">
                &ldquo;{item.pin.content}&rdquo;
              </p>

              {/* Client Info */}
              <div className="flex items-center gap-2.5 pt-2.5 border-t border-white/10">
                <div className="w-7 h-7 rounded-full bg-[#d4f938] text-black font-black text-[10px] flex items-center justify-center shadow">
                  {item.pin.avatar}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white font-['Agrandir',sans-serif]">
                    {item.pin.name}
                  </h4>
                  <p className="text-[10px] text-neutral-400 font-['Questrial',sans-serif]">
                    {item.pin.role},{" "}
                    <span className="text-neutral-300 font-semibold">
                      {item.pin.company}
                    </span>
                  </p>
                </div>
              </div>

              {/* Chat Bubble Arrow Tip */}
              {isNearTop ? (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-0.5 border-solid border-b-neutral-950/92 border-b-8 border-x-transparent border-x-8 border-t-0" />
              ) : (
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-0.5 border-solid border-t-neutral-950/92 border-t-8 border-x-transparent border-x-8 border-b-0" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
