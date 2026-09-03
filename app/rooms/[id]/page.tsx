import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ROOMS } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { notFound } from "next/navigation";
import { Bed, Users, Mountain, Coffee, Wifi, ArrowLeft, Calendar } from "lucide-react";

export function generateStaticParams() {
  return ROOMS.map((room) => ({
    id: room.id,
  }));
}

export default async function RoomDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const room = ROOMS.find((r) => r.id === id || r.slug === id);

  if (!room) {
    notFound();
  }

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <Link
        href="/rooms"
        className="inline-flex items-center gap-2 text-xs font-accent uppercase font-bold text-[#C62828] hover:text-[#2C2473]"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Rooms</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-6">
          <div className="relative h-[420px] rounded-3xl overflow-hidden shadow-2xl border border-[#C89D45]/40">
            <Image
              src={room.images[0]}
              alt={room.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {room.images.slice(1).map((img, idx) => (
              <div key={idx} className="relative h-44 rounded-2xl overflow-hidden border border-[#C89D45]/30">
                <Image src={img} alt={`${room.title} ${idx + 2}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 glass-ivory rounded-3xl p-8 border border-[#C89D45] shadow-2xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#C62828] text-white text-xs font-accent font-bold px-3 py-1 rounded-full uppercase">
                {room.type}
              </span>
              {room.floor && (
                <span className="bg-[#2C2473] text-[#F3D27A] text-xs font-accent font-bold px-3 py-1 rounded-full uppercase border border-[#C89D45]/40">
                  {room.floor}
                </span>
              )}
              <span className="bg-emerald-800 text-emerald-100 text-xs font-accent font-bold px-3 py-1 rounded-full uppercase border border-emerald-500/40">
                Fooding &amp; Lodging Included
              </span>
            </div>

            <h1 className="font-serif text-3xl font-bold text-[#1F1F1F]">
              {room.title}
            </h1>

            <p className="font-display text-lg text-[#C62828] italic flex items-center gap-1.5">
              <Mountain className="w-5 h-5 text-[#C89D45]" />
              <span>{room.view}</span>
            </p>

            <p className="font-sans text-sm text-gray-700 leading-relaxed">
              {room.description}
            </p>

            {/* PACKAGE TARIFFS BOX */}
            <div className="p-4 rounded-2xl bg-[#FAF7F0] border border-[#C89D45]/40 space-y-3">
              <div className="flex items-center justify-between border-b border-[#C89D45]/20 pb-2">
                <span className="text-xs font-accent uppercase text-[#1F1F1F] font-bold">
                  Official Room Tariffs (Fooding &amp; Lodging)
                </span>
                <span className="text-[10px] font-accent uppercase font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  All 4 Meals
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white border border-[#C89D45]/30 shadow-xs space-y-1">
                  <span className="text-[10px] font-accent uppercase text-gray-500 font-bold block">
                    Standard Package
                  </span>
                  <p className="font-serif text-2xl font-bold text-[#1F1F1F]">
                    ₹{room.standardPricePerPax || room.pricePerNight}
                  </p>
                  <p className="text-[10px] text-gray-500">Per Pax / Per Day</p>
                  <p className="text-[10px] text-emerald-700 font-semibold">Standard Himalayan Meals</p>
                </div>

                <div className="p-3 rounded-xl bg-white border border-[#C62828]/40 shadow-xs space-y-1">
                  <span className="text-[10px] font-accent uppercase text-[#C62828] font-bold block">
                    Premium Package
                  </span>
                  <p className="font-serif text-2xl font-bold text-[#C62828]">
                    ₹{room.premiumPricePerPax || 2100}
                  </p>
                  <p className="text-[10px] text-gray-500">Per Pax / Per Day</p>
                  <p className="text-[10px] text-[#C62828] font-semibold">Gourmet Organic Dining</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#C89D45]/20 text-xs font-sans text-[#1F1F1F]">
              <div className="flex items-center gap-2">
                <Bed className="w-4 h-4 text-[#C89D45]" />
                <span>{room.bedType}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#C89D45]" />
                <span>
                  {room.minCapacity ? `Max ${room.minCapacity} – ${room.capacity} Pax` : `Up to ${room.capacity} Guests`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Coffee className="w-4 h-4 text-[#C89D45]" />
                <span>All Meals Included</span>
              </div>
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-[#C89D45]" />
                <span>High-Speed WiFi</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#C89D45]/30 space-y-4">
            <Link
              href={`/booking?roomId=${room.id}`}
              className="w-full bg-[#C62828] hover:bg-[#8B1E1E] text-white py-3.5 rounded-xl font-accent text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg border border-[#C89D45]"
            >
              <Calendar className="w-4 h-4 text-[#C89D45]" />
              <span>Reserve This Room Package</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
