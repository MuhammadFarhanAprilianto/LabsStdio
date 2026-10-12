"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Mail01Icon, ArrowRight02Icon } from "hugeicons-react";
import { ShieldAlert, CheckCircle2, ArrowLeft, ExternalLink } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successInfo, setSuccessInfo] = useState<{
    message: string;
    resetUrl?: string;
    isDev?: boolean;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process request.");
      }

      setSuccessInfo({
        message: data.message || "A recovery link has been prepared.",
        resetUrl: data.resetUrl,
        isDev: data.isDev,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred.";
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
              Forgot Password
            </h1>
            <p className="text-xs text-neutral-400 font-['Agrandir',sans-serif] leading-relaxed">
              Enter your email address to receive a secure password recovery link
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
                <ShieldAlert className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Card or Form */}
          {successInfo ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full space-y-4 text-left"
            >
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-emerald-800 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Recovery Link Prepared</span>
                </div>
                <p className="text-[11px] text-emerald-700 leading-relaxed">
                  We have prepared instructions to reset your password for <span className="font-semibold">{email}</span>.
                </p>
              </div>

              {/* Dev Mode Instant Test Link */}
              {successInfo.resetUrl && (
                <div className="p-3.5 rounded-2xl bg-[#f8fafc] border border-neutral-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500">
                      Localhost Test Mode
                    </span>
                    <span className="text-[10px] bg-[#d4f938] text-black px-1.5 py-0.5 rounded font-bold">
                      Active
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 leading-relaxed">
                    Click the link below to test the reset password flow directly:
                  </p>
                  <Link
                    href={successInfo.resetUrl}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-900 bg-white border border-neutral-200 px-3 py-2 rounded-xl hover:bg-neutral-50 hover:border-neutral-400 transition-all w-full justify-center shadow-xs"
                  >
                    <span>Open Reset Password Page</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}

              <Link
                href="/login"
                className="w-full py-2.5 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Sign In</span>
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full space-y-3.5">
              {/* Email Field */}
              <div className="relative">
                <Mail01Icon className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="Your Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#f4f5f7] border-0 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-gray-900 placeholder:text-neutral-400 focus:outline-none focus:bg-[#edf0f4] transition-colors"
                />
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
                  {isLoading ? "Generating Link..." : "Send Recovery Link"}
                </span>
              </button>
            </form>
          )}
        </div>

        {/* Bottom Gray Footer Bar */}
        <div className="bg-[#f9fafb] border-t border-neutral-100 py-3.5 px-6 text-center text-xs text-neutral-400">
          <span>Remember your password? </span>
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
