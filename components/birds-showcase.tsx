"use client";

import React, { useState } from "react";
import Image from "next/image";
import { RARE_BIRDS } from "@/lib/data";
import { Feather, Camera, Calendar, CheckCircle2 } from "lucide-react";

export default function BirdsShowcase() {
  const [selectedBird, setSelectedBird] = useState(RARE_BIRDS[0]);

  return (
    <section className="py-20 bg-[#FBF8F3] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C62828]/10 text-[#C62828] text-xs font-accent tracking-widest uppercase font-semibold">
            <Feather className="w-4 h-4 text-[#C89D45]" />
            <span>Mahananda Sanctuary Avian Treasures</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1F1F1F]">
            The Hornbill Capital of North Bengal
          </h2>
          <p className="font-display text-lg text-gray-600 italic">
            Latpanchar is globally celebrated for offering rare, intimate sightings of the Rufous-necked Hornbill and over 240 Himalayan bird species right outside our homestay verandas.
          </p>
        </div>

        {/* INTERACTIVE BIRD DISPLAY & CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* FEATURED BIRD DETAILED DISPLAY */}
          <div className="lg:col-span-7 relative group rounded-3xl overflow-hidden shadow-2xl border border-[#C89D45]/30 h-[480px]">
            <Image
              src={selectedBird.image}
              alt={selectedBird.name}
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-[0.85]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-8 space-y-3 text-white">
              <div className="flex items-center gap-3">
                <span className="bg-[#C62828] text-white px-3 py-1 rounded-full text-xs font-accent font-bold uppercase tracking-widest border border-[#C89D45]/50">
                  {selectedBird.rarity} Species
                </span>
                <span className="text-xs font-accent text-[#C89D45] flex items-center gap-1 font-semibold">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Best Time: {selectedBird.bestViewingMonths}</span>
                </span>
              </div>

              <h3 className="font-serif text-3xl font-bold text-white">
                {selectedBird.name}
              </h3>
              <p className="font-display text-sm italic text-gray-300">
                {selectedBird.scientificName}
              </p>
              <p className="font-sans text-sm text-gray-200 leading-relaxed max-w-xl">
                {selectedBird.description}
              </p>

              <div className="pt-2 flex items-center gap-4 text-xs font-accent text-[#FBF8F3]/90">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C89D45]" />
                  Guided Photography Walks
                </span>
                <span className="flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-[#C89D45]" />
                  Telephoto Hide Spots Available
                </span>
              </div>
            </div>
          </div>

          {/* BIRD SELECTION LIST */}
          <div className="lg:col-span-5 space-y-4">
            {RARE_BIRDS.map((bird) => {
              const isSelected = bird.id === selectedBird.id;
              return (
                <div
                  key={bird.id}
                  onClick={() => setSelectedBird(bird)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 border flex items-center gap-4 ${
                    isSelected
                      ? "bg-[#2C2473] text-white border-[#C89D45] shadow-xl translate-x-2"
                      : "glass-card hover:bg-white text-[#1F1F1F] border-transparent hover:border-[#C89D45]/40"
                  }`}
                >
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-[#C89D45]/40">
                    <Image
                      src={bird.image}
                      alt={bird.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4
                      className={`font-serif text-lg font-bold ${
                        isSelected ? "text-white" : "text-[#1F1F1F]"
                      }`}
                    >
                      {bird.name}
                    </h4>
                    <p
                      className={`text-xs font-display italic ${
                        isSelected ? "text-[#C89D45]" : "text-gray-500"
                      }`}
                    >
                      {bird.scientificName}
                    </p>
                    <p
                      className={`text-xs font-sans mt-1 line-clamp-1 ${
                        isSelected ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {bird.rarity} • {bird.bestViewingMonths}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
