"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { HeroService } from "@/services/hero.service";
import type { HeroSlide } from "@/types/hero";
import MountainFog from "./mountain-fog";
import { ChevronLeft, ChevronRight, Compass, Calendar, MapPin, ChevronDown } from "lucide-react";

export default function HeroSlider() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // GSAP timeline refs
  const badgeRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const locationRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const overlayBlobRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const unsub = HeroService.subscribeToActiveSlides((activeSlides) => {
      setSlides(activeSlides);
    });

    const handleUpdate = async () => {
      const activeSlides = await HeroService.getActiveSlides();
      setSlides(activeSlides);
    };

    window.addEventListener("lp_hero_slides_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      unsub();
      window.removeEventListener("lp_hero_slides_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (slides.length <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 7000);
  }, [slides.length]);

  const nextSlide = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    startTimer();
  }, [slides.length, startTimer]);

  const prevSlide = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    startTimer();
  }, [slides.length, startTimer]);

  const goToSlide = useCallback((idx: number) => {
    setCurrentIndex(idx);
    startTimer();
  }, [startTimer]);

  // Auto-advance slides with timer cleanup
  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  // GSAP slide transition animation — runs smoothly on slide switch
  useEffect(() => {
    if (slides.length === 0) return;

    const runTimeline = async () => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const { gsap } = await import("gsap");

      const targets = [
        badgeRef.current,
        headingRef.current,
        subtitleRef.current,
        locationRef.current,
        buttonsRef.current,
      ];

      gsap.killTweensOf(targets);

      if (prefersReduced) {
        targets.forEach((el) => {
          if (el) gsap.set(el, { opacity: 1, y: 0 });
        });
        return;
      }

      // Reset targets to initial state cleanly
      gsap.set(targets, {
        opacity: 0,
        y: 22,
      });

      const tl = gsap.timeline();

      // 1. Badge slides up
      tl.to(badgeRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: "power3.out",
      });

      // 2. Heading smoothly animates without DOM splitting thrash
      tl.to(
        headingRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: "power3.out",
        },
        "-=0.4"
      );

      // 3. Subtitle slides up
      tl.to(
        subtitleRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.4"
      );

      // 4. Location tag
      tl.to(
        locationRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.35"
      );

      // 5. Buttons stagger up
      tl.to(
        buttonsRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
        },
        "-=0.3"
      );
    };

    runTimeline();
  }, [currentIndex]);

  // Scroll indicator bounce & float animation (runs once on mount)
  useEffect(() => {
    const initScrollAnim = async () => {
      const { gsap } = await import("gsap");
      if (!scrollIndicatorRef.current) return;

      gsap.set(scrollIndicatorRef.current, { opacity: 0, y: -10 });

      const tl = gsap.timeline({ delay: 1.2 });
      tl.to(scrollIndicatorRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "back.out(2)",
      });
      tl.to(scrollIndicatorRef.current, {
        y: 8,
        duration: 1.2,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
      }, "+=0.2");
    };

    initScrollAnim();
  }, []);

  if (slides.length === 0) return (
    <section className="w-full h-screen bg-[#111111] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-2 border-[#C89D45] border-t-transparent rounded-full animate-spin" />
        <p className="font-accent text-xs uppercase tracking-widest text-[#C89D45]">Loading Paradise...</p>
      </div>
    </section>
  );

  const activeSlide = slides[currentIndex] || slides[0];
  if (!activeSlide) return null;

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen min-h-[700px] max-h-[1000px] overflow-hidden bg-[#111111]"
    >
      {/* BACKGROUND IMAGE — Natural colors, pristine uncompressed quality, silky smooth hardware-accelerated zoom */}
      <div
        key={activeSlide.id}
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{
          animation: "kenBurns 10s ease-out forwards",
          willChange: "transform",
          transform: "translate3d(0, 0, 0)",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
      >
        <Image
          src={activeSlide.desktopImage || "/images/hero/bengal-latpanchar.jpg.jpeg"}
          alt={activeSlide.title || "Hero banner"}
          fill
          priority
          quality={100}
          unoptimized={true}
          className="hero-bg-image object-cover object-center"
        />
      </div>

      {/* ULTRA-MINIMAL SOFT BOTTOM ACCENT — Keeps image 100% natural and bright with no dark veil */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/25 to-transparent pointer-events-none z-10" />

      {/* TEXT CONTENT CONTAINER — pointer-events-none so it never intercepts bottom/side controls */}
      <div
        className={`relative z-30 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center pt-28 sm:pt-32 lg:pt-36 pb-20 md:pb-28 pointer-events-none ${
          activeSlide.textAlignment === "center"
            ? "items-center text-center"
            : activeSlide.textAlignment === "right"
            ? "items-end text-right"
            : "items-start text-left"
        }`}
      >
        <div className="max-w-3xl lg:max-w-4xl space-y-3.5 sm:space-y-4 pointer-events-auto">
          {/* BADGE (Reduced blur for sharp clarity, comfortably below logo) */}
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full border text-[#FBF8F3] text-[11px] sm:text-xs font-accent tracking-widest uppercase shadow-lg"
            style={{
              background: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              borderColor: "rgba(200,157,69,0.7)",
            }}
          >
            <MapPin className="w-3.5 h-3.5 text-[#C89D45]" />
            <span>{activeSlide.badge}</span>
          </div>

          {/* MAIN TITLE (Balanced luxury scale preventing layout collision) */}
          <h1
            ref={headingRef}
            className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.06] tracking-tight"
            style={{ perspective: "800px" }}
          >
            {activeSlide.title}
          </h1>

          {/* SUBTITLE (Readable, elegant proportion) */}
          <p
            ref={subtitleRef}
            className="font-display text-base sm:text-lg md:text-xl text-white/95 italic font-medium max-w-2xl leading-relaxed"
          >
            {activeSlide.subtitle}
          </p>

          {/* LOCATION TAG */}
          <p
            ref={locationRef}
            className="flex items-center gap-2.5 text-[11px] sm:text-xs font-accent text-white tracking-wider uppercase font-semibold"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C62828] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C62828]" />
            </span>
            <span>{activeSlide.location}</span>
          </p>

          {/* BUTTONS (Reduced blur for snappy luxury feel) */}
          <div
            ref={buttonsRef}
            className="pt-2 sm:pt-3 flex flex-wrap items-center gap-3 sm:gap-4"
          >
            <Link
              href={activeSlide.buttonLink || "/booking"}
              className="btn-luxury group relative bg-gradient-luxury-red text-white px-9 py-4 rounded-full font-accent text-xs font-bold uppercase tracking-widest flex items-center gap-2.5 border border-[#C89D45]/50 overflow-hidden shadow-xl"
              style={{ background: "linear-gradient(135deg, #C62828, #8B1E1E)" }}
            >
              <Calendar className="w-4 h-4 text-[#C89D45] relative z-10" />
              <span className="relative z-10">{activeSlide.buttonText || "Book Your Stay"}</span>
            </Link>

            <Link
              href="/experiences"
              className="btn-luxury relative text-[#1F1F1F] px-9 py-4 rounded-full font-accent text-xs font-bold uppercase tracking-widest flex items-center gap-2.5 border border-[#C89D45]/60 overflow-hidden shadow-lg"
              style={{
                background: "rgba(251,248,243,0.96)",
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
              }}
            >
              <Compass className="w-4 h-4 text-[#C62828] relative z-10" />
              <span className="relative z-10 font-bold">Explore Experiences</span>
            </Link>
          </div>
        </div>
      </div>



      {/* BOTTOM SLIDE CONTROLS (Back / Dots / Next) — High z-index with pointer-events-auto */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 right-5 sm:right-8 z-50 flex items-center gap-2.5 sm:gap-3 pointer-events-auto">
          <button
            type="button"
            onClick={prevSlide}
            className="p-2.5 sm:p-3 rounded-full text-white border border-[#C89D45]/50 transition-all hover:bg-[#C62828] hover:border-[#C62828] hover:scale-110 shadow-xl cursor-pointer flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
            aria-label="Previous Slide (Back)"
            title="Back"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {slides.map((slide, idx) => (
              <button
                type="button"
                key={slide.id}
                onClick={() => goToSlide(idx)}
                className={`rounded-full transition-all duration-500 cursor-pointer ${
                  idx === currentIndex
                    ? "w-8 sm:w-9 h-2.5 bg-[#C89D45] shadow-golden-glow"
                    : "w-2.5 h-2.5 bg-white/50 hover:bg-white/90"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={nextSlide}
            className="p-2.5 sm:p-3 rounded-full text-white border border-[#C89D45]/50 transition-all hover:bg-[#C62828] hover:border-[#C62828] hover:scale-110 shadow-xl cursor-pointer flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
            aria-label="Next Slide"
            title="Next"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      )}

      {/* SCROLL INDICATOR */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 cursor-pointer"
        onClick={() => window.scrollBy({ top: window.innerHeight * 0.85, behavior: "smooth" })}
        aria-label="Scroll down"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && window.scrollBy({ top: window.innerHeight * 0.85, behavior: "smooth" })}
      >
        <span className="text-[10px] font-accent uppercase tracking-[0.3em] text-white/50">Discover</span>
        <div className="w-7 h-11 rounded-full border border-white/30 flex items-start justify-center p-1.5">
          <div className="w-1 h-2.5 bg-[#C89D45] rounded-full animate-float-up" />
        </div>
        <ChevronDown className="w-4 h-4 text-white/40" />
      </div>

      {/* KEN BURNS CSS — Silky smooth hardware-accelerated subtle zoom */}
      <style jsx>{`
        @keyframes kenBurns {
          0% { transform: scale(1.04) translate3d(0, 0, 0); }
          100% { transform: scale(1.0) translate3d(0, 0, 0); }
        }
      `}</style>
    </section>
  );
}
