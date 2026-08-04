"use client";

import { useEffect, useRef } from "react";

interface StatItem {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
}

const STATS: StatItem[] = [
  { value: 1200, suffix: "+", label: "Happy Guests" },
  { value: 9, label: "Years of Hospitality" },
  { value: 50, suffix: "+", label: "Bird Species Spotted" },
  { value: 4500, label: "Ft Altitude" },
];

export default function CounterStats() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const init = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      counterRefs.current.forEach((el, idx) => {
        if (!el) return;
        const stat = STATS[idx];

        if (prefersReduced) {
          el.textContent = `${stat.prefix || ""}${stat.value.toLocaleString()}${stat.suffix || ""}`;
          return;
        }

        const obj = { val: 0 };
        gsap.to(obj, {
          val: stat.value,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
          onUpdate: () => {
            el.textContent = `${stat.prefix || ""}${Math.round(obj.val).toLocaleString()}${stat.suffix || ""}`;
          },
        });
      });
    };

    init();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="grid grid-cols-2 lg:grid-cols-4 gap-6 py-10"
    >
      {STATS.map((stat, idx) => (
        <div
          key={idx}
          className="text-center space-y-1.5 group"
        >
          <div className="font-serif text-4xl sm:text-5xl font-bold text-[#C62828] leading-none">
            <span
              ref={(el) => { counterRefs.current[idx] = el; }}
            >
              0
            </span>
          </div>
          <p className="font-accent text-xs uppercase tracking-widest text-[#1F1F1F]/60 font-semibold">
            {stat.label}
          </p>
          <div className="w-8 h-0.5 bg-gradient-to-r from-[#C89D45] to-[#C62828] mx-auto group-hover:w-16 transition-all duration-500 rounded-full" />
        </div>
      ))}
    </div>
  );
}
