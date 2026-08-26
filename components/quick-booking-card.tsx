"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Calendar as CalendarIcon, Users, MapPin, Building2, Search, ArrowRight } from "lucide-react";
import { useRoomStore } from "@/lib/room-store";

export default function QuickBookingCard() {
  const router = useRouter();
  const { properties } = useRoomStore();

  const today = new Date().toISOString().split("T")[0];
  const defaultCheckOut = new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0];

  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(defaultCheckOut);
  const [guests, setGuests] = useState("2 Guests");
  const [propertyId, setPropertyId] = useState("all");
  const cardRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 1024);
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      checkIn,
      checkOut,
      guests,
    });
    if (propertyId !== "all") {
      params.set("propertyId", propertyId);
    }
    router.push(`/booking?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 relative z-20">
      <div
        ref={cardRef}
        className="rounded-[28px] p-5 md:p-7 border"
        style={{
          background: isMobile ? "rgba(22, 22, 26, 0.85)" : "rgba(30, 30, 35, 0.13)",
          backdropFilter: isMobile ? "none" : "blur(12px) saturate(180%)",
          WebkitBackdropFilter: isMobile ? "none" : "blur(12px) saturate(180%)",
          boxShadow: "0 30px 80px -15px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.12)",
          borderColor: "rgba(255,255,255,0.12)",
          animation: "breathing-glow 6s ease-in-out infinite",
        }}
      >
        {/* Header label */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="font-accent text-[11px] uppercase tracking-widest text-[#C89D45] font-bold">
              Check Availability
            </p>
            <h3 className="font-serif text-lg font-bold text-white">
              Reserve Your Mountain Stay
            </h3>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-accent text-gray-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Rooms Available</span>
          </div>
        </div>

        <form
          onSubmit={handleSearch}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end"
        >
          {/* CHECK-IN */}
          <div className="flex flex-col gap-1.5 group">
            <label
              className="text-[11px] font-accent uppercase tracking-wider text-[#C89D45] font-bold flex items-center gap-1.5"
              htmlFor="booking-checkin"
            >
              <CalendarIcon className="w-3.5 h-3.5 text-[#C89D45]" />
              <span>Check In</span>
            </label>
            <div className="relative">
              <input
                id="booking-checkin"
                type="date"
                value={checkIn}
                min={today}
                onChange={(e) => setCheckIn(e.target.value)}
                className="luxury-input-dark"
              />
              <span className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#C62828] to-[#C89D45] rounded-full w-0 group-focus-within:w-full transition-all duration-400" />
            </div>
          </div>

          {/* CHECK-OUT */}
          <div className="flex flex-col gap-1.5 group">
            <label
              className="text-[11px] font-accent uppercase tracking-wider text-[#C89D45] font-bold flex items-center gap-1.5"
              htmlFor="booking-checkout"
            >
              <CalendarIcon className="w-3.5 h-3.5 text-[#C89D45]" />
              <span>Check Out</span>
            </label>
            <div className="relative">
              <input
                id="booking-checkout"
                type="date"
                value={checkOut}
                min={checkIn || today}
                onChange={(e) => setCheckOut(e.target.value)}
                className="luxury-input-dark"
              />
              <span className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#C62828] to-[#C89D45] rounded-full w-0 group-focus-within:w-full transition-all duration-400" />
            </div>
          </div>

          {/* GUESTS */}
          <div className="flex flex-col gap-1.5 group">
            <label
              className="text-[11px] font-accent uppercase tracking-wider text-[#C89D45] font-bold flex items-center gap-1.5"
              htmlFor="booking-guests"
            >
              <Users className="w-3.5 h-3.5 text-[#C89D45]" />
              <span>Guests</span>
            </label>
            <div className="relative">
              <select
                id="booking-guests"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="luxury-input-dark"
              >
                <option value="1 Guest">1 Guest</option>
                <option value="2 Guests">2 Guests (Couple)</option>
                <option value="3 Guests">3 Guests</option>
                <option value="4 Guests">4 Guests (Family)</option>
                <option value="5+ Group">5+ Guests (Group)</option>
              </select>
              <span className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#C62828] to-[#C89D45] rounded-full w-0 group-focus-within:w-full transition-all duration-400" />
            </div>
          </div>

          {/* PROPERTY LOCATION */}
          <div className="flex flex-col gap-1.5 group">
            <label
              className="text-[11px] font-accent uppercase tracking-wider text-[#C89D45] font-bold flex items-center gap-1.5"
              htmlFor="booking-location"
            >
              <MapPin className="w-3.5 h-3.5 text-[#C89D45]" />
              <span>Property Location</span>
            </label>
            <div className="relative">
              <select
                id="booking-location"
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
                className="luxury-input-dark"
              >
                <option value="all">All Properties</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.location}
                  </option>
                ))}
              </select>
              <span className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#C62828] to-[#C89D45] rounded-full w-0 group-focus-within:w-full transition-all duration-400" />
            </div>
          </div>

          {/* SEARCH BUTTON */}
          <button
            type="submit"
            id="booking-search-btn"
            className="btn-luxury w-full text-white py-3.5 px-4 rounded-2xl font-accent text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 border border-[#C89D45]/40 overflow-hidden"
            style={{ background: "linear-gradient(135deg, #C62828, #8B1E1E)" }}
          >
            <Search className="w-4 h-4 text-[#C89D45] relative z-10 flex-shrink-0" />
            <span className="relative z-10">Check Dates</span>
            <ArrowRight className="w-4 h-4 relative z-10 flex-shrink-0" />
          </button>
        </form>
      </div>
    </div>
  );
}
