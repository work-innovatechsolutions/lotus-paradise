"use client";

import { useEffect, useRef, ReactNode } from "react";

interface SectionRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "clip";
  threshold?: string;
}

/**
 * Reusable section reveal wrapper using GSAP ScrollTrigger.
 * Wraps any content and animates it into view on scroll.
 */
export default function SectionReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  threshold = "80% bottom",
}: SectionRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const init = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const fromVars: Record<string, string | number> = { opacity: 0 };
      const toVars: Record<string, string | number> = { opacity: 1, duration: 1.1, delay };

      if (direction === "up") {
        fromVars.y = 60;
        toVars.y = 0;
        toVars.ease = "power3.out";
      } else if (direction === "left") {
        fromVars.x = -70;
        toVars.x = 0;
        toVars.ease = "power3.out";
      } else if (direction === "right") {
        fromVars.x = 70;
        toVars.x = 0;
        toVars.ease = "power3.out";
      } else if (direction === "clip") {
        fromVars.clipPath = "inset(0 0 100% 0)";
        toVars.clipPath = "inset(0 0 0% 0)";
        toVars.ease = "power4.inOut";
        toVars.duration = 1.3;
        delete fromVars.opacity;
        delete toVars.opacity;
        // Set initial opacity to 1 for clip
        gsap.set(el, { opacity: 1 });
      }

      gsap.fromTo(el, fromVars, {
        ...toVars,
        scrollTrigger: {
          trigger: el,
          start: threshold,
          once: true,
        },
      });
    };

    init();
  }, [delay, direction, threshold]);

  // Set initial state via inline style for SSR compatibility
  const initialStyle: React.CSSProperties =
    direction === "clip"
      ? { clipPath: "inset(0 0 100% 0)" }
      : { opacity: 0 };

  return (
    <div ref={ref} className={className} style={initialStyle}>
      {children}
    </div>
  );
}
