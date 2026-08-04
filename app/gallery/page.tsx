import React from "react";
import GalleryMasonry from "@/components/gallery-masonry";

export default function GalleryPage() {
  return (
    <div className="pt-28 pb-16 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3 px-4">
        <span className="text-xs font-accent uppercase tracking-widest text-[#C62828] font-bold">
          Visual Anthology
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#1F1F1F]">
          Photo Gallery & Moments
        </h1>
        <p className="font-display text-lg text-gray-600 italic">
          Explore golden sunrise panoramas, cozy retreat interiors, rare avian sightings, and homestay moments.
        </p>
      </div>

      <GalleryMasonry />
    </div>
  );
}
