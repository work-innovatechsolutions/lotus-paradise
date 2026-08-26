"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function PageLoader() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    // Smoothly animate progress from 0% to 100%
    const startTime = Date.now();
    const duration = 1400; // 1.4 seconds

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
        // Start fading after 200ms
        setTimeout(() => {
          setFading(true);
        }, 200);

        // Remove from DOM after fade out transition completes
        setTimeout(() => {
          setVisible(false);
          document.body.style.overflow = "";
        }, 800);
      }
    }, 16); // 60fps update

    return () => {
      clearInterval(interval);
      document.body.style.overflow = "";
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      id="page-loader"
      role="status"
      aria-label="Loading The Cometas"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: fading ? 0 : 1,
        transform: fading ? "scale(1.02)" : "scale(1)",
        transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        pointerEvents: fading ? "none" : "auto",
      }}
    >
      {/* BACKGROUND — hotel night photo */}
      <div style={{ position: "absolute", inset: 0 }}>
        <Image
          src="/hotel_night.jpeg"
          alt=""
          fill
          priority
          className="object-cover object-center"
          style={{ transform: "scale(1.06)" }}
          aria-hidden="true"
        />
      </div>

      {/* DARK GRADIENT OVERLAY — deepens the night atmosphere */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(0,0,0,0.72) 0%, rgba(15,8,25,0.80) 50%, rgba(0,0,0,0.75) 100%)",
        }}
      />

      {/* AMBIENT GLOW — matches the hotel neon lights */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "500px",
          height: "300px",
          background:
            "radial-gradient(ellipse, rgba(255,220,100,0.12) 0%, rgba(198,40,40,0.06) 50%, transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />

      {/* GLASSMORPHIC CARD */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.75rem",
          padding: "3rem 3.5rem",
          borderRadius: "28px",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.05) 100%)",
          backdropFilter: "blur(28px) saturate(160%)",
          WebkitBackdropFilter: "blur(28px) saturate(160%)",
          border: "1px solid rgba(200,157,69,0.35)",
          boxShadow:
            "0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.12)",
          minWidth: "340px",
          maxWidth: "90vw",
        }}
      >
        {/* Gold top accent line */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: "10%",
            right: "10%",
            height: "1.5px",
            background:
              "linear-gradient(90deg, transparent, #C89D45, #F3D27A, #C89D45, transparent)",
            borderRadius: "2px",
          }}
        />

        {/* LOGO */}
        <div>
          <div
            style={{
              position: "relative",
              width: "220px",
              height: "92px",
              background: "rgba(255, 255, 255, 0.95)",
              borderRadius: "18px",
              padding: "10px 16px",
              border: "1px solid rgba(200, 157, 69, 0.4)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
              <Image
                src="/The Cometas Logo.png"
                alt="The Cometas — Luxury Himalayan Homestay"
                fill
                priority
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* SUBTITLE */}
        <p
          style={{
            fontFamily: "Manrope, sans-serif",
            fontSize: "10.5px",
            textTransform: "uppercase",
            letterSpacing: "0.32em",
            color: "rgba(200,157,69,0.9)",
            textAlign: "center",
            lineHeight: 1.8,
          }}
        >
          Himalayan Homestay
          <br />
          <span style={{ color: "rgba(255,255,255,0.45)", letterSpacing: "0.18em" }}>
            Latpanchar · Sitong · Darjeeling
          </span>
        </p>

        {/* MOUNTAIN SVG DIVIDER */}
        <svg
          viewBox="0 0 400 48"
          style={{ width: "100%", maxWidth: "320px" }}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M0,48 L40,28 L70,40 L110,8 L150,36 L190,4 L230,32 L265,18 L300,40 L335,14 L370,34 L400,22 L400,48 Z"
            fill="url(#mountain-grad-ldr)"
            opacity="0.4"
          />
          <defs>
            <linearGradient id="mountain-grad-ldr" x1="0" y1="0" x2="400" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#C62828" />
              <stop offset="0.5" stopColor="#C89D45" />
              <stop offset="1" stopColor="#2C2473" />
            </linearGradient>
          </defs>
        </svg>

        {/* PROGRESS BAR & PERCENTAGE */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "220px",
              height: "3px",
              background: "rgba(255,255,255,0.12)",
              borderRadius: "4px",
              overflow: "hidden",
              position: "relative",
              border: "1px solid rgba(200,157,69,0.3)",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background:
                  "linear-gradient(90deg, #C62828 0%, #C89D45 60%, #F3D27A 100%)",
                borderRadius: "4px",
                transition: "width 0.05s linear",
                boxShadow: "0 0 10px rgba(243,210,122,0.6)",
              }}
            />
          </div>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "10px",
              color: "rgba(200,157,69,0.9)",
              letterSpacing: "0.15em",
              fontWeight: 600,
            }}
          >
            {progress}%
          </span>
        </div>

        {/* Gold bottom accent line */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: 0,
            left: "20%",
            right: "20%",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(200,157,69,0.4), transparent)",
            borderRadius: "2px",
          }}
        />
      </div>
    </div>
  );
}
