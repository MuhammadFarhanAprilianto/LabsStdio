"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import SoundWaveVisualizer from "@/components/ui/SoundWaveVisualizer";

export default function ShowcaseCardSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Toggle Audio & Musik saat tombol diklik (Menjamin audio jernih tanpa patah-patah di mobile)
  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isPlayingAudio) {
      // Matikan Suara / Pause Lagu
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlayingAudio(false);
    } else {
      // Putar Musik: Selaraskan posisi detik awal sekali saja saat tombol diklik, lalu biarkan streaming mengalir lancar tanpa interupsi
      if (audioRef.current && videoRef.current) {
        const vTime = videoRef.current.currentTime || 0;
        const aDuration = audioRef.current.duration || 0;
        if (aDuration > 0) {
          audioRef.current.currentTime = vTime % aDuration;
        } else {
          audioRef.current.currentTime = vTime;
        }

        audioRef.current.play().catch((err) => {
          console.log("Audio playback error:", err);
        });
      }
      setIsPlayingAudio(true);
    }
  };

  // Sinkronisasi saat video di-seek atau di-loop ulang
  const handleVideoSeeked = () => {
    if (videoRef.current && audioRef.current && isPlayingAudio) {
      const vTime = videoRef.current.currentTime || 0;
      const aDuration = audioRef.current.duration || 0;
      if (aDuration > 0) {
        audioRef.current.currentTime = vTime % aDuration;
      }
    }
  };

  // Pastikan video selalu autoplay & selalu muted agar tidak terjadi dual-audio / bentrok audio focus di Android & iPhone
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  // Track scroll progress with wide travel range
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 95%", "center 50%"],
  });

  // Ultra-smooth spring physics for fluid slow-motion continuous expansion
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 45,
    damping: 22,
    mass: 0.6,
    restDelta: 0.0001,
  });

  // Transform scale & dimensions softly
  const scale = useTransform(smoothProgress, [0, 1], [0.88, 1]);
  const width = useTransform(smoothProgress, [0, 1], ["90%", "100%"]);
  const borderRadius = useTransform(smoothProgress, [0, 1], [36, 24]);
  const opacity = useTransform(smoothProgress, [0, 0.5], [0.75, 1]);

  // Lapisan Hitam yang pudar bertahap saat di-scroll
  const darkOverlayOpacity = useTransform(smoothProgress, [0, 0.75], [0.92, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full flex flex-col items-center justify-start pt-6 sm:pt-4 pb-12 sm:pb-10 px-4 sm:px-8 bg-white overflow-hidden"
    >
      {/* Audio Element: Memutar lagu Sport01Backsound.mp3 */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
      >
        <source src="/audio/Sport01Backsound.mp3" type="audio/mpeg" />
        <source src="/audio/song.mp3" type="audio/mpeg" />
      </audio>

      {/* Expanding Card Container with GPU acceleration */}
      <motion.div
        style={{
          scale,
          width,
          borderRadius,
          opacity,
        }}
        className="group relative mx-auto max-w-7xl aspect-[16/9] min-h-[420px] sm:min-h-[580px] bg-black border border-slate-800/80 overflow-hidden flex flex-col items-center justify-center will-change-transform transform-gpu cursor-pointer"
      >
        {/* Video Player: Video01.webm (selalu muted agar tidak bentrok dengan soundtrack MP3) */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          onSeeked={handleVideoSeeked}
          className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none"
        >
          <source src="/videos/Video01.webm" type="video/webm" />
          <source src="/videos/showcase.mp4" type="video/mp4" />
        </video>

        {/* Lapisan Hitam Murni (Fade Out saat scroll & Hover Reveal) */}
        <motion.div
          style={{
            opacity: darkOverlayOpacity,
          }}
          className="absolute inset-0 bg-gradient-to-b from-[#090a0f] via-[#090b10] to-[#040507] z-20 pointer-events-none transition-opacity duration-500 group-hover:opacity-0"
        />

        {/* Neon Lime Audio/Mute Toggle Button dengan Rolling Flip Transition Sesuai Desain Tombol Website */}
        <button
          onClick={toggleAudio}
          aria-label={isPlayingAudio ? "Mute audio" : "Play audio & music"}
          title={isPlayingAudio ? "Mute audio" : "Play audio & music"}
          className={`group/btn absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-30 inline-flex h-13 w-13 sm:h-15 sm:w-15 items-center justify-center overflow-hidden rounded-full bg-[#d4f938] border border-[#c4eb28] shadow-xl shadow-black/40 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] hover:bg-[#111111] hover:border-black hover:shadow-2xl active:scale-90 cursor-pointer ${
            isPlayingAudio ? "ring-4 ring-[#d4f938]/40 scale-105 shadow-[#d4f938]/30" : ""
          }`}
        >
          {/* Layer 1: Icon Hitam Awal (Meluncur keluar ke atas saat hover) */}
          <div className="flex items-center justify-center text-black transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover/btn:-translate-y-[160%]">
            <SoundWaveVisualizer isPlaying={isPlayingAudio} />
          </div>

          {/* Layer 2: Icon Hijau Neon (Meluncur masuk dari bawah ke tengah saat hover) */}
          <div className="absolute inset-0 flex items-center justify-center text-[#d4f938] translate-y-[160%] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover/btn:translate-y-0">
            <SoundWaveVisualizer isPlaying={isPlayingAudio} />
          </div>
        </button>
      </motion.div>
    </section>
  );
}
