"use client";

import { useEffect } from "react";

/**
 * Registers GSAP ScrollTrigger globally once on mount.
 * Must be rendered inside the root layout (client-side only).
 */
export default function GsapInitializer() {
  useEffect(() => {
    const init = async () => {
      // Only initialize in browser
      if (typeof window === "undefined") return;

      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");

      gsap.registerPlugin(ScrollTrigger);

      // Disable lag smoothing for consistent scroll-driven animations
      gsap.ticker.lagSmoothing(0);

      // Default GSAP global settings for luxury feel
      gsap.defaults({
        ease: "power3.out",
        duration: 1.0,
      });
    };

    init();
  }, []);

  return null;
}
