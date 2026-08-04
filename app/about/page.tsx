import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Heart, Coffee, Mountain, Feather, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="pt-28 pb-20 space-y-20">
      {/* HERO HEADER */}
      <div className="max-w-4xl mx-auto text-center space-y-4 px-4">
        <span className="text-xs font-accent uppercase tracking-widest text-[#C62828] font-bold">
          Our Heritage & Philosophy
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#1F1F1F]">
          Colonial Charm Meets Himalayan Serenity
        </h1>
        <p className="font-display text-xl text-[#C62828] italic">
          &quot;At Lotus Paradise, we don&apos;t simply offer rooms. We create experiences.&quot;
        </p>
      </div>

      {/* STORY SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 relative h-[480px] rounded-3xl overflow-hidden shadow-2xl border border-[#C89D45]/40">
          <Image
            src="/images/hero/512706723_2775845722805003_4817204501185083117_n.jpg.jpeg"
            alt="Lotus Paradise Veranda View"
            fill
            className="object-cover"
          />
        </div>

        <div className="lg:col-span-6 space-y-6 text-[#1F1F1F]">
          <h2 className="font-serif text-3xl font-bold">
            The Story of Latpanchar & Lotus Paradise
          </h2>
          <p className="font-sans text-sm text-gray-700 leading-relaxed">
            Latpanchar sits at an altitude of 4,500 feet inside the Kurseong hill division of Darjeeling district. Developed during British rule as the center for Cinchona plantation, it remains one of the cleanest, most serene mountain villages in North Bengal.
          </p>
          <p className="font-sans text-sm text-gray-700 leading-relaxed">
            Lotus Paradise Homestay was founded with a singular vision: to offer travelers an authentic Himalayan retreat that feels like a warm home rather than a commercial hotel. We combine colonial Darjeeling woodwork, monastery-inspired peace, and traditional Bengali home-cooked hospitality.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2 font-accent text-xs font-bold text-[#2C2473]">
            <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-[#C89D45]/30">
              <Mountain className="w-4 h-4 text-[#C89D45]" />
              <span>4,500 Ft Elevation</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-[#C89D45]/30">
              <Feather className="w-4 h-4 text-[#C89D45]" />
              <span>Hornbill Sanctuary</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-[#C89D45]/30">
              <Coffee className="w-4 h-4 text-[#C89D45]" />
              <span>Organic Bengali Thalis</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-[#C89D45]/30">
              <ShieldCheck className="w-4 h-4 text-[#C89D45]" />
              <span>Verified Homestay</span>
            </div>
          </div>

          <div className="pt-4">
            <Link
              href="/booking"
              className="bg-[#C62828] hover:bg-[#8B1E1E] text-white px-8 py-3.5 rounded-full font-accent text-xs font-bold uppercase tracking-widest inline-flex items-center gap-2 shadow-lg border border-[#C89D45]"
            >
              <span>Book Your Stay</span>
              <ArrowRight className="w-4 h-4 text-[#C89D45]" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
