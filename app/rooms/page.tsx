"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRoomStore } from "@/lib/room-store";
import FAQAccordion from "@/components/faq-accordion";
import { FilteredRoomShowcase } from "@/components/filtered-room-showcase";
import {
  Calendar, MapPin, Search, X, ChevronDown,
  BedDouble, Users, Heart, Star, Home, Layers, Building2,
} from "lucide-react";

// ── Room type category config ──────────────────────────────────────────────────
const ROOM_TYPE_CATEGORIES = [
  { label: "All Rooms",      value: "all",           icon: Layers    },
  { label: "Deluxe Room",    value: "Deluxe Suite",  icon: Star      },
  { label: "Family Room",    value: "Family Suite",  icon: Users     },
  { label: "Couple Room",    value: "Couple Room",   icon: Heart     },
  { label: "Standard Room",  value: "Standard Room", icon: BedDouble },
  { label: "Premium Room",   value: "Premium Suite", icon: Home      },
  { label: "Dormitory",      value: "Dormitory",     icon: Layers    },
] as const;

export default function RoomsPage() {
  const { rooms, properties } = useRoomStore();

  const today    = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const [checkIn,        setCheckIn]        = useState(today);
  const [checkOut,       setCheckOut]       = useState(tomorrow);
  const [locationFilter, setLocationFilter] = useState("all"); // holds propertyId
  const [typeFilter,     setTypeFilter]     = useState("all");

  const [activeFilters, setActiveFilters] = useState({
    checkIn:  today,
    checkOut: tomorrow,
    location: "all", // propertyId
    type:     "all",
  });

  // Handle URL query parameter ?propertyId=...
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const propId = params.get("propertyId");
      if (propId) {
        setLocationFilter(propId);
        setActiveFilters((prev) => ({ ...prev, location: propId }));
      }
    }
  }, []);

  // Room types that actually exist
  const existingTypes = useMemo(() => {
    const types = new Set(rooms.map((r) => r.type));
    return ROOM_TYPE_CATEGORIES.filter(
      (c) => c.value === "all" || types.has(c.value)
    );
  }, [rooms]);

  // Apply all filters (location = propertyId)
  const filteredRooms = useMemo(() => {
    return rooms.filter((r) => {
      if (!r.available) return false;
      if (activeFilters.location !== "all" && r.propertyId !== activeFilters.location) return false;
      if (activeFilters.type     !== "all" && r.type       !== activeFilters.type)     return false;
      return true;
    });
  }, [rooms, activeFilters]);

  const scrollToRooms = () => {
    setTimeout(() => {
      const el = document.getElementById("matching-rooms-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 60);
  };

  const handleSearch = () => {
    if (checkOut <= checkIn) {
      alert("Check-out date must be after check-in date.");
      return;
    }
    setActiveFilters({ checkIn, checkOut, location: locationFilter, type: typeFilter });
    scrollToRooms();
  };

  const handleTypeTab = (val: string) => {
    setTypeFilter(val);
    setActiveFilters((prev) => ({ ...prev, type: val }));
    scrollToRooms();
  };

  const clearFilters = () => {
    setCheckIn(today); setCheckOut(tomorrow);
    setLocationFilter("all"); setTypeFilter("all");
    setActiveFilters({ checkIn: today, checkOut: tomorrow, location: "all", type: "all" });
  };

  const hasActiveFilter =
    activeFilters.location !== "all" || activeFilters.type     !== "all" ||
    activeFilters.checkIn  !== today  || activeFilters.checkOut !== tomorrow;

  const nights = checkIn && checkOut
    ? Math.max(1, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))
    : 1;

  const activeLocationLabel =
    properties.find((p) => p.id === activeFilters.location)?.name ?? "All Properties";

  return (
    <div className="pt-28 pb-16 space-y-0">
      {/* ── PAGE HEADER ── */}
      <div className="text-center max-w-3xl mx-auto space-y-3 px-4 pb-12">
        <span className="text-xs font-accent uppercase tracking-widest text-[#C62828] font-bold">
          Accommodations &amp; Rooms
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#1F1F1F]">
          Our Properties
        </h1>
        <p className="font-display text-lg text-gray-600 italic">
          Every room at Lotus Paradise features hand-crafted teak wood
          furnishings, electric blanket warming, private balconies, and sweeping
          views of Kanchenjunga.
        </p>
      </div>

      {/* ── SEARCH / FILTER BAR — LIGHT THEME ── */}
      <div className="bg-[#F4EFE6] border-y border-[#C89D45]/20 py-10 px-4">
        <div className="max-w-5xl mx-auto space-y-6">
          <p className="text-center text-xs font-accent uppercase tracking-widest text-[#C62828] font-bold">
            Find Your Perfect Room
          </p>

          {/* Date + Property + Search Card */}
          <div className="bg-white border border-[#C89D45]/35 rounded-3xl p-4 md:p-6 shadow-[0_10px_35px_rgba(0,0,0,0.06)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Check-in */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-accent uppercase tracking-widest text-[#7A5818] font-bold flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-[#C89D45]" /> Check-In
                </label>
                <input
                  type="date" id="checkin-date" value={checkIn} min={today}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#C89D45]/30 rounded-xl px-3 py-2.5 text-xs text-[#1F1F1F] font-semibold focus:border-[#C89D45] focus:bg-white focus:outline-none transition-colors [color-scheme:light]"
                />
              </div>

              {/* Check-out */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-accent uppercase tracking-widest text-[#7A5818] font-bold flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-[#C89D45]" /> Check-Out
                </label>
                <input
                  type="date" id="checkout-date" value={checkOut} min={checkIn || today}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#C89D45]/30 rounded-xl px-3 py-2.5 text-xs text-[#1F1F1F] font-semibold focus:border-[#C89D45] focus:bg-white focus:outline-none transition-colors [color-scheme:light]"
                />
              </div>

              {/* Property Dropdown */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-accent uppercase tracking-widest text-[#7A5818] font-bold flex items-center gap-1.5">
                  <Building2 className="w-3 h-3 text-[#C89D45]" /> Property
                </label>
                <div className="relative">
                  <select
                    id="property-filter"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#C89D45]/30 rounded-xl px-3 py-2.5 text-xs text-[#1F1F1F] font-semibold focus:border-[#C89D45] focus:bg-white focus:outline-none transition-colors appearance-none pr-8 [color-scheme:light]"
                  >
                    <option value="all">All Properties</option>
                    {properties.map((prop) => (
                      <option key={prop.id} value={prop.id}>
                        {prop.name} — {prop.location}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#C89D45] pointer-events-none" />
                </div>
              </div>

              {/* Search Button */}
              <div className="flex flex-col justify-end gap-1.5">
                <span className="text-[10px] text-transparent select-none">&nbsp;</span>
                <button
                  onClick={handleSearch} id="search-rooms-btn"
                  className="w-full bg-[#C62828] hover:bg-[#8B1E1E] text-white px-4 py-2.5 rounded-xl font-accent text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg shadow-red-900/20"
                >
                  <Search className="w-3.5 h-3.5" /> Search Rooms
                </button>
              </div>
            </div>

            {/* Nights + clear */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
              <p className="text-[11px] text-gray-500 font-sans">
                <span className="text-[#C62828] font-bold">{nights} night{nights !== 1 ? "s" : ""}</span> selected
              </p>
              {hasActiveFilter && (
                <button onClick={clearFilters} className="flex items-center gap-1 text-[11px] font-accent font-semibold text-gray-500 hover:text-[#C62828] transition-colors">
                  <X className="w-3.5 h-3.5" /> Clear All Filters
                </button>
              )}
            </div>
          </div>

          {/* ── ROOM TYPE CATEGORY TABS ── */}
          <div className="space-y-3">
            <p className="text-[10px] font-accent uppercase tracking-widest text-[#7A5818] font-bold text-center">
              Browse by Room Type
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {existingTypes.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeFilters.type === cat.value;
                const count = cat.value === "all"
                  ? rooms.filter((r) => r.available).length
                  : rooms.filter((r) => r.available && r.type === cat.value).length;
                return (
                  <button
                    key={cat.value}
                    onClick={() => handleTypeTab(cat.value)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-accent text-[11px] font-bold uppercase tracking-widest transition-all duration-200 border ${
                      isActive
                        ? "bg-[#C89D45] text-[#1F1F1F] border-[#C89D45] shadow-md shadow-[#C89D45]/25 scale-105"
                        : "bg-white text-gray-700 border-gray-200 hover:border-[#C89D45] hover:text-[#C62828] hover:bg-[#FAF8F5] shadow-xs"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {cat.label}
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? "bg-[#1F1F1F]/15 text-[#1F1F1F]" : "bg-gray-100 text-gray-600"}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active filter pills */}
          {hasActiveFilter && (
            <div className="flex flex-wrap items-center gap-2 justify-center">
              {activeFilters.type !== "all" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C89D45]/15 border border-[#C89D45]/40 rounded-full text-[10px] font-accent font-bold text-[#7A5818] uppercase tracking-wider">
                  <BedDouble className="w-3 h-3 text-[#C89D45]" /> {activeFilters.type}
                </span>
              )}
              {activeFilters.location !== "all" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C89D45]/15 border border-[#C89D45]/40 rounded-full text-[10px] font-accent font-bold text-[#7A5818] uppercase tracking-wider">
                  <MapPin className="w-3 h-3 text-[#C89D45]" /> {activeLocationLabel}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C89D45]/15 border border-[#C89D45]/40 rounded-full text-[10px] font-accent font-bold text-[#7A5818] uppercase tracking-wider">
                <Calendar className="w-3 h-3 text-[#C89D45]" /> {activeFilters.checkIn} → {activeFilters.checkOut}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-300 rounded-full text-[10px] font-accent font-bold text-emerald-700 uppercase tracking-wider shadow-xs">
                {filteredRooms.length} room{filteredRooms.length !== 1 ? "s" : ""} available
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── FILTERED ROOM SHOWCASE ── */}
      <FilteredRoomShowcase
        rooms={filteredRooms}
        checkIn={activeFilters.checkIn}
        checkOut={activeFilters.checkOut}
        activeType={activeFilters.type}
      />

      <FAQAccordion />
    </div>
  );
}
