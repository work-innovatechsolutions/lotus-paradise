"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { TESTIMONIALS } from "@/lib/data";
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import SectionReveal from "./section-reveal";

export default function TestimonialsSlider() {
  const [activeIdx, setActiveIdx] = useState(0);

  const goTo = (idx: number) => {
    setActiveIdx(idx);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const activeTestimonial = TESTIMONIALS[activeIdx];

  return (
    <section className="py-28 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #FFFDF8 0%, #F8F5EE 100%)" }}>
      {/* Large decorative quote mark */}
      <div
        className="absolute top-12 left-1/2 -translate-x-1/2 font-serif text-[280px] font-bold leading-none select-none pointer-events-none"
        style={{ color: "rgba(200,157,69,0.045)", fontFamily: "Cormorant Garamond, Georgia, serif" }}
        aria-hidden="true"
      >
        &ldquo;
      </div>

      {/* Blob decoration */}
      <div
        className="absolute bottom-0 right-0 w-96 h-96 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(198,40,40,0.05), transparent)", filter: "blur(60px)" }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* HEADER */}
        <SectionReveal className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          {/* Google Rating Badge */}
          <div
            className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full border border-[#C89D45]/35 shadow-lg mx-auto"
            style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)" }}
          >
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
            <span className="text-xs font-accent font-bold text-[#1F1F1F]">
              4.9 / 5.0 on Google Reviews
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1F1F1F]">
            Guest Impressions
          </h2>
          <p className="font-display text-lg text-gray-500 italic">
            Read authentic stories from travelers who experienced our Himalayan hospitality.
          </p>
        </SectionReveal>

        {/* STACKED CARD CAROUSEL */}
        <div className="max-w-4xl mx-auto relative">
          {/* Background peeking cards — visual stacking illusion */}
          {[-1, 1].map((offset) => {
            const peekIdx = (activeIdx + offset + TESTIMONIALS.length) % TESTIMONIALS.length;
            return (
              <div
                key={peekIdx}
                className="absolute inset-x-8 rounded-3xl border border-[#C89D45]/15"
                style={{
                  top: offset === -1 ? "-12px" : "12px",
                  bottom: offset === -1 ? "12px" : "-12px",
                  opacity: 0.3,
                  background: "rgba(251,248,243,0.7)",
                  backdropFilter: "blur(8px)",
                  transform: `scale(${1 - Math.abs(offset) * 0.04})`,
                  zIndex: 0,
                }}
                aria-hidden="true"
              />
            );
          })}

          {/* MAIN ACTIVE CARD */}
          <div
            className="relative z-10 rounded-3xl p-8 md:p-14 border text-center space-y-6"
            style={{
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderColor: "rgba(200,157,69,0.35)",
              boxShadow: "0 20px 60px -15px rgba(44,36,115,0.1), 0 0 0 1px rgba(200,157,69,0.15)",
            }}
          >
            <Quote
              className="w-14 h-14 mx-auto"
              style={{ color: "rgba(198,40,40,0.15)" }}
            />

            <p className="font-display text-xl sm:text-2xl text-[#1F1F1F] italic leading-[1.7]">
              &ldquo;{activeTestimonial.comment}&rdquo;
            </p>

            <div className="flex justify-center gap-1 pt-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>

            <div className="pt-4 border-t border-[#C89D45]/18 flex flex-col items-center space-y-3">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#C89D45] shadow-golden-glow">
                <Image
                  src={activeTestimonial.avatar}
                  alt={activeTestimonial.guestName}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-serif text-xl font-bold text-[#1F1F1F]">
                  {activeTestimonial.guestName}
                </h4>
                <p className="text-xs font-accent text-[#C62828] font-semibold">
                  {activeTestimonial.location} · {activeTestimonial.date}
                </p>
              </div>
            </div>
          </div>

          {/* NAVIGATION */}
          <div className="flex items-center justify-center gap-5 mt-10">
            <button
              onClick={() => goTo((activeIdx - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
              className="p-3.5 rounded-full bg-white hover:bg-[#C62828] text-[#1F1F1F] hover:text-white border border-[#C89D45]/35 shadow-md transition-all hover:scale-110 hover:shadow-golden-glow"
              aria-label="Previous Review"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goTo(idx)}
                  className={`rounded-full transition-all duration-400 ${
                    idx === activeIdx
                      ? "w-9 h-2.5 bg-[#C62828] shadow-red-glow"
                      : "w-2.5 h-2.5 bg-[#C89D45]/30 hover:bg-[#C89D45]"
                  }`}
                  aria-label={`Go to review ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => goTo((activeIdx + 1) % TESTIMONIALS.length)}
              className="p-3.5 rounded-full bg-white hover:bg-[#C62828] text-[#1F1F1F] hover:text-white border border-[#C89D45]/35 shadow-md transition-all hover:scale-110 hover:shadow-golden-glow"
              aria-label="Next Review"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
