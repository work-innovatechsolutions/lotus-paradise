"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ATTRACTIONS } from "@/lib/data";
import { MapPin, Navigation, Car, ExternalLink } from "lucide-react";

export default function AttractionMap() {
  const [selectedAttr, setSelectedAttr] = useState(ATTRACTIONS[0]);

  return (
    <section className="py-24 bg-[#FBF8F3] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-accent uppercase tracking-widest text-[#C62828] font-bold">
            Explore Kurseong Hills & Valleys
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1F1F1F]">
            Nearby Attractions
          </h2>
          <p className="font-display text-lg text-gray-600 italic">
            Conveniently located at the hub of North Bengal&apos;s most serene mountain viewpoints, lakes, and orange valleys.
          </p>
        </div>

        {/* INTERACTIVE CARDS & MAP CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* ATTRACTIONS SELECTION LIST */}
          <div className="lg:col-span-5 space-y-4">
            {ATTRACTIONS.map((attr) => {
              const isSelected = attr.id === selectedAttr.id;
              return (
                <div
                  key={attr.id}
                  onClick={() => setSelectedAttr(attr)}
                  className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 border flex items-center gap-4 ${
                    isSelected
                      ? "bg-[#2C2473] text-white border-[#C89D45] shadow-xl translate-x-2"
                      : "glass-card hover:bg-white text-[#1F1F1F] border-transparent hover:border-[#C89D45]/40"
                  }`}
                >
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-[#C89D45]/40">
                    <Image
                      src={attr.image}
                      alt={attr.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`font-serif text-lg font-bold ${
                          isSelected ? "text-white" : "text-[#1F1F1F]"
                        }`}
                      >
                        {attr.name}
                      </h4>
                      <span
                        className={`text-[11px] font-accent uppercase font-semibold px-2.5 py-0.5 rounded-full ${
                          isSelected
                            ? "bg-[#C62828] text-white"
                            : "bg-[#C89D45]/15 text-[#C62828]"
                        }`}
                      >
                        {attr.distance}
                      </span>
                    </div>

                    <p
                      className={`text-xs font-sans flex items-center gap-1 ${
                        isSelected ? "text-[#C89D45]" : "text-gray-500"
                      }`}
                    >
                      <Car className="w-3.5 h-3.5" />
                      <span>{attr.driveTime} drive from homestay</span>
                    </p>

                    <p
                      className={`text-xs font-sans line-clamp-2 ${
                        isSelected ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {attr.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* MAP & FEATURED VIEWPORT */}
          <div className="lg:col-span-7 bg-[#2C2473] rounded-3xl overflow-hidden border border-[#C89D45]/40 shadow-2xl relative flex flex-col">
            {/* MAP EMBED SIMULATION CONTAINER */}
            <div className="relative h-80 w-full overflow-hidden">
              <iframe
                title="Latpanchar Interactive Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14238.123456789!2d88.412!3d26.921!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e440781234567%3A0x890123456789!2sLatpanchar%2C%20West%20Bengal!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "contrast(1.1) opacity(0.85)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-white text-xs font-accent font-semibold px-4 py-2 rounded-full border border-[#C89D45]/40 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C62828]" />
                <span>Base Location: Lotus Paradise Homestay</span>
              </div>
            </div>

            {/* ATTRACTION DETAIL FOOTER */}
            <div className="p-6 text-white space-y-3 bg-[#2C2473] border-t border-[#C89D45]/30 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-2xl font-bold text-white">
                    {selectedAttr.name}
                  </h3>
                  <a
                    href={`https://maps.google.com/?q=${selectedAttr.coordinates.lat},${selectedAttr.coordinates.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-accent text-[#C89D45] hover:text-white uppercase font-bold"
                  >
                    <span>Get Directions</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <p className="font-sans text-sm text-gray-300 mt-2 leading-relaxed">
                  {selectedAttr.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-accent text-gray-300">
                <span className="flex items-center gap-1.5 text-[#C89D45]">
                  <Navigation className="w-4 h-4 text-[#C62828]" />
                  Distance: {selectedAttr.distance} ({selectedAttr.driveTime})
                </span>
                <span>Sightseeing Cab Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
