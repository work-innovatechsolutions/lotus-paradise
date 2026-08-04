"use client";

import { useRef, useEffect, ReactNode } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

/**
 * Magnetic button: cursor attracts the button toward it within ~100px radius.
 * Wrap any button or link with this component.
 */
export default function MagneticButton({
  children,
  className = "",
  strength = 0.35,
}: MagneticButtonProps) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let gsapRef: Awaited<typeof import("gsap")>["gsap"] | null = null;

    const initGsap = async () => {
      const { gsap } = await import("gsap");
      gsapRef = gsap;
    };

    initGsap();

    const handleMouseMove = (e: MouseEvent) => {
      if (!gsapRef) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const radius = rect.width * 1.2;

      if (dist < radius) {
        gsapRef.to(el, {
          x: dx * strength,
          y: dy * strength,
          duration: 0.4,
          ease: "power2.out",
        });
      }
    };

    const handleMouseLeave = () => {
      if (!gsapRef) return;
      gsapRef.to(el, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.5)",
      });
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [strength]);

  return (
    <div ref={wrapRef} className={`magnetic-wrap ${className}`}>
      {children}
    </div>
  );
}
