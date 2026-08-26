"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { type StoreRoom } from "@/lib/room-store";
import { formatPrice } from "@/lib/utils";
import {
  Users,
  Bed,
  Mountain,
  Coffee,
  Wifi,
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  BedDouble,
} from "lucide-react";

interface FilteredRoomShowcaseProps {
  rooms: StoreRoom[];
  checkIn?: string;
  checkOut?: string;
  activeType?: string;
}

export function FilteredRoomShowcase({
  rooms,
  checkIn,
  checkOut,
  activeType,
}: FilteredRoomShowcaseProps) {
  if (rooms.length === 0) {
    return (
      <section id="matching-rooms-section" className="py-24 bg-[#FBF8F3] text-[#1F1F1F] relative scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
          <BedDouble className="w-14 h-14 mx-auto text-[#C89D45]" />
          <h2 className="font-serif text-3xl font-bold text-[#1F1F1F]">
            No Rooms Found
          </h2>
          <p className="text-gray-600 text-sm max-w-md mx-auto">
            No available rooms match your selected location or dates. Try a
            different location or clear your filters.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="matching-rooms-section" className="py-16 bg-[#FBF8F3] text-[#1F1F1F] relative overflow-hidden scroll-mt-20">
      {/* Decorative subtle background accents */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none opacity-60"
        style={{
          background: "radial-gradient(circle, rgba(200,157,69,0.12), transparent)",
          filter: "blur(60px)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-96 h-96 rounded-full pointer-events-none opacity-60"
        style={{
          background: "radial-gradient(circle, rgba(198,40,40,0.06), transparent)",
          filter: "blur(60px)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-10">
          <p className="text-xs font-accent uppercase tracking-widest text-[#C62828] font-bold">
            {rooms.length} Room{rooms.length !== 1 ? "s" : ""} Available
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1F1F1F] mt-1">
            {activeType && activeType !== "all" ? activeType : "Your Matching Rooms"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} checkIn={checkIn} checkOut={checkOut} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Individual Room Card (Light Background) ──────────────────────────────────
function RoomCard({
  room,
  checkIn,
  checkOut,
}: {
  room: StoreRoom;
  checkIn?: string;
  checkOut?: string;
}) {
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  const images = room.images.length > 0 ? room.images : ["/images/hero/b.jpg.jpg.jpeg"];

  const nextImg = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveImgIdx((prev) => (prev + 1) % images.length);
  };
  const prevImg = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveImgIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  // Build booking URL with dates
  const bookingParams = new URLSearchParams({ roomId: room.id });
  if (checkIn) bookingParams.set("checkIn", checkIn);
  if (checkOut) bookingParams.set("checkOut", checkOut);

  const nights =
    checkIn && checkOut
      ? Math.max(
          1,
          Math.round(
            (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
              86400000
          )
        )
      : null;

  return (
    <div
      className="bg-white rounded-3xl overflow-hidden flex flex-col group border border-[#C89D45]/30 hover:border-[#C89D45] transition-all duration-300 hover:-translate-y-2 h-[600px] shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
    >
      {/* IMAGE */}
      <div className="relative h-64 w-full overflow-hidden flex-shrink-0">
        <Image
          src={images[activeImgIdx]}
          alt={room.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25" />

        {/* Price badge */}
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
        {images.length > 1 && (
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
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4 bg-white">
        <div className="space-y-2">
          <h3 className="font-serif text-xl font-bold text-[#1F1F1F] group-hover:text-[#C62828] transition-colors duration-300 leading-tight">
            {room.title}
          </h3>

          {/* Location */}
          <p className="font-accent text-xs text-[#8B1E1E] font-semibold flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-[#C62828]" />
            {room.location}
          </p>

          <p className="font-display text-sm italic text-gray-600 flex items-center gap-1.5">
            <Mountain className="w-3.5 h-3.5 shrink-0 text-[#C89D45]" />
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

        {/* Total price for nights */}
        {nights && nights > 0 && (
          <p className="text-[10px] font-accent text-gray-500 text-right">
            Est.{" "}
            <span className="font-bold text-[#C62828]">
              {formatPrice(room.pricePerNight * nights)}
            </span>{" "}
            for {nights} night{nights !== 1 ? "s" : ""}
          </p>
        )}

        {/* CTA */}
        <Link
          href={`/booking?${bookingParams.toString()}`}
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

export default FilteredRoomShowcase;

