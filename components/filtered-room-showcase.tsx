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
      className="bg-white rounded-3xl overflow-hidden flex flex-col justify-between group border border-[#C89D45]/30 hover:border-[#C89D45] transition-all duration-300 hover:-translate-y-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
    >
      {/* IMAGE */}
      <div className="relative h-52 w-full overflow-hidden flex-shrink-0" style={{ position: "relative" }}>
        <Image
          src={images[activeImgIdx]}
          alt={room.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/30" />

        {/* Price badge */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1 z-10">
          <div
            className="text-white px-2.5 py-1 rounded-full text-xs font-accent font-bold tracking-wider border border-[#C89D45]/50 shadow-lg"
            style={{ background: "linear-gradient(135deg, #C62828, #8B1E1E)" }}
          >
            ₹{room.standardPricePerPax || room.pricePerNight}{" "}
            <span className="font-normal text-[10px] opacity-85">/ pax / day</span>
          </div>
          <span className="text-[8px] font-accent uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 backdrop-blur-sm">
            Fooding &amp; Lodging
          </span>
        </div>

        {/* Type & Floor badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          <div
            className="text-[#C89D45] px-2.5 py-0.5 rounded-full text-[11px] font-accent uppercase font-bold tracking-wider border border-[#C89D45]/40 shadow-sm"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)" }}
          >
            {room.type}
          </div>
          {room.floor && (
            <span className="text-[9px] font-accent uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-black/70 text-[#F3D27A] border border-[#C89D45]/40 backdrop-blur-sm w-fit">
              {room.floor}
            </span>
          )}
        </div>

        {/* Image nav */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 z-10">
            <button
              onClick={prevImg}
              className="p-1 rounded-full bg-black/55 hover:bg-[#C62828] text-white border border-[#C89D45]/40 transition-all hover:scale-110 shadow"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={nextImg}
              className="p-1 rounded-full bg-black/55 hover:bg-[#C62828] text-white border border-[#C89D45]/40 transition-all hover:scale-110 shadow"
              aria-label="Next image"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* CARD CONTENT — COMPACT & CLEAN */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3 bg-white">
        <div className="space-y-1">
          <h3 className="font-serif text-lg font-bold text-[#1F1F1F] group-hover:text-[#C62828] transition-colors duration-300 leading-snug">
            {room.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-[#8B1E1E] font-accent font-semibold">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-[#C62828]" />
            <span>{room.location}</span>
          </div>

          {/* View */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-display italic">
            <Mountain className="w-3.5 h-3.5 shrink-0 text-[#C89D45]" />
            <span className="truncate">{room.view}</span>
          </div>
        </div>

        {/* PACKAGE TARIFFS BREAKDOWN BOX */}
        <div className="bg-[#FAF7F0] border border-[#C89D45]/30 rounded-xl p-2.5 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-accent uppercase tracking-wider text-gray-500 font-bold border-b border-gray-200/70 pb-1">
            <span>Tariff (Fooding &amp; Lodging)</span>
            <span className="text-emerald-700 font-bold">All 4 Meals</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-lg bg-white border border-[#C89D45]/20 shadow-xs">
              <span className="text-[9px] font-accent uppercase text-gray-500 font-bold block">
                Standard
              </span>
              <p className="font-bold text-[#1F1F1F] mt-0.5 text-sm">
                ₹{room.standardPricePerPax || room.pricePerNight}{" "}
                <span className="text-[9px] text-gray-500 font-normal">/ pax</span>
              </p>
            </div>
            <div className="p-2 rounded-lg bg-white border border-[#C62828]/20 shadow-xs">
              <span className="text-[9px] font-accent uppercase text-[#C62828] font-bold block">
                Premium
              </span>
              <p className="font-bold text-[#C62828] mt-0.5 text-sm">
                ₹{room.premiumPricePerPax || (room.pricePerNight + 550)}{" "}
                <span className="text-[9px] text-gray-500 font-normal">/ pax</span>
              </p>
            </div>
          </div>
        </div>

        {/* Specs: Bed & Capacity */}
        <div className="grid grid-cols-2 gap-2 text-xs font-sans text-gray-700 pt-1.5 border-t border-gray-100">
          <div className="flex items-center gap-1.5 truncate">
            <Bed className="w-3.5 h-3.5 text-[#C89D45] shrink-0" />
            <span className="truncate">{room.bedType}</span>
          </div>
          <div className="flex items-center gap-1.5 justify-end">
            <Users className="w-3.5 h-3.5 text-[#C89D45] shrink-0" />
            <span className="font-bold text-[#1F1F1F]">
              {room.minCapacity ? `${room.minCapacity} – ${room.capacity} Pax` : `Up to ${room.capacity} Pax`}
            </span>
          </div>
        </div>

        {/* CTA - ALWAYS VISIBLE */}
        <Link
          href={`/booking?${bookingParams.toString()}`}
          className="btn-luxury w-full text-white py-3 rounded-xl font-accent text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 border border-[#C89D45]/40 overflow-hidden shadow-md hover:shadow-lg transition-all"
          style={{ background: "linear-gradient(135deg, #C62828, #8B1E1E)" }}
        >
          <Calendar className="w-3.5 h-3.5 text-[#C89D45] relative z-10" />
          <span className="relative z-10">Reserve This Package</span>
        </Link>
      </div>
    </div>
  );
}

export default FilteredRoomShowcase;

