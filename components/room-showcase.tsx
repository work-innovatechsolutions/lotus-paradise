"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRoomStore } from "@/lib/room-store";
import { formatPrice } from "@/lib/utils";
import { Users, Bed, Mountain, Coffee, Wifi, ChevronLeft, ChevronRight, Calendar, ArrowRight, MapPin } from "lucide-react";
import SectionReveal from "./section-reveal";

interface RoomShowcaseProps {
  badge?: string;
  title?: string;
  description?: string;
  hideViewAllButton?: boolean;
}

export default function RoomShowcase({
  badge = "Sanctuary of Peaceful Rest",
  title = "Luxury Mountain Rooms",
  description = "Crafted with warm teak wood, private panoramic verandas, and heated blankets to wrap you in mountain comfort.",
  hideViewAllButton = false,
}: RoomShowcaseProps) {
  const { rooms } = useRoomStore();
  const featuredRooms = rooms.filter((r) => r.featured && r.available);
  const showViewAll = !hideViewAllButton;

  return (
    <section
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

          {showViewAll && (
            <Link
              href="/rooms"
              className="inline-flex items-center gap-2 text-xs font-accent uppercase tracking-widest text-[#C89D45] hover:text-white font-bold transition-colors group self-start md:self-auto"
            >
              <span>Explore All Rooms</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </SectionReveal>

        {/* ROOMS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredRooms.map((room, idx) => (
            <SectionReveal key={room.id} delay={idx * 0.1} direction="up">
              <RoomCard room={room} />
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

type AnyRoom = { id: string; title: string; type: string; pricePerNight: number; capacity: number; bedType: string; view: string; location: string; description: string; amenities: string[]; images: string[]; featured: boolean; };

function RoomCard({ room }: { room: AnyRoom }) {
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
      className="bg-white rounded-3xl overflow-hidden flex flex-col group border border-[#C89D45]/30 hover:border-[#C89D45] transition-all duration-300 hover:-translate-y-2 h-[580px] shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)]"
    >
      {/* IMAGE */}
      <div className="relative h-64 w-full overflow-hidden" style={{ position: "relative" }}>
        <Image
          src={room.images[activeImgIdx]}
          alt={room.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25" />

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
          className="absolute top-4 left-4 text-[#C89D45] px-3 py-1 rounded-full text-xs font-accent uppercase font-bold tracking-widest border border-[#C89D45]/40 shadow-sm"
          style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(12px)" }}
        >
          {room.type}
        </div>

        {/* Image nav */}
        {room.images.length > 1 && (
          <div className="absolute bottom-4 right-4 flex items-center gap-1.5 z-10">
            <button
              onClick={prevImg}
              className="p-1.5 rounded-full bg-black/55 hover:bg-[#C62828] text-white border border-[#C89D45]/40 transition-all hover:scale-110 shadow"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImg}
              className="p-1.5 rounded-full bg-black/55 hover:bg-[#C62828] text-white border border-[#C89D45]/40 transition-all hover:scale-110 shadow"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* CARD CONTENT — LIGHT THEME */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-5 bg-white">
        <div className="space-y-2.5">
          <h3 className="font-serif text-2xl font-bold text-[#1F1F1F] group-hover:text-[#C62828] transition-colors duration-300">
            {room.title}
          </h3>
          <p className="font-accent text-xs text-[#8B1E1E] font-semibold flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-[#C62828]" />
            {room.location}
          </p>
          <p className="font-display text-sm italic text-gray-600 flex items-center gap-1.5">
            <Mountain className="w-4 h-4 shrink-0 text-[#C89D45]" />
            <span>{room.view}</span>
          </p>
          <p className="font-sans text-xs text-gray-600 line-clamp-2 leading-relaxed">
            {room.description}
          </p>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-2 gap-2 text-xs font-sans text-gray-700 pt-3 border-t border-gray-100">
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
          className="btn-luxury w-full text-white py-3.5 rounded-2xl font-accent text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 border border-[#C89D45]/40 overflow-hidden shadow-md"
          style={{ background: "linear-gradient(135deg, #C62828, #8B1E1E)" }}
        >
          <Calendar className="w-4 h-4 text-[#C89D45] relative z-10" />
          <span className="relative z-10">Reserve Room</span>
        </Link>
      </div>
    </div>
  );
}
