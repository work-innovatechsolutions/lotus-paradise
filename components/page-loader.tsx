"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function PageLoader() {
  const [visible, setVisible] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const mountainRef = useRef<SVGSVGElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const animate = async () => {
      const { gsap } = await import("gsap");

      // Set initial states
      gsap.set(cardRef.current, { opacity: 0, y: 40, scale: 0.94 });
      gsap.set(logoRef.current, { opacity: 0, y: -24 });
      gsap.set(textRef.current, { opacity: 0, y: 12 });
      gsap.set(mountainRef.current, { opacity: 0, y: 30 });
      gsap.set(progressRef.current, { scaleX: 0, transformOrigin: "left center" });

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.to(loaderRef.current, {
            opacity: 0,
            duration: 0.9,
            ease: "power2.inOut",
            onComplete: () => {
              setVisible(false);
              document.body.style.overflow = "";
            },
          });
        },
      });

      // 1. Glass card rises in
      tl.to(cardRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.9,
        ease: "power3.out",
      });

      // 2. Logo drops in inside card
      tl.to(logoRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "back.out(1.6)",
      }, "-=0.5");

      // 3. Subtitle fades up
      tl.to(textRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: "power2.out",
      }, "-=0.35");

      // 4. Mountain silhouette rises
      tl.to(mountainRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
      }, "-=0.3");

      // 5. Progress bar sweeps
      tl.to(progressRef.current, {
        scaleX: 1,
        duration: 1.4,
        ease: "power1.inOut",
      }, "-=0.4");

      // 6. Pause then exit
      tl.to({}, { duration: 0.3 });
    };

    animate();

    const fallback = setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = "";
    }, 5000);

    return () => clearTimeout(fallback);
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={loaderRef}
      id="page-loader"
      role="status"
      aria-label="Loading Lotus Paradise"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
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
        ref={cardRef}
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
        <div ref={logoRef} style={{ opacity: 0 }}>
          <div style={{ position: "relative", width: "240px", height: "62px" }}>
            <Image
              src="/LotusParadise.png"
              alt="Lotus Paradise Homestay"
              fill
              priority
              className="object-contain"
              style={{
                filter:
                  "drop-shadow(0 2px 16px rgba(200,157,69,0.5)) brightness(1.15)",
              }}
            />
          </div>
        </div>

        {/* SUBTITLE */}
        <p
          ref={textRef}
          style={{
            fontFamily: "Manrope, sans-serif",
            fontSize: "10.5px",
            textTransform: "uppercase",
            letterSpacing: "0.32em",
            color: "rgba(200,157,69,0.9)",
            opacity: 0,
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
          ref={mountainRef}
          viewBox="0 0 400 48"
          style={{ width: "100%", maxWidth: "320px", opacity: 0 }}
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

        {/* PROGRESS BAR */}
        <div
          style={{
            width: "200px",
            height: "1.5px",
            background: "rgba(200,157,69,0.18)",
            borderRadius: "2px",
            overflow: "hidden",
          }}
        >
          <div
            ref={progressRef}
            style={{
              height: "100%",
              background:
                "linear-gradient(90deg, #C62828, #C89D45, #F3D27A, #C89D45)",
              borderRadius: "2px",
              transform: "scaleX(0)",
              transformOrigin: "left center",
            }}
          />
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
