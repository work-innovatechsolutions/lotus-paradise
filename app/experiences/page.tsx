import React from "react";
import ExperienceStoryCard from "@/components/experience-story-card";
import BirdsShowcase from "@/components/birds-showcase";
import SeasonalGuide from "@/components/seasonal-guide";
import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Himalayan Experiences & Birding Trails | The Cometas Homestays",
  description:
    "Discover guided Rufous-necked Hornbill birdwatching expeditions in Mahananda Wildlife Sanctuary, Ahaldara sunrise treks, Namthing Pokhari salamander visits, and orchard walks.",
  canonicalUrl: "https://thecometas.com/experiences",
  keywords: [
    "Latpanchar Birdwatching",
    "Rufous Necked Hornbill Trek",
    "Ahaldara View Point",
    "Namthing Pokhari Lake",
    "Sittong Orange Orchards Tour",
    "Mahananda Forest Safari",
  ],
});

export default function ExperiencesPage() {
  return (
    <div className="pt-28 pb-16 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-3 px-4">
        <span className="text-xs font-accent uppercase tracking-widest text-[#C62828] font-bold">
          Immersive Latpanchar Journeys
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#1F1F1F]">
          Signature Himalayan Experiences
        </h1>
        <p className="font-display text-lg text-gray-600 italic">
          From guided birding hikes in search of the Rufous-necked Hornbill to starlit bonfires and orange orchard harvests.
        </p>
      </div>

      <ExperienceStoryCard />
      <BirdsShowcase />
      <SeasonalGuide />
    </div>
  );
}
