import React from "react";
import CorporateSection from "@/components/corporate-section";
import TestimonialsSlider from "@/components/testimonials-slider";

export default function CorporatePage() {
  return (
    <div className="pt-28 pb-16 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-3 px-4">
        <span className="text-xs font-accent uppercase tracking-widest text-[#C62828] font-bold">
          Team Building & Strategy Offsites
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#1F1F1F]">
          Corporate Mountain Retreats
        </h1>
        <p className="font-display text-lg text-gray-600 italic">
          Swap crowded city boardrooms for pine-scented air, starlit team bonfires, high-speed fiber internet, and multi-course organic dining.
        </p>
      </div>

      <CorporateSection />
      <TestimonialsSlider />
    </div>
  );
}
