"use client";

import React, { useState, useEffect, useRef } from "react";
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
    async function load() {
      const activeSlides = await HeroService.getActiveSlides();
      setSlides(activeSlides);
    }
    load();

    const handleUpdate = () => {
      load();
    };

    window.addEventListener("lp_hero_slides_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("lp_hero_slides_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // Auto-advance slides
  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides]);

  // GSAP slide transition animation — runs every time current index changes
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

      // Reset targets to initial hidden state
      gsap.set(targets, {
        opacity: 0,
        y: 20,
      });

      // Split heading characters using SplitType
      let splitHeading: any = null;
      if (headingRef.current) {
        const SplitType = (await import("split-type")).default;
        // Clean up previous split formatting (React will have rendered new plain text)
        splitHeading = new SplitType(headingRef.current, { types: "words,chars" });
        gsap.set(splitHeading.chars, { opacity: 0, y: 30, rotateX: -45 });
      }

      const tl = gsap.timeline();

      // 1. Badge slides up
      tl.to(badgeRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.65,
        ease: "power3.out",
      });

      // 2. Heading characters stagger in
      if (splitHeading && splitHeading.chars.length > 0) {
        gsap.set(headingRef.current, { opacity: 1, y: 0 });
        tl.to(
          splitHeading.chars,
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.55,
            ease: "back.out(1.4)",
            stagger: { amount: 0.35 },
          },
          "-=0.45"
        );
      } else {
        tl.to(
          headingRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: "power3.out",
          },
          "-=0.45"
        );
      }

      // 3. Subtitle slides up
      tl.to(
        subtitleRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: "power2.out",
        },
        "-=0.35"
      );

      // 4. Location tag
      tl.to(
        locationRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power2.out",
        },
        "-=0.4"
      );

      // 5. Buttons stagger up
      tl.to(
        buttonsRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: "power3.out",
        },
        "-=0.3"
      );
    };

    runTimeline();
  }, [currentIndex, slides]);

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

  // Parallax mouse effect on hero image
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const xRatio = (e.clientX / innerWidth - 0.5) * 2;
      const yRatio = (e.clientY / innerHeight - 0.5) * 2;

      const img = section.querySelector(".hero-bg-image") as HTMLElement;
      if (img) {
        img.style.transform = `scale(1.08) translate(${xRatio * -8}px, ${yRatio * -8}px)`;
      }
    };

    section.addEventListener("mousemove", handleMouseMove);
    return () => section.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (slides.length === 0) return (
    <section className="w-full h-screen bg-[#111111] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-2 border-[#C89D45] border-t-transparent rounded-full animate-spin" />
        <p className="font-accent text-xs uppercase tracking-widest text-[#C89D45]">Loading Paradise...</p>
      </div>
    </section>
  );

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  const activeSlide = slides[currentIndex];

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen min-h-[700px] max-h-[1000px] overflow-hidden bg-[#111111]"
    >
      {/* CANVAS MOUNTAIN FOG */}
      <MountainFog />

      {/* BACKGROUND IMAGE — KEY: changes on slide switch */}
      <div
        key={activeSlide.id}
        className="absolute inset-0 w-full h-full"
        style={{
          animation: "kenBurns 8s ease-out forwards",
        }}
      >
        <Image
          src={activeSlide.desktopImage}
          alt={activeSlide.title}
          fill
          priority
          className="hero-bg-image object-cover object-center transition-transform duration-300"
          style={{ transform: "scale(1.08)" }}
        />
      </div>

      {/* LAYERED OVERLAYS */}
      {/* 1. Dynamic opacity overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `rgba(0,0,0,${activeSlide.overlayOpacity ?? 0.5})`,
        }}
      />
      {/* 2. Hero gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#111111]/30 to-black/50" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />

      {/* 3. Animated radial warm light blob (center-left) */}
      <div
        ref={overlayBlobRef}
        className="absolute top-1/3 left-1/4 w-[600px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(198,40,40,0.08) 0%, transparent 70%)",
          filter: "blur(40px)",
          animation: "blob-float 16s ease-in-out infinite",
        }}
        aria-hidden="true"
      />

      <div
        className={`relative z-40 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center pt-20 pb-20 md:pb-28 ${
          activeSlide.textAlignment === "center"
            ? "items-center text-center"
            : activeSlide.textAlignment === "right"
            ? "items-end text-right"
            : "items-start text-left"
        }`}
      >
        <div className="max-w-3xl space-y-5">
          {/* BADGE */}
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[#FBF8F3] text-xs font-accent tracking-widest uppercase"
            style={{
              background: "rgba(200,157,69,0.15)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              borderColor: "rgba(200,157,69,0.5)",
            }}
          >
            <MapPin className="w-3.5 h-3.5 text-[#C89D45]" />
            <span>{activeSlide.badge}</span>
          </div>

          {/* MAIN TITLE */}
          <h1
            ref={headingRef}
            className="font-serif text-5xl sm:text-7xl lg:text-8xl font-bold text-white leading-[1.0] tracking-tight drop-shadow-2xl"
            style={{ perspective: "800px" }}
          >
            {activeSlide.title}
          </h1>

          {/* SUBTITLE */}
          <p
            ref={subtitleRef}
            className="font-display text-xl sm:text-2xl text-white italic font-light max-w-2xl"
          >
            {activeSlide.subtitle}
          </p>

          {/* LOCATION TAG */}
          <p
            ref={locationRef}
            className="flex items-center gap-2.5 text-xs font-accent text-white/65 tracking-wider uppercase font-medium"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C62828] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C62828]" />
            </span>
            <span>{activeSlide.location}</span>
          </p>

          {/* BUTTONS */}
          <div
            ref={buttonsRef}
            className="pt-4 flex flex-wrap items-center gap-4"
          >
            <Link
              href={activeSlide.buttonLink || "/booking"}
              className="btn-luxury group relative bg-gradient-luxury-red text-white px-9 py-4 rounded-full font-accent text-xs font-bold uppercase tracking-widest flex items-center gap-2.5 border border-[#C89D45]/50 overflow-hidden"
              style={{ background: "linear-gradient(135deg, #C62828, #8B1E1E)" }}
            >
              <Calendar className="w-4 h-4 text-[#C89D45] relative z-10" />
              <span className="relative z-10">{activeSlide.buttonText || "Book Your Stay"}</span>
            </Link>

            <Link
              href="/experiences"
              className="btn-luxury relative text-[#1F1F1F] px-9 py-4 rounded-full font-accent text-xs font-bold uppercase tracking-widest flex items-center gap-2.5 border border-[#C89D45]/60 overflow-hidden"
              style={{
                background: "rgba(251,248,243,0.88)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
              }}
            >
              <Compass className="w-4 h-4 text-[#C62828] relative z-10" />
              <span className="relative z-10">Explore Experiences</span>
            </Link>
          </div>
        </div>
      </div>

      {/* SLIDE CONTROLS */}
      <div className="absolute bottom-10 right-8 z-30 hidden md:flex items-center gap-3">
        <button
          onClick={prevSlide}
          className="p-3 rounded-full text-white border border-[#C89D45]/40 transition-all hover:bg-[#C62828] hover:border-[#C62828] hover:scale-110"
          style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(12px)" }}
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          {slides.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setCurrentIndex(idx)}
              className={`rounded-full transition-all duration-500 ${
                idx === currentIndex
                  ? "w-9 h-2.5 bg-[#C89D45] shadow-golden-glow"
                  : "w-2.5 h-2.5 bg-white/35 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="p-3 rounded-full text-white border border-[#C89D45]/40 transition-all hover:bg-[#C62828] hover:border-[#C62828] hover:scale-110"
          style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(12px)" }}
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

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

      {/* KEN BURNS CSS */}
      <style jsx>{`
        @keyframes kenBurns {
          0% { transform: scale(1.12); opacity: 0.7; }
          100% { transform: scale(1.04); opacity: 1; }
        }
      `}</style>
    </section>
  );
}
