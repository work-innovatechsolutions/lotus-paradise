"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { GALLERY_ITEMS } from "@/lib/data";
import { Maximize2, X, ChevronLeft, ChevronRight, Camera } from "lucide-react";
import SectionReveal from "./section-reveal";

export default function GalleryMasonry() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const categories = ["All", "Nature", "Rooms", "Food", "Events", "Birding", "Sunrise"];

  const filteredItems =
    activeCategory === "All"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === activeCategory);

  const openLightbox = (idx: number) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);
  const nextLightbox = useCallback(() => {
    if (lightboxIndex !== null)
      setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
  }, [lightboxIndex, filteredItems.length]);
  const prevLightbox = useCallback(() => {
    if (lightboxIndex !== null)
      setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
  }, [lightboxIndex, filteredItems.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "ArrowRight") nextLightbox();
      if (e.key === "ArrowLeft") prevLightbox();
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, nextLightbox, prevLightbox]);

  // GSAP stagger animation for gallery items
  useEffect(() => {
    const initAnimations = async () => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) return;

      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const items = gridRef.current?.querySelectorAll(".gallery-item");
      if (!items || items.length === 0) return;

      gsap.fromTo(
        items,
        { scale: 0.85, opacity: 0, clipPath: "inset(20% 20% 20% 20% round 16px)" },
        {
          scale: 1,
          opacity: 1,
          clipPath: "inset(0% 0% 0% 0% round 16px)",
          duration: 0.9,
          stagger: { amount: 1.2, from: "start" },
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );
    };

    initAnimations();
  }, [activeCategory]);

  return (
    <section className="py-24 bg-[#111111] text-white relative">
      {/* Subtle gradient top */}
      <div
        className="absolute top-0 inset-x-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(180deg, rgba(17,17,17,0) 0%, #111111 100%)" }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <SectionReveal className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-accent uppercase tracking-widest text-[#C62828] font-bold flex items-center justify-center gap-1.5">
            <Camera className="w-4 h-4 text-[#C89D45]" />
            <span>Visual Memories Of Lotus Paradise</span>
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white">
            Gallery & Moments
          </h2>
          <p className="font-display text-lg text-gray-400 italic">
            Immerse yourself in authentic captures of golden Himalayan sunrises, cozy suites, rare hornbills, and homestay gatherings.
          </p>
        </SectionReveal>

        {/* CATEGORY FILTERS */}
        <SectionReveal className="flex flex-wrap justify-center gap-2 mb-12" delay={0.1}>
          {categories.map((cat) => {
            const isActive = cat === activeCategory;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full font-accent text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
                  isActive
                    ? "text-white border-[#C89D45] shadow-golden-glow scale-105"
                    : "text-gray-300 border-white/15 hover:border-[#C89D45]/50 hover:text-[#C89D45]"
                }`}
                style={isActive ? { background: "linear-gradient(135deg, #C62828, #8B1E1E)" } : { background: "rgba(255,255,255,0.05)" }}
              >
                {cat}
              </button>
            );
          })}
        </SectionReveal>

        {/* MASONRY GRID */}
        <div
          ref={gridRef}
          className="columns-1 sm:columns-2 lg:columns-3 gap-5"
          style={{ columnGap: "20px" }}
        >
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => openLightbox(idx)}
              className="gallery-item relative group rounded-2xl overflow-hidden cursor-pointer border border-white/8 hover:border-[#C89D45]/50 transition-all duration-500 mb-5 break-inside-avoid"
              style={{ boxShadow: "0 8px 30px -8px rgba(0,0,0,0.5)" }}
              role="button"
              tabIndex={0}
              aria-label={`View ${item.title}`}
              onKeyDown={(e) => e.key === "Enter" && openLightbox(idx)}
            >
              <div className="relative w-full h-auto overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  width={600}
                  height={450}
                  className="w-full h-auto object-cover group-hover:scale-108 transition-transform duration-700"
                  style={{ transition: "transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}
                />
              </div>

              {/* HOVER OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col justify-end p-5 text-white">
                <span className="text-[10px] font-accent uppercase tracking-widest text-[#C89D45] font-bold translate-y-3 group-hover:translate-y-0 transition-transform duration-400">
                  {item.category}
                </span>
                <h4 className="font-serif text-xl font-bold text-white mt-1 translate-y-3 group-hover:translate-y-0 transition-transform duration-400 delay-75">
                  {item.title}
                </h4>
                <div className="mt-1.5 flex items-center gap-1 text-xs font-sans text-gray-300 translate-y-3 group-hover:translate-y-0 transition-transform duration-400 delay-100">
                  <Maximize2 className="w-3.5 h-3.5 text-[#C89D45]" />
                  <span>View Full Size</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LIGHTBOX */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.93)", backdropFilter: "blur(20px)" }}
          role="dialog"
          aria-modal="true"
          aria-label={`Gallery image: ${filteredItems[lightboxIndex]?.title}`}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-[#C62828] text-white border border-white/20 transition-all hover:scale-110 z-50"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={prevLightbox}
            className="absolute left-4 sm:left-8 p-3 rounded-full bg-white/10 hover:bg-[#C62828] text-white border border-white/20 transition-all hover:scale-110 z-50"
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="relative max-w-5xl w-full flex flex-col items-center">
            <div className="relative w-full h-[70vh] rounded-2xl overflow-hidden border border-[#C89D45]/35 shadow-cinematic">
              <Image
                src={filteredItems[lightboxIndex].imageUrl}
                alt={filteredItems[lightboxIndex].title}
                fill
                className="object-contain"
              />
            </div>
            <div className="mt-5 text-center">
              <span className="text-xs font-accent uppercase tracking-widest text-[#C89D45] font-bold">
                {filteredItems[lightboxIndex].category}
              </span>
              <h3 className="font-serif text-2xl font-bold text-white mt-1">
                {filteredItems[lightboxIndex].title}
              </h3>
              <p className="text-xs font-sans text-gray-400 mt-1">
                {lightboxIndex + 1} / {filteredItems.length}
              </p>
            </div>
          </div>

          <button
            onClick={nextLightbox}
            className="absolute right-4 sm:right-8 p-3 rounded-full bg-white/10 hover:bg-[#C62828] text-white border border-white/20 transition-all hover:scale-110 z-50"
            aria-label="Next Image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </section>
  );
}
