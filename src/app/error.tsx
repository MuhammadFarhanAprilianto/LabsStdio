"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home, ShieldAlert } from "lucide-react";

export default function GlobalErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [incidentId, setIncidentId] = useState<string>("");

  useEffect(() => {
    const id = "INC-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    setIncidentId(id);
    console.error("[OBSERVABILITY_CLIENT_CRASH]", {
      incidentId: id,
      message: error.message,
      digest: error.digest,
      timestamp: new Date().toISOString(),
    });
  }, [error]);

  return (
    <div className="min-h-screen bg-[#080808] text-white flex items-center justify-center p-6 selection:bg-[#a6f30d] selection:text-black">
      <div className="max-w-md w-full bg-[#121212]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#a6f30d]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Icon & Badge */}
        <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-6">
          <AlertCircle className="w-6 h-6" />
        </div>

        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
            System Fault Intercepted
          </span>
          {incidentId && (
            <span className="text-xs text-white/40 font-mono">
              ID: {incidentId}
            </span>
          )}
        </div>

        <h1 className="text-2xl font-bold tracking-tight mb-2">
          An Unexpected Incident Occurred
        </h1>

        <p className="text-sm text-white/60 mb-6 leading-relaxed">
          The Labs Stdio zero-trust observability shield intercepted a runtime fault. Your account and stored credentials remain completely safe and uncompromised.
        </p>

        {error.digest && (
          <div className="mb-6 p-3 rounded-lg bg-black/40 border border-white/5 font-mono text-xs text-white/50 break-all">
            Digest Signature: {error.digest}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => reset()}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#a6f30d] text-black font-semibold text-sm hover:brightness-110 transition-all cursor-pointer shadow-lg shadow-[#a6f30d]/10"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>

          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-medium text-sm hover:bg-white/10 transition-all"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-white/40">
          <span className="flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-[#a6f30d]" />
            Enterprise Observability Active
          </span>
          <span>Labs Stdio Core</span>
        </div>
      </div>
    </div>
  );
}
