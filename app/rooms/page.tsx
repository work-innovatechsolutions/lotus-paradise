import React from "react";
import Link from "next/link";
import RoomShowcase from "@/components/room-showcase";
import FAQAccordion from "@/components/faq-accordion";

export default function RoomsPage() {
  return (
    <div className="pt-28 pb-16 space-y-16">
      {/* PAGE HEADER */}
      <div className="text-center max-w-3xl mx-auto space-y-3 px-4">
        <span className="text-xs font-accent uppercase tracking-widest text-[#C62828] font-bold">
          Accommodations & Suites
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#1F1F1F]">
          Himalayan Mountain Suites
        </h1>
        <p className="font-display text-lg text-gray-600 italic">
          Every suite at Lotus Paradise features hand-crafted teak wood furnishings, electric blanket warming, private balconies, and sweeping views of Kanchenjunga.
        </p>
      </div>

      <RoomShowcase />
      <FAQAccordion />
    </div>
  );
}
