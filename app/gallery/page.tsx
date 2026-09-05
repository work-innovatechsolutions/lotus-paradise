import React from "react";
import GalleryMasonry from "@/components/gallery-masonry";
import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Photo Gallery & Visual Anthology | The Cometas Homestays",
  description:
    "View our photography gallery capturing golden Kanchenjunga sunrises, luxury guest rooms, Rufous-necked Hornbills, bonfire evenings, and scenic Latpanchar landscapes.",
  canonicalUrl: "https://thecometas.com/gallery",
  keywords: [
    "Latpanchar Photos",
    "The Cometas Gallery",
    "Lotus Paradise Photos",
    "Rufous-necked hornbill pictures",
    "Kanchenjunga sunrise Latpanchar",
  ],
});

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
