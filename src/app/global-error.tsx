"use client";

import React from "react";
import { RotateCcw } from "lucide-react";

export default function GlobalFatalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-[#080808] text-white flex items-center justify-center min-h-screen p-6 font-sans">
        <div className="max-w-md w-full bg-[#121212] border border-white/10 rounded-2xl p-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 mx-auto flex items-center justify-center mb-4">
            ⚠️
          </div>
          <h1 className="text-xl font-bold mb-2">Critical System Recovery</h1>
          <p className="text-sm text-white/60 mb-6">
            The application encountered a critical runtime exception. The observability engine has logged this incident.
          </p>
          <button
            onClick={() => reset()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#a6f30d] text-black font-semibold text-sm cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Reload Platform
          </button>
        </div>
      </body>
    </html>
  );
}
