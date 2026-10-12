"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail01Icon,
  LockKeyIcon,
  ViewIcon,
  ViewOffSlashIcon,
  ArrowRight02Icon,
} from "hugeicons-react";
import { User, ShieldCheck } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setErrorMessage("");
    window.location.href = "/api/auth/google";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed.");
      }

      const destination = data.redirectTo || "/portal";
      router.push(destination);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration error.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f6f8] flex items-center justify-center p-4 font-['Agrandir',sans-serif] relative select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[390px] bg-white rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-neutral-100/90 overflow-hidden"
      >
        {/* Top Body */}
        <div className="p-7 sm:p-8 space-y-5 flex flex-col items-center text-center">
          {/* Logo Squircle with Dotted Halo */}
          <div className="relative flex items-center justify-center pt-1">
            <div className="absolute w-20 h-20 rounded-full border border-dashed border-neutral-200/90 animate-[spin_60s_linear_infinite]" />
            <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-[0_8px_20px_rgba(0,0,0,0.15)] relative z-10 bg-black flex items-center justify-center border border-neutral-800">
              <Image
                src="/images/P-LOGO.webp"
                alt="Labs Stdio Official Logo"
                width={56}
                height={56}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <h1 className="text-xl sm:text-[22px] font-bold text-gray-900 tracking-tight font-['Questrial',sans-serif]">
              Create an account
            </h1>
            <p className="text-xs text-neutral-400 font-['Agrandir',sans-serif] leading-relaxed">
              Sign up to access your digital agency portal
            </p>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium flex items-center gap-2 text-left"
              >
                <ShieldCheck className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-3.5">
            {/* Full Name */}
            <div className="relative">
              <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                required
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#f4f5f7] border-0 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-gray-900 placeholder:text-neutral-400 focus:outline-none focus:bg-[#edf0f4] transition-colors"
              />
            </div>

            {/* Email Field */}
            <div className="relative">
              <Mail01Icon className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#f4f5f7] border-0 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-gray-900 placeholder:text-neutral-400 focus:outline-none focus:bg-[#edf0f4] transition-colors"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <LockKeyIcon className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Create Password (min. 6 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#f4f5f7] border-0 rounded-xl pl-10 pr-10 py-3 text-xs sm:text-sm text-gray-900 placeholder:text-neutral-400 focus:outline-none focus:bg-[#edf0f4] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-gray-700 transition-colors cursor-pointer"
              >
                {showPassword ? (
                  <ViewOffSlashIcon className="w-4 h-4" />
                ) : (
                  <ViewIcon className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Submit Button: Exact 1000ms Sliding Hover Transition */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full border border-neutral-900 bg-[#121316] px-5 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold tracking-wide text-white shadow-sm transition-all duration-1000 hover:border-[#a6f30d] hover:shadow-[0_8px_24px_rgba(166,243,13,0.25)] cursor-pointer disabled:opacity-50 w-full mt-1"
            >
              {/* Sliding Neon Fill Background (1000ms duration) */}
              <span className="absolute inset-0 z-0 bg-[#a6f30d] -translate-x-full transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:translate-x-0" />

              {/* Circle Arrow Badge with Nudge Animation */}
              <span className="relative z-10 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-white/10 transition-all duration-1000 group-hover:bg-black/10 group-hover:translate-x-0.5">
                <ArrowRight02Icon className="h-3.5 w-3.5 text-white transition-colors duration-1000 group-hover:text-black" />
              </span>

              {/* Text */}
              <span className="relative z-10 font-semibold text-white transition-colors duration-1000 group-hover:text-black">
                {isLoading ? "Creating Account..." : "Create Account"}
              </span>
            </button>
          </form>

          {/* Dotted Divider: Or continue with */}
          <div className="relative flex items-center justify-center w-full my-1">
            <div className="w-full border-t border-dashed border-neutral-200" />
            <span className="absolute bg-white px-3 text-[11px] text-neutral-400 font-medium">
              Or continue with
            </span>
          </div>

          {/* Google Sign In Only */}
          <div className="w-full">
            <button
              type="button"
              disabled={isLoading}
              onClick={handleGoogleLogin}
              title="Sign in with Google"
              className="w-full py-2.5 px-4 rounded-full border border-neutral-200/90 bg-white hover:bg-neutral-50 active:scale-[0.99] flex items-center justify-center gap-2.5 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.03)] cursor-pointer disabled:opacity-50 relative overflow-hidden group"
            >
              <svg className="w-4 h-4 group-hover:scale-110 transition-transform shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span className="text-xs sm:text-sm font-semibold text-neutral-700">
                Sign in with Google
              </span>
            </button>
          </div>
        </div>

        {/* Bottom Gray Footer Bar */}
        <div className="bg-[#f9fafb] border-t border-neutral-100 py-3.5 px-6 text-center text-xs text-neutral-400">
          <span>Already have an account? </span>
          <Link
            href="/login"
            className="font-bold text-gray-900 hover:underline transition-colors"
          >
            Sign In
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
