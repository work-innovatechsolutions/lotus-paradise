"use client";

import React, { useState } from "react";
import { SEASONAL_GUIDE } from "@/lib/data";
import { Sun, CloudRain, Snowflake, Leaf, Thermometer, Check } from "lucide-react";

export default function SeasonalGuide() {
  const [activeSeasonIndex, setActiveSeasonIndex] = useState(3); // Default to Autumn

  const activeSeason = SEASONAL_GUIDE[activeSeasonIndex];

  const seasonIcons = [
    <Leaf key="spring" className="w-4 h-4 text-[#355E3B]" />,
    <Sun key="summer" className="w-4 h-4 text-[#C89D45]" />,
    <CloudRain key="monsoon" className="w-4 h-4 text-blue-600" />,
    <Sun key="autumn" className="w-4 h-4 text-[#C62828]" />,
    <Snowflake key="winter" className="w-4 h-4 text-sky-600" />,
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-[#FBF8F3] to-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-accent uppercase tracking-widest text-[#C62828] font-bold">
            Plan Your Ideal Mountain Escape
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1F1F1F]">
            Seasonal Visit Guide
          </h2>
          <p className="font-display text-lg text-gray-600 italic">
            Each season in Latpanchar unveils a distinct personality—from golden autumn peak views to misty monsoon romantic trails.
          </p>
        </div>

        {/* TABS */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {SEASONAL_GUIDE.map((item, idx) => {
            const isActive = idx === activeSeasonIndex;
            return (
              <button
                key={item.season}
                onClick={() => setActiveSeasonIndex(idx)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-accent text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
                  isActive
                    ? "bg-[#C62828] text-white border-[#C89D45] shadow-lg scale-105"
                    : "glass-ivory text-[#1F1F1F] hover:bg-[#2C2473] hover:text-white border-[#C89D45]/30"
                }`}
              >
                {seasonIcons[idx]}
                <span>{item.season}</span>
                <span className="text-[10px] opacity-80 font-normal">({item.months})</span>
              </button>
            );
          })}
        </div>

        {/* ACTIVE SEASON DISPLAY CARD */}
        <div className="glass-ivory rounded-3xl p-8 md:p-12 border border-[#C89D45]/40 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <span className="bg-[#2C2473] text-[#FBF8F3] px-4 py-1.5 rounded-full text-xs font-accent font-semibold tracking-wider uppercase border border-[#C89D45]/40">
                {activeSeason.months}
              </span>
              <span className="flex items-center gap-1.5 text-sm font-sans font-semibold text-[#C62828]">
                <Thermometer className="w-4 h-4 text-[#C89D45]" />
                <span>{activeSeason.temp}</span>
              </span>
            </div>

            <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#1F1F1F]">
              {activeSeason.highlight}
            </h3>

            <p className="font-sans text-base text-gray-700 leading-relaxed">
              {activeSeason.description}
            </p>

            <div className="pt-2">
              <span className="text-xs font-accent uppercase tracking-wider text-[#C89D45] font-bold block mb-2">
                Recommended For:
              </span>
              <div className="flex items-center gap-2 text-sm font-sans font-medium text-[#1F1F1F]">
                <Check className="w-4 h-4 text-[#C62828]" />
                <span>{activeSeason.recommendedFor}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-[#2C2473] rounded-2xl p-6 text-white space-y-4 border border-[#C89D45]/50 shadow-xl">
            <h4 className="font-serif text-xl font-bold text-[#C89D45]">
              Local Homestay Tip
            </h4>
            <p className="font-display text-sm italic text-gray-200 leading-relaxed">
              &quot;In {activeSeason.season}, we recommend packing light warm layers for early mornings on the veranda, and reserving guided bird hikes at least 48 hours in advance.&quot;
            </p>
            <div className="pt-2 border-t border-[#C89D45]/30 flex items-center justify-between text-xs font-accent text-gray-300">
              <span>Lotus Paradise Concierge</span>
              <span className="text-[#C89D45] font-bold">Latpanchar</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
