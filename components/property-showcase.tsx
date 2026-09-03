"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRoomStore, type StoreProperty } from "@/lib/room-store";
import { formatPrice } from "@/lib/utils";
import {
  MapPin,
  Building2,
  BedDouble,
  ArrowRight,
  Sparkles,
  Users,
  Compass,
  CheckCircle2,
  Navigation,
  ExternalLink,
} from "lucide-react";

export default function PropertyShowcase() {
  const { properties, rooms } = useRoomStore();

  if (!properties || properties.length === 0) return null;

  return (
    <section className="py-24 relative overflow-hidden bg-[#FBF8F3]">
      {/* Background ambient lighting */}
      <div
        className="absolute top-0 right-1/4 w-[600px] h-[600px] pointer-events-none rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(200,157,69,0.07) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-10 w-[500px] h-[500px] pointer-events-none rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(198,40,40,0.05) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C62828]/8 border border-[#C62828]/20 text-[#C62828] text-xs font-accent tracking-widest uppercase font-bold">
            <Compass className="w-3.5 h-3.5 text-[#C89D45]" />
            <span>Luxury Himalayan Destinations</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1F1F1F] leading-tight">
            Our Distinct Mountain Properties
          </h2>

          <p className="font-display text-lg text-gray-600 italic">
            Each retreat is deeply immersed in Himalayan serenity, offering panoramic peak vistas, bespoke rooms, and warm local hospitality.
          </p>

          {/* Gold separator */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#C89D45]" />
            <div className="w-2 h-2 rounded-full bg-[#C89D45]" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#C89D45]" />
          </div>
        </div>

        {/* PROPERTY CARDS GRID */}
        <div className={`grid grid-cols-1 ${properties.length === 1 ? "max-w-xl mx-auto" : properties.length === 2 ? "lg:grid-cols-2 max-w-5xl mx-auto" : "lg:grid-cols-3"} gap-8`}>
          {properties.map((prop) => (
            <div key={prop.id}>
              <PropertyCard property={prop} rooms={rooms.filter((r) => r.propertyId === prop.id)} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Single Property Card ───────────────────────────────────────────────────────
function PropertyCard({
  property,
  rooms,
}: {
  property: StoreProperty;
  rooms: ReturnType<typeof useRoomStore>["rooms"];
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [currentImgIndex, setCurrentImgIndex] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);

  // All images: Cover image + property gallery images (deduplicated)
  const allImages = React.useMemo(() => {
    const rawList = [property.coverImage, ...(property.images || [])].filter(Boolean);
    const uniqueList = Array.from(new Set(rawList));
    return uniqueList.length > 0 ? uniqueList : ["/images/hero/b.jpg.jpg.jpeg"];
  }, [property.coverImage, property.images]);

  // Auto-slide images every 3.5 seconds (pauses on hover)
  useEffect(() => {
    if (allImages.length <= 1 || isHovered) return;
    const interval = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % allImages.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [allImages.length, isHovered]);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  // Calculate starting price & types
  const prices = rooms.map((r) => r.pricePerNight).filter(Boolean);
  const minPrice = prices.length > 0 ? Math.min(...prices) : null;
  const uniqueTypes = Array.from(new Set(rooms.map((r) => r.type))).slice(0, 3);
  const totalCapacity = rooms.reduce((acc, r) => acc + (r.capacity || 2), 0);
  const totalUnits = rooms.reduce((acc, r) => acc + (r.quantity || 1), 0);
  const mapUrl = property.mapLink || `https://maps.google.com/?q=${encodeURIComponent(property.name + " " + property.location)}`;

  // 3D Card tilt effect on hover
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(1000px) rotateY(${x * 4}deg) rotateX(${-y * 3}deg) translateY(-6px)`;
    };

    const handleMouseEnter = () => setIsHovered(true);

    const handleMouseLeave = () => {
      setIsHovered(false);
      card.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0px)";
      card.style.transition = "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="group rounded-3xl overflow-hidden flex flex-col justify-between border border-[#C89D45]/30 hover:border-[#C89D45] transition-all duration-500 h-full bg-white shadow-xl hover:shadow-2xl"
      style={{
        boxShadow: "0 10px 35px -10px rgba(44, 36, 115, 0.08), 0 0 0 1px rgba(200, 157, 69, 0.15)",
        transition: "transform 0.3s ease, box-shadow 0.4s ease, border-color 0.4s ease",
      }}
    >
      {/* ── IMAGE SECTION WITH AUTO-SLIDE & CROSSFADE ── */}
      <div className="relative h-64 sm:h-72 w-full overflow-hidden shrink-0">
        {allImages.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentImgIndex ? "opacity-100 z-[1]" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <Image
              src={img}
              alt={`${property.name} photo ${idx + 1}`}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-108 ease-out"
              unoptimized={img.startsWith("data:")}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none z-[2]" />

        {/* Top Status & Price Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#C89D45]/40 text-[#F3D27A] text-[11px] font-accent font-bold tracking-wider uppercase">
            <Building2 className="w-3 h-3 text-[#C89D45]" />
            <span>Property Estate</span>
          </div>

          {minPrice && (
            <div
              className="text-white px-3.5 py-1.5 rounded-full text-xs font-accent font-bold tracking-wider border border-[#C89D45]/40 shadow-lg shrink-0"
              style={{ background: "linear-gradient(135deg, #C62828, #8B1E1E)" }}
            >
              From {formatPrice(minPrice)}{" "}
              <span className="font-normal text-[10px] opacity-80">/ night</span>
            </div>
          )}
        </div>

        {/* Multi-Image Carousel Controls & Dots */}
        {allImages.length > 1 && (
          <>
            <div className="absolute inset-y-0 left-2 right-2 flex items-center justify-between pointer-events-none z-10">
              <button
                type="button"
                onClick={prevImage}
                className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 flex items-center justify-center pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity"
                title="Previous photo"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={nextImage}
                className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 flex items-center justify-center pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity"
                title="Next photo"
              >
                ›
              </button>
            </div>

            {/* Photo count indicator */}
            <div className="absolute top-4 right-1/2 translate-x-1/2 z-10 px-2 py-0.5 rounded-full bg-black/60 text-[10px] font-mono text-[#F3D27A] border border-[#C89D45]/40 backdrop-blur-sm">
              {currentImgIndex + 1} / {allImages.length}
            </div>

            {/* Micro navigation pills */}
            <div className="absolute bottom-16 left-0 right-0 flex items-center justify-center gap-1.5 z-10 pointer-events-auto">
              {allImages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImgIndex(i);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentImgIndex
                      ? "w-5 bg-[#C89D45]"
                      : "w-1.5 bg-white/50 hover:bg-white/80"
                  }`}
                  title={`Photo ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Floating title over image bottom */}
        <div className="absolute bottom-4 left-5 right-5 space-y-1 z-10 pointer-events-none">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight group-hover:text-[#F3D27A] transition-colors duration-300">
            {property.name}
          </h3>
        </div>
      </div>

      {/* ── BODY CONTENT ── */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
        <div className="space-y-4">
          {/* Location & Interactive Map Link */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#C89D45]/10 border border-[#C89D45]/30 text-[#C62828] text-xs font-accent font-bold">
              <MapPin className="w-4 h-4 text-[#C89D45] shrink-0" />
              <span className="text-[#1F1F1F] font-semibold">{property.location}</span>
            </div>

            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2C2473]/8 hover:bg-[#2C2473] border border-[#2C2473]/25 hover:border-[#2C2473] text-[#2C2473] hover:text-white text-[11px] font-accent font-bold uppercase tracking-wider transition-all duration-300 group/map shadow-sm hover:shadow"
              title="Open location directions in Google Maps"
            >
              <Navigation className="w-3 h-3 text-[#C89D45] group-hover/map:scale-110 transition-transform" />
              <span>View on Map</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover/map:opacity-100" />
            </a>
          </div>

          {/* Description */}
          <p className="font-sans text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-3">
            {property.description || "A serene Himalayan haven offering colonial charm, breathtaking Kanchenjunga panoramas, and authentic mountain hospitality."}
          </p>

          {/* Quick Specifications */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100 text-xs text-gray-700">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F8F5EE] border border-[#C89D45]/20">
              <BedDouble className="w-4 h-4 text-[#C89D45] shrink-0" />
              <div>
                <p className="font-accent font-bold text-[#1F1F1F] text-xs">
                  {rooms.length} Room Type{rooms.length !== 1 ? "s" : ""}
                </p>
                <p className="text-[10px] text-gray-500">{totalUnits} total rooms</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F8F5EE] border border-[#C89D45]/20">
              <Users className="w-4 h-4 text-[#C89D45] shrink-0" />
              <div>
                <p className="font-accent font-bold text-[#1F1F1F] text-xs">
                  Max {totalCapacity} Guests
                </p>
                <p className="text-[10px] text-gray-500">Group / Family ready</p>
              </div>
            </div>
          </div>

          {/* Available Room Types Pill Tags */}
          {uniqueTypes.length > 0 && (
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-accent uppercase tracking-widest text-gray-400 font-bold block">
                Available Accommodations:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {uniqueTypes.map((type) => (
                  <span
                    key={type}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#C89D45]/10 border border-[#C89D45]/30 text-[10px] font-accent font-bold text-[#1F1F1F]"
                  >
                    <CheckCircle2 className="w-3 h-3 text-[#C89D45]" />
                    {type}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── ACTION BUTTONS ── */}
        <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-3">
          <Link
            href={`/rooms?propertyId=${property.id}`}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl font-accent text-xs font-bold uppercase tracking-widest text-center border-2 border-[#2C2473] text-[#2C2473] hover:bg-[#2C2473] hover:text-white transition-all flex items-center justify-center gap-2 group/btn"
          >
            <span>Explore Rooms</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C89D45] group-hover/btn:translate-x-1 transition-transform" />
          </Link>

          <Link
            href={`/booking?propertyId=${property.id}`}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl font-accent text-xs font-bold uppercase tracking-widest text-center text-white transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg shadow-red-900/20"
            style={{ background: "linear-gradient(135deg, #C62828, #8B1E1E)" }}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C89D45]" />
            <span>Book Stay</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
