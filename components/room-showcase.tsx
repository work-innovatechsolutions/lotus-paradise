"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ROOMS } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { Users, Bed, Mountain, Coffee, Wifi, ChevronLeft, ChevronRight, Calendar, ArrowRight } from "lucide-react";
import SectionReveal from "./section-reveal";

interface RoomShowcaseProps {
  badge?: string;
  title?: string;
  description?: string;
  hideViewAllButton?: boolean;
}

export default function RoomShowcase({
  badge = "Sanctuary of Peaceful Rest",
  title = "Luxury Mountain Suites",
  description = "Crafted with warm teak wood, private panoramic verandas, and heated blankets to wrap you in mountain comfort.",
  hideViewAllButton = false,
}: RoomShowcaseProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // GSAP scroll-driven horizontal scroll for room cards on larger screens
  useEffect(() => {
    let ctx: any;

    const initScroll = async () => {
      if (window.innerWidth < 1024) return; // Only on desktop
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) return;

      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const track = trackRef.current;
      const section = sectionRef.current;
      if (!track || !section) return;

      ctx = gsap.context(() => {
        const totalWidth = track.scrollWidth - track.offsetWidth;

        gsap.to(track, {
          x: -totalWidth,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${totalWidth + 400}`,
            pin: true,
            scrub: 1.2,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }, section);

      // Refresh ScrollTrigger to recalculate offsets after initial layout settles
      ScrollTrigger.refresh();
      
      // Fallback refresh for late layout changes
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 800);

      return () => clearTimeout(timer);
    };

    initScroll();

    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-[#1F1F1F] text-white relative overflow-hidden"
    >
      {/* Gradient blob decorations */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(198,40,40,0.08), transparent)", filter: "blur(60px)" }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(44,36,115,0.18), transparent)", filter: "blur(60px)" }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* HEADER */}
        <SectionReveal className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-accent uppercase tracking-widest text-[#C89D45] font-bold">
              {badge}
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white">
              {title}
            </h2>
            <p className="font-display text-lg text-gray-400 italic">
              {description}
            </p>
          </div>
          {!hideViewAllButton && (
            <Link
              href="/rooms"
              className="btn-luxury inline-flex items-center gap-2 text-[#C89D45] px-6 py-3 rounded-full font-accent text-xs uppercase font-bold tracking-widest transition-all border border-[#C89D45] hover:bg-[#C89D45] hover:text-[#1F1F1F] overflow-hidden"
            >
              <span className="relative z-10">View All Suites</span>
              <ArrowRight className="w-4 h-4 relative z-10" />
            </Link>
          )}
        </SectionReveal>

        {/* HORIZONTAL SCROLL TRACK */}
        <div
          ref={trackRef}
          className="flex gap-8 lg:will-change-transform"
          style={{ width: "max-content" }}
        >
          {ROOMS.map((room, idx) => (
            <SectionReveal key={room.id} delay={idx * 0.15} direction="right">
              <div className="w-[340px] sm:w-[380px]">
                <RoomCard room={room} />
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function RoomCard({ room }: { room: (typeof ROOMS)[0] }) {
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const nextImg = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveImgIdx((prev) => (prev + 1) % room.images.length);
  };

  const prevImg = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveImgIdx((prev) => (prev - 1 + room.images.length) % room.images.length);
  };

  // Card tilt effect
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 4}deg) translateY(-6px)`;
    };

    const handleMouseLeave = () => {
      card.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) translateY(0px)";
      card.style.transition = "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="rounded-3xl overflow-hidden flex flex-col group border border-[#C89D45]/25 hover:border-[#C89D45]/60 transition-all duration-500 h-[580px]"
      style={{
        background: "rgba(44,36,115,0.35)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        transition: "transform 0.3s ease, box-shadow 0.4s ease, border-color 0.4s ease",
        boxShadow: "0 10px 40px -10px rgba(0,0,0,0.4)",
      }}
    >
      {/* IMAGE */}
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={room.images[activeImgIdx]}
          alt={room.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/25" />

        {/* Price badge — gradient */}
        <div
          className="absolute top-4 right-4 text-white px-4 py-1.5 rounded-full text-xs font-accent font-bold tracking-wider border border-[#C89D45]/50 shadow-lg"
          style={{ background: "linear-gradient(135deg, #C62828, #8B1E1E)" }}
        >
          {formatPrice(room.pricePerNight)}{" "}
          <span className="font-normal text-[10px] opacity-80">/ Night</span>
        </div>

        {/* Type badge */}
        <div
          className="absolute top-4 left-4 text-[#C89D45] px-3 py-1 rounded-full text-xs font-accent uppercase font-bold tracking-widest border border-[#C89D45]/40"
          style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(12px)" }}
        >
          {room.type}
        </div>

        {/* Image nav */}
        {room.images.length > 1 && (
          <div className="absolute bottom-4 right-4 flex items-center gap-1.5 z-10">
            <button
              onClick={prevImg}
              className="p-1.5 rounded-full bg-black/55 hover:bg-[#C62828] text-white border border-[#C89D45]/40 transition-all hover:scale-110"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImg}
              className="p-1.5 rounded-full bg-black/55 hover:bg-[#C62828] text-white border border-[#C89D45]/40 transition-all hover:scale-110"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* CARD CONTENT */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
        <div className="space-y-2.5">
          <h3 className="font-serif text-2xl font-bold text-white group-hover:text-[#C89D45] transition-colors duration-300">
            {room.title}
          </h3>
          <p className="font-display text-sm italic text-[#C89D45] flex items-center gap-1.5">
            <Mountain className="w-4 h-4 shrink-0 text-[#C62828]" />
            <span>{room.view}</span>
          </p>
          <p className="font-sans text-xs text-gray-400 line-clamp-2 leading-relaxed">
            {room.description}
          </p>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-2 gap-2 text-xs font-sans text-gray-400 pt-3 border-t border-white/10">
          <div className="flex items-center gap-1.5">
            <Bed className="w-3.5 h-3.5 text-[#C89D45]" />
            <span>{room.bedType}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#C89D45]" />
            <span>Up to {room.capacity} Guests</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Coffee className="w-3.5 h-3.5 text-[#C89D45]" />
            <span>Breakfast Included</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-[#C89D45]" />
            <span>High-Speed WiFi</span>
          </div>
        </div>

        {/* CTA */}
        <Link
          href={`/booking?roomId=${room.id}`}
          className="btn-luxury w-full text-white py-3.5 rounded-2xl font-accent text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 border border-[#C89D45]/40 overflow-hidden"
          style={{ background: "linear-gradient(135deg, #C62828, #8B1E1E)" }}
        >
          <Calendar className="w-4 h-4 text-[#C89D45] relative z-10" />
          <span className="relative z-10">Reserve Suite</span>
        </Link>
      </div>
    </div>
  );
}
