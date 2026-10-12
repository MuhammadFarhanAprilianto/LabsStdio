"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { LockKeyIcon, ViewIcon, ViewOffSlashIcon, ArrowRight02Icon } from "hugeicons-react";
import { ShieldAlert, CheckCircle2, ArrowLeft } from "lucide-react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setErrorMessage("Missing recovery token. Please use the link sent to your email.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please recheck.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password.");
      }

      setIsSuccess(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
          {isSuccess ? "Password Updated" : "Set New Password"}
        </h1>
        <p className="text-xs text-neutral-400 font-['Agrandir',sans-serif] leading-relaxed">
          {isSuccess
            ? "Your account password has been updated securely"
            : "Choose a strong password with at least 6 characters"}
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

      {/* Success View */}
      {isSuccess ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full space-y-5 pt-2"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-100/80 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-sm font-bold text-gray-900">All Set!</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              You can now sign in using your new credentials. Any previous security lockouts have been reset.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/login")}
            className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full border border-neutral-900 bg-[#121316] px-5 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold tracking-wide text-white shadow-sm transition-all duration-1000 hover:border-[#a6f30d] hover:shadow-[0_8px_24px_rgba(166,243,13,0.25)] cursor-pointer w-full"
          >
            <span className="absolute inset-0 z-0 bg-[#a6f30d] -translate-x-full transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:translate-x-0" />
            <span className="relative z-10 font-semibold text-white transition-colors duration-1000 group-hover:text-black">
              Sign In to Your Account
            </span>
          </button>
        </motion.div>
      ) : (
        /* Form View */
        <form onSubmit={handleSubmit} className="w-full space-y-3.5">
          {/* New Password Field */}
          <div className="relative">
            <LockKeyIcon className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="New Password (min. 6 chars)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-[#f4f5f7] border-0 rounded-xl pl-10 pr-10 py-3 text-xs sm:text-sm text-gray-900 placeholder:text-neutral-400 focus:outline-none focus:bg-[#edf0f4] transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-gray-700 transition-colors cursor-pointer"
            >
              {showPassword ? <ViewOffSlashIcon className="w-4 h-4" /> : <ViewIcon className="w-4 h-4" />}
            </button>
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <LockKeyIcon className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type={showConfirm ? "text" : "password"}
              required
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#f4f5f7] border-0 rounded-xl pl-10 pr-10 py-3 text-xs sm:text-sm text-gray-900 placeholder:text-neutral-400 focus:outline-none focus:bg-[#edf0f4] transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-gray-700 transition-colors cursor-pointer"
            >
              {showConfirm ? <ViewOffSlashIcon className="w-4 h-4" /> : <ViewIcon className="w-4 h-4" />}
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
              {isLoading ? "Saving..." : "Update Password"}
            </span>
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-[#f5f6f8] flex items-center justify-center p-4 font-['Agrandir',sans-serif] relative select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[390px] bg-white rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-neutral-100/90 overflow-hidden"
      >
        <Suspense
          fallback={
            <div className="p-12 text-center text-xs text-neutral-400">
              Loading recovery details...
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>

        {/* Bottom Gray Footer Bar */}
        <div className="bg-[#f9fafb] border-t border-neutral-100 py-3.5 px-6 text-center text-xs text-neutral-400">
          <Link
            href="/login"
            className="font-bold text-gray-900 hover:underline transition-colors inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
