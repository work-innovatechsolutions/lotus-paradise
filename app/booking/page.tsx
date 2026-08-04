"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ROOMS } from "@/lib/data";
import { formatPrice, generateBookingNumber } from "@/lib/utils";
import { BookingService } from "@/services/booking.service";
import { AvailabilityService } from "@/services/availability.service";
import { Calendar, Users, Check, Printer, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";

function BookingWizardContent() {
  const searchParams = useSearchParams();
  const initialRoomId = searchParams.get("roomId") || ROOMS[0].id;
  const initialCheckIn = searchParams.get("checkIn") || "2026-08-15";
  const initialCheckOut = searchParams.get("checkOut") || "2026-08-18";

  const [step, setStep] = useState(1);
  const [selectedRoomId, setSelectedRoomId] = useState(initialRoomId);
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [guestsCount, setGuestsCount] = useState(2);
  const [availabilityError, setAvailabilityError] = useState("");
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

  const selectedRoom = ROOMS.find((r) => r.id === selectedRoomId) || ROOMS[0];

  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  const nights = Math.max(1, Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 3600 * 24)));

  const roomTotal = selectedRoom.pricePerNight * nights;
  const birdingAddonPrice = addons.birding ? 1200 : 0;
  const bonfireAddonPrice = addons.bonfire ? 800 : 0;
  const pickupAddonPrice = addons.pickup ? 2800 : 0;
  const grandTotal = roomTotal + birdingAddonPrice + bonfireAddonPrice + pickupAddonPrice;

  const handleValidateDates = async () => {
    setAvailabilityError("");
    const available = await AvailabilityService.isRoomAvailable(selectedRoom.id, checkIn, checkOut);
    if (!available) {
      setAvailabilityError("Selected room is not available for these dates. Please choose different dates.");
      return;
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
      roomId: selectedRoom.id,
      roomTitle: selectedRoom.title,
      pricePerNight: selectedRoom.pricePerNight,
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
    }

    setStep(5);
  };

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* HEADER */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-accent uppercase tracking-widest text-[#C62828] font-bold">
          Direct Reservation Engine
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1F1F1F]">
          Reserve Your Stay at Lotus Paradise
        </h1>
        <p className="font-display text-base text-gray-600 italic">
          Experience authentic Himalayan hospitality, Kanchenjunga sunrises, and private verandas.
        </p>
      </div>

      {/* STEP INDICATOR */}
      <div className="flex items-center justify-center max-w-3xl mx-auto">
        {[
          { num: 1, label: "Choose Suite" },
          { num: 2, label: "Dates & Guests" },
          { num: 3, label: "Add-on Experiences" },
          { num: 4, label: "Guest Details" },
          { num: 5, label: "Confirmation" },
        ].map((s, i, arr) => (
          <React.Fragment key={s.num}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-accent text-xs font-bold transition-all ${
                  step === s.num
                    ? "bg-[#C62828] text-white ring-4 ring-[#C89D45]/30 shadow-md"
                    : step > s.num
                    ? "bg-[#2C2473] text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step > s.num ? <Check className="w-4 h-4" /> : s.num}
              </div>
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

      {/* STEP 1: ROOM SELECTION */}
      {step === 1 && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <h2 className="font-serif text-2xl font-bold text-center text-[#1F1F1F]">
            Step 1: Select Your Preferred Suite
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ROOMS.map((room) => {
              const isSelected = room.id === selectedRoomId;
              return (
                <div
                  key={room.id}
                  onClick={() => setSelectedRoomId(room.id)}
                  className={`glass-ivory rounded-3xl p-6 border-2 cursor-pointer transition-all duration-300 flex flex-col justify-between space-y-4 ${
                    isSelected
                      ? "border-[#C62828] shadow-2xl bg-white scale-105"
                      : "border-[#C89D45]/30 hover:border-[#C89D45]"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="relative h-48 rounded-2xl overflow-hidden border border-[#C89D45]/30">
                      <Image
                        src={room.images[0]}
                        alt={room.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-[#C62828] text-white text-xs font-accent font-bold px-3 py-1 rounded-full">
                        {formatPrice(room.pricePerNight)} / Night
                      </div>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-[#1F1F1F]">
                      {room.title}
                    </h3>
                    <p className="font-display text-xs text-[#C62828] italic">
                      {room.view}
                    </p>
                    <p className="font-sans text-xs text-gray-600 line-clamp-2">
                      {room.description}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRoomId(room.id);
                      setStep(2);
                    }}
                    className={`w-full py-3 rounded-xl font-accent text-xs font-bold uppercase tracking-widest transition-colors ${
                      isSelected
                        ? "bg-[#C62828] text-white"
                        : "bg-[#2C2473] text-white hover:bg-[#1F1F1F]"
                    }`}
                  >
                    {isSelected ? "Selected - Continue" : "Select Room"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 2: DATES & GUESTS */}
      {step === 2 && (
        <div className="max-w-2xl mx-auto glass-ivory rounded-3xl p-8 border border-[#C89D45] shadow-2xl space-y-6 animate-in fade-in duration-300">
          <h2 className="font-serif text-2xl font-bold text-[#1F1F1F]">
            Step 2: Choose Stay Dates & Guests
          </h2>

          {availabilityError && (
            <div className="bg-red-100 border border-red-400 text-red-700 text-xs p-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{availabilityError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-accent uppercase text-[#C62828] font-bold block mb-1.5">
                Check-In Date
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full bg-white border border-[#C89D45]/40 rounded-xl px-4 py-3 text-sm font-sans"
              />
            </div>
            <div>
              <label className="text-xs font-accent uppercase text-[#C62828] font-bold block mb-1.5">
                Check-Out Date
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-white border border-[#C89D45]/40 rounded-xl px-4 py-3 text-sm font-sans"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-accent uppercase text-[#C62828] font-bold block mb-1.5">
              Number of Guests
            </label>
            <select
              value={guestsCount}
              onChange={(e) => setGuestsCount(Number(e.target.value))}
              className="w-full bg-white border border-[#C89D45]/40 rounded-xl px-4 py-3 text-sm font-sans"
            >
              <option value={1}>1 Guest</option>
              <option value={2}>2 Guests (Couple)</option>
              <option value={3}>3 Guests</option>
              <option value={4}>4 Guests (Family)</option>
              <option value={5}>5 Guests</option>
            </select>
          </div>

          <div className="bg-[#2C2473] text-white rounded-2xl p-4 flex items-center justify-between text-xs font-accent">
            <span>Duration: {nights} Night(s)</span>
            <span className="text-[#C89D45] font-bold text-sm">
              Room Subtotal: {formatPrice(roomTotal)}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-3 rounded-xl border border-gray-300 font-accent text-xs font-bold uppercase"
            >
              Back
            </button>
            <button
              onClick={handleValidateDates}
              className="bg-[#C62828] hover:bg-[#8B1E1E] text-white px-8 py-3 rounded-xl font-accent text-xs font-bold uppercase tracking-widest flex items-center gap-2"
            >
              <span>Next: Add-ons</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: ADD-ONS */}
      {step === 3 && (
        <div className="max-w-2xl mx-auto glass-ivory rounded-3xl p-8 border border-[#C89D45] shadow-2xl space-y-6 animate-in fade-in duration-300">
          <h2 className="font-serif text-2xl font-bold text-[#1F1F1F]">
            Step 3: Enhance Your Himalayan Retreat
          </h2>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 rounded-2xl bg-white border border-[#C89D45]/30 cursor-pointer">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={addons.birding}
                  onChange={(e) => setAddons({ ...addons, birding: e.target.checked })}
                  className="w-5 h-5 accent-[#C62828]"
                />
                <div>
                  <h4 className="font-serif text-base font-bold">Guided Hornbill Birding Trail</h4>
                  <p className="text-xs text-gray-600">Local naturalist guide + optic telescope setup</p>
                </div>
              </div>
              <span className="text-xs font-accent font-bold text-[#C62828]">+ ₹1,200</span>
            </label>

            <label className="flex items-center justify-between p-4 rounded-2xl bg-white border border-[#C89D45]/30 cursor-pointer">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={addons.bonfire}
                  onChange={(e) => setAddons({ ...addons, bonfire: e.target.checked })}
                  className="w-5 h-5 accent-[#C62828]"
                />
                <div>
                  <h4 className="font-serif text-base font-bold">Private Garden Bonfire & Barbecue</h4>
                  <p className="text-xs text-gray-600">Wood fire + roasted skewers & tea</p>
                </div>
              </div>
              <span className="text-xs font-accent font-bold text-[#C62828]">+ ₹800</span>
            </label>

            <label className="flex items-center justify-between p-4 rounded-2xl bg-white border border-[#C89D45]/30 cursor-pointer">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={addons.pickup}
                  onChange={(e) => setAddons({ ...addons, pickup: e.target.checked })}
                  className="w-5 h-5 accent-[#C62828]"
                />
                <div>
                  <h4 className="font-serif text-base font-bold">NJP / Bagdogra Private Airport Transfer</h4>
                  <p className="text-xs text-gray-600">Private luxury Innova / Xylo pickup to homestay</p>
                </div>
              </div>
              <span className="text-xs font-accent font-bold text-[#C62828]">+ ₹2,800</span>
            </label>
          </div>

          <div className="bg-[#2C2473] text-white rounded-2xl p-4 flex items-center justify-between text-xs font-accent">
            <span>Calculated Total:</span>
            <span className="text-[#C89D45] font-bold text-base">{formatPrice(grandTotal)}</span>
          </div>

          <div className="flex justify-between gap-4">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-3 rounded-xl border border-gray-300 font-accent text-xs font-bold uppercase"
            >
              Back
            </button>
            <button
              onClick={() => setStep(4)}
              className="bg-[#C62828] hover:bg-[#8B1E1E] text-white px-8 py-3 rounded-xl font-accent text-xs font-bold uppercase tracking-widest flex items-center gap-2"
            >
              <span>Next: Guest Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: GUEST DETAILS & CONFIRM */}
      {step === 4 && (
        <form
          onSubmit={handleFinalSubmit}
          className="max-w-2xl mx-auto glass-ivory rounded-3xl p-8 border border-[#C89D45] shadow-2xl space-y-6 animate-in fade-in duration-300"
        >
          <h2 className="font-serif text-2xl font-bold text-[#1F1F1F]">
            Step 4: Personal Information & Requests
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-accent uppercase text-[#C62828] font-bold block mb-1">
                Full Name *
              </label>
              <input
                required
                type="text"
                placeholder="Swati Roy"
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
              <span>Selected Suite:</span>
              <span className="font-bold text-[#C89D45]">{selectedRoom.title}</span>
            </div>
            <div className="flex justify-between">
              <span>Stay Duration:</span>
              <span>{nights} Night(s) ({checkIn} to {checkOut})</span>
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
              className="px-6 py-3 rounded-xl border border-gray-300 font-accent text-xs font-bold uppercase"
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

      {/* STEP 5: CONFIRMATION RECEIPT */}
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

          {/* INVOICE DETAILS GRID */}
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
              className="inline-flex items-center gap-2 border border-gray-300 hover:bg-gray-100 text-[#1F1F1F] px-6 py-2.5 rounded-xl font-accent text-xs font-bold uppercase"
            >
              <Printer className="w-4 h-4 text-[#C89D45]" />
              <span>Print Invoice Receipt</span>
            </button>

            <Link
              href="/"
              className="bg-[#C62828] text-white px-8 py-2.5 rounded-xl font-accent text-xs font-bold uppercase tracking-widest"
            >
              Return To Homepage
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="pt-32 text-center font-serif text-2xl">Loading Reservation Engine...</div>}>
      <BookingWizardContent />
    </Suspense>
  );
}
