"use client";

import React from "react";

interface MountainDividerProps {
  /** "ivory" = light background below, "dark" = dark background below */
  facing?: "up" | "down";
  colorAbove?: string;
  colorBelow?: string;
  className?: string;
  animated?: boolean;
}

export default function MountainDivider({
  facing = "up",
  colorAbove = "#FBF8F3",
  colorBelow = "#1F1F1F",
  className = "",
}: MountainDividerProps) {
  const transform = facing === "down" ? "scale(1, -1)" : undefined;

  return (
    <div className={`mountain-divider relative ${className}`} aria-hidden="true">
      {/* Gold decorative line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C89D45] to-transparent" />

      <svg
        viewBox="0 0 1440 80"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ display: "block", width: "100%", transform, background: colorAbove }}
      >
        <path
          d="M0,80 L0,50 L60,30 L120,55 L200,15 L280,45 L360,5 L440,38 L520,20 L600,50 L680,10 L760,42 L840,22 L920,48 L1000,8 L1080,38 L1160,18 L1240,52 L1320,28 L1380,48 L1440,30 L1440,80 Z"
          fill={colorBelow}
          stroke="#C89D45"
          strokeWidth="0.5"
          strokeOpacity="0.5"
        />
      </svg>
    </div>
  );
}
