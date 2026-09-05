"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useRoomStore } from "@/lib/room-store";
import { formatPrice, generateBookingNumber } from "@/lib/utils";
import { BookingService } from "@/services/booking.service";
import { AvailabilityService } from "@/services/availability.service";
import FAQAccordion from "@/components/faq-accordion";
import {
  Calendar,
  Users,
  Check,
  Printer,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  MapPin,
  Building2,
  Bed,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Mountain,
} from "lucide-react";

export function ReservationEngine() {
  const searchParams = useSearchParams();
  const { properties, rooms } = useRoomStore();

  const urlPropId = searchParams.get("propertyId");
  const urlRoomId = searchParams.get("roomId");
  const initialCheckIn = searchParams.get("checkIn") || new Date().toISOString().split("T")[0];
  const initialCheckOut =
    searchParams.get("checkOut") || new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0];

  const [step, setStep] = useState(1);
  const [selectedPropId, setSelectedPropId] = useState<string>(urlPropId || "all");
  const [selectedRoomId, setSelectedRoomId] = useState<string>(urlRoomId || "");
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [guestsCount, setGuestsCount] = useState(2);
  const [availabilityError, setAvailabilityError] = useState("");
  const [activeImgIndexes, setActiveImgIndexes] = useState<{ [key: string]: number }>({});
  const [addons, setAddons] = useState<{ [key: string]: boolean }>({
    birding: true,
    bonfire: false,
    pickup: false,
  });

  const [guestDetails, setGuestDetails] = useState({
    name: "",
    email: "",
    phone: "",
    specialRequests: "",
  });

  const [bookingConfirmed, setBookingConfirmed] = useState<any | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<"standard" | "premium">("standard");

  // Sync with searchParams when loaded
  useEffect(() => {
    if (urlPropId) setSelectedPropId(urlPropId);
    if (urlRoomId) setSelectedRoomId(urlRoomId);
  }, [urlPropId, urlRoomId]);

  // Scroll to top on step progression
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [step]);

  // Filtered rooms based on selected location/property
  const availableRooms = useMemo(() => {
    if (selectedPropId === "all") {
      return rooms.filter((r) => r.available);
    }
    return rooms.filter((r) => r.available && r.propertyId === selectedPropId);
  }, [rooms, selectedPropId]);

  // Set default selected room if not set or invalid
  useEffect(() => {
    if (availableRooms.length > 0) {
      if (!selectedRoomId || !availableRooms.some((r) => r.id === selectedRoomId)) {
        setSelectedRoomId(availableRooms[0].id);
      }
    }
  }, [availableRooms, selectedRoomId]);

  const selectedRoom = useMemo(() => {
    return rooms.find((r) => r.id === selectedRoomId) || availableRooms[0] || rooms[0];
  }, [rooms, selectedRoomId, availableRooms]);

  const selectedProperty = useMemo(() => {
    if (!selectedRoom) return properties[0] || null;
    return properties.find((p) => p.id === selectedRoom.propertyId) || properties[0] || null;
  }, [properties, selectedRoom]);

  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  const nights = Math.max(1, Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 3600 * 24)));

  const standardRate = selectedRoom?.standardPricePerPax || selectedRoom?.pricePerNight || 1550;
  const premiumRate = selectedRoom?.premiumPricePerPax || 2100;
  const pricePerPaxPerDay = selectedPackage === "premium" ? premiumRate : standardRate;
  const roomTotal = pricePerPaxPerDay * Number(guestsCount || 1) * nights;

  const birdingAddonPrice = addons.birding ? 1200 : 0;
  const bonfireAddonPrice = addons.bonfire ? 800 : 0;
  const pickupAddonPrice = addons.pickup ? 2800 : 0;
  const grandTotal = roomTotal + birdingAddonPrice + bonfireAddonPrice + pickupAddonPrice;

  const handleValidateDates = async () => {
    setAvailabilityError("");
    if (checkOut <= checkIn) {
      setAvailabilityError("Check-out date must be after check-in date.");
      return;
    }
    if (selectedRoom) {
      const available = await AvailabilityService.isRoomAvailable(selectedRoom.id, checkIn, checkOut);
      if (!available) {
        setAvailabilityError("Selected room is not available for these dates. Please choose different dates.");
        return;
      }
    }
    setStep(3);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const bookingNo = generateBookingNumber();

    const bookingPayload = {
      bookingNumber: bookingNo,
      guestName: guestDetails.name,
      email: guestDetails.email,
      phone: guestDetails.phone,
      roomId: selectedRoom?.id || "room-1",
      roomTitle: `${selectedRoom?.title || "Mountain Room"} [${selectedPackage === "premium" ? "PREMIUM PACKAGE" : "STANDARD PACKAGE"} - Fooding & Lodging]${selectedProperty ? ` (${selectedProperty.name})` : ""}`,
      pricePerNight: pricePerPaxPerDay,
      discount: 0,
      tax: 0,
      totalAmount: grandTotal,
      checkIn,
      checkOut,
      nights,
      guestsCount,
      specialRequests: guestDetails.specialRequests,
      status: "CONFIRMED" as const,
    };

    try {
      const created = await BookingService.createBooking(bookingPayload);
      setBookingConfirmed(created);
    } catch {
      setBookingConfirmed(bookingPayload);

      fetch("/api/send-booking-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking: bookingPayload }),
      }).catch((err) => console.warn("Email dispatch error:", err));
    }

    setStep(5);
  };

  const cycleImage = (roomId: string, imagesCount: number, dir: 1 | -1, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImgIndexes((prev) => {
      const current = prev[roomId] || 0;
      const next = (current + dir + imagesCount) % imagesCount;
      return { ...prev, [roomId]: next };
    });
  };

  return (
    <div className="space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* ── HEADER ── */}
        <div className="text-center max-w-3xl mx-auto space-y-3 pt-6">
          <span className="text-xs font-accent uppercase tracking-widest text-[#C62828] font-bold">
            Direct Reservation Engine
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1F1F1F]">
            Reserve Your Stay at The Cometas Homestay
          </h1>
          <p className="font-display text-base text-gray-600 italic">
            Select your stay dates, destination, and package to begin your Himalayan retreat.
          </p>
        </div>

        {/* ── STEP INDICATOR ── */}
        <div className="flex items-center justify-center max-w-3xl mx-auto">
          {[
            { num: 1, label: "Dates, Location & Room" },
            { num: 2, label: "Package & Tariff" },
            { num: 3, label: "Add-on Experiences" },
            { num: 4, label: "Guest Details" },
            { num: 5, label: "Confirmation" },
          ].map((s, i, arr) => (
            <React.Fragment key={s.num}>
              <div className="flex flex-col items-center gap-1.5">
                <button
                  type="button"
                  disabled={s.num > step}
                  onClick={() => s.num < step && setStep(s.num)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-accent text-xs font-bold transition-all ${
                    step === s.num
                      ? "bg-[#C62828] text-white ring-4 ring-[#C89D45]/30 shadow-md"
                      : step > s.num
                      ? "bg-[#2C2473] text-white cursor-pointer hover:bg-[#1F1F1F]"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                </button>
                <span className="text-[10px] font-accent uppercase font-bold tracking-wider hidden sm:block text-gray-600">
                  {s.label}
                </span>
              </div>
              {i < arr.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-2 ${
                    step > s.num ? "bg-[#2C2473]" : "bg-gray-200"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            STEP 1: CHECK-IN / CHECK-OUT CONTAINER + DESTINATION + ROOMS
        ══════════════════════════════════════════════════════════════════════ */}
        {step === 1 && (
          <div className="space-y-10 animate-in fade-in duration-300">
            {/* 1. CHECKIN / CHECKOUT CONTAINER */}
            <div className="glass-ivory bg-[#FBF8F3] rounded-3xl p-6 md:p-8 border border-[#C89D45]/40 shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#C89D45]/20 pb-4">
                <div>
                  <span className="text-[10px] font-accent uppercase tracking-widest text-[#C62828] font-bold block">
                    Step 1A — Choose Stay Dates &amp; Guests
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F1F1F]">
                    Select Stay Dates &amp; Party Size
                  </h2>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2C2473]/10 text-[#2C2473] text-xs font-accent font-bold">
                  <Calendar className="w-3.5 h-3.5 text-[#C89D45]" />
                  <span>{nights} Night{nights !== 1 ? "s" : ""} Selected</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                {/* Check-In */}
                <div className="space-y-1.5">
                  <label className="text-xs font-accent uppercase text-[#7A5818] font-bold flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#C89D45]" /> Check-In Date
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-white border border-[#C89D45]/40 rounded-xl px-4 py-3 text-sm font-sans font-semibold text-[#1F1F1F] shadow-xs focus:border-[#C89D45] focus:outline-none [color-scheme:light]"
                  />
                </div>

                {/* Check-Out */}
                <div className="space-y-1.5">
                  <label className="text-xs font-accent uppercase text-[#7A5818] font-bold flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#C89D45]" /> Check-Out Date
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-white border border-[#C89D45]/40 rounded-xl px-4 py-3 text-sm font-sans font-semibold text-[#1F1F1F] shadow-xs focus:border-[#C89D45] focus:outline-none [color-scheme:light]"
                  />
                </div>

                {/* Guests */}
                <div className="space-y-1.5">
                  <label className="text-xs font-accent uppercase text-[#7A5818] font-bold flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#C89D45]" /> Number of Guests
                  </label>
                  <select
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(Number(e.target.value))}
                    className="w-full bg-white border border-[#C89D45]/40 rounded-xl px-4 py-3 text-sm font-sans font-semibold text-[#1F1F1F] shadow-xs focus:border-[#C89D45] focus:outline-none"
                  >
                    <option value={1}>1 Guest</option>
                    <option value={2}>2 Guests (Couple)</option>
                    <option value={3}>3 Guests</option>
                    <option value={4}>4 Guests (Family)</option>
                    <option value={5}>5 Guests</option>
                    <option value={6}>6 Guests</option>
                    <option value={7}>7 Guests</option>
                    <option value={8}>8+ Guests (Group)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 2. DESTINATION SELECTION */}
            <div className="glass-ivory bg-[#FBF8F3] rounded-3xl p-6 md:p-8 border border-[#C89D45]/40 shadow-xl space-y-6">
              <div className="text-center space-y-1.5">
                <span className="text-[10px] font-accent uppercase tracking-widest text-[#C62828] font-bold">
                  Step 1B — Choose Destination
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F1F1F]">
                  Select Your Homestay Location
                </h2>
                <p className="text-xs text-gray-600">
                  Pick a property location to view and reserve its available mountain rooms
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPropId("all")}
                  className={`p-4 rounded-2xl border text-left transition-all duration-300 flex items-center justify-between gap-3 ${
                    selectedPropId === "all"
                      ? "bg-[#C89D45] text-[#1F1F1F] border-[#C89D45] shadow-lg shadow-[#C89D45]/20 scale-[1.02]"
                      : "bg-white border-gray-200/80 hover:border-[#C89D45] text-[#1F1F1F] shadow-sm hover:shadow"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2.5 rounded-xl ${
                        selectedPropId === "all" ? "bg-[#1F1F1F]/15 text-[#1F1F1F]" : "bg-[#2C2473]/10 text-[#2C2473]"
                      }`}
                    >
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-base leading-tight">All Properties</h3>
                      <p className={`text-[11px] font-accent ${selectedPropId === "all" ? "text-[#1F1F1F]/80" : "text-gray-500"}`}>
                        View all destinations ({rooms.length} rooms)
                      </p>
                    </div>
                  </div>
                  {selectedPropId === "all" && <Check className="w-5 h-5 shrink-0" />}
                </button>

                {properties.map((prop) => {
                  const isSelected = selectedPropId === prop.id;
                  const propRooms = rooms.filter((r) => r.propertyId === prop.id);
                  return (
                    <button
                      key={prop.id}
                      type="button"
                      onClick={() => setSelectedPropId(prop.id)}
                      className={`p-4 rounded-2xl border text-left transition-all duration-300 flex items-center justify-between gap-3 ${
                        isSelected
                          ? "bg-[#C89D45] text-[#1F1F1F] border-[#C89D45] shadow-lg shadow-[#C89D45]/20 scale-[1.02]"
                          : "bg-white border-gray-200/80 hover:border-[#C89D45] text-[#1F1F1F] shadow-sm hover:shadow"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`p-2.5 rounded-xl shrink-0 ${
                            isSelected ? "bg-[#1F1F1F]/15 text-[#1F1F1F]" : "bg-[#C62828]/10 text-[#C62828]"
                          }`}
                        >
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-serif font-bold text-base leading-tight truncate">
                            {prop.name}
                          </h3>
                          <p className={`text-[11px] font-accent truncate ${isSelected ? "text-[#1F1F1F]/80" : "text-gray-500"}`}>
                            {prop.location} · {propRooms.length} room types
                          </p>
                        </div>
                      </div>
                      {isSelected && <Check className="w-5 h-5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. SELECT ROOM (COMPACT CARDS, BUTTON FULLY VISIBLE) */}
            <div className="space-y-6">
              <div className="text-center space-y-1">
                <span className="text-xs font-accent uppercase tracking-widest text-[#C62828] font-bold">
                  Step 1C — Available Mountain Rooms
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F1F1F]">
                  Available Rooms ({availableRooms.length})
                </h3>
              </div>

              {availableRooms.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 space-y-3">
                  <Building2 className="w-12 h-12 mx-auto text-gray-300" />
                  <h4 className="font-serif text-xl font-bold text-gray-700">No Rooms Found</h4>
                  <p className="text-xs text-gray-500">Please select &quot;All Properties&quot; above to view available rooms.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableRooms.map((room) => {
                    const isSelected = room.id === selectedRoomId;
                    const roomProp = properties.find((p) => p.id === room.propertyId);
                    const images = room.images?.length > 0 ? room.images : ["/images/hero/b.jpg.jpg.jpeg"];
                    const activeIdx = activeImgIndexes[room.id] || 0;

                    return (
                      <div
                        key={room.id}
                        onClick={() => setSelectedRoomId(room.id)}
                        className={`bg-white rounded-3xl overflow-hidden flex flex-col justify-between group border transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] cursor-pointer ${
                          isSelected
                            ? "border-[#C62828] ring-2 ring-[#C62828]/40 scale-[1.01]"
                            : "border-[#C89D45]/30 hover:border-[#C89D45]"
                        }`}
                      >
                        {/* Image */}
                        <div className="relative h-52 w-full overflow-hidden flex-shrink-0" style={{ position: "relative" }}>
                          <Image
                            src={images[activeIdx]}
                            alt={room.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            unoptimized={images[activeIdx]?.startsWith("data:")}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/30 pointer-events-none" />

                          {/* Price badge */}
                          <div className="absolute top-3 right-3 flex flex-col items-end gap-1 z-10">
                            <span
                              className="text-white px-2.5 py-1 rounded-full text-xs font-accent font-bold tracking-wider border border-[#C89D45]/50 shadow-lg"
                              style={{ background: "linear-gradient(135deg, #C62828, #8B1E1E)" }}
                            >
                              ₹{room.standardPricePerPax || room.pricePerNight}{" "}
                              <span className="font-normal text-[10px] opacity-85">/ pax</span>
                            </span>
                            <span className="text-[8px] font-accent uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 backdrop-blur-sm">
                              Fooding &amp; Lodging
                            </span>
                          </div>

                          {/* Type & Floor */}
                          <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                            <span
                              className="text-[#C89D45] px-2.5 py-0.5 rounded-full text-[11px] font-accent uppercase font-bold tracking-wider border border-[#C89D45]/40 shadow-sm"
                              style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)" }}
                            >
                              {room.type}
                            </span>
                            {room.floor && (
                              <span className="text-[9px] font-accent uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-black/70 text-[#F3D27A] border border-[#C89D45]/40 backdrop-blur-sm w-fit">
                                {room.floor}
                              </span>
                            )}
                          </div>

                          {/* Image controls */}
                          {images.length > 1 && (
                            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 z-10">
                              <button
                                type="button"
                                onClick={(e) => cycleImage(room.id, images.length, -1, e)}
                                className="p-1 rounded-full bg-black/55 hover:bg-[#C62828] text-white border border-[#C89D45]/40 transition-all hover:scale-110 shadow"
                              >
                                <ChevronLeft className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => cycleImage(room.id, images.length, 1, e)}
                                className="p-1 rounded-full bg-black/55 hover:bg-[#C62828] text-white border border-[#C89D45]/40 transition-all hover:scale-110 shadow"
                              >
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Card body */}
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-3 bg-white">
                          <div className="space-y-1">
                            <h4 className="font-serif text-lg font-bold text-[#1F1F1F] group-hover:text-[#C62828] transition-colors leading-snug">
                              {room.title}
                            </h4>

                            {/* Location */}
                            <div className="flex items-center gap-1.5 text-xs text-[#8B1E1E] font-accent font-semibold">
                              <MapPin className="w-3.5 h-3.5 shrink-0 text-[#C62828]" />
                              <span>{room.location || roomProp?.location || "Latpanchar, North Bengal"}</span>
                            </div>

                            {/* View */}
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-display italic">
                              <Mountain className="w-3.5 h-3.5 shrink-0 text-[#C89D45]" />
                              <span className="truncate">{room.view}</span>
                            </div>
                          </div>

                          {/* Tariffs box */}
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
                                  ₹{room.premiumPricePerPax || 2100}{" "}
                                  <span className="text-[9px] text-gray-500 font-normal">/ pax</span>
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Specs */}
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

                          {/* CTA Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRoomId(room.id);
                              setStep(2);
                            }}
                            className="btn-luxury w-full text-white py-3 rounded-xl font-accent text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 border border-[#C89D45]/40 overflow-hidden shadow-md hover:shadow-lg transition-all"
                            style={{ background: "linear-gradient(135deg, #C62828, #8B1E1E)" }}
                          >
                            <Calendar className="w-3.5 h-3.5 text-[#C89D45] relative z-10" />
                            <span className="relative z-10">Reserve This Room</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            STEP 2: PACKAGE SELECTION & STAY REVIEW
        ══════════════════════════════════════════════════════════════════════ */}
        {step === 2 && (
          <div className="max-w-2xl mx-auto glass-ivory rounded-3xl p-8 border border-[#C89D45] shadow-2xl space-y-6 animate-in fade-in duration-300">
            <div className="text-center space-y-1">
              <span className="text-xs font-accent uppercase tracking-widest text-[#C62828] font-bold">
                Step 2
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F1F1F]">
                Select Package &amp; Review Stay
              </h2>
              {selectedProperty && (
                <p className="text-xs text-gray-600 font-accent">
                  {selectedProperty.name} · <span className="font-bold text-[#C62828]">{selectedRoom?.title}</span>
                </p>
              )}
            </div>

            {availabilityError && (
              <div className="bg-red-100 border border-red-400 text-red-700 text-xs p-3 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{availabilityError}</span>
              </div>
            )}

            {/* Stay Dates & Guests Quick Edit */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-white border border-[#C89D45]/30">
              <div>
                <label className="text-[10px] font-accent uppercase text-[#7A5818] font-bold block mb-1">
                  Check-In
                </label>
                <input
                  type="date"
                  value={checkIn}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold [color-scheme:light]"
                />
              </div>
              <div>
                <label className="text-[10px] font-accent uppercase text-[#7A5818] font-bold block mb-1">
                  Check-Out
                </label>
                <input
                  type="date"
                  value={checkOut}
                  min={checkIn}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold [color-scheme:light]"
                />
              </div>
              <div>
                <label className="text-[10px] font-accent uppercase text-[#7A5818] font-bold block mb-1">
                  Guests
                </label>
                <select
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(Number(e.target.value))}
                  className="w-full bg-[#FAF8F5] border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                >
                  <option value={1}>1 Guest</option>
                  <option value={2}>2 Guests</option>
                  <option value={3}>3 Guests</option>
                  <option value={4}>4 Guests</option>
                  <option value={5}>5 Guests</option>
                  <option value={6}>6 Guests</option>
                  <option value={7}>7 Guests</option>
                  <option value={8}>8+ Guests</option>
                </select>
              </div>
            </div>

            {/* PACKAGE SELECTION (Standard vs Premium) */}
            <div className="space-y-2">
              <label className="text-xs font-accent uppercase text-[#C62828] font-bold block mb-1">
                Choose Package (Fooding &amp; Lodging per Pax per Day)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedPackage("standard")}
                  className={`p-4 rounded-2xl border text-left transition-all relative ${
                    selectedPackage === "standard"
                      ? "bg-[#F8F5EE] border-[#C89D45] ring-2 ring-[#C89D45]/50 shadow-md"
                      : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-accent text-xs uppercase tracking-wider font-bold text-[#1F1F1F]">
                      Standard Package
                    </span>
                    {selectedPackage === "standard" && (
                      <span className="text-[10px] font-accent uppercase font-bold bg-[#C89D45] text-[#1F1F1F] px-2 py-0.5 rounded-full">
                        Selected
                      </span>
                    )}
                  </div>
                  <div className="mt-2">
                    <span className="font-serif text-2xl font-bold text-[#1F1F1F]">
                      ₹{standardRate}
                    </span>
                    <span className="text-[10px] text-gray-500 font-sans ml-1">/ pax / day</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 font-semibold mt-1">
                    ✓ Fooding &amp; Lodging (All 4 Daily Meals)
                  </p>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    Fresh traditional home-cooked Himalayan meals
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPackage("premium")}
                  className={`p-4 rounded-2xl border text-left transition-all relative ${
                    selectedPackage === "premium"
                      ? "bg-[#FFF9F9] border-[#C62828] ring-2 ring-[#C62828]/50 shadow-md"
                      : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-accent text-xs uppercase tracking-wider font-bold text-[#C62828]">
                      Premium Package
                    </span>
                    {selectedPackage === "premium" && (
                      <span className="text-[10px] font-accent uppercase font-bold bg-[#C62828] text-white px-2 py-0.5 rounded-full">
                        Selected
                      </span>
                    )}
                  </div>
                  <div className="mt-2">
                    <span className="font-serif text-2xl font-bold text-[#C62828]">
                      ₹{premiumRate}
                    </span>
                    <span className="text-[10px] text-gray-500 font-sans ml-1">/ pax / day</span>
                  </div>
                  <p className="text-[11px] text-[#C62828] font-semibold mt-1">
                    ✓ Gourmet Fooding &amp; Lodging
                  </p>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    Organic farm produce, special local delicacies &amp; chef specials
                  </p>
                </button>
              </div>
            </div>

            {/* Breakdown Subtotal Box */}
            <div className="bg-[#2C2473] text-white rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-accent">
              <div>
                <span className="text-gray-200 font-bold block">
                  {selectedPackage === "premium" ? "Premium Package" : "Standard Package"} · {guestsCount} Guest(s) · {nights} Night(s)
                </span>
                <p className="text-[10px] text-emerald-300">
                  ₹{pricePerPaxPerDay} × {guestsCount} guests × {nights} days (Fooding &amp; Lodging)
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[#C89D45] font-bold text-base">
                  Subtotal: {formatPrice(roomTotal)}
                </span>
              </div>
            </div>

            <div className="flex justify-between gap-4">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 rounded-xl border border-gray-300 font-accent text-xs font-bold uppercase hover:bg-gray-100 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleValidateDates}
                className="bg-[#C62828] hover:bg-[#8B1E1E] text-white px-8 py-3 rounded-xl font-accent text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow"
              >
                <span>Next: Add-ons</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            STEP 3: ADD-ONS
        ══════════════════════════════════════════════════════════════════════ */}
        {step === 3 && (
          <div className="max-w-2xl mx-auto glass-ivory rounded-3xl p-8 border border-[#C89D45] shadow-2xl space-y-6 animate-in fade-in duration-300">
            <div className="text-center space-y-1">
              <span className="text-xs font-accent uppercase tracking-widest text-[#C62828] font-bold">
                Step 3
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F1F1F]">
                Curate Your Experiences
              </h2>
              <p className="text-xs text-gray-600">
                Enhance your stay with guided birding walks and Himalayan bonfires
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  id: "birding",
                  title: "Guided Rufous-Necked Hornbill Birding Trail",
                  price: 1200,
                  desc: "Early morning 3-hour trek led by a native Lepcha naturalist with spotting scopes.",
                },
                {
                  id: "bonfire",
                  title: "Private Mountain Sunset Bonfire & Barbecue",
                  price: 800,
                  desc: "Wood-fired pinecone bonfire on the private veranda with local acoustic music.",
                },
                {
                  id: "pickup",
                  title: "Bagdogra Airport (IXB) / NJP Station Cab Transfer",
                  price: 2800,
                  desc: "Private 4x4 Bolero pickup directly from the airport/railway station to the homestay.",
                },
              ].map((addon) => (
                <div
                  key={addon.id}
                  onClick={() => setAddons({ ...addons, [addon.id]: !addons[addon.id] })}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between gap-4 ${
                    addons[addon.id]
                      ? "border-[#C62828] bg-white shadow-md"
                      : "border-gray-200 bg-gray-50/50 hover:border-gray-300"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-sm text-[#1F1F1F]">
                        {addon.title}
                      </span>
                      <span className="text-xs font-accent font-bold text-[#C62828]">
                        +{formatPrice(addon.price)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 font-sans">{addon.desc}</p>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 ${
                      addons[addon.id]
                        ? "bg-[#C62828] border-[#C62828] text-white"
                        : "border-gray-300"
                    }`}
                  >
                    {addons[addon.id] && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#2C2473] text-white rounded-2xl p-4 flex items-center justify-between text-xs font-accent">
              <span>Estimated Total:</span>
              <span className="text-[#C89D45] font-bold text-base">
                {formatPrice(grandTotal)}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-xl border border-gray-300 font-accent text-xs font-bold uppercase hover:bg-gray-100 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="bg-[#C62828] hover:bg-[#8B1E1E] text-white px-8 py-3 rounded-xl font-accent text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow"
              >
                <span>Next: Guest Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            STEP 4: GUEST DETAILS & SUMMARY
        ══════════════════════════════════════════════════════════════════════ */}
        {step === 4 && (
          <form
            onSubmit={handleFinalSubmit}
            className="max-w-2xl mx-auto glass-ivory rounded-3xl p-8 border border-[#C89D45] shadow-2xl space-y-6 animate-in fade-in duration-300"
          >
            <div className="text-center space-y-1">
              <span className="text-xs font-accent uppercase tracking-widest text-[#C62828] font-bold">
                Step 4
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F1F1F]">
                Guest Information
              </h2>
              <p className="text-xs text-gray-600">
                Please provide your contact details for booking confirmation and WhatsApp updates
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-accent uppercase text-[#C62828] font-bold block mb-1">
                  Primary Guest Full Name *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Swati Roy"
                  value={guestDetails.name}
                  onChange={(e) => setGuestDetails({ ...guestDetails, name: e.target.value })}
                  className="w-full bg-white border border-[#C89D45]/40 rounded-xl px-4 py-3 text-sm font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-accent uppercase text-[#C62828] font-bold block mb-1">
                    Email Address *
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="swati@example.com"
                    value={guestDetails.email}
                    onChange={(e) => setGuestDetails({ ...guestDetails, email: e.target.value })}
                    className="w-full bg-white border border-[#C89D45]/40 rounded-xl px-4 py-3 text-sm font-sans"
                  />
                </div>

                <div>
                  <label className="text-xs font-accent uppercase text-[#C62828] font-bold block mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    required
                    type="tel"
                    placeholder="+91 98300 12345"
                    value={guestDetails.phone}
                    onChange={(e) => setGuestDetails({ ...guestDetails, phone: e.target.value })}
                    className="w-full bg-white border border-[#C89D45]/40 rounded-xl px-4 py-3 text-sm font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-accent uppercase text-[#C62828] font-bold block mb-1">
                  Special Requests or Dietary Requirements
                </label>
                <textarea
                  rows={3}
                  placeholder="High floor veranda, vegetarian meals, airport cab timing..."
                  value={guestDetails.specialRequests}
                  onChange={(e) => setGuestDetails({ ...guestDetails, specialRequests: e.target.value })}
                  className="w-full bg-white border border-[#C89D45]/40 rounded-xl px-4 py-3 text-sm font-sans"
                />
              </div>
            </div>

            <div className="bg-[#2C2473] text-white rounded-2xl p-4 space-y-1 text-xs font-accent">
              <div className="flex justify-between">
                <span>Destination:</span>
                <span className="font-bold text-[#F3D27A]">{selectedProperty?.name || "Lotus Paradise"}</span>
              </div>
              <div className="flex justify-between">
                <span>Selected Room:</span>
                <span className="font-bold text-[#C89D45]">{selectedRoom?.title}</span>
              </div>
              <div className="flex justify-between">
                <span>Selected Package:</span>
                <span className="font-bold text-[#F3D27A]">
                  {selectedPackage === "premium" ? "Premium Package" : "Standard Package"} (Fooding &amp; Lodging)
                </span>
              </div>
              <div className="flex justify-between">
                <span>Guests &amp; Duration:</span>
                <span>{guestsCount} Guest(s) · {nights} Night(s) ({checkIn} to {checkOut})</span>
              </div>
              <div className="flex justify-between">
                <span>Rate per Pax:</span>
                <span>₹{pricePerPaxPerDay} / pax / day (All Meals Included)</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
                <span>Final Total Amount:</span>
                <span className="text-[#C89D45] text-base">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <div className="flex justify-between gap-4">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-3 rounded-xl border border-gray-300 font-accent text-xs font-bold uppercase hover:bg-gray-100 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-[#C62828] hover:bg-[#8B1E1E] text-white px-8 py-3.5 rounded-xl font-accent text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg border border-[#C89D45]"
              >
                <ShieldCheck className="w-4 h-4 text-[#C89D45]" />
                <span>Confirm Reservation</span>
              </button>
            </div>
          </form>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            STEP 5: CONFIRMATION RECEIPT
        ══════════════════════════════════════════════════════════════════════ */}
        {step === 5 && bookingConfirmed && (
          <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 md:p-12 border-2 border-[#C89D45] shadow-2xl space-y-8 animate-in zoom-in-95 duration-300">
            <div className="text-center space-y-3 border-b border-[#C89D45]/30 pb-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8" />
              </div>
              <span className="text-xs font-accent uppercase tracking-widest text-[#C62828] font-bold">
                Reservation Confirmed
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#1F1F1F]">
                Welcome to Lotus Paradise Homestay!
              </h2>
              <p className="font-mono text-sm font-bold text-[#2C2473] bg-gray-100 inline-block px-4 py-1.5 rounded-full">
                Booking Ref: {bookingConfirmed.bookingNumber}
              </p>
            </div>

            {/* Invoice details grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans text-[#1F1F1F]">
              <div className="space-y-2">
                <h4 className="font-accent text-xs font-bold uppercase text-[#C62828]">Guest Information</h4>
                <p><strong>Name:</strong> {bookingConfirmed.guestName}</p>
                <p><strong>Email:</strong> {bookingConfirmed.email}</p>
                <p><strong>Phone:</strong> {bookingConfirmed.phone}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-accent text-xs font-bold uppercase text-[#C62828]">Stay Breakdown</h4>
                <p><strong>Room Reserved:</strong> {bookingConfirmed.roomTitle}</p>
                <p><strong>Check-In:</strong> {bookingConfirmed.checkIn}</p>
                <p><strong>Check-Out:</strong> {bookingConfirmed.checkOut} ({bookingConfirmed.nights} Nights)</p>
                <p><strong>Guests:</strong> {bookingConfirmed.guestsCount} Guests</p>
              </div>
            </div>

            <div className="bg-[#2C2473] text-white rounded-2xl p-6 flex items-center justify-between">
              <div>
                <span className="text-xs font-accent text-gray-300 block">Total Amount Payable:</span>
                <span className="font-serif text-3xl font-bold text-[#C89D45]">
                  {formatPrice(bookingConfirmed.totalAmount)}
                </span>
              </div>
              <span className="bg-emerald-600 text-white text-[11px] font-accent font-bold uppercase px-3 py-1 rounded-full">
                Confirmed
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 border border-gray-300 hover:bg-gray-100 text-[#1F1F1F] px-6 py-2.5 rounded-xl font-accent text-xs font-bold uppercase transition-colors"
              >
                <Printer className="w-4 h-4 text-[#C89D45]" />
                <span>Print Invoice Receipt</span>
              </button>

              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-[#2C2473] hover:bg-[#1F1F1F] text-white px-6 py-2.5 rounded-xl font-accent text-xs font-bold uppercase transition-colors"
              >
                <Sparkles className="w-4 h-4 text-[#C89D45]" />
                <span>Return to Home</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* ── FAQ ACCORDION AT THE BOTTOM ── */}
      <FAQAccordion />
    </div>
  );
}

export default ReservationEngine;
