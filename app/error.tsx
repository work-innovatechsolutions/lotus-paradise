"use client";

import React, { useEffect } from "react";
import { RefreshCw, Home, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Check if error is due to stale chunk/stylesheet 404 from a rebuild
    const msg = error?.message || "";
    if (
      msg.includes("Failed to fetch dynamically imported module") ||
      msg.includes("ChunkLoadError") ||
      msg.includes("Loading chunk") ||
      msg.includes("net::ERR_ABORTED")
    ) {
      console.warn("Stale dev chunk detected. Auto-reloading page for fresh assets...");
      window.location.reload();
    }
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20 bg-[#FBF8F3]">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border-2 border-[#C89D45]/40 shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 text-[#C62828] flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-accent uppercase tracking-widest text-[#C89D45] font-bold block">
            Lotus Paradise Homestay
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#1F1F1F]">
            Page Refresh Needed
          </h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            The page encountered a temporary resource reload. Please refresh to load the latest Himalayan retreat view.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#C62828] text-white font-accent text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:bg-[#8B1E1E] transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Page</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-accent text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:border-[#C89D45] hover:text-[#1F1F1F] transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
