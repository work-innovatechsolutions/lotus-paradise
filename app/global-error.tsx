"use client";

import React, { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // If a stylesheet or root chunk fails to load after a recompile, reload once cleanly
    if (typeof window !== "undefined") {
      const hasReloaded = sessionStorage.getItem("lp_auto_reloaded");
      if (!hasReloaded) {
        sessionStorage.setItem("lp_auto_reloaded", "true");
        window.location.reload();
      }
    }
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: "#FBF8F3", fontFamily: "sans-serif", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div style={{ maxWidth: 440, background: "#FFFFFF", borderRadius: 20, padding: 32, textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", border: "1px solid #C89D45" }}>
          <h2 style={{ color: "#2C2473", margin: "0 0 12px 0", fontFamily: "serif" }}>Lotus Paradise Homestay</h2>
          <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6, margin: "0 0 24px 0" }}>
            Updating with the latest Himalayan retreat view. Please click below to refresh.
          </p>
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                sessionStorage.removeItem("lp_auto_reloaded");
                window.location.reload();
              }
            }}
            style={{ background: "#C62828", color: "#FFFFFF", border: "none", padding: "12px 24px", borderRadius: 10, fontSize: 12, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1, cursor: "pointer" }}
          >
            Refresh Now
          </button>
        </div>
      </body>
    </html>
  );
}
