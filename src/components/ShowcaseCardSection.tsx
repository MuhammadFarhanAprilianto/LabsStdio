"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export default function ShowcaseCardSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Sinkronisasi posisi audio dengan video secara presisi (durasi & loop otomatis mengikuti video)
  const handleTimeUpdate = () => {
    if (videoRef.current && audioRef.current && isPlayingAudio) {
      // Jika selisih waktu audio dan video > 0.2 detik, selaraskan langsung
      if (Math.abs(audioRef.current.currentTime - videoRef.current.currentTime) > 0.25) {
        audioRef.current.currentTime = videoRef.current.currentTime;
      }
    }
  };

  const handleVideoSeeked = () => {
    if (videoRef.current && audioRef.current) {
      audioRef.current.currentTime = videoRef.current.currentTime;
    }
  };

  // Fungsi Toggle Audio & Musik saat tombol diklik
  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isPlayingAudio) {
      // Matikan Suara / Pause Lagu
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (videoRef.current) {
        videoRef.current.muted = true;
      }
      setIsPlayingAudio(false);
    } else {
      // Putar Musik & Samakan Posisi Detik dengan Video Saat Ini
      if (videoRef.current && audioRef.current) {
        audioRef.current.currentTime = videoRef.current.currentTime;
        audioRef.current.play().catch((err) => {
          console.log("Audio playback error:", err);
        });
        videoRef.current.muted = false;
      }
      setIsPlayingAudio(true);
    }
  };

  // Pastikan video autoplay secara otomatis (selalu muted di awal sebelum tombol diklik)
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
      className="relative w-full min-h-[90vh] flex flex-col items-center justify-start pt-2 pb-24 px-4 sm:px-8 bg-white overflow-hidden"
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
        className="group relative mx-auto max-w-7xl aspect-[16/9] min-h-[420px] sm:min-h-[580px] bg-black shadow-[0_30px_90px_-20px_rgba(15,23,42,0.4)] border border-slate-800/80 overflow-hidden flex flex-col items-center justify-center will-change-transform transform-gpu cursor-pointer"
      >
        {/* Video Player: Video01.webm dengan listener timeupdate & seeked */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={!isPlayingAudio}
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onSeeked={handleVideoSeeked}
          className="absolute inset-0 w-full h-full object-cover z-10"
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

        {/* Neon Lime Audio/Mute Toggle Button di Pojok Kanan Bawah */}
        <button
          onClick={toggleAudio}
          aria-label={isPlayingAudio ? "Mute audio" : "Play audio & music"}
          className={`absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-30 flex h-13 w-13 sm:h-15 sm:w-15 items-center justify-center rounded-full bg-[#d4f938] text-black shadow-xl shadow-black/40 transition-all duration-300 hover:scale-110 active:scale-90 hover:shadow-[#d4f938]/40 hover:shadow-2xl cursor-pointer ${
            isPlayingAudio ? "ring-4 ring-[#d4f938]/40 scale-105" : ""
          }`}
        >
          {isPlayingAudio ? (
            /* Icon Unmuted / Playing Music (Speaker with active sound waves) */
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7 animate-pulse"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          ) : (
            /* Icon Muted (Speaker with slash) */
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          )}
        </button>
      </motion.div>
    </section>
  );
}
