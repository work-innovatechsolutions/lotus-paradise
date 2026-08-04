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
        <span>Back to All Suites</span>
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
            <span className="bg-[#C62828] text-white text-xs font-accent font-bold px-3 py-1 rounded-full uppercase">
              {room.type}
            </span>

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

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#C89D45]/20 text-xs font-sans text-[#1F1F1F]">
              <div className="flex items-center gap-2">
                <Bed className="w-4 h-4 text-[#C89D45]" />
                <span>{room.bedType}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#C89D45]" />
                <span>Up to {room.capacity} Guests</span>
              </div>
              <div className="flex items-center gap-2">
                <Coffee className="w-4 h-4 text-[#C89D45]" />
                <span>Breakfast Included</span>
              </div>
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-[#C89D45]" />
                <span>High-Speed WiFi</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#C89D45]/30 space-y-4">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-accent uppercase text-gray-600 font-bold">Nightly Rate:</span>
              <span className="font-serif text-3xl font-bold text-[#C62828]">
                {formatPrice(room.pricePerNight)}
              </span>
            </div>

            <Link
              href={`/booking?roomId=${room.id}`}
              className="w-full bg-[#C62828] hover:bg-[#8B1E1E] text-white py-3.5 rounded-xl font-accent text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg border border-[#C89D45]"
            >
              <Calendar className="w-4 h-4 text-[#C89D45]" />
              <span>Reserve Suite Now</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
